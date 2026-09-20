<?php
// STARS Prediction Proxy Handler
header('Content-Type: application/json');
require_once __DIR__ . '/config/config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'error' => 'Metode request tidak diizinkan. Gunakan POST.'
    ]);
    exit;
}

// Read and parse input parameters
$nama = isset($_POST['nama']) ? trim($_POST['nama']) : '';
$matematika = isset($_POST['matematika']) ? floatval($_POST['matematika']) : 0;
$bahasa_inggris = isset($_POST['bahasa_inggris']) ? floatval($_POST['bahasa_inggris']) : 0;
$ipa = isset($_POST['ipa']) ? floatval($_POST['ipa']) : 0;
$ips = isset($_POST['ips']) ? floatval($_POST['ips']) : 0;

$minat = isset($_POST['minat']) ? trim($_POST['minat']) : '';
$hobi = isset($_POST['hobi']) ? trim($_POST['hobi']) : '';
$kemampuan_komputer = isset($_POST['kemampuan_komputer']) ? trim($_POST['kemampuan_komputer']) : '';
$kemampuan_komunikasi = isset($_POST['kemampuan_komunikasi']) ? trim($_POST['kemampuan_komunikasi']) : '';
$kemampuan_kepemimpinan = isset($_POST['kemampuan_kepemimpinan']) ? trim($_POST['kemampuan_kepemimpinan']) : '';
$kemampuan_analisis = isset($_POST['kemampuan_analisis']) ? trim($_POST['kemampuan_analisis']) : '';
$kemampuan_kreativitas = isset($_POST['kemampuan_kreativitas']) ? trim($_POST['kemampuan_kreativitas']) : '';
$kemampuan_problem_solving = isset($_POST['kemampuan_problem_solving']) ? trim($_POST['kemampuan_problem_solving']) : '';

$mata_pelajaran_favorit = isset($_POST['mata_pelajaran_favorit']) ? trim($_POST['mata_pelajaran_favorit']) : '';
$gaya_belajar = isset($_POST['gaya_belajar']) ? trim($_POST['gaya_belajar']) : '';
$tujuan_karier = isset($_POST['tujuan_karier']) ? trim($_POST['tujuan_karier']) : '';
$aktivitas_organisasi = isset($_POST['aktivitas_organisasi']) ? trim($_POST['aktivitas_organisasi']) : '';

// Process Prestasi Akademik
if (isset($_POST['prestasi_akademik'])) {
    $prestasi_akademik = trim($_POST['prestasi_akademik']);
} else {
    $pa_tingkat = isset($_POST['prestasi_akademik_tingkat']) ? trim($_POST['prestasi_akademik_tingkat']) : '';
    $pa_bidang = isset($_POST['prestasi_akademik_bidang']) ? trim($_POST['prestasi_akademik_bidang']) : '';
    if (empty($pa_tingkat) || $pa_tingkat === 'Tidak Ada' || empty($pa_bidang)) {
        $prestasi_akademik = 'Tidak Ada';
    } else {
        $prestasi_akademik = $pa_tingkat . ' - ' . $pa_bidang;
    }
}

// Process Prestasi Non-Akademik
if (isset($_POST['prestasi_non_akademik'])) {
    $prestasi_non_akademik = trim($_POST['prestasi_non_akademik']);
} else {
    $pna_tingkat = isset($_POST['prestasi_non_akademik_tingkat']) ? trim($_POST['prestasi_non_akademik_tingkat']) : '';
    $pna_bidang = isset($_POST['prestasi_non_akademik_bidang']) ? trim($_POST['prestasi_non_akademik_bidang']) : '';
    if (empty($pna_tingkat) || $pna_tingkat === 'Tidak Ada' || empty($pna_bidang)) {
        $prestasi_non_akademik = 'Tidak Ada';
    } else {
        $prestasi_non_akademik = $pna_bidang . ' - ' . $pna_tingkat;
    }
}

