// ============================================================
// STARS Validation Engine v3.0
// Layer 1: Hard Validation (blocks prediction)
// Layer 2: Soft Validation (reduces quality score)
// NEW V3: Profile Strength Score (separate from quality score)
// ============================================================

const STARSValidator = (function () {
    'use strict';

    // ---- Helper: collect all form values ----
    function collectInputs() {
        const val = (id) => {
            const el = document.getElementById(id);
            if (!el) return '';
            return el.value;
        };
        const num = (id) => {
            const v = parseInt(val(id), 10);
            return isNaN(v) ? 0 : v;
        };

        return {
            matematika:               num('matematika'),
            bahasa_inggris:           num('bahasa_inggris'),
            ipa:                      num('ipa'),
            ips:                      num('ips'),
            mata_pelajaran_favorit:   val('mata_pelajaran_favorit'),
            gaya_belajar:             val('gaya_belajar'),
            minat:                    val('minat'),
            hobi:                     val('hobi-hidden'),
            kemampuan_komputer:       val('kemampuan_komputer'),
            kemampuan_komunikasi:     val('kemampuan_komunikasi'),
            kemampuan_kepemimpinan:   val('kemampuan_kepemimpinan'),
            kemampuan_analisis:       val('kemampuan_analisis'),
            kemampuan_kreativitas:    val('kemampuan_kreativitas'),
            kemampuan_problem_solving: val('kemampuan_problem_solving'),
            aktivitas_organisasi:     val('aktivitas_organisasi'),
            tujuan_karier:            val('tujuan_karier'),
            prestasi_akademik_tingkat:     val('prestasi_akademik_tingkat'),
            prestasi_akademik_bidang:      val('prestasi_akademik_bidang'),
            prestasi_non_akademik_tingkat: val('prestasi_non_akademik_tingkat'),
            prestasi_non_akademik_bidang:  val('prestasi_non_akademik_bidang'),
        };
    }

    // ---- Helpers ----
    function avgScore(d) {
        return (d.matematika + d.bahasa_inggris + d.ipa + d.ips) / 4;
    }

    function allSkillsEqual(d, level) {
        const skills = [
            d.kemampuan_komputer, d.kemampuan_komunikasi,
            d.kemampuan_kepemimpinan, d.kemampuan_analisis,
            d.kemampuan_kreativitas, d.kemampuan_problem_solving
        ];
        return skills.length > 0 && skills.every(s => s === level);
    }

    function allSkillsSame(d) {
        const skills = [
            d.kemampuan_komputer, d.kemampuan_komunikasi,
            d.kemampuan_kepemimpinan, d.kemampuan_analisis,
            d.kemampuan_kreativitas, d.kemampuan_problem_solving
        ];
        return skills[0] !== '' && skills.every(s => s === skills[0]);
    }

    const SPORTS_HOBBIES = ['Sepak Bola', 'Taekwondo', 'Atletik', 'Basket', 'Renang', 'Olahraga', 'Badminton', 'Voli', 'Tenis'];
    const LEADERSHIP_CAREERS = ['Manajer', 'Direktur', 'CEO', 'Kepala Sekolah', 'Politisi', 'Diplomat'];
    const ENTREPRENEUR_CAREERS = ['Wirausahawan', 'Pengusaha', 'Entrepreneur', 'Pebisnis'];
    const RESEARCH_CAREERS = ['Peneliti', 'Ilmuwan', 'Dosen', 'Akademisi'];

    // ============================================================
    // LAYER 1: HARD VALIDATION RULES
    // If ANY triggers â†’ block prediction entirely
    // ============================================================

    function hardRuleH1(d) {
        // All academic scores identical (random input indicator)
        const scores = [d.matematika, d.bahasa_inggris, d.ipa, d.ips];
        const allSame = scores.every(s => s === scores[0]) && scores[0] !== 0;
        if (allSame) {
            return {
                triggered: true,
                rule: 'H1',
                message: `Semua nilai akademik identik (${scores[0]}). Mohon periksa kembali nilai Anda.`
            };
        }
        return { triggered: false };
    }

    function hardRuleH2(d) {
        // All skills set to highest level
        if (allSkillsEqual(d, 'Tinggi')) {
            return {
                triggered: true,
                rule: 'H2',
                message: 'Mohon tinjau kembali profil kemampuan Anda agar lebih mencerminkan kondisi sebenarnya.'
            };
        }
        return { triggered: false };
    }

    function hardRuleH3(d) {
        // All skills set to lowest level
        if (allSkillsEqual(d, 'Rendah')) {
            return {
                triggered: true,
                rule: 'H3',
                message: 'Mohon isi kemampuan Anda dengan lebih cermat agar rekomendasi lebih akurat.'
            };
        }
        return { triggered: false };
    }

    function hardRuleH4(d) {
        // International academic achievement + average score < 60
        const avg = avgScore(d);
        if (d.prestasi_akademik_tingkat === 'Internasional' && avg < 60) {
            return {
                triggered: true,
                rule: 'H4',
                message: `Data prestasi internasional tampak belum sinkron dengan rata-rata nilai akademik saat ini.`
            };
        }
        return { triggered: false };
    }

    function hardRuleH5(d) {
        // International non-academic achievement + no hobby + not active + low skills
        const noOrg = d.aktivitas_organisasi === 'Tidak Aktif' || d.aktivitas_organisasi === '';
        const noHobi = d.hobi === '' || d.hobi === '-';
        const lowSkills = d.kemampuan_kreativitas === 'Rendah' && d.kemampuan_analisis === 'Rendah';
        if (d.prestasi_non_akademik_tingkat === 'Internasional' && noOrg && noHobi && lowSkills) {
            return {
                triggered: true,
                rule: 'H5',
                message: 'Mohon lengkapi profil aktivitas dan kemampuan Anda untuk mendukung klaim prestasi tersebut.'
            };
        }
        return { triggered: false };
    }

    // ============================================================
    // LAYER 2: SOFT VALIDATION RULES
    // Reduce quality score, prediction still allowed
    // ============================================================

    function softRules(d) {
        const issues = [];
        let penalty = 0;
        const avg = avgScore(d);
        const scores = [d.matematika, d.bahasa_inggris, d.ipa, d.ips];

        // S1: Average score < 60
        if (avg < 60) {
            penalty += 10;
            issues.push({ rule: 'S1', message: `Rata-rata nilai akademik Anda masih bisa ditingkatkan lagi.`, penalty: 10 });
        }

        // S2: Average score > 90 AND all skills low
        if (avg > 90 && allSkillsEqual(d, 'Rendah')) {
            penalty += 10;
            issues.push({ rule: 'S2', message: 'Tingkatkan pengisian data kemampuan agar selaras dengan nilai akademik yang tinggi.', penalty: 10 });
        }

        // S3: Technology interest + Computer low
        if (d.minat === 'Teknologi' && d.kemampuan_komputer === 'Rendah') {
            penalty += 10;
            issues.push({ rule: 'S3', message: 'Untuk bidang teknologi, cobalah untuk lebih eksplorasi kemampuan komputer Anda.', penalty: 10 });
        }

        // S4: Technology interest + Problem Solving low
        if (d.minat === 'Teknologi' && d.kemampuan_problem_solving === 'Rendah') {
            penalty += 5;
            issues.push({ rule: 'S4', message: 'Problem solving yang baik sangat membantu di bidang teknologi.', penalty: 5 });
        }

        // S5: Health interest + IPA < 60
        if ((d.minat === 'Kesehatan' || d.minat === 'Kedokteran') && d.ipa < 60) {
            penalty += 5;
            issues.push({ rule: 'S5', message: `Pertimbangkan untuk meningkatkan nilai IPA Anda untuk mendukung minat di bidang kesehatan.`, penalty: 5 });
        }

        // S6: Economics interest + IPS < 60
        if ((d.minat === 'Ekonomi' || d.minat === 'Bisnis') && d.ips < 60) {
            penalty += 5;
            issues.push({ rule: 'S6', message: `Peningkatan nilai IPS akan sangat bermanfaat bagi minat bisnis Anda.`, penalty: 5 });
        }

        // S7: Education interest + Communication low
        if (d.minat === 'Pendidikan' && d.kemampuan_komunikasi === 'Rendah') {
            penalty += 5;
            issues.push({ rule: 'S7', message: 'Kemampuan komunikasi yang baik sangat penting dalam dunia pendidikan.', penalty: 5 });
        }

        // S8: Engineering interest + Math < 60
        if ((d.minat === 'Teknik' || d.minat === 'Engineering') && d.matematika < 60) {
            penalty += 5;
            issues.push({ rule: 'S8', message: `Penguasaan matematika yang kuat akan sangat membantu studi teknik Anda.`, penalty: 5 });
        }

        // S9: Arts interest + Creativity low
        if ((d.minat === 'Seni' || d.minat === 'Desain') && d.kemampuan_kreativitas === 'Rendah') {
            penalty += 5;
            issues.push({ rule: 'S9', message: 'Terus gali potensi kreativitas Anda untuk bidang seni dan desain.', penalty: 5 });
        }

        // S10: Leadership career + Leadership skill low
        if (LEADERSHIP_CAREERS.some(c => d.tujuan_karier && d.tujuan_karier.toLowerCase().includes(c.toLowerCase())) && d.kemampuan_kepemimpinan === 'Rendah') {
            penalty += 5;
            issues.push({ rule: 'S10', message: `Kembangkan jiwa kepemimpinan Anda untuk mendukung cita-cita karier tersebut.`, penalty: 5 });
        }

        // S11: Entrepreneur career + Comm low + PS low
        if (ENTREPRENEUR_CAREERS.some(c => d.tujuan_karier && d.tujuan_karier.toLowerCase().includes(c.toLowerCase()))) {
            if (d.kemampuan_komunikasi === 'Rendah' && d.kemampuan_problem_solving === 'Rendah') {
                penalty += 5;
                issues.push({ rule: 'S11', message: 'Kombinasi komunikasi dan problem solving adalah kunci bagi seorang pengusaha.', penalty: 5 });
            }
        }

        // S12: Research career + Analysis low
        if (RESEARCH_CAREERS.some(c => d.tujuan_karier && d.tujuan_karier.toLowerCase().includes(c.toLowerCase())) && d.kemampuan_analisis === 'Rendah') {
            penalty += 5;
            issues.push({ rule: 'S12', message: `Kemampuan analisis sangat krusial dalam dunia penelitian.`, penalty: 5 });
        }

        // S13: Academic achievement exists BUT avg score < 60
        if (d.prestasi_akademik_tingkat && d.prestasi_akademik_tingkat !== 'Tidak Ada' && d.prestasi_akademik_tingkat !== '' && avg < 60) {
            penalty += 5;
            issues.push({ rule: 'S13', message: `Pastikan data prestasi akademik Anda sudah sesuai dengan nilai harian Anda.`, penalty: 5 });
        }

        // S14: Non-academic achievement field match
        const hasAch = d.prestasi_non_akademik_bidang && d.prestasi_non_akademik_bidang !== '';
        const matchHobby = d.hobi && d.hobi.toLowerCase().includes(d.prestasi_non_akademik_bidang.toLowerCase());
        if (hasAch && !matchHobby && d.minat.toLowerCase() !== d.prestasi_non_akademik_bidang.toLowerCase()) {
            penalty += 5;
            issues.push({ rule: 'S14', message: 'Prestasi non-akademik akan lebih baik jika didukung oleh hobi yang relevan.', penalty: 5 });
        }

        // S15: Organization activity + Leadership low + Comm low
        if (d.aktivitas_organisasi && d.aktivitas_organisasi !== 'Tidak Aktif' && d.aktivitas_organisasi !== '') {
            if (d.kemampuan_kepemimpinan === 'Rendah' && d.kemampuan_komunikasi === 'Rendah') {
                penalty += 5;
                issues.push({ rule: 'S15', message: 'Aktiflah dalam berorganisasi untuk mengasah kemampuan komunikasi dan kepemimpinan Anda.', penalty: 5 });
            }
        }

        // S16: All academic scores below 60
        if (scores.every(s => s < 60)) {
            penalty += 10;
            issues.push({ rule: 'S16', message: 'Semangat! Terus tingkatkan performa akademik Anda.', penalty: 10 });
        }

        // S17: All academic scores above 95
        if (scores.every(s => s > 95)) {
            penalty += 5;
            issues.push({ rule: 'S17', message: 'Luar biasa! Pastikan data nilai Anda sudah tepat.', penalty: 5 });
        }

        // S18: Sequential/suspicious score pattern
        const sorted = [...scores].sort((a, b) => a - b);
        let isSequential = true;
        for (let i = 1; i < sorted.length; i++) {
            if (Math.abs(sorted[i] - sorted[i-1]) > 3) { isSequential = false; break; }
        }
        if (isSequential && sorted[sorted.length-1] - sorted[0] <= 6) {
            penalty += 5;
            issues.push({ rule: 'S18', message: `Tinjau kembali data nilai agar lebih variatif dan akurat.`, penalty: 5 });
        }

        // S19-S21: Score spread penalties (V5.2)
        const maxVal = Math.max(...scores);
        const minVal = Math.min(...scores);
        const spread = maxVal - minVal;
        if (spread > 90) {
            penalty += 15;
            issues.push({ rule: 'S21', message: `Selisih antara nilai tertinggi dan terendah Anda sangat besar (${spread} poin). Pastikan data nilai yang dimasukkan sudah benar dan realistis.`, penalty: 15 });
        } else if (spread > 80) {
            penalty += 10;
            issues.push({ rule: 'S20', message: `Terdapat kesenjangan yang cukup besar (${spread} poin) antara nilai tertinggi dan terendah Anda. Tinjau kembali keakuratan data.`, penalty: 10 });
        } else if (spread > 70) {
            penalty += 5;
            issues.push({ rule: 'S19', message: `Nilai akademik Anda memiliki variasi yang cukup lebar (${spread} poin). Pertimbangkan untuk menyeimbangkan semua mata pelajaran.`, penalty: 5 });
        }

        // S22: High achievement (Nasional/Internasional) with very low avg (V5.2)
        const avgNow = avgScore(d);
        const highAchievement = d.prestasi_akademik_tingkat === 'Nasional' || d.prestasi_akademik_tingkat === 'Internasional' ||
                                d.prestasi_non_akademik_tingkat === 'Nasional' || d.prestasi_non_akademik_tingkat === 'Internasional';
        if (highAchievement && avgNow < 50) {
            penalty += 20;
            issues.push({ rule: 'S22', message: `Prestasi tingkat nasional/internasional yang Anda cantumkan tampak tidak sinkron dengan rata-rata nilai akademik saat ini (${avgNow.toFixed(1)}). Pastikan data sudah akurat.`, penalty: 20 });
        }

        // S23: All skills same level — all Tinggi or all Rendah (V5.2)
        // Note: Hard rules H2/H3 block identical all-same, but soft adds IQS penalty when borderline
        if (allSkillsSame(d) && !allSkillsEqual(d, 'Sedang')) {
            penalty += 10;
            issues.push({ rule: 'S23', message: 'Semua kemampuan terisi dengan level yang sama. Profil kemampuan yang lebih variatif akan menghasilkan analisis yang lebih akurat.', penalty: 10 });
        }

        return { penalty, issues };
    }

    // ============================================================
    // Main validate function
    // ============================================================
    function validate() {
        const d = collectInputs();

        // === LAYER 1: Hard Validation ===
        const hardRuleFns = [hardRuleH1, hardRuleH2, hardRuleH3, hardRuleH4, hardRuleH5];
        const hardViolations = [];

        for (const fn of hardRuleFns) {
            const result = fn(d);
            if (result.triggered) {
                hardViolations.push(result);
            }
        }

        if (hardViolations.length > 0) {
            return {
                score: 0,
                status: 'BLOCKED',
                statusLabel: 'Profil Diblokir',
                statusRange: 'â€”',
                statusColor: '#ef4444',
                statusIcon: 'fa-shield-halved',
                isHardBlocked: true,
                hardViolations,
                issues: [],
                inputData: d,
            };
        }

        // === LAYER 2: Soft Validation ===
        const { penalty, issues } = softRules(d);
        const score = Math.max(0, 100 - penalty);

        let status, statusLabel, statusColor, statusIcon, statusRange;

        if (score >= 90) {
            status = 'EXCELLENT';
            statusLabel = 'Profil Sangat Baik';
            statusRange = '90 â€“ 100';
            statusColor = '#10b981'; // green
            statusIcon = 'fa-circle-check';
        } else if (score >= 75) {
            status = 'GOOD';
            statusLabel = 'Profil Baik';
            statusRange = '75 â€“ 89';
            statusColor = '#3b82f6'; // blue
            statusIcon = 'fa-thumbs-up';
        } else if (score >= 60) {
            status = 'WARNING';
            statusLabel = 'Valid dengan Peringatan';
            statusRange = '60 â€“ 74';
            statusColor = '#f59e0b'; // amber
            statusIcon = 'fa-triangle-exclamation';
        } else {
            status = 'REVIEW';
            statusLabel = 'Perlu Ditinjau';
            statusRange = '0 â€“ 59';
            statusColor = '#f97316'; // orange-red
            statusIcon = 'fa-magnifying-glass';
        }

        return {
            score,
            status,
            statusLabel,
            statusRange,
            statusColor,
            statusIcon,
            isHardBlocked: false,
            hardViolations: [],
            issues,
            inputData: d,
        };
    }

    // ============================================================
    // Render the validation card
    // ============================================================
    function renderValidationCard(result) {
        const container = document.getElementById('validation-analysis-card');
        if (!container) return;

        if (result.isHardBlocked) {
            renderHardBlockCard(container, result);
        } else {
            renderSoftCard(container, result);
        }

        container.classList.remove('hidden');
    }

    function renderHardBlockCard(container, result) {
        let violationsHTML = result.hardViolations.map(v => `
            <div class="flex items-start space-x-3 text-sm">
                <span class="mt-0.5 text-red-500 flex-shrink-0"><i class="fas fa-circle-xmark"></i></span>
                <div>
                    <span class="text-[10px] font-bold text-red-500/70 mr-1">[${v.rule}]</span>
                    <span style="color: var(--text-secondary);">${v.message}</span>
                </div>
            </div>`).join('');

        container.innerHTML = `
            <div class="validation-card validation-card-animated rounded-3xl border overflow-hidden relative p-6 sm:p-8"
                 style="border-color: #ef444430; background: radial-gradient(ellipse at top left, #ef444408 0%, transparent 60%), var(--bg-secondary);">
                <!-- Glow -->
                <div class="absolute -top-16 -left-16 w-40 h-40 rounded-full pointer-events-none" 
                     style="background: radial-gradient(circle, #ef444420 0%, transparent 70%); filter: blur(40px);"></div>
                
                <!-- Header -->
                <div class="flex items-center justify-between mb-5 relative z-10">
                    <div class="flex items-center space-x-3">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                             style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                            <i class="fas fa-shield-halved"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-primary);">Validasi Gagal Ã¢â‚¬â€ Profil Diblokir</h4>
                            <p class="text-[11px]" style="color: var(--text-muted);">Layer 1: Hard Validation</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                          style="background: #ef444418; color: #ef4444;">DIBLOKIR</span>
                </div>

                <!-- Alert banner -->
                <div class="mb-5 p-3 rounded-xl border relative z-10"
                     style="background:#ef444408; border-color:#ef444425;">
                    <p class="text-xs font-medium" style="color:var(--text-secondary);">
                        <i class="fas fa-ban mr-1.5" style="color:#ef4444;"></i>
                        Profil terdeteksi tidak realistis atau mengandung pola input yang tidak konsisten. 
                        Silakan periksa kembali data yang dimasukkan sebelum melanjutkan.
                    </p>
                </div>

                <!-- Violations -->
                <div class="relative z-10 space-y-2.5 mb-5">
                    <h5 class="text-[10px] font-bold uppercase tracking-wider mb-2" style="color:var(--text-muted);">
                        Masalah Terdeteksi (${result.hardViolations.length})
                    </h5>
                    ${violationsHTML}
                </div>
            </div>`;

        // Animate in
        requestAnimationFrame(() => {
            const card = container.querySelector('.validation-card');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    }

    function renderSoftCard(container, result) {
        // Build issues HTML
        let issueListHTML = '';
        if (result.issues.length === 0) {
            issueListHTML = `
                <div class="flex items-center space-x-2 text-sm" style="color:var(--text-secondary);">
                    <i class="fas fa-check" style="color:#10b981;"></i>
                    <span>Tidak ada inkonsistensi terdeteksi. Profil Anda terlihat realistis dan konsisten.</span>
                </div>`;
        } else {
            result.issues.forEach(issue => {
                issueListHTML += `
                    <div class="flex items-start space-x-3 text-sm">
                        <span class="mt-0.5 flex-shrink-0" style="color: ${result.statusColor};"><i class="fas fa-circle-exclamation"></i></span>
                        <div>
                            <span class="text-[10px] font-bold mr-1" style="color:${result.statusColor}80;">[${issue.rule}]</span>
                            <span style="color:var(--text-secondary);">${issue.message}</span>
                            <span class="text-[10px] ml-1 font-mono" style="color:var(--text-muted);">(-${issue.penalty})</span>
                        </div>
                    </div>`;
            });
        }

        // Recommendation banner
        let recsHTML = '';
        if (result.status === 'EXCELLENT') {
            recsHTML = `
                <div class="mt-4 p-3 rounded-xl border text-sm" style="background:#10b98108; border-color:#10b98120; color:var(--text-secondary);">
                    <i class="fas fa-rocket mr-1.5" style="color:#10b981;"></i>
                    <strong style="color:#10b981;">Profil Sangat Baik!</strong> Prediksi AI dapat langsung dijalankan dengan akurasi penuh.
                </div>`;
        } else if (result.status === 'GOOD') {
            recsHTML = `
                <div class="mt-4 p-3 rounded-xl border text-sm" style="background:#3b82f608; border-color:#3b82f620; color:var(--text-secondary);">
                    <i class="fas fa-thumbs-up mr-1.5" style="color:#3b82f6;"></i>
                    <strong style="color:#3b82f6;">Profil Baik.</strong> Terdapat sedikit ketidaksesuaian kecil namun prediksi AI tetap dapat berjalan dengan baik.
                </div>`;
        } else if (result.status === 'WARNING') {
            recsHTML = `
                <div class="mt-4 p-3 rounded-xl border text-sm" style="background:#f59e0b08; border-color:#f59e0b20; color:var(--text-secondary);">
                    <i class="fas fa-info-circle mr-1.5" style="color:#f59e0b;"></i>
                    <strong style="color:#f59e0b;">Profil cukup valid namun terdapat beberapa ketidaksesuaian kecil.</strong> Prediksi tetap dapat dilakukan, namun akurasi rekomendasi mungkin sedikit berkurang.
                </div>`;
        } else if (result.status === 'REVIEW') {
            recsHTML = `
                <div class="mt-4 p-3 rounded-xl border text-sm" style="background:#f9731608; border-color:#f9731620; color:var(--text-secondary);">
                    <i class="fas fa-triangle-exclamation mr-1.5" style="color:#f97316;"></i>
                    <strong style="color:#f97316;">Profil memerlukan perhatian.</strong> Prediksi masih dapat dijalankan, namun harap tinjau kembali data yang terdeteksi tidak konsisten agar rekomendasi lebih akurat.
                </div>`;
        }

        // Score bar markers
        const markerHTML = `
            <div class="flex justify-between mt-1 text-[9px] font-mono" style="color:var(--text-muted);">
                <span>0</span>
                <span style="color:#f97316cc; margin-left:calc(60% - 8px);">60</span>
                <span style="color:#f59e0bcc;">75</span>
                <span style="color:#3b82f6cc;">90</span>
                <span>100</span>
            </div>`;

        container.innerHTML = `
            <div class="validation-card validation-card-animated rounded-3xl border overflow-hidden relative p-6 sm:p-8"
                 data-status="${result.status}"
                 style="border-color: ${result.statusColor}20; --status-color: ${result.statusColor};
                        background: radial-gradient(ellipse at top left, ${result.statusColor}06 0%, transparent 60%), var(--bg-secondary);">

                <!-- Glow accent -->
                <div class="absolute -top-16 -left-16 w-40 h-40 rounded-full pointer-events-none"
                     style="background: radial-gradient(circle, ${result.statusColor}15 0%, transparent 70%); filter: blur(40px);"></div>

                <!-- Header -->
                <div class="flex items-center justify-between mb-6 relative z-10">
                    <div class="flex items-center space-x-3">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                             style="background: linear-gradient(135deg, ${result.statusColor}dd, ${result.statusColor});">
                            <i class="fas ${result.statusIcon}"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold uppercase tracking-wider" style="color:var(--text-primary);">Analisis Kualitas Input</h4>
                            <p class="text-[11px]" style="color:var(--text-muted);">Layer 2: Soft Validation Ã¢â‚¬â€ ${result.issues.length} inkonsistensi terdeteksi</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                          style="background: ${result.statusColor}15; color: ${result.statusColor};">
                        ${result.statusLabel}
                    </span>
                </div>

                <!-- Score Bar -->
                <div class="mb-6 relative z-10">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--text-secondary);">Input Quality Score</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                  style="background:${result.statusColor}18; color:${result.statusColor};">${result.statusRange}</span>
                            <span class="text-sm font-extrabold font-mono" style="color:${result.statusColor};">${result.score} / 100</span>
                        </div>
                    </div>
                    <div class="w-full rounded-full h-3 overflow-hidden relative" style="background:var(--bg-tertiary);">
                        <div class="validation-score-bar h-3 rounded-full"
                             style="width:0%; background:linear-gradient(90deg, ${result.statusColor}80, ${result.statusColor}); transition: width 1.1s cubic-bezier(.4,0,.2,1);"></div>
                        <!-- Threshold markers -->
                        <div class="absolute top-0 h-full w-px" style="left:60%; background:#f9731640;"></div>
                        <div class="absolute top-0 h-full w-px" style="left:75%; background:#f59e0b40;"></div>
                        <div class="absolute top-0 h-full w-px" style="left:90%; background:#3b82f640;"></div>
                    </div>
                    ${markerHTML}
                </div>

                <!-- Issues -->
                <div class="relative z-10 space-y-3">
                    <h5 class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text-muted);">
                        Inkonsistensi Terdeteksi (${result.issues.length})
                    </h5>
                    <div class="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        ${issueListHTML}
                    </div>
                </div>

                ${recsHTML}
            </div>`;

        container.classList.remove('hidden');

        // Animate card in
        requestAnimationFrame(() => {
            const card = container.querySelector('.validation-card');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }
            // Animate score bar
            setTimeout(() => {
                const bar = container.querySelector('.validation-score-bar');
                if (bar) bar.style.width = result.score + '%';
            }, 200);
        });
    }

    // ============================================================
    // V3: PROFILE STRENGTH SCORE SYSTEM
    // Separate from Input Quality Score.
    // Measures real student strength, not data consistency.
    // ============================================================

    const ACHIEVEMENT_LEVEL_SCORE = {
        'Internasional': 25, 'Nasional': 20, 'Provinsi': 15,
        'Kabupaten': 10, 'Sekolah': 5, 'Tidak Ada': 0, '': 0
    };

    const SKILL_WEIGHT = { 'Tinggi': 100, 'Sedang': 70, 'Rendah': 40, '': 40 };

    function calculateStrengthScore(d) {
        // --- Academic Strength (max 40 pts) ---
        const avg = (d.matematika + d.bahasa_inggris + d.ipa + d.ips) / 4;
        let academicPts;
        if      (avg >= 90) academicPts = 40;
        else if (avg >= 80) academicPts = 35;
        else if (avg >= 70) academicPts = 30;
        else if (avg >= 60) academicPts = 25;
        else if (avg >= 50) academicPts = 15;
        else                academicPts = 5;

        // --- Skills Strength (max 35 pts) ---
        const skillValues = [
            SKILL_WEIGHT[d.kemampuan_komputer]       || 40,
            SKILL_WEIGHT[d.kemampuan_komunikasi]     || 40,
            SKILL_WEIGHT[d.kemampuan_kepemimpinan]   || 40,
            SKILL_WEIGHT[d.kemampuan_analisis]       || 40,
            SKILL_WEIGHT[d.kemampuan_kreativitas]    || 40,
            SKILL_WEIGHT[d.kemampuan_problem_solving]|| 40,
        ];
        const avgSkillPct = skillValues.reduce((a, b) => a + b, 0) / skillValues.length; // 40-100
        const skillPts = Math.round((avgSkillPct / 100) * 35);

        // --- Achievement Strength (max 25 pts, highest wins) ---
        const acadLevel  = ACHIEVEMENT_LEVEL_SCORE[d.prestasi_akademik_tingkat]      ?? 0;
        const nonAcLevel = ACHIEVEMENT_LEVEL_SCORE[d.prestasi_non_akademik_tingkat]  ?? 0;
        const achievementPts = Math.min(25, Math.max(acadLevel, nonAcLevel));

        const totalScore = Math.min(100, academicPts + skillPts + achievementPts);

        // Classification
        let status, statusLabel, statusColor, statusIcon, description;
        if (totalScore >= 90) {
            status = 'EXCELLENT'; statusLabel = 'Excellent Profile';
            statusColor = '#10b981'; statusIcon = 'fa-trophy';
            description = 'Profil sangat kuat dan kompetitif.';
        } else if (totalScore >= 75) {
            status = 'STRONG'; statusLabel = 'Strong Profile';
            statusColor = '#3b82f6'; statusIcon = 'fa-star';
            description = 'Profil kuat dan memiliki potensi tinggi.';
        } else if (totalScore >= 60) {
            status = 'DEVELOPING'; statusLabel = 'Developing Profile';
            statusColor = '#f59e0b'; statusIcon = 'fa-seedling';
            description = 'Profil cukup baik namun masih memiliki ruang pengembangan.';
        } else if (totalScore >= 40) {
            status = 'AVERAGE'; statusLabel = 'Average Profile';
            statusColor = '#f97316'; statusIcon = 'fa-chart-bar';
            description = 'Profil standar dan membutuhkan peningkatan pada beberapa aspek.';
        } else {
            status = 'NEEDS_IMPROVEMENT'; statusLabel = 'Needs Improvement';
            statusColor = '#ef4444'; statusIcon = 'fa-arrow-trend-up';
            description = 'Profil masih lemah dan memerlukan pengembangan signifikan.';
        }

        return {
            totalScore, status, statusLabel, statusColor, statusIcon, description,
            breakdown: {
                academic:     { score: academicPts,    max: 40, avg: avg.toFixed(1) },
                skills:       { score: skillPts,       max: 35, avgPct: avgSkillPct.toFixed(0) },
                achievement:  { score: achievementPts, max: 25 },
            },
            details: {
                avgScore: avg.toFixed(1),
                skillValues,
                acadLevel, nonAcLevel,
            }
        };
    }

    // ============================================================
    // V5.4: CRITICAL SKILL ENGINE HELPERS
    // ============================================================
    function getCriticalSkillConflicts(d) {
        const conflicts = [];
        const karierLower = (d.tujuan_karier || '').toLowerCase();
        
        // 1. Hukum (Pengacara, Jaksa, Hakim, Notaris)
        const isHukum = ['pengacara', 'jaksa', 'hakim', 'notaris'].some(k => karierLower.includes(k));
        if (isHukum && d.kemampuan_komunikasi === 'Rendah') {
            conflicts.push({
                type: 'HUKUM',
                pcsPenalty: 20,
                relPenalty: 10,
                message: 'Profesi hukum sangat bergantung pada kemampuan komunikasi. Kondisi saat ini menurunkan tingkat kecocokan terhadap karier yang dipilih.'
            });
        }
        
        // 2. Komunikasi (Presenter TV, Jurnalis, Public Relations)
        const isKomunikasi = ['presenter', 'jurnalis', 'public relations', 'humas', 'hubungan masyarakat'].some(k => karierLower.includes(k));
        if (isKomunikasi && d.kemampuan_komunikasi === 'Rendah') {
            conflicts.push({
                type: 'KOMUNIKASI',
                pcsPenalty: 20,
                relPenalty: 10,
                message: 'Karier Presenter TV umumnya membutuhkan kemampuan komunikasi yang kuat. Saat ini kemampuan komunikasi masih berada pada kategori rendah sehingga menurunkan tingkat konsistensi profil.'
            });
        }
        
        // 3. Psikologi (Psikolog)
        const isPsikologi = ['psikolog', 'konselor', 'psychologist'].some(k => karierLower.includes(k));
        if (isPsikologi) {
            const commLow = d.kemampuan_komunikasi === 'Rendah';
            const analLow = d.kemampuan_analisis === 'Rendah';
            if (commLow && analLow) {
                conflicts.push({
                    type: 'PSIKOLOGI_BOTH',
                    pcsPenalty: 30,
                    relPenalty: 10,
                    message: 'Karier Psikolog membutuhkan kemampuan komunikasi dan analisis yang baik. Profil saat ini belum sepenuhnya mendukung jalur tersebut.'
                });
            } else if (commLow || analLow) {
                conflicts.push({
                    type: 'PSIKOLOGI_ONE',
                    pcsPenalty: 15,
                    relPenalty: 0,
                    message: `Karier Psikolog membutuhkan kemampuan komunikasi dan analisis yang baik. Kemampuan ${commLow ? 'komunikasi' : 'analisis'} Anda yang masih rendah perlu ditingkatkan.`
                });
            }
        }
        
        // 4. Teknologi (Software Engineer, Cyber Security, Data Scientist, Game Developer)
        const isTeknologi = ['software engineer', 'programmer', 'developer', 'coding', 'cyber security', 'keamanan siber', 'data scientist', 'data analyst', 'game developer', 'game designer'].some(k => karierLower.includes(k));
        if (isTeknologi) {
            const kompLow = d.kemampuan_komputer === 'Rendah';
            const analLow = d.kemampuan_analisis === 'Rendah';
            if (kompLow && analLow) {
                conflicts.push({
                    type: 'TEKNOLOGI_BOTH',
                    pcsPenalty: 30,
                    relPenalty: 10,
                    message: 'Karier di bidang teknologi membutuhkan kemampuan komputer dan analisis yang kuat. Kedua aspek ini saat ini menjadi hambatan utama dalam profil Anda.'
                });
            } else if (kompLow || analLow) {
                conflicts.push({
                    type: 'TEKNOLOGI_ONE',
                    pcsPenalty: 15,
                    relPenalty: 0,
                    message: `Karier di bidang teknologi membutuhkan kemampuan komputer dan analisis yang kuat. Aspek ${kompLow ? 'komputer' : 'analisis'} Anda masih memerlukan peningkatan.`
                });
            }
        }
        
        // 5. Kesehatan (Dokter, Apoteker)
        const isKesehatan = ['dokter', 'physician', 'dokter umum', 'dokter spesialis', 'apoteker', 'farmasi', 'pharmacist'].some(k => karierLower.includes(k));
        if (isKesehatan && d.ipa < 60) {
            conflicts.push({
                type: 'KESEHATAN',
                pcsPenalty: 20,
                relPenalty: 10,
                message: 'Profesi kesehatan membutuhkan fondasi sains (IPA) yang sangat kuat. Nilai IPA Anda yang di bawah 60 memengaruhi keandalan profil untuk jalur ini.'
            });
        }
        
        // 6. Pendidikan (Guru)
        const isPendidikan = ['guru', 'teacher', 'pengajar', 'tutor'].some(k => karierLower.includes(k));
        if (isPendidikan && d.kemampuan_komunikasi === 'Rendah') {
            conflicts.push({
                type: 'PENDIDIKAN',
                pcsPenalty: 15,
                relPenalty: 0,
                message: 'Karier sebagai Guru memerlukan kemampuan komunikasi yang baik untuk menyampaikan materi pembelajaran secara efektif.'
            });
        }
        
        // 7. Bisnis (Manajer)
        const isBisnisManajer = ['manajer', 'manager', 'direktur', 'ceo'].some(k => karierLower.includes(k));
        if (isBisnisManajer && d.kemampuan_kepemimpinan === 'Rendah' && d.kemampuan_komunikasi === 'Rendah') {
            conflicts.push({
                type: 'BISNIS_BOTH',
                pcsPenalty: 25,
                relPenalty: 5,
                message: 'Untuk mencapai target karier manajerial, Anda membutuhkan kemampuan komunikasi dan kepemimpinan yang baik secara bersamaan.'
            });
        }
        
        return conflicts;
    }

    // ============================================================
    // V5: PROFILE CONSISTENCY SCORE ENGINE (C1-C27 + A1-A5)
    // ============================================================
    function calculateConsistencyScore(d) {
        let score = 100;
        const issues = [];

        // Apply V5.4 Critical Skill Engine penalties to consistency score
        const conflicts = getCriticalSkillConflicts(d);
        conflicts.forEach(c => {
            score -= c.pcsPenalty;
            issues.push({ id: 'CS_' + c.type, type: 'warning', message: c.message, penalty: c.pcsPenalty });
        });

        const avg = avgScore(d);
        const scores = [d.matematika, d.bahasa_inggris, d.ipa, d.ips];
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        const careerContains = (words) => {
            if (!d.tujuan_karier) return false;
            const cLower = d.tujuan_karier.toLowerCase();
            return words.some(w => cLower.includes(w.toLowerCase()));
        };
        const orgContains = (words) => {
            if (!d.aktivitas_organisasi) return false;
            const oLower = d.aktivitas_organisasi.toLowerCase();
            return words.some(w => oLower.includes(w.toLowerCase()));
        };

        // --- C1-C14 ---
        if (d.minat === 'Sains' && d.kemampuan_analisis === 'Rendah' && d.kemampuan_problem_solving === 'Rendah') {
            score -= 10; issues.push({ id:'C1', type:'warning', message:'Anda tertarik pada bidang Sains, sebaiknya asah lebih dalam kemampuan Analisis dan Problem Solving Anda.', penalty:10 });
        }
        if (d.minat === 'Teknologi' && d.kemampuan_komputer === 'Rendah') {
            score -= 10; issues.push({ id:'C2', type:'warning', message:'Pilihan minat Teknologi akan lebih kuat jika didukung dengan peningkatan kemampuan praktis Komputer.', penalty:10 });
        }
        if ((d.minat === 'Kesehatan' || d.minat === 'Kedokteran') && d.ipa < 60) {
            score -= 10; issues.push({ id:'C3', type:'warning', message:`Minat pada rumpun Kesehatan membutuhkan fondasi IPA yang kuat. Nilai IPA Anda saat ini (${d.ipa}) masih perlu ditingkatkan.`, penalty:10 });
        }
        if ((d.minat === 'Bisnis' || d.minat === 'Ekonomi') && d.kemampuan_komunikasi === 'Rendah' && d.kemampuan_kepemimpinan === 'Rendah') {
            score -= 10; issues.push({ id:'C4', type:'warning', message:'Minat pada bidang Bisnis akan berkembang lebih pesat jika Anda mengasah kemampuan Komunikasi dan Kepemimpinan.', penalty:10 });
        }
        if (careerContains(LEADERSHIP_CAREERS) && d.kemampuan_kepemimpinan === 'Rendah') {
            score -= 15; issues.push({ id:'C5', type:'warning', message:`Untuk mendukung target karier sebagai ${d.tujuan_karier}, cobalah untuk mengambil peran aktif guna melatih Kepemimpinan.`, penalty:15 });
        }
        if (careerContains(['Content Creator','Kreator Konten','Influencer','Artis','Desainer','Seniman']) && d.kemampuan_kreativitas === 'Rendah') {
            score -= 10; issues.push({ id:'C6', type:'warning', message:`Karier kreatif seperti ${d.tujuan_karier} membutuhkan inovasi dan Kreativitas yang terus dilatih.`, penalty:10 });
        }
        if (careerContains(['Programmer','Developer','Software Engineer','Data Scientist','IT Specialist']) && d.kemampuan_komputer === 'Rendah') {
            score -= 10; issues.push({ id:'C7', type:'warning', message:`Untuk menjadi ${d.tujuan_karier} profesional, tingkatkan kemampuan Komputer dan pemrograman Anda.`, penalty:10 });
        }
        if (careerContains(RESEARCH_CAREERS) && d.kemampuan_analisis === 'Rendah') {
            score -= 10; issues.push({ id:'C8', type:'warning', message:'Jalur karier peneliti membutuhkan pemikiran kritis dan Analisis yang kuat. Disarankan untuk melatih kemampuan tersebut.', penalty:10 });
        }
        const hasInternational = d.prestasi_akademik_tingkat === 'Internasional' || d.prestasi_non_akademik_tingkat === 'Internasional';
        const hasAnyMediumOrHighSkill = [d.kemampuan_komputer,d.kemampuan_komunikasi,d.kemampuan_kepemimpinan,d.kemampuan_analisis,d.kemampuan_kreativitas,d.kemampuan_problem_solving].some(s=>s==='Sedang'||s==='Tinggi');
        if (hasInternational && !hasAnyMediumOrHighSkill) {
            score -= 15; issues.push({ id:'C9', type:'warning', message:'Anda mencantumkan prestasi tingkat Internasional. Agar seimbang, pastikan kemampuan dasar Anda juga terus dikembangkan.', penalty:15 });
        }
        if (orgContains(['OSIS','Organisasi Siswa Intra Sekolah']) && d.kemampuan_kepemimpinan === 'Rendah') {
            score -= 10; issues.push({ id:'C10', type:'warning', message:'Pengalaman berharga di OSIS akan lebih bersinar jika didukung dengan pengembangan jiwa Kepemimpinan Anda.', penalty:10 });
        }
        if (orgContains(['Paskibra','Pasukan Pengibar Bendera']) && d.kemampuan_kepemimpinan === 'Rendah') {
            score -= 5; issues.push({ id:'C11', type:'warning', message:'Keikutsertaan di Paskibra sangat baik untuk kedisiplinan. Latih terus jiwa Kepemimpinan Anda agar semakin matang.', penalty:5 });
        }
        if (orgContains(['Karang Taruna','Remaja Masjid']) && d.kemampuan_komunikasi === 'Rendah') {
            score -= 5; issues.push({ id:'C12', type:'warning', message:'Keterlibatan di Karang Taruna sangat membantu bersosialisasi. Asah terus kemampuan Komunikasi Anda.', penalty:5 });
        }
        if (avg >= 80 && allSkillsEqual(d,'Rendah')) {
            score -= 10; issues.push({ id:'C13', type:'warning', message:'Nilai akademik harian Anda sudah sangat baik. Mari selaraskan prestasi ini dengan melatih keterampilan/kemampuan praktis.', penalty:10 });
        }
        if (avg < 55 && allSkillsEqual(d,'Tinggi')) {
            score -= 10; issues.push({ id:'C14', type:'warning', message:'Keterampilan praktis Anda diatur Tinggi. Tingkatkan juga fokus belajar harian di sekolah agar nilai akademik sejalan.', penalty:10 });
        }

        // A1-A5 (Anomaly Detection)
        const contains100 = scores.some(s=>s===100);
        const containsExtremelyLow = scores.some(s=>s<=20);
        if (contains100 && containsExtremelyLow) {
            score -= 15; issues.push({ id:'A1', type:'anomaly', message:'Pola nilai akademik Anda memiliki perbedaan yang sangat ekstrem (ada nilai sempurna 100 namun ada juga nilai di bawah 20).', penalty:15 });
        }
        if ((maxScore - minScore) > 90) {
            score -= 10; issues.push({ id:'A2', type:'anomaly', message:'Selisih antara nilai rapor tertinggi dan terendah melebihi 90 poin. Pastikan data nilai yang dimasukkan sudah benar.', penalty:10 });
        }
        const scienceInterest = ['Sains','Teknologi','Kesehatan','Kedokteran','Teknik','Engineering'].includes(d.minat);
        const socialInterest = ['Sosial','Ekonomi','Bisnis','Hukum','Pendidikan','Sastra','Seni','Desain'].includes(d.minat);
        const scienceGradesBetter = (d.ipa + d.matematika)/2 > (d.ips + d.bahasa_inggris)/2 + 20;
        const socialGradesBetter  = (d.ips + d.bahasa_inggris)/2 > (d.ipa + d.matematika)/2 + 20;
        if (scienceInterest && socialGradesBetter) {
            score -= 15; issues.push({ id:'A3', type:'anomaly', message:`Minat Anda berada di rumpun Sains/Teknologi, namun pencapaian akademik menunjukkan kekuatan pada mata pelajaran rumpun Sosial.`, penalty:15 });
        } else if (socialInterest && scienceGradesBetter) {
            score -= 15; issues.push({ id:'A3', type:'anomaly', message:`Minat Anda berada di rumpun Sosial/Bisnis, namun pencapaian akademik menunjukkan kekuatan pada mata pelajaran rumpun Eksakta.`, penalty:15 });
        }
        const rumpunEksakta = ['sains','teknologi','kesehatan','kedokteran','teknik','engineering','komputer','programmer','developer','dokter','perawat','insinyur','peneliti'];
        const rumpunSosial  = ['sosial','ekonomi','bisnis','hukum','pendidikan','sastra','seni','desain','manajer','guru','wirausaha','menulis','komunikasi','politik','creator','seniman'];
        const minatR  = rumpunEksakta.some(x=>d.minat.toLowerCase().includes(x))?'eksakta':(rumpunSosial.some(x=>d.minat.toLowerCase().includes(x))?'sosial':'netral');
        const karierR = rumpunEksakta.some(x=>d.tujuan_karier.toLowerCase().includes(x))?'eksakta':(rumpunSosial.some(x=>d.tujuan_karier.toLowerCase().includes(x))?'sosial':'netral');
        const hobiR   = rumpunEksakta.some(x=>d.hobi.toLowerCase().includes(x))?'eksakta':(rumpunSosial.some(x=>d.hobi.toLowerCase().includes(x))?'sosial':'netral');
        if (minatR!=='netral'&&karierR!=='netral'&&hobiR!=='netral'&&minatR!==karierR&&karierR!==hobiR&&minatR!==hobiR) {
            score -= 20; issues.push({ id:'A4', type:'anomaly', message:'Minat, target karier, dan hobi yang Anda pilih berada pada rumpun yang saling berlawanan/tidak berhubungan.', penalty:20 });
        }
        if (hasInternational && avg < 60 && allSkillsEqual(d,'Rendah')) {
            score -= 20; issues.push({ id:'A5', type:'anomaly', message:'Pencantuman prestasi tingkat Internasional terlihat tidak selaras dengan capaian rata-rata nilai sekolah dan kemampuan Anda.', penalty:20 });
        }

        // --- C15-C27 ---
        if ((d.minat === 'Teknik' || d.minat === 'Engineering') && d.kemampuan_komputer === 'Rendah') {
            score -= 10; issues.push({ id:'C15', type:'warning', message:'Minat Teknik akan lebih solid jika dibarengi dengan dasar kemampuan Komputer yang mumpuni.', penalty:10 });
        }
        if ((d.minat === 'Teknik' || d.minat === 'Engineering') && d.kemampuan_analisis === 'Rendah') {
            score -= 10; issues.push({ id:'C16', type:'warning', message:'Bidang Teknik membutuhkan penalaran yang baik. Disarankan untuk melatih kemampuan Analisis Anda.', penalty:10 });
        }
        if (d.minat === 'Teknologi' && d.kemampuan_problem_solving === 'Rendah') {
            score -= 10; issues.push({ id:'C17', type:'warning', message:'Pilihan minat Teknologi akan lebih optimal jika Anda membiasakan diri melatih kemampuan Problem Solving.', penalty:10 });
        }
        if (careerContains(['Arsitek','Arsitektur']) && d.matematika < 60) {
            score -= 10; issues.push({ id:'C18', type:'warning', message:`Profesi Arsitek sangat erat kaitannya dengan kalkulasi. Nilai Matematika Anda (${d.matematika}) masih perlu ditingkatkan.`, penalty:10 });
        }
        if (careerContains(['Programmer','Developer','Software Engineer']) && d.matematika < 60) {
            score -= 10; issues.push({ id:'C19', type:'warning', message:`Pemrograman membutuhkan logika matematika yang kuat. Nilai Matematika saat ini (${d.matematika}) masih bisa ditingkatkan.`, penalty:10 });
        }
        if (careerContains(['Engineer','Insinyur','Teknik']) && d.ipa < 60) {
            score -= 10; issues.push({ id:'C20', type:'warning', message:`Profesi insinyur/engineer membutuhkan pemahaman IPA yang matang. Nilai IPA saat ini (${d.ipa}) perlu ditingkatkan.`, penalty:10 });
        }
        if (careerContains(RESEARCH_CAREERS) && d.kemampuan_analisis === 'Rendah') {
            if (!issues.find(i=>i.id==='C8')) {
                score -= 10; issues.push({ id:'C21', type:'warning', message:'Profesi Peneliti sangat mengutamakan metodologi ilmiah. Kemampuan Analisis Anda masih perlu ditingkatkan.', penalty:10 });
            }
        }
        if (careerContains(['Dokter','Physician','Medis']) && d.ipa < 70) {
            score -= 10; issues.push({ id:'C22', type:'warning', message:`Menjadi Dokter membutuhkan keahlian sains yang mendalam. Nilai IPA Anda (${d.ipa}) perlu ditingkatkan setidaknya hingga di atas 70.`, penalty:10 });
        }
        const acadBidang = (d.prestasi_akademik_bidang || '').toLowerCase();
        if ((acadBidang.includes('sains') || acadBidang.includes('ipa') || acadBidang.includes('biologi') || acadBidang.includes('fisika') || acadBidang.includes('kimia')) && d.ipa < 60) {
            score -= 10; issues.push({ id:'C23', type:'warning', message:`Anda memiliki prestasi di bidang Sains. Tingkatkan konsistensi Anda dengan mendongkrak nilai IPA rapor harian (${d.ipa}).`, penalty:10 });
        }
        if ((acadBidang.includes('matematika') || acadBidang.includes('math')) && d.matematika < 60) {
            score -= 10; issues.push({ id:'C24', type:'warning', message:`Prestasi Matematika Anda sudah bagus. Selaraskan juga dengan meningkatkan nilai harian Matematika di sekolah (${d.matematika}).`, penalty:10 });
        }
        if (avg < 40 && d.kemampuan_analisis === 'Tinggi') {
            score -= 15; issues.push({ id:'C25', type:'anomaly', message:`Rata-rata nilai akademik Anda masih sangat rendah (${avg.toFixed(1)}). Harap pastikan keakuratan pengisian tingkat kemampuan Analisis.`, penalty:15 });
        }
        if (avg < 40 && d.kemampuan_problem_solving === 'Tinggi') {
            score -= 15; issues.push({ id:'C26', type:'anomaly', message:`Rata-rata nilai akademik masih sangat rendah. Harap tinjau kembali kecocokan tingkat kemampuan Problem Solving.`, penalty:15 });
        }
        if (avg < 40 && d.kemampuan_komputer === 'Tinggi') {
            score -= 10; issues.push({ id:'C27', type:'anomaly', message:`Rata-rata nilai akademik masih rendah. Harap sesuaikan pengisian tingkat kemampuan Komputer Anda agar realistis.`, penalty:10 });
        }

        // --- V5.2: Minat <-> Nilai ---
        if ((d.minat === 'Teknik' || d.minat === 'Engineering') && d.matematika < 50) {
            score -= 15; issues.push({ id:'C28', type:'warning', message:'Anda memiliki minat di bidang teknik, namun nilai Matematika saat ini masih perlu ditingkatkan secara signifikan untuk mendukung jalur tersebut.', penalty:15 });
        }
        if ((d.minat === 'Teknik' || d.minat === 'Engineering') && d.ipa < 50) {
            score -= 10; issues.push({ id:'C29', type:'warning', message:'Minat di bidang teknik akan lebih solid jika didukung dengan peningkatan nilai IPA Anda.', penalty:10 });
        }
        if (d.minat === 'Sains' && d.ipa < 60) {
            score -= 15; issues.push({ id:'C30', type:'warning', message:'Minat pada bidang Sains sangat bergantung pada fondasi IPA yang kuat. Nilai IPA Anda saat ini masih bisa ditingkatkan lebih jauh.', penalty:15 });
        }
        if ((d.minat === 'Bisnis' || d.minat === 'Ekonomi') && d.ips < 60) {
            score -= 10; issues.push({ id:'C31', type:'warning', message:'Untuk jalur bisnis dan ekonomi, nilai IPS yang baik akan menjadi bekal yang sangat berharga. Pertimbangkan untuk meningkatkannya.', penalty:10 });
        }
        if (d.minat === 'Komunikasi' && d.bahasa_inggris < 60) {
            score -= 10; issues.push({ id:'C32', type:'warning', message:'Minat di bidang komunikasi akan semakin kuat jika didukung dengan kemampuan Bahasa Inggris yang memadai.', penalty:10 });
        }

        // --- V5.2: Minat <-> Kemampuan ---
        if (!issues.find(i => i.id === 'C15') && (d.minat === 'Teknik' || d.minat === 'Engineering') && d.kemampuan_komputer === 'Rendah') {
            score -= 10; issues.push({ id:'C33', type:'warning', message:'Anda tertarik pada bidang teknik. Meningkatkan kemampuan komputer akan memperkuat kesiapan Anda di bidang ini.', penalty:10 });
        }
        if (!issues.find(i => i.id === 'C16') && (d.minat === 'Teknik' || d.minat === 'Engineering') && d.kemampuan_analisis === 'Rendah') {
            score -= 10; issues.push({ id:'C34', type:'warning', message:'Bidang teknik memerlukan pemikiran analitis yang tajam. Melatih kemampuan analisis Anda akan sangat bermanfaat.', penalty:10 });
        }
        if (!issues.find(i => i.id === 'C17') && (d.minat === 'Teknik' || d.minat === 'Engineering') && d.kemampuan_problem_solving === 'Rendah') {
            score -= 10; issues.push({ id:'C35', type:'warning', message:'Profil teknik yang kuat idealnya disertai dengan kemampuan problem solving yang baik. Ini adalah area yang bisa Anda kembangkan.', penalty:10 });
        }
        if ((d.minat === 'Bisnis' || d.minat === 'Ekonomi') && d.kemampuan_komunikasi === 'Rendah') {
            if (!issues.find(i => i.id === 'C4')) {
                score -= 10; issues.push({ id:'C36', type:'warning', message:'Dalam dunia bisnis, kemampuan komunikasi adalah kunci. Kembangkan keterampilan ini untuk mendukung karier Anda di bidang bisnis.', penalty:10 });
            }
        }
        if ((d.minat === 'Desain' || d.minat === 'Seni') && d.kemampuan_kreativitas === 'Rendah') {
            score -= 10; issues.push({ id:'C37', type:'warning', message:'Kreativitas adalah nyawa dari bidang desain dan seni. Teruslah eksplorasi dan latih potensi kreatif Anda.', penalty:10 });
        }

        // --- V5.3: CAREER INTELLIGENCE ENGINE (CIE) ---
        // Database relasi: Karier → Kompetensi Utama + Nilai Pendukung
        // Setiap entry: { keys, rules: [{ field, op, val, penalty, msg }] }
        const CIE_DB = [
            // ── BIDANG TEKNOLOGI ─────────────────────────────────────
            {
                keys: ['software engineer', 'programmer', 'developer', 'coding'],
                rules: [
                    { field:'kemampuan_komputer',       op:'skill',  val:'Rendah', penalty:15, id:'CI01', msg:`Karier sebagai ${d.tujuan_karier} membutuhkan kemampuan komputer yang sangat kuat. Ini adalah kompetensi utama yang wajib dikembangkan.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:15, id:'CI02', msg:`Kemampuan analisis yang baik sangat dibutuhkan dalam dunia pengembangan perangkat lunak. Latih kemampuan ini untuk mendukung jalur ${d.tujuan_karier}.` },
                    { field:'kemampuan_problem_solving',op:'skill',  val:'Rendah', penalty:10, id:'CI03', msg:`Problem solving adalah inti dari pekerjaan ${d.tujuan_karier}. Kembangkan kemampuan ini agar siap menghadapi tantangan teknis.` },
                    { field:'matematika',               op:'lt',     val:60,       penalty:10, id:'CI04', msg:`Karier di bidang pemrograman umumnya memerlukan logika matematika yang baik. Nilai matematika Anda (${d.matematika}) masih bisa ditingkatkan.` },
                ]
            },
            {
                keys: ['data scientist', 'data analyst', 'machine learning', 'ai engineer'],
                rules: [
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:15, id:'CI05', msg:`Karier Data Scientist sangat bertumpu pada kemampuan analisis data yang kuat. Ini adalah fondasi utama yang perlu Anda kembangkan.` },
                    { field:'matematika',               op:'lt',     val:70,       penalty:15, id:'CI06', msg:`Data science memerlukan dasar statistika dan matematika yang kuat. Nilai matematika Anda (${d.matematika}) perlu ditingkatkan untuk mendukung jalur ini.` },
                    { field:'kemampuan_komputer',       op:'skill',  val:'Rendah', penalty:10, id:'CI07', msg:`Sebagai Data Scientist, kemampuan komputer dan pemrograman adalah alat kerja utama yang perlu dikuasai.` },
                ]
            },
            {
                keys: ['cyber security', 'keamanan siber', 'ethical hacker', 'network security'],
                rules: [
                    { field:'kemampuan_komputer',       op:'skill',  val:'Rendah', penalty:15, id:'CI08', msg:`Karier di bidang keamanan siber membutuhkan penguasaan komputer yang sangat mendalam. Ini adalah kompetensi inti yang harus diperkuat.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:15, id:'CI09', msg:`Cyber security memerlukan pemikiran analitis untuk mengidentifikasi ancaman. Kemampuan analisis Anda perlu ditingkatkan.` },
                    { field:'kemampuan_problem_solving',op:'skill',  val:'Rendah', penalty:10, id:'CI10', msg:`Mengatasi ancaman siber memerlukan problem solving yang cepat dan tepat. Kembangkan kemampuan ini secara aktif.` },
                ]
            },
            {
                keys: ['game developer', 'game designer', 'pengembang game'],
                rules: [
                    { field:'kemampuan_komputer',       op:'skill',  val:'Rendah', penalty:15, id:'CI11', msg:`Pengembangan game memerlukan kemampuan komputer dan pemrograman yang solid. Tingkatkan kompetensi ini sebagai fondasi karier Anda.` },
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:10, id:'CI12', msg:`Dunia game sangat mengandalkan kreativitas dalam desain dan narasi. Teruslah mengembangkan sisi kreatif Anda.` },
                ]
            },

            // ── BIDANG KESEHATAN ─────────────────────────────────────
            {
                keys: ['dokter', 'physician', 'dokter umum', 'dokter spesialis'],
                rules: [
                    { field:'ipa',                      op:'lt',     val:70,       penalty:15, id:'CI13', msg:`Profesi dokter membutuhkan penguasaan ilmu sains yang sangat mendalam. Nilai IPA Anda (${d.ipa}) perlu ditingkatkan sebagai fondasi utama jalur kedokteran.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI14', msg:`Dokter harus mampu menganalisis gejala dan kondisi pasien secara akurat. Tingkatkan kemampuan analisis Anda untuk mendukung jalur ini.` },
                ]
            },
            {
                keys: ['apoteker', 'farmasi', 'pharmacist'],
                rules: [
                    { field:'ipa',                      op:'lt',     val:70,       penalty:15, id:'CI15', msg:`Profesi apoteker memerlukan pemahaman kimia dan biologi yang kuat. Nilai IPA Anda (${d.ipa}) perlu ditingkatkan untuk mendukung jalur ini.` },
                ]
            },
            {
                keys: ['perawat', 'nurse', 'bidan'],
                rules: [
                    { field:'ipa',                      op:'lt',     val:60,       penalty:10, id:'CI16', msg:`Jalur keperawatan memerlukan dasar ilmu IPA yang memadai. Tingkatkan nilai IPA Anda untuk memperkuat kesiapan di bidang ini.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:10, id:'CI17', msg:`Perawat berinteraksi langsung dengan pasien setiap hari. Kemampuan komunikasi yang baik adalah kunci penting dalam profesi ini.` },
                ]
            },
            {
                keys: ['psikolog', 'psikiater', 'konselor', 'psychologist'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI18', msg:`Karier psikolog membutuhkan kemampuan komunikasi yang sangat baik untuk membangun kepercayaan dan memahami klien. Profil saat ini belum sepenuhnya mendukung jalur tersebut.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI19', msg:`Psikolog harus mampu menganalisis perilaku dan kondisi mental klien secara mendalam. Tingkatkan kemampuan analisis untuk mendukung karier ini.` },
                ]
            },

            // ── BIDANG BISNIS ─────────────────────────────────────────
            {
                keys: ['manajer', 'manager', 'direktur', 'ceo', 'kepala divisi'],
                rules: [
                    { field:'kemampuan_kepemimpinan',   op:'skill',  val:'Rendah', penalty:15, id:'CI20', msg:`Posisi manajerial membutuhkan jiwa kepemimpinan yang kuat. Ini adalah kompetensi inti yang sangat perlu Anda kembangkan untuk mencapai target karier tersebut.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI21', msg:`Seorang manajer harus mampu berkomunikasi secara efektif dengan tim dan pemangku kepentingan. Kemampuan komunikasi Anda perlu ditingkatkan.` },
                ]
            },
            {
                keys: ['wirausaha', 'entrepreneur', 'pengusaha', 'pebisnis', 'startup founder'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:10, id:'CI22', msg:`Wirausaha memerlukan kreativitas dalam menciptakan produk dan memecahkan tantangan bisnis. Teruslah mengembangkan potensi kreatif Anda.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:10, id:'CI23', msg:`Kemampuan komunikasi yang kuat membantu wirausahawan dalam negosiasi, pemasaran, dan membangun jaringan bisnis.` },
                    { field:'kemampuan_kepemimpinan',   op:'skill',  val:'Rendah', penalty:10, id:'CI24', msg:`Memimpin tim dan mengambil keputusan bisnis memerlukan jiwa kepemimpinan. Kembangkan kemampuan ini untuk mendukung cita-cita wirausaha Anda.` },
                ]
            },
            {
                keys: ['konsultan bisnis', 'business consultant', 'konsultan manajemen', 'konsultan'],
                rules: [
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:15, id:'CI25', msg:`Konsultan bisnis harus mampu menganalisis permasalahan perusahaan dan merancang solusi strategis. Kemampuan analisis Anda adalah kunci utama profesi ini.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI26', msg:`Karier konsultan sangat mengandalkan kemampuan komunikasi yang efektif untuk menyampaikan rekomendasi kepada klien.` },
                ]
            },
            {
                keys: ['akuntan', 'accountant', 'auditor', 'keuangan'],
                rules: [
                    { field:'matematika',               op:'lt',     val:65,       penalty:10, id:'CI27', msg:`Karier di bidang akuntansi dan keuangan memerlukan ketelitian dan dasar matematika yang baik. Nilai matematika Anda (${d.matematika}) perlu ditingkatkan.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI28', msg:`Akuntan dan auditor harus mampu menganalisis data keuangan secara akurat. Tingkatkan kemampuan analitis Anda untuk mendukung karier ini.` },
                ]
            },

            // ── BIDANG KOMUNIKASI ─────────────────────────────────────
            {
                keys: ['presenter', 'presenter tv', 'penyiar', 'host', 'mc', 'master of ceremony'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:20, id:'CI29', msg:`Karier Presenter TV umumnya membutuhkan kemampuan komunikasi yang sangat kuat. Saat ini kemampuan komunikasi masih berada pada kategori rendah sehingga menurunkan tingkat konsistensi profil secara signifikan.` },
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:5,  id:'CI30', msg:`Kreativitas membantu seorang presenter tampil lebih menarik dan berkesan. Kembangkan sisi kreatif Anda untuk memperkuat profil ini.` },
                ]
            },
            {
                keys: ['jurnalis', 'wartawan', 'reporter', 'journalist', 'editor'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI31', msg:`Jurnalis dan wartawan memerlukan kemampuan komunikasi yang kuat untuk wawancara, menulis, dan menyampaikan berita. Ini adalah kompetensi inti profesi ini.` },
                    { field:'bahasa_inggris',           op:'lt',     val:60,       penalty:10, id:'CI32', msg:`Kemampuan bahasa Inggris yang memadai akan memperluas jangkauan kerja seorang jurnalis, terutama untuk sumber berita internasional. Nilai bahasa Inggris Anda (${d.bahasa_inggris}) masih bisa ditingkatkan.` },
                ]
            },
            {
                keys: ['content creator', 'kreator konten', 'youtuber', 'influencer', 'tiktoker', 'blogger'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:15, id:'CI33', msg:`Content Creator adalah profesi yang sangat mengandalkan kreativitas untuk menghasilkan konten yang menarik dan relevan. Ini adalah kompetensi utama yang harus dikembangkan.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:10, id:'CI34', msg:`Komunikasi yang baik membantu content creator membangun koneksi yang kuat dengan audiens mereka.` },
                ]
            },
            {
                keys: ['public relations', 'pr', 'humas', 'hubungan masyarakat'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI35', msg:`Public Relations adalah profesi yang sepenuhnya bertumpu pada kemampuan komunikasi. Ini adalah kompetensi inti yang wajib dimiliki.` },
                    { field:'kemampuan_kepemimpinan',   op:'skill',  val:'Rendah', penalty:10, id:'CI36', msg:`Kemampuan kepemimpinan membantu praktisi PR dalam memimpin kampanye dan mengelola hubungan dengan media.` },
                ]
            },
            {
                keys: ['penulis', 'author', 'novelis', 'copywriter', 'scriptwriter', 'penulis konten'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:15, id:'CI37', msg:`Karier penulis sangat bergantung pada kreativitas dalam mengolah ide dan merangkai cerita. Teruslah mengembangkan potensi kreatif Anda.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:10, id:'CI38', msg:`Kemampuan komunikasi tertulis yang baik adalah fondasi utama bagi seorang penulis profesional.` },
                ]
            },

            // ── BIDANG PENDIDIKAN ─────────────────────────────────────
            {
                keys: ['guru', 'teacher', 'pengajar', 'tutor', 'instruktur'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI39', msg:`Profesi guru sangat membutuhkan kemampuan komunikasi yang baik untuk menyampaikan materi dengan jelas dan memotivasi siswa. Ini adalah kompetensi utama yang perlu dikembangkan.` },
                ]
            },
            {
                keys: ['dosen', 'lecturer', 'professor', 'akademisi', 'peneliti'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI40', msg:`Dosen dan akademisi perlu menyampaikan ide-ide kompleks dengan jelas kepada mahasiswa dan komunitas ilmiah. Kemampuan komunikasi adalah kompetensi inti yang harus dimiliki.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI41', msg:`Penelitian akademik memerlukan kemampuan analisis yang tajam untuk mengolah data dan menarik kesimpulan yang valid.` },
                ]
            },

            // ── BIDANG HUKUM ──────────────────────────────────────────
            {
                keys: ['pengacara', 'lawyer', 'advokat', 'jaksa', 'hakim', 'notaris'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI42', msg:`Profesi hukum seperti pengacara sangat mengandalkan kemampuan komunikasi, baik dalam argumentasi di pengadilan maupun negosiasi. Ini adalah kompetensi inti yang wajib dikuasai.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI43', msg:`Pengacara harus mampu menganalisis kasus, peraturan hukum, dan bukti secara mendalam. Kemampuan analisis Anda perlu ditingkatkan.` },
                    { field:'bahasa_inggris',           op:'lt',     val:60,       penalty:5,  id:'CI44', msg:`Pemahaman bahasa Inggris yang baik akan memperluas akses terhadap literatur hukum internasional. Nilai bahasa Inggris Anda (${d.bahasa_inggris}) masih bisa ditingkatkan.` },
                ]
            },

            // ── BIDANG DESAIN & KREATIF ───────────────────────────────
            {
                keys: ['desainer grafis', 'graphic designer', 'desainer', 'ilustrator'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:15, id:'CI45', msg:`Desainer grafis adalah profesi yang sepenuhnya mengandalkan kreativitas visual. Kreativitas adalah kompetensi utama yang harus terus diasah.` },
                    { field:'kemampuan_komputer',       op:'skill',  val:'Rendah', penalty:10, id:'CI46', msg:`Desainer grafis modern menggunakan berbagai perangkat lunak desain. Kemampuan komputer yang memadai akan sangat mendukung karier ini.` },
                ]
            },
            {
                keys: ['arsitek', 'arsitektur', 'architect'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:10, id:'CI47', msg:`Arsitektur adalah perpaduan antara seni dan teknik. Kreativitas dalam merancang ruang adalah kompetensi penting yang perlu Anda kembangkan.` },
                    { field:'matematika',               op:'lt',     val:60,       penalty:10, id:'CI48', msg:`Arsitek bekerja erat dengan kalkulasi struktur dan geometri. Nilai matematika Anda (${d.matematika}) perlu ditingkatkan untuk mendukung jalur ini.` },
                ]
            },
            {
                keys: ['ui ux', 'ui/ux', 'ux designer', 'ui designer', 'product designer'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:15, id:'CI49', msg:`UI/UX Designer mendesain pengalaman pengguna yang intuitif dan menarik. Kreativitas adalah kompetensi inti profesi ini.` },
                    { field:'kemampuan_komputer',       op:'skill',  val:'Rendah', penalty:10, id:'CI50', msg:`Alat desain UI/UX berbasis digital memerlukan kemampuan komputer yang memadai. Tingkatkan kompetensi ini untuk mendukung karier Anda.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:5,  id:'CI51', msg:`UI/UX yang baik didasarkan pada pemahaman mendalam tentang kebutuhan pengguna. Kemampuan analisis membantu dalam riset dan evaluasi desain.` },
                ]
            },
            {
                keys: ['fotografer', 'videografer', 'filmmaker', 'sinematografer'],
                rules: [
                    { field:'kemampuan_kreativitas',    op:'skill',  val:'Rendah', penalty:15, id:'CI52', msg:`Fotografi dan videografi sangat bergantung pada kepekaan estetika dan kreativitas visual. Teruslah mengembangkan sisi kreatif Anda.` },
                ]
            },

            // ── BIDANG SAINS & TEKNIK ────────────────────────────────
            {
                keys: ['insinyur', 'engineer', 'teknik sipil', 'teknik mesin', 'teknik elektro', 'teknik kimia', 'teknik industri'],
                rules: [
                    { field:'matematika',               op:'lt',     val:60,       penalty:10, id:'CI53', msg:`Jalur keteknikan memerlukan matematika sebagai dasar perhitungan teknis. Nilai matematika Anda (${d.matematika}) masih perlu ditingkatkan.` },
                    { field:'ipa',                      op:'lt',     val:60,       penalty:10, id:'CI54', msg:`Ilmu pengetahuan alam adalah fondasi dari banyak bidang keteknikan. Tingkatkan nilai IPA Anda untuk memperkuat kesiapan di jalur ini.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI55', msg:`Insinyur harus mampu menganalisis permasalahan teknis dan merancang solusi yang efisien. Kemampuan analisis Anda perlu dikembangkan.` },
                    { field:'kemampuan_problem_solving',op:'skill',  val:'Rendah', penalty:10, id:'CI56', msg:`Problem solving adalah inti dari pekerjaan seorang insinyur. Kembangkan kemampuan ini secara aktif.` },
                ]
            },
            {
                keys: ['ilmuwan', 'scientist', 'peneliti sains', 'fisikawan', 'kimiawan', 'biolog'],
                rules: [
                    { field:'ipa',                      op:'lt',     val:70,       penalty:15, id:'CI57', msg:`Karier ilmuwan memerlukan penguasaan sains yang sangat baik. Nilai IPA Anda (${d.ipa}) perlu ditingkatkan sebagai fondasi utama jalur ini.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:15, id:'CI58', msg:`Penelitian ilmiah sepenuhnya bertumpu pada kemampuan analisis yang tajam dan metodis. Ini adalah kompetensi inti yang wajib dikuasai.` },
                    { field:'matematika',               op:'lt',     val:65,       penalty:10, id:'CI59', msg:`Matematika adalah bahasa ilmu pengetahuan. Nilai matematika Anda (${d.matematika}) perlu ditingkatkan untuk mendukung jalur sains.` },
                ]
            },

            // ── BIDANG SOSIAL & PELAYANAN ────────────────────────────
            {
                keys: ['diplomat', 'hubungan internasional', 'diplomat karier'],
                rules: [
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI60', msg:`Diplomat harus mahir berkomunikasi lintas budaya dan bahasa. Kemampuan komunikasi adalah kompetensi terpenting dalam karier ini.` },
                    { field:'bahasa_inggris',           op:'lt',     val:70,       penalty:15, id:'CI61', msg:`Bahasa Inggris adalah alat komunikasi utama dalam diplomasi internasional. Nilai bahasa Inggris Anda (${d.bahasa_inggris}) sangat perlu ditingkatkan.` },
                    { field:'kemampuan_analisis',       op:'skill',  val:'Rendah', penalty:10, id:'CI62', msg:`Diplomat perlu menganalisis situasi geopolitik dan merancang strategi negosiasi yang efektif. Kemampuan analisis Anda perlu dikembangkan.` },
                ]
            },
            {
                keys: ['politisi', 'anggota dpr', 'anggota dprd', 'walikota', 'bupati'],
                rules: [
                    { field:'kemampuan_kepemimpinan',   op:'skill',  val:'Rendah', penalty:15, id:'CI63', msg:`Karier politik membutuhkan jiwa kepemimpinan yang kuat untuk memimpin dan mewakili masyarakat. Ini adalah kompetensi inti yang wajib dikembangkan.` },
                    { field:'kemampuan_komunikasi',     op:'skill',  val:'Rendah', penalty:15, id:'CI64', msg:`Politisi harus mampu berkomunikasi secara persuasif dengan berbagai kalangan. Kemampuan komunikasi Anda perlu ditingkatkan secara signifikan.` },
                ]
            },
            {
                keys: ['atlet', 'olahragawan', 'pesepakbola', 'pemain basket', 'perenang', 'sprinter'],
                rules: [
                    { field:'kemampuan_problem_solving',op:'skill',  val:'Rendah', penalty:5,  id:'CI65', msg:`Atlet profesional perlu kemampuan membaca situasi dan mengambil keputusan cepat di lapangan. Latih kemampuan problem solving untuk mendukung karier ini.` },
                ]
            },
        ];

        // Terapkan CIE — cek setiap karier terhadap aturannya
        const karierLower = (d.tujuan_karier || '').toLowerCase();
        for (const career of CIE_DB) {
            if (!career.keys.some(k => karierLower.includes(k))) continue;
            for (const rule of career.rules) {
                // Cegah duplikasi dengan rule sebelumnya (C5, C7, C8, dll.)
                if (issues.find(i => i.id === rule.id)) continue;
                let triggered = false;
                if (rule.op === 'skill') {
                    triggered = d[rule.field] === rule.val;
                } else if (rule.op === 'lt') {
                    triggered = (d[rule.field] || 0) < rule.val;
                }
                if (triggered) {
                    score -= rule.penalty;
                    issues.push({ id: rule.id, type: 'warning', message: rule.msg, penalty: rule.penalty });
                }
            }
        }

        // --- V5.2/V5.3: Prestasi <-> Profil (Fixed) ---
        const acadBidangLower = (d.prestasi_akademik_bidang || '').toLowerCase();
        if ((acadBidangLower.includes('sains') || acadBidangLower.includes('biologi') || acadBidangLower.includes('fisika') || acadBidangLower.includes('kimia')) && d.ipa < 60) {
            if (!issues.find(i => i.id === 'C23' || i.id === 'C44')) {
                score -= 15; issues.push({ id:'C44', type:'warning', message:'Anda mencantumkan prestasi di bidang sains, namun nilai IPA rapor harian masih perlu ditingkatkan agar keduanya saling mendukung.', penalty:15 });
            }
        }
        if ((acadBidangLower.includes('matematika') || acadBidangLower.includes('math')) && d.matematika < 60) {
            if (!issues.find(i => i.id === 'C24' || i.id === 'C45')) {
                score -= 15; issues.push({ id:'C45', type:'warning', message:'Prestasi di bidang matematika akan lebih meyakinkan jika diiringi dengan nilai matematika harian yang baik. Pertahankan dan tingkatkan konsistensi ini.', penalty:15 });
            }
        }
        if ((acadBidangLower.includes('debat') || acadBidangLower.includes('debate')) && d.kemampuan_komunikasi === 'Rendah') {
            score -= 10; issues.push({ id:'C46', type:'warning', message:'Prestasi debat yang Anda miliki akan lebih bersinar jika sejalan dengan pengembangan kemampuan komunikasi Anda secara keseluruhan.', penalty:10 });
        }

        // Bug Fix V5.3: Hanya cek olahraga jika prestasi NON-AKADEMIK memang di bidang olahraga
        // Jangan trigger jika prestasi akademik (fisika, kimia, matematika, debat, dll.)
        const nonAcadBidangLower = (d.prestasi_non_akademik_bidang || '').toLowerCase();
        const hobiLower = (d.hobi || '').toLowerCase();
        const orgLower  = (d.aktivitas_organisasi || '').toLowerCase();
        const olahragaKeywords = ['sepak bola', 'basket', 'voli', 'renang', 'tenis', 'badminton', 'atletik', 'olahraga', 'taekwondo', 'futsal', 'pencak silat', 'karate'];
        const isOlahragaAchievement = nonAcadBidangLower && olahragaKeywords.some(k => nonAcadBidangLower.includes(k));
        // Pastikan ini bukan prestasi akademik (fisika, kimia, dll.)
        const isAcademicSubject = acadBidangLower && (acadBidangLower.includes('fisika') || acadBidangLower.includes('kimia') || acadBidangLower.includes('matematika') || acadBidangLower.includes('debat') || acadBidangLower.includes('sains') || acadBidangLower.includes('biologi'));
        if (isOlahragaAchievement && !isAcademicSubject) {
            const hasOlahragaActivity = olahragaKeywords.some(k => hobiLower.includes(k) || orgLower.includes(k));
            if (!hasOlahragaActivity) {
                score -= 10; issues.push({ id:'C47', type:'warning', message:'Anda mencantumkan prestasi di bidang olahraga, namun hobi dan aktivitas organisasi Anda belum mencerminkan hal tersebut. Pastikan data ini konsisten.', penalty:10 });
            }
        }

        // --- V5 Consistency Limiter ---
        score = Math.max(0, score);
        const issueCount = issues.length;
        if (issueCount >= 7)      score = Math.min(score, 70);
        else if (issueCount >= 5) score = Math.min(score, 80);
        else if (issueCount >= 3) score = Math.min(score, 90);

        let status, statusLabel, statusColor, statusIcon;
        if (score >= 90)      { status='EXCELLENT'; statusLabel='Sangat Konsisten'; statusColor='#10b981'; statusIcon='fa-circle-check'; }
        else if (score >= 75) { status='GOOD';      statusLabel='Cukup Konsisten';  statusColor='#3b82f6'; statusIcon='fa-thumbs-up'; }
        else if (score >= 60) { status='WARNING';   statusLabel='Kurang Konsisten'; statusColor='#f59e0b'; statusIcon='fa-triangle-exclamation'; }
        else                  { status='INVALID';   statusLabel='Tidak Konsisten';  statusColor='#ef4444'; statusIcon='fa-circle-xmark'; }

        return { score, status, statusLabel, statusColor, statusIcon, issues };
    }

    // ============================================================
    // V5.1: EXPLAINABLE STRENGTHS & DEVELOPMENT ENGINE
    // ============================================================
    function detectStrengths(d) {
        const strengths = [];
        const avg = avgScore(d);

        if (avg >= 85) strengths.push(`Rata-rata nilai akademik Anda sangat baik (${avg.toFixed(1)}), menjadi pondasi kuat untuk perkuliahan.`);
        else if (avg >= 75) strengths.push(`Rata-rata nilai akademik Anda cukup baik (${avg.toFixed(1)}).`);

        if (d.ipa >= 80 && (d.minat==='Sains'||d.minat==='Kesehatan'||d.minat==='Kedokteran'||d.minat==='Teknik'))
            strengths.push(`Nilai IPA yang tinggi (${d.ipa}) sangat selaras dengan minat Anda di bidang ${d.minat}.`);
        if (d.matematika >= 80 && (d.minat==='Teknologi'||d.minat==='Teknik'||d.minat==='Sains'))
            strengths.push(`Kemampuan logika dan nilai Matematika Anda (${d.matematika}) sangat menunjang rumpun eksakta.`);
        if (d.ips >= 80 && (d.minat==='Bisnis'||d.minat==='Ekonomi'||d.minat==='Sosial'||d.minat==='Hukum'))
            strengths.push(`Nilai IPS yang baik (${d.ips}) sangat menunjang minat Anda di rumpun sosial.`);
        if (d.bahasa_inggris >= 80 && (d.minat==='Sastra'||d.minat==='Pariwisata'||d.minat==='Komunikasi'))
            strengths.push(`Nilai Bahasa Inggris yang memuaskan (${d.bahasa_inggris}) akan mempermudah komunikasi global.`);

        if (d.kemampuan_analisis==='Tinggi' && (d.minat==='Sains'||d.tujuan_karier.toLowerCase().includes('peneliti')))
            strengths.push('Kemampuan Analisis yang Tinggi sangat mendukung penyelesaian riset dan penelitian.');
        if (d.kemampuan_kepemimpinan==='Tinggi' && (d.aktivitas_organisasi&&d.aktivitas_organisasi!=='Tidak Aktif'))
            strengths.push('Keterampilan Kepemimpinan Anda sangat baik untuk berkolaborasi dalam organisasi.');
        if (d.kemampuan_komputer==='Tinggi' && (d.minat==='Teknologi'||d.tujuan_karier.toLowerCase().includes('programmer')))
            strengths.push('Kemampuan Komputer Tinggi sangat membantu adaptasi di dunia teknologi modern.');
        if (d.kemampuan_kreativitas==='Tinggi' && (d.minat==='Seni'||d.minat==='Desain'))
            strengths.push('Potensi Kreativitas yang Tinggi menjadi modal utama dalam bidang desain kreatif.');
        if (d.kemampuan_komunikasi==='Tinggi' && (d.minat==='Pendidikan'||d.tujuan_karier.toLowerCase().includes('guru')))
            strengths.push('Keahlian Komunikasi Anda sangat baik untuk profesi pendidik.');

        const acadLevel = ACHIEVEMENT_LEVEL_SCORE[d.prestasi_akademik_tingkat] ?? 0;
        const nonAcLevel= ACHIEVEMENT_LEVEL_SCORE[d.prestasi_non_akademik_tingkat] ?? 0;
        if (acadLevel >= 15)  strengths.push(`Prestasi akademik tingkat ${d.prestasi_akademik_tingkat} membuktikan daya saing Anda.`);
        if (nonAcLevel >= 15) strengths.push(`Prestasi non-akademik tingkat ${d.prestasi_non_akademik_tingkat} menambah nilai tambah diri Anda.`);

        return strengths;
    }

    // ============================================================
    // V5.2: CONFIDENCE CALCULATOR — PSS as Primary Gate
    // ============================================================
    function calculateConfidence(iqs, pcs, pss, isHardBlocked) {
        if (isHardBlocked) return {
            score: 0, status: 'BLOCKED', statusLabel: 'Sangat Rendah',
            statusColor: '#ef4444', statusIcon: 'fa-ban',
            description: 'Rekomendasi terblokir karena terdapat pola data yang tidak wajar.',
            iqs, pcs, pss
        };

        // Formula dasar: 30% IQS + 35% PCS + 35% PSS
        let score = Math.round((iqs * 0.30) + (pcs * 0.35) + (pss * 0.35));

        // --- V5.2: Profile Strength Gate System ---
        // PSS menjadi faktor penentu utama. Profil lemah tidak boleh menghasilkan reliability tinggi.
        if      (pss >= 80)  { /* bebas */                            }
        else if (pss >= 60)  { score = Math.min(score, 80);          }
        else if (pss >= 50)  { score = Math.min(score, 70);          }
        else if (pss >= 40)  { score = Math.min(score, 60);          }
        else if (pss >= 30)  { score = Math.min(score, 45);          }
        else if (pss >= 20)  { score = Math.min(score, 35);          }
        else                 { score = Math.min(score, 25);           }

        // IQS / PCS secondary caps
        if (iqs < 60) score = Math.min(score, 55);
        if (pcs < 60) score = Math.min(score, 55);

        // Apply V5.4 Critical Skill Reliability Penalties
        const d = collectInputs();
        const conflicts = getCriticalSkillConflicts(d);
        let relPenaltyTotal = 0;
        conflicts.forEach(c => { relPenaltyTotal += c.relPenalty; });
        score -= relPenaltyTotal;

        score = Math.max(0, Math.min(100, score));

        let status, statusLabel, statusColor, statusIcon, description;
        if      (score >= 80) { status='EXCELLENT'; statusLabel='Sangat Dapat Dipercaya'; statusColor='#10b981'; statusIcon='fa-circle-check';          description='Tingkat keandalan sangat tinggi. Data konsisten dan profil sangat solid.'; }
        else if (score >= 60) { status='HIGH';      statusLabel='Cukup Dapat Dipercaya';  statusColor='#3b82f6'; statusIcon='fa-thumbs-up';             description='Tingkat keandalan cukup baik. Rekomendasi didasarkan pada profil yang memadai.'; }
        else if (score >= 40) { status='MEDIUM';    statusLabel='Perlu Ditinjau';          statusColor='#f59e0b'; statusIcon='fa-circle-info';           description='Tingkat keandalan sedang. Beberapa bagian data profil masih bisa ditingkatkan.'; }

        else                  { status='LOW';       statusLabel='Kurang Dapat Dipercaya';  statusColor='#ef4444'; statusIcon='fa-triangle-exclamation';  description='Tingkat keandalan rendah. Profil masih lemah dan banyak ketidaksesuaian ditemukan.'; }

        return { score, status, statusLabel, statusColor, statusIcon, description, iqs, pcs, pss };
    }

    // ============================================================
    // V5.4: UNIFIED DASHBOARD RENDERER
    // ============================================================
    function renderUnifiedDashboard(container, iqs, consistency, strength, confidence, softIssues) {
        if (!container) return;

        const c = confidence.statusColor;
        const d = iqs.inputData || {};
        const avg = (d.matematika + d.bahasa_inggris + d.ipa + d.ips) / 4 || 0;

        // ── Kekuatan Profil (max 3) ─────────────────────────────
        const strengths = detectStrengths(d).slice(0, 3);

        // ── Area Pengembangan — gabungan soft + consistency (max 3) ─
        const concerns  = [...(softIssues||[]).map(i=>i.message), ...(consistency.issues||[]).map(i=>i.message)].slice(0, 3);

        // ── V5.4: Faktor Peningkat Skor (max 3) ────────────────
        const boostFactors = [];

        const minat = d.minat;

        if (minat === 'Bisnis' || minat === 'Ekonomi') {
            if (d.ips >= 75) boostFactors.push(`Nilai IPS Anda yang baik (${d.ips}) sangat mendukung minat di bidang Bisnis/Ekonomi.`);
            if (d.kemampuan_komunikasi === 'Tinggi') boostFactors.push(`Kemampuan komunikasi yang tinggi mendukung interaksi dan negosiasi bisnis.`);
            if (d.kemampuan_kepemimpinan === 'Tinggi') boostFactors.push(`Kepemimpinan yang baik menjadi modal berharga untuk manajemen bisnis.`);
        } 
        else if (minat === 'Teknik' || minat === 'Engineering') {
            if (d.matematika >= 75) boostFactors.push(`Nilai Matematika Anda (${d.matematika}) mendukung rumpun teknik.`);
            if (d.ipa >= 75) boostFactors.push(`Nilai IPA yang baik (${d.ipa}) menunjang pemahaman dasar keteknikan.`);
            if (d.kemampuan_komputer === 'Tinggi') boostFactors.push(`Kemampuan komputer yang tinggi sangat relevan dengan kebutuhan studi teknik.`);
            if (d.kemampuan_analisis === 'Tinggi') boostFactors.push(`Kemampuan analisis yang kuat membantu pemecahan masalah keteknikan.`);
        }
        else if (minat === 'Sains') {
            if (d.ipa >= 75) boostFactors.push(`Nilai IPA yang tinggi (${d.ipa}) menjadi fondasi utama minat Sains Anda.`);
            if (d.kemampuan_analisis === 'Tinggi') boostFactors.push(`Kemampuan analisis yang kuat sangat menunjang metode ilmiah sains.`);
        }
        else if (minat === 'Komunikasi') {
            if (d.bahasa_inggris >= 75) boostFactors.push(`Nilai Bahasa Inggris (${d.bahasa_inggris}) mendukung minat komunikasi global Anda.`);
            if (d.kemampuan_komunikasi === 'Tinggi') boostFactors.push(`Kemampuan komunikasi yang tinggi sangat selaras dengan rumpun minat Anda.`);
        }
        else if (minat === 'Desain' || minat === 'Seni') {
            if (d.kemampuan_kreativitas === 'Tinggi') boostFactors.push(`Potensi kreativitas yang tinggi sangat menunjang minat Anda di bidang Desain/Seni.`);
        }
        else if (minat === 'Pendidikan') {
            if (d.kemampuan_komunikasi === 'Tinggi') boostFactors.push(`Kemampuan komunikasi yang baik mendukung penyampaian materi sebagai pendidik.`);
            if (d.kemampuan_kepemimpinan === 'Tinggi') boostFactors.push(`Kemampuan kepemimpinan membantu dalam pengelolaan kelas dan organisasi.`);
        }
        else if (minat === 'Olahraga') {
            const nonAcadBidangLower = (d.prestasi_non_akademik_bidang || '').toLowerCase();
            const hobiLower = (d.hobi || '').toLowerCase();
            const orgLower  = (d.aktivitas_organisasi || '').toLowerCase();
            const olahragaKeywords = ['sepak bola', 'basket', 'voli', 'renang', 'tenis', 'badminton', 'atletik', 'olahraga', 'taekwondo', 'futsal', 'pencak silat', 'karate'];
            const hasOlahragaPrestasi = nonAcadBidangLower && olahragaKeywords.some(k => nonAcadBidangLower.includes(k));
            const hasOlahragaHobiOrOrg = olahragaKeywords.some(k => hobiLower.includes(k) || orgLower.includes(k));
            
            if (hasOlahragaPrestasi) boostFactors.push(`Prestasi olahraga Anda mendukung minat di bidang olahraga.`);
            if (hasOlahragaHobiOrOrg) boostFactors.push(`Aktivitas hobi/organisasi Anda mencerminkan kecintaan pada olahraga.`);
        }

        // Fillers
        if (boostFactors.length < 3) {
            const avgScoreVal = (d.matematika + d.bahasa_inggris + d.ipa + d.ips) / 4;
            if (avgScoreVal >= 80) {
                boostFactors.push(`Rata-rata nilai akademik Anda cukup tinggi (${avgScoreVal.toFixed(1)}), menjadi modal dasar yang baik.`);
            }
        }
        if (boostFactors.length < 3) {
            const acadLvl = (ACHIEVEMENT_LEVEL_SCORE[d.prestasi_akademik_tingkat] || 0);
            if (acadLvl >= 15) {
                boostFactors.push(`Prestasi akademik tingkat ${d.prestasi_akademik_tingkat} memperkuat profil daya saing Anda.`);
            }
        }

        // ── V5.4: Faktor Penurun Skor (max 3) ──────────────────
        // Prioritaskan: 1. Critical Skill Conflict, 2. Minat vs Nilai, 3. Karier vs Kemampuan, 4. Prestasi vs Profil
        const dropFactors = [];

        // 1. Critical Skill Conflict
        const activeConflicts = getCriticalSkillConflicts(d);
        activeConflicts.forEach(c => {
            dropFactors.push(c.message);
        });

        // 2. Minat vs Nilai
        const allIssues = [...(softIssues || []), ...(consistency.issues || [])];
        const minatNilaiIds = ['C28', 'C29', 'C30', 'C31', 'C32', 'S5', 'S6', 'S8'];
        allIssues.forEach(iss => {
            if (minatNilaiIds.includes(iss.id || iss.rule)) {
                dropFactors.push(iss.message);
            }
        });

        // 3. Karier vs Kemampuan
        const careerSkillsIds = ['C5', 'C6', 'C7', 'C8', 'C42', 'C43', 'S10', 'S11', 'S12'];
        allIssues.forEach(iss => {
            const id = iss.id || iss.rule || '';
            if (careerSkillsIds.includes(id) || id.startsWith('CI')) {
                // Ensure no duplicate messages
                if (!dropFactors.includes(iss.message)) {
                    dropFactors.push(iss.message);
                }
            }
        });

        // 4. Prestasi vs Profil
        const prestProfilIds = ['C44', 'C45', 'C46', 'C47', 'S13', 'S14'];
        allIssues.forEach(iss => {
            if (prestProfilIds.includes(iss.id || iss.rule)) {
                if (!dropFactors.includes(iss.message)) {
                    dropFactors.push(iss.message);
                }
            }
        });

        // fallback generic issues
        allIssues.forEach(iss => {
            if (dropFactors.length < 3 && !dropFactors.includes(iss.message)) {
                dropFactors.push(iss.message);
            }
        });

        // Wajib muncul minimal 1 faktor penurun jika ada penalty
        if (dropFactors.length === 0 && allIssues.length > 0) {
            allIssues.sort((a, b) => (b.penalty || 0) - (a.penalty || 0));
            dropFactors.push(allIssues[0].message);
        }

        const boostHTML = boostFactors.slice(0, 3).map(f => `<div class="flex items-start gap-2 text-xs py-0.5"><i class="fas fa-check mt-0.5 flex-shrink-0" style="color:#10b981;"></i><span style="color:var(--text-secondary);">${f}</span></div>`).join('')
            || `<div class="text-xs italic" style="color:var(--text-muted);">Belum ada faktor penguat yang terdeteksi secara signifikan.</div>`;
        const dropHTML = dropFactors.slice(0, 3).map(f => `<div class="flex items-start gap-2 text-xs py-0.5"><i class="fas fa-triangle-exclamation mt-0.5 flex-shrink-0" style="color:#f59e0b;"></i><span style="color:var(--text-secondary);">${f}</span></div>`).join('')
            || `<div class="flex items-center gap-2 text-xs"><i class="fas fa-check text-green-500"></i><span style="color:var(--text-secondary);">Tidak ada faktor penurun yang signifikan terdeteksi.</span></div>`;


        const strengthsHTML = strengths.length > 0
            ? strengths.map(s=>`<div class="flex items-start gap-2 text-xs py-1"><i class="fas fa-check-circle mt-0.5 flex-shrink-0" style="color:#10b981;"></i><span style="color:var(--text-secondary);">${s}</span></div>`).join('')
            : `<div class="text-xs italic" style="color:var(--text-muted);">Tidak ada kekuatan spesifik yang terdeteksi dari data pengisian Anda.</div>`;

        const concernsHTML = concerns.length > 0
            ? concerns.map(c=>`<div class="flex items-start gap-2 text-xs py-1"><i class="fas fa-triangle-exclamation mt-0.5 flex-shrink-0 text-amber-500"></i><span style="color:var(--text-secondary);">${c}</span></div>`).join('')
            : `<div class="flex items-center gap-2 text-xs"><i class="fas fa-check text-green-500"></i><span style="color:var(--text-secondary);">Semua data Anda terlihat harmonis dan tidak membutuhkan area pengembangan mendesak.</span></div>`;

        // Smart Warning Banner (Bagian 4)
        let warningBannerHTML = '';
        if (confidence.score >= 80) {
            warningBannerHTML = `
                <div class="p-4 rounded-2xl border mb-6 flex items-start gap-3" style="background:#10b98108; border-color:#10b98130;">
                    <i class="fas fa-shield-check text-lg mt-0.5" style="color:#10b981;"></i>
                    <div>
                        <strong class="text-xs font-bold block" style="color:#10b981;">Rekomendasi Sangat Dapat Dipercaya</strong>
                        <span class="text-xs text-[var(--text-secondary)]">Data yang dimasukkan konsisten dan mendukung hasil rekomendasi.</span>
                    </div>
                </div>`;
        } else if (confidence.score >= 60) {
            warningBannerHTML = `
                <div class="p-4 rounded-2xl border mb-6 flex items-start gap-3" style="background:#3b82f608; border-color:#3b82f630;">
                    <i class="fas fa-circle-info text-lg mt-0.5" style="color:#3b82f6;"></i>
                    <div>
                        <strong class="text-xs font-bold block" style="color:#3b82f6;">Rekomendasi Cukup Dapat Dipercaya</strong>
                        <span class="text-xs text-[var(--text-secondary)]">Masih terdapat beberapa area yang dapat diperbaiki.</span>
                    </div>
                </div>`;
        } else if (confidence.score >= 40) {
            warningBannerHTML = `
                <div class="p-4 rounded-2xl border mb-6 flex items-start gap-3" style="background:#f59e0b08; border-color:#f59e0b30;">
                    <i class="fas fa-triangle-exclamation text-lg mt-0.5" style="color:#f59e0b;"></i>
                    <div>
                        <strong class="text-xs font-bold block" style="color:#f59e0b;">Rekomendasi Perlu Ditinjau</strong>
                        <span class="text-xs text-[var(--text-secondary)]">Beberapa bagian profil kurang konsisten sehingga akurasi dapat berkurang.</span>
                    </div>
                </div>`;
        } else {
            warningBannerHTML = `
                <div class="p-4 rounded-2xl border mb-6 flex items-start gap-3" style="background:#ef444408; border-color:#ef444430;">
                    <i class="fas fa-circle-xmark text-lg mt-0.5" style="color:#ef4444;"></i>
                    <div>
                        <strong class="text-xs font-bold block" style="color:#ef4444;">Rekomendasi Kurang Dapat Dipercaya</strong>
                        <span class="text-xs text-[var(--text-secondary)]">Sistem menemukan banyak ketidaksesuaian pada data yang dimasukkan. Sebaiknya periksa kembali data Anda.</span>
                    </div>
                </div>`;
        }

        // Horizontal mini cards for scores (Bagian 3)
        const miniCard = (title, val, statusText, color) => `
            <div class="p-3.5 rounded-2xl border text-center flex-1 flex flex-col justify-between" style="background:var(--bg-tertiary); border-color:var(--card-border);">
                <span class="text-[10px] uppercase font-bold tracking-wider" style="color:var(--text-muted);">${title}</span>
                <span class="text-xl font-extrabold font-mono mt-1" style="color:${color};">${val} <span class="text-xs font-normal" style="color:var(--text-muted);">/ 100</span></span>
                <span class="text-[9px] font-semibold mt-1 px-2 py-0.5 rounded-full inline-block mx-auto" style="background:${color}15; color:${color};">${statusText}</span>
            </div>`;

        // Safe representation for status circles
        const statusDotText = score => score >= 90 ? 'Hijau' : (score >= 75 ? 'Biru' : (score >= 60 ? 'Kuning' : (score >= 40 ? 'Oranye' : 'Merah')));

        container.innerHTML = `
            <div class="unified-dashboard-card rounded-3xl border overflow-hidden relative p-6 sm:p-8"
                 style="border-color:${c}25;
                        background: radial-gradient(ellipse at top right, ${c}07 0%, transparent 55%),
                                    radial-gradient(ellipse at bottom left, ${c}04 0%, transparent 60%),
                                    var(--bg-secondary);">

                <!-- Glow accents -->
                <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                     style="background:radial-gradient(circle,${c}12 0%,transparent 70%); filter:blur(50px);"></div>

                <!-- Header (Bagian 2) -->
                <div class="flex items-start justify-between mb-6 relative z-10">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-lg"
                             style="background:linear-gradient(135deg,${c}cc,${c});">
                            <i class="fas ${confidence.statusIcon}"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold uppercase tracking-widest" style="color:var(--text-primary);">Analisis Profil Siswa</h4>
                            <p class="text-[11px] mt-0.5" style="color:var(--text-muted);">Sistem mengevaluasi kualitas data, konsistensi profil, dan kekuatan akademik.</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ml-2"
                          style="background:${c}15; color:${c}; border:1px solid ${c}30;">Status: ${confidence.statusLabel}</span>
                </div>

                <!-- SMART BANNER -->
                ${warningBannerHTML}

                <!-- MAIN SCORE (Reliability) -->
                <div class="flex flex-col sm:flex-row items-center gap-6 mb-6 relative z-10">
                    <!-- Circular Score Badge -->
                    <div class="flex-shrink-0 relative">
                        <div class="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-xl"
                             style="border-color:${c}; background:radial-gradient(circle at center, ${c}10 0%, transparent 70%);">
                            <span class="text-4xl font-black leading-none font-mono" style="color:${c};">${confidence.score}%</span>
                            <span class="text-[9px] font-bold uppercase tracking-widest mt-1" style="color:var(--text-muted);">Keandalan</span>
                        </div>
                    </div>

                    <!-- Right: Description -->
                    <div class="flex-1 w-full">
                        <p class="text-xs leading-relaxed" style="color:var(--text-secondary);">${confidence.description}</p>
                        
                        <!-- Horizontal Mini Cards (Bagian 3) -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                            ${miniCard('Kualitas Data', iqs.score, iqs.statusLabel, iqs.statusColor)}
                            ${miniCard('Konsistensi Profil', consistency.score, consistency.statusLabel, consistency.statusColor)}
                            ${miniCard('Kekuatan Profil', strength.totalScore, strength.statusLabel, strength.statusColor)}
                        </div>
                    </div>
                </div>

                <!-- Toggle Detail Button -->
                <div class="relative z-10">
                    <button type="button" id="unified-detail-toggle"
                            class="w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2"
                            style="border-color:${c}30; color:${c}; background:${c}08;"
                            onclick="
                                const p = document.getElementById('unified-detail-panel');
                                p.classList.toggle('hidden');
                                this.querySelector('i').classList.toggle('fa-rotate-180');
                                this.querySelector('.toggle-label').textContent = p.classList.contains('hidden') ? 'Lihat Analisis Detail' : 'Sembunyikan Detail';
                            ">
                        <i class="fas fa-chart-line text-[10px]"></i>
                        <span class="toggle-label">Lihat Analisis Detail</span>
                        <i class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                    </button>

                    <!-- Detail Panel (Responsive Grid 1, 2, 3 cols) -->
                    <div id="unified-detail-panel" class="hidden mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <!-- Kekuatan Profil -->
                        <div class="p-4 rounded-2xl border" style="background:#10b98108; border-color:#10b98125;">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]" style="background:#10b981;">
                                    <i class="fas fa-star"></i>
                                </div>
                                <span class="text-xs font-bold uppercase tracking-wider" style="color:#10b981;">Kekuatan Utama</span>
                            </div>
                            <div class="space-y-0.5">${strengthsHTML}</div>
                        </div>

                        <!-- Area Pengembangan -->
                        <div class="p-4 rounded-2xl border" style="background:#f59e0b08; border-color:#f59e0b25;">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]" style="background:#f59e0b;">
                                    <i class="fas fa-triangle-exclamation"></i>
                                </div>
                                <span class="text-xs font-bold uppercase tracking-wider" style="color:#f59e0b;">Area Pengembangan</span>
                            </div>
                            <div class="space-y-0.5">${concernsHTML}</div>
                        </div>

                        <!-- V5.2: Faktor yang Meningkatkan Skor -->
                        <div class="p-4 rounded-2xl border" style="background:#10b98105; border-color:#10b98120;">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]" style="background:#10b981;">
                                    <i class="fas fa-arrow-trend-up"></i>
                                </div>
                                <span class="text-xs font-bold uppercase tracking-wider" style="color:#10b981;">Faktor yang Meningkatkan Skor</span>
                            </div>
                            <div class="space-y-0.5">${boostHTML}</div>
                        </div>

                        <!-- V5.2: Faktor yang Menurunkan Skor -->
                        <div class="p-4 rounded-2xl border" style="background:#f5900508; border-color:#f5900520;">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]" style="background:#f59e0b;">
                                    <i class="fas fa-arrow-trend-down"></i>
                                </div>
                                <span class="text-xs font-bold uppercase tracking-wider" style="color:#f59e0b;">Faktor yang Menurunkan Skor</span>
                            </div>
                            <div class="space-y-0.5">${dropHTML}</div>
                        </div>

                        <!-- Penjelasan Sistem & Collapsible Formula -->

                        <div class="p-4 rounded-2xl border flex flex-col justify-between" style="background:var(--bg-tertiary); border-color:var(--card-border);">
                            <div>
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]" style="background:#6366f1;">
                                        <i class="fas fa-circle-info"></i>
                                    </div>
                                    <span class="text-xs font-bold uppercase tracking-wider" style="color:#6366f1;">Penjelasan Sistem</span>
                                </div>
                                <p class="text-xs leading-relaxed" style="color:var(--text-secondary);">
                                    Tingkat keandalan dihitung secara cerdas berdasarkan kualitas input, konsistensi data minat-kemampuan Anda, serta kekuatan prestasi akademik.
                                </p>
                            </div>
                            
                            <!-- Collapsible Formula Breakdown (Bagian 3) -->
                            <div class="mt-4 border-t border-dashed border-[var(--card-border)] pt-3">
                                <button type="button" class="w-full text-left text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-between"
                                        onclick="document.getElementById('formula-breakdown-panel').classList.toggle('hidden');">
                                    <span>[Lihat Detail Perhitungan]</span>
                                    <i class="fas fa-calculator"></i>
                                </button>
                                <div id="formula-breakdown-panel" class="hidden mt-2 text-[10px] space-y-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-[var(--text-muted)]">
                                    <div class="flex justify-between"><span>Input Quality (30%):</span> <span class="font-mono font-bold">${iqs.score}</span></div>
                                    <div class="flex justify-between"><span>Consistency (35%):</span> <span class="font-mono font-bold">${consistency.score}</span></div>
                                    <div class="flex justify-between"><span>Strength (35%):</span> <span class="font-mono font-bold">${strength.totalScore}</span></div>
                                    <div class="border-t border-[var(--card-border)] pt-1 mt-1 flex justify-between font-bold text-[var(--text-primary)]">
                                        <span>Formula:</span> <span>(IQSx0.30) + (PCSx0.35) + (PSSx0.35)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        container.classList.remove('hidden');

        // Card entrance animation
        requestAnimationFrame(() => {
            const card = container.querySelector('.unified-dashboard-card');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(16px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 80);
            }
        });
    }

    // ============================================================
    // Public API (V5.1)
    // ============================================================
    return {
        validate,
        collectInputs,
        calculateStrengthScore,
        calculateConsistencyScore,
        calculateConfidence,
        detectStrengths,
        renderUnifiedDashboard,
        // Legacy (kept for backward compat)
        renderValidationCard: () => {},
        renderStrengthCard: () => {},
        renderConsistencyCard: () => {},
        renderConfidenceCard: () => {},
    };
})();