// Validate required fields
if (
    empty($nama) || empty($minat) || empty($hobi) || 
    empty($kemampuan_komputer) || empty($kemampuan_komunikasi) || 
    empty($kemampuan_kepemimpinan) || empty($kemampuan_analisis) ||
    empty($kemampuan_kreativitas) || empty($kemampuan_problem_solving) ||
    empty($mata_pelajaran_favorit) || empty($gaya_belajar) ||
    empty($tujuan_karier) || empty($aktivitas_organisasi)
) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Harap lengkapi semua data siswa yang wajib diisi.'
    ]);
    exit;
}

// ============================================================
// Server-side Validation Engine v2.0 — Two-Layer System
// Hard Validation (H1-H5): blocks prediction
// Soft Validation (S1-S18): reduces quality score (no blocking)
// ============================================================

function skills_all_equal($d, $level) {
    $skills = [
        $d['kemampuan_komputer'], $d['kemampuan_komunikasi'],
        $d['kemampuan_kepemimpinan'], $d['kemampuan_analisis'],
        $d['kemampuan_kreativitas'], $d['kemampuan_problem_solving']
    ];
    foreach ($skills as $s) { if ($s !== $level) return false; }
    return true;
}

function hard_validate($d) {
    $violations = [];
    $scores = [$d['matematika'], $d['bahasa_inggris'], $d['ipa'], $d['ips']];
    $avg = array_sum($scores) / 4;

    // H1: All academic scores identical
    $all_same_score = count(array_unique($scores)) === 1 && $scores[0] != 0;
    if ($all_same_score) {
        $violations[] = '[H1] Semua nilai akademik identik (' . implode(',', $scores) . '). Indikasi kuat input acak.';
    }

    // H2: All skills Tinggi
    if (skills_all_equal($d, 'Tinggi')) {
        $violations[] = '[H2] Semua kemampuan diatur ke level Tinggi. Pola ini tidak realistis.';
    }

    // H3: All skills Rendah
    if (skills_all_equal($d, 'Rendah')) {
        $violations[] = '[H3] Semua kemampuan diatur ke level Rendah. Kemungkinan input tidak serius.';
    }

    // H4: International academic achievement + avg < 60
    if ($d['prestasi_akademik_tingkat'] === 'Internasional' && $avg < 60) {
        $violations[] = '[H4] Prestasi Akademik Internasional tidak konsisten dengan rata-rata nilai ' . round($avg) . ' (sangat rendah).';
    }

    // H5: International non-academic achievement + no hobby + not active + low skills
    $no_org  = empty($d['aktivitas_organisasi']) || $d['aktivitas_organisasi'] === 'Tidak Aktif';
    $no_hobi = empty($d['hobi']) || $d['hobi'] === '-';
    $low_skills = $d['kemampuan_kreativitas'] === 'Rendah' && $d['kemampuan_analisis'] === 'Rendah';
    if ($d['prestasi_non_akademik_tingkat'] === 'Internasional' && $no_org && $no_hobi && $low_skills) {
        $violations[] = '[H5] Prestasi Non-Akademik Internasional tanpa hobi, organisasi, maupun kemampuan pendukung.';
    }

    return $violations;
}

function soft_validate($d) {
    $penalty = 0;
    $scores = [$d['matematika'], $d['bahasa_inggris'], $d['ipa'], $d['ips']];
    $avg = array_sum($scores) / 4;

    // S1: Average < 60
    if ($avg < 60) $penalty += 10;

    // S2: Average > 90 AND all skills Rendah
    if ($avg > 90 && skills_all_equal($d, 'Rendah')) $penalty += 10;

    // S3: Tech + Computer Rendah
    if ($d['minat'] === 'Teknologi' && $d['kemampuan_komputer'] === 'Rendah') $penalty += 10;

    // S4: Tech + Problem Solving Rendah
    if ($d['minat'] === 'Teknologi' && $d['kemampuan_problem_solving'] === 'Rendah') $penalty += 5;

    // S5: Health interest + IPA < 60
    if (in_array($d['minat'], ['Kesehatan', 'Kedokteran']) && $d['ipa'] < 60) $penalty += 5;

    // S6: Economics interest + IPS < 60
    if (in_array($d['minat'], ['Ekonomi', 'Bisnis']) && $d['ips'] < 60) $penalty += 5;

    // S7: Education + Communication Rendah
    if ($d['minat'] === 'Pendidikan' && $d['kemampuan_komunikasi'] === 'Rendah') $penalty += 5;

    // S8: Engineering + Math < 60
    if (in_array($d['minat'], ['Teknik', 'Engineering']) && $d['matematika'] < 60) $penalty += 5;

    // S9: Arts + Creativity Rendah
    if (in_array($d['minat'], ['Seni', 'Desain']) && $d['kemampuan_kreativitas'] === 'Rendah') $penalty += 5;

    // S10: Leadership career + Leadership skill Rendah
    $leadership_careers = ['Manajer', 'Direktur', 'CEO', 'Kepala Sekolah', 'Politisi'];
    foreach ($leadership_careers as $c) {
        if (stripos($d['tujuan_karier'], $c) !== false && $d['kemampuan_kepemimpinan'] === 'Rendah') {
            $penalty += 5; break;
        }
    }

    // S11: Entrepreneur career + Comm low + PS low
    $entrepreneur_careers = ['Wirausahawan', 'Pengusaha', 'Entrepreneur', 'Pebisnis'];
    foreach ($entrepreneur_careers as $c) {
        if (stripos($d['tujuan_karier'], $c) !== false) {
            if ($d['kemampuan_komunikasi'] === 'Rendah' && $d['kemampuan_problem_solving'] === 'Rendah') {
                $penalty += 5;
            }
            break;
        }
    }

    // S12: Research career + Analysis Rendah
    $research_careers = ['Peneliti', 'Ilmuwan', 'Dosen', 'Akademisi'];
    foreach ($research_careers as $c) {
        if (stripos($d['tujuan_karier'], $c) !== false && $d['kemampuan_analisis'] === 'Rendah') {
            $penalty += 5; break;
        }
    }

    // S13: Academic achievement exists + avg < 60
    if (!empty($d['prestasi_akademik_tingkat']) && $d['prestasi_akademik_tingkat'] !== 'Tidak Ada' && $avg < 60) {
        $penalty += 5;
    }

    // S14: Sports achievement + no sports hobby
    $sports_hobbies = ['Sepak Bola', 'Taekwondo', 'Atletik', 'Basket', 'Renang', 'Olahraga', 'Badminton', 'Voli'];
    $has_sports_achievement = !empty($d['prestasi_non_akademik_bidang']) &&
        (stripos($d['prestasi_non_akademik_bidang'], 'olahraga') !== false || stripos($d['prestasi_non_akademik_bidang'], 'sport') !== false);
    $has_sports_hobby = false;
    foreach ($sports_hobbies as $sh) {
        if (stripos($d['hobi'], $sh) !== false) { $has_sports_hobby = true; break; }
    }
    if ($has_sports_achievement && !$has_sports_hobby && $d['minat'] !== 'Olahraga') $penalty += 5;

    // S15: Organization + Leadership Rendah + Comm Rendah
    if (!empty($d['aktivitas_organisasi']) && $d['aktivitas_organisasi'] !== 'Tidak Aktif') {
        if ($d['kemampuan_kepemimpinan'] === 'Rendah' && $d['kemampuan_komunikasi'] === 'Rendah') {
            $penalty += 5;
        }
    }

    // S16: All academic scores below 60
    $all_below_60 = true;
    foreach ($scores as $s) { if ($s >= 60) { $all_below_60 = false; break; } }
    if ($all_below_60) $penalty += 10;

    // S17: All academic scores above 95
    $all_above_95 = true;
    foreach ($scores as $s) { if ($s <= 95) { $all_above_95 = false; break; } }
    if ($all_above_95) $penalty += 5;

    // S18: Sequential suspicious pattern
    $sorted = $scores; sort($sorted);
    $is_sequential = true;
    for ($i = 1; $i < count($sorted); $i++) {
        if (abs($sorted[$i] - $sorted[$i-1]) > 3) { $is_sequential = false; break; }
    }
    if ($is_sequential && ($sorted[count($sorted)-1] - $sorted[0]) <= 6) $penalty += 5;

    return max(0, 100 - $penalty);
}

$validation_data = [
    'matematika'                   => $matematika,
    'bahasa_inggris'               => $bahasa_inggris,
    'ipa'                          => $ipa,
    'ips'                          => $ips,
    'mata_pelajaran_favorit'       => $mata_pelajaran_favorit,
    'gaya_belajar'                 => $gaya_belajar,
    'minat'                        => $minat,
    'hobi'                         => $hobi,
    'kemampuan_komputer'           => $kemampuan_komputer,
    'kemampuan_komunikasi'         => $kemampuan_komunikasi,
    'kemampuan_kepemimpinan'       => $kemampuan_kepemimpinan,
    'kemampuan_analisis'           => $kemampuan_analisis,
    'kemampuan_kreativitas'        => $kemampuan_kreativitas,
    'kemampuan_problem_solving'    => $kemampuan_problem_solving,
    'aktivitas_organisasi'         => $aktivitas_organisasi,
    'tujuan_karier'                => $tujuan_karier,
    'prestasi_akademik_tingkat'    => $pa_tingkat,
    'prestasi_akademik_bidang'     => $pa_bidang,
    'prestasi_non_akademik_tingkat'=> $pna_tingkat,
    'prestasi_non_akademik_bidang' => $pna_bidang,
];

// === LAYER 1: HARD VALIDATION ===
$hard_violations = hard_validate($validation_data);
if (!empty($hard_violations)) {
    echo json_encode([
        'status' => 'error',
        'error'  => 'Profil terdeteksi tidak realistis atau mengandung pola input yang tidak konsisten. Silakan periksa kembali data yang dimasukkan sebelum melanjutkan.',
        'violations' => $hard_violations
    ]);
    exit;
}

// === LAYER 2: SOFT VALIDATION (score only, no blocking) ===
$quality_score = soft_validate($validation_data);


// Build Python API Payload matching KOLOM_FITUR in api.py:
$payload = [
    'Matematika' => $matematika,
    'Bahasa_Inggris' => $bahasa_inggris,
    'IPA' => $ipa,
    'IPS' => $ips,
    'Minat' => $minat,
    'Hobi' => $hobi,
    'Kemampuan_Komputer' => $kemampuan_komputer,
    'Kemampuan_Komunikasi' => $kemampuan_komunikasi,
    'Kemampuan_Kepemimpinan' => $kemampuan_kepemimpinan,
    'Kemampuan_Analisis' => $kemampuan_analisis,
    'Kemampuan_Kreativitas' => $kemampuan_kreativitas,
    'Kemampuan_Problem_Solving' => $kemampuan_problem_solving,
    'Mata_Pelajaran_Favorit' => $mata_pelajaran_favorit,
    'Gaya_Belajar' => $gaya_belajar,
    'Tujuan_Karier' => $tujuan_karier,
    'Aktivitas_Organisasi' => $aktivitas_organisasi,
    'Prestasi_Akademik' => $prestasi_akademik,
    'Prestasi_NonAkademik' => $prestasi_non_akademik
];

// Send POST request via cURL to Python Backend
$ch = curl_init(PYTHON_API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // 10 second timeout

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Tidak dapat terhubung ke Backend AI server. Pastikan API server aktif.',
        'details' => $curl_error
    ]);
    exit;
}

if ($http_code !== 200) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Backend AI mengembalikan error code ' . $http_code,
        'details' => json_decode($response, true)
    ]);
    exit;
}

// Decode response from Python API
$response_data = json_decode($response, true);

if (isset($response_data['status']) && $response_data['status'] === 'success') {
    // Append supplementary/non-model fields to report back to frontend
    $response_data['nama_siswa'] = $nama;
    $response_data['minat_spesifik'] = isset($_POST['minat_spesifik']) ? trim($_POST['minat_spesifik']) : '';
    $response_data['hobi_tambahan'] = isset($_POST['hobi_tambahan']) ? trim($_POST['hobi_tambahan']) : '';
    $response_data['prestasi_akademik'] = $prestasi_akademik;
    $response_data['prestasi_non_akademik'] = $prestasi_non_akademik;

    echo json_encode($response_data);
} else {
    echo json_encode([
        'status' => 'error',
        'error' => isset($response_data['error']) ? $response_data['error'] : 'Gagal memproses prediksi di Server AI.'
    ]);
}
?>
