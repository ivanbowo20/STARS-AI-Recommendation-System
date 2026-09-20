// ============================================================
// STARS V4.5 — Campus Recommendation Engine
// Reads kampus_indonesia.csv and ranks universities by
// Campus Match Score (100 pts) based on:
//   A. Major Match (40)   B. Location (20)
//   C. Accreditation (15) D. Excellence Match (15)
//   E. Strength Compat (10)
// ============================================================

const STARSCampus = (function () {
    'use strict';

    // ---- Campus dataset (loaded from PHP-rendered JSON) ----
    let campusData = [];

    // Related major pairs (+25 instead of +40)
    const RELATED_MAJORS = {
        'Teknik Informatika':       ['Sistem Informasi', 'Teknik Elektro'],
        'Sistem Informasi':         ['Teknik Informatika', 'Manajemen Bisnis', 'Administrasi Bisnis'],
        'Teknik Elektro':           ['Teknik Informatika', 'Teknik Mesin', 'Teknik Industri'],
        'Teknik Mesin':             ['Teknik Industri', 'Teknik Elektro', 'Teknik Sipil'],
        'Teknik Industri':          ['Teknik Mesin', 'Manajemen Bisnis', 'Administrasi Bisnis'],
        'Teknik Sipil':             ['Arsitektur', 'Teknik Mesin', 'Teknik Lingkungan'],
        'Teknik Lingkungan':        ['Teknik Sipil', 'Farmasi'],
        'Arsitektur':               ['Teknik Sipil', 'Desain Komunikasi Visual'],
        'Akuntansi':                ['Manajemen', 'Administrasi Bisnis', 'Manajemen Bisnis'],
        'Manajemen':                ['Akuntansi', 'Administrasi Bisnis', 'Manajemen Bisnis', 'Ilmu Komunikasi'],
        'Manajemen Bisnis':         ['Manajemen', 'Akuntansi', 'Administrasi Bisnis', 'Sistem Informasi'],
        'Administrasi Bisnis':      ['Manajemen', 'Akuntansi', 'Manajemen Bisnis'],
        'Hukum':                    ['Ilmu Komunikasi', 'Psikologi'],
        'Psikologi':                ['Kedokteran', 'Pendidikan', 'Ilmu Komunikasi'],
        'Kedokteran':               ['Farmasi', 'Psikologi'],
        'Farmasi':                  ['Kedokteran', 'Teknik Lingkungan'],
        'Ilmu Komunikasi':          ['Desain Komunikasi Visual', 'Manajemen', 'Hukum'],
        'Desain Komunikasi Visual': ['Ilmu Komunikasi', 'Arsitektur'],
        'Pendidikan':               ['Psikologi', 'Ilmu Komunikasi', 'Ilmu Keolahragaan'],
        'Ilmu Keolahragaan':        ['Pendidikan', 'Psikologi'],
    };

    // Accreditation scores
    const AKREDITASI_SCORE = {
        'Unggul': 15, 'Baik Sekali': 10, 'Baik': 5
    };

    // ---- A. Major Match Score (0, 25, or 40) ----
    function scoreMajorMatch(campusJurusan, predictedMajor) {
        if (!campusJurusan || !predictedMajor) return 0;
        if (campusJurusan.toLowerCase() === predictedMajor.toLowerCase()) return 40;
        const related = RELATED_MAJORS[predictedMajor] || [];
        if (related.map(r => r.toLowerCase()).includes(campusJurusan.toLowerCase())) return 25;
        return 0;
    }

    // ---- B. Location Match Score (5, 10, 15, or 20) ----
    function scoreLocation(campusProvince, campusCity, studentProvince, studentCity) {
        if (!studentProvince) return 5;
        const sp = studentProvince.trim();
        const sc = (studentCity || '').trim();
        const cp = (campusProvince || '').trim();
        const cc = (campusCity || '').trim();

        if (cp === sp && cc === sc) return 20;
        if (cp === sp) return 15;

        const studentIsland = getIslandForProvince(sp);
        const campusIsland  = getIslandForProvince(cp);
        if (studentIsland && campusIsland && studentIsland === campusIsland) return 10;
        return 5;
    }

    // ---- C. Accreditation Score (0–15) ----
    function scoreAccreditation(akreditasi) {
        return AKREDITASI_SCORE[akreditasi] || 0;
    }

    // ---- D. Excellence Match Score (0–15) ----
    function scoreExcellence(keunggulan, studentData) {
        if (!keunggulan) return 0;
        const keywords = keunggulan.toLowerCase();

        // Build student keyword pool
        const pool = [
            studentData.minat         || '',
            studentData.hobi          || '',
            studentData.hobi_tambahan || '',
            studentData.mata_pelajaran_favorit || '',
            studentData.tujuan_karier || '',
            studentData.minat_spesifik || '',
        ].join(' ').toLowerCase();

        // Tokenize student pool (2+ char words)
        const studentWords = pool.split(/[\s,/&]+/).filter(w => w.length > 2);

        let hits = 0;
        studentWords.forEach(word => {
            if (keywords.includes(word)) hits++;
        });

        if (hits >= 3) return 15;
        if (hits === 2) return 10;
        if (hits === 1) return 7;
        return 0;
    }

    // ---- E. Profile Strength Compatibility (0–10) ----
    function scoreStrengthCompat(strengthScore) {
        if (!strengthScore && strengthScore !== 0) return 5; // neutral if no V3 data
        if (strengthScore >= 85) return 10;
        if (strengthScore >= 70) return 8;
        if (strengthScore >= 55) return 6;
        if (strengthScore >= 40) return 4;
        return 2;
    }

    // ---- Compute reasons list ----
    function buildReasons(campus, scores, studentData) {
        const reasons = [];
        if (scores.majorScore === 40) reasons.push(`✓ Jurusan ${campus.Jurusan} tersedia`);
        else if (scores.majorScore === 25) reasons.push(`✓ Jurusan terkait ${campus.Jurusan} tersedia`);
        if (scores.locationScore >= 20) reasons.push('✓ Lokasi sangat dekat (kota sama)');
        else if (scores.locationScore >= 15) reasons.push('✓ Lokasi dekat (provinsi sama)');
        else if (scores.locationScore >= 10) reasons.push('✓ Dalam satu pulau');
        if (scores.accrScore >= 15) reasons.push('✓ Akreditasi Unggul');
        else if (scores.accrScore >= 10) reasons.push('✓ Akreditasi Baik Sekali');
        if (scores.excellenceScore >= 10) reasons.push('✓ Keunggulan sesuai minat & karier');
        if (scores.strengthScore >= 8) reasons.push('✓ Cocok dengan kekuatan profil');
        return reasons;
    }

    // ---- Main ranking function ----
    function rankCampuses(predictedMajor, studentData, strengthScore) {
        if (!campusData.length) return [];

        const results = campusData.map(campus => {
            const majorScore     = scoreMajorMatch(campus.Jurusan, predictedMajor);
            const locationScore  = scoreLocation(campus.Provinsi, campus.Kota_Kabupaten,
                                                 studentData.provinsi, studentData.kota);
            const accrScore      = scoreAccreditation(campus.Akreditasi);
            const excellenceScore= scoreExcellence(campus.Keunggulan, studentData);
            const strengthScore2 = scoreStrengthCompat(strengthScore);
            const totalScore     = majorScore + locationScore + accrScore + excellenceScore + strengthScore2;

            const scores = { majorScore, locationScore, accrScore, excellenceScore, strengthScore: strengthScore2 };

            return {
                ...campus,
                totalScore,
                scores,
                reasons: buildReasons(campus, scores, studentData),
            };
        });

        // Filter to only those with major match (>0) for relevance
        const matched = results.filter(r => r.scores.majorScore > 0);
        const sorted  = matched.sort((a, b) => b.totalScore - a.totalScore);

        // Deduplicate: one entry per unique campus+major (already unique in dataset)
        return sorted;
    }

    // ---- Render Top 3 premium cards ----
    function renderTop3Cards(top10, container) {
        if (!container) return;
        if (!top10.length) {
            container.innerHTML = `<p class="text-sm text-center py-8" style="color:var(--text-muted);">Tidak ada rekomendasi kampus tersedia untuk jurusan ini.</p>`;
            return;
        }

        const MEDALS = ['🥇', '🥈', '🥉'];
        const MEDAL_COLORS = ['#f59e0b', '#94a3b8', '#cd7c3f'];
        const MEDAL_GLOWS  = ['rgba(245,158,11,0.15)', 'rgba(148,163,184,0.12)', 'rgba(205,124,63,0.12)'];
        const MEDAL_LABELS = ['#1', '#2', '#3'];

        const top3 = top10.slice(0, 3);

        const cards = top3.map((c, i) => {
            const kelebihan = (c.Keunggulan || '').split(',').slice(0, 3).map(k => k.trim()).filter(Boolean);
            const keunggulanTags = kelebihan.map(k => `<span class="campus-tag">${k}</span>`).join('');
            const reasonsHtml = c.reasons.slice(0, 5).map(r => `<li>${r}</li>`).join('');
            const scoreBreakdownId = `breakdown-${i}`;
            const jenisBadge = c.Jenis_Kampus === 'PTN'
                ? `<span class="campus-ptn-badge">PTN</span>`
                : `<span class="campus-pts-badge">PTS</span>`;

            return `
            <div class="campus-card campus-card-rank-${i+1}" style="--medal-color:${MEDAL_COLORS[i]}; --medal-glow:${MEDAL_GLOWS[i]};">
                <!-- Rank Badge -->
                <div class="campus-rank-badge">${MEDALS[i]} Rank ${MEDAL_LABELS[i]}</div>

                <!-- Header -->
                <div class="campus-card-header">
                    <div class="campus-score-circle">
                        <span class="campus-score-num">${c.totalScore}</span>
                        <span class="campus-score-max">/100</span>
                    </div>
                    <div class="campus-info">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="campus-name">${c.Nama_Kampus}</h3>
                            ${jenisBadge}
                        </div>
                        <p class="campus-location"><i class="fas fa-map-marker-alt mr-1"></i>${c.Kota_Kabupaten}, ${c.Provinsi}</p>
                        <div class="campus-meta-row">
                            <span class="campus-akreditasi campus-akr-${(c.Akreditasi||'').toLowerCase().replace(' ','-')}">
                                <i class="fas fa-award mr-1"></i>${c.Akreditasi || 'N/A'}
                            </span>
                            <span class="campus-jurusan-badge">
                                <i class="fas fa-graduation-cap mr-1"></i>${c.Jurusan}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Score Bar -->
                <div class="campus-score-bar-wrap">
                    <div class="campus-score-bar-bg">
                        <div class="campus-score-bar-fill" style="width:0%" data-target="${c.totalScore}"></div>
                    </div>
                    <span class="campus-score-label">Campus Match Score</span>
                </div>

                <!-- Keunggulan Tags -->
                <div class="campus-keunggulan">${keunggulanTags}</div>

                <!-- Reasons -->
                ${c.reasons.length ? `<ul class="campus-reasons">${reasonsHtml}</ul>` : ''}

                <!-- Toggle Analysis -->
                <button type="button" class="campus-analysis-toggle" onclick="document.getElementById('${scoreBreakdownId}').classList.toggle('hidden'); this.querySelector('i').classList.toggle('fa-rotate-180');">
                    <span>Lihat Match Analysis</span>
                    <i class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                </button>
                <div id="${scoreBreakdownId}" class="hidden campus-breakdown">
                    <div class="campus-breakdown-grid">
                        <div class="campus-bitem">
                            <span>Major Match</span>
                            <strong style="color:#10b981;">${c.scores.majorScore}/40</strong>
                        </div>
                        <div class="campus-bitem">
                            <span>Lokasi</span>
                            <strong style="color:#3b82f6;">${c.scores.locationScore}/20</strong>
                        </div>
                        <div class="campus-bitem">
                            <span>Akreditasi</span>
                            <strong style="color:#a855f7;">${c.scores.accrScore}/15</strong>
                        </div>
                        <div class="campus-bitem">
                            <span>Keunggulan</span>
                            <strong style="color:#f59e0b;">${c.scores.excellenceScore}/15</strong>
                        </div>
                        <div class="campus-bitem">
                            <span>Profil Compat.</span>
                            <strong style="color:#f97316;">${c.scores.strengthScore}/10</strong>
                        </div>
                        <div class="campus-bitem" style="border-top:1px solid var(--card-border); padding-top:8px;">
                            <span><strong>Total</strong></span>
                            <strong style="color:var(--text-primary);">${c.totalScore}/100</strong>
                        </div>
                    </div>
                </div>

                <!-- Website Link -->
                ${c.Website ? `<a href="${c.Website}" target="_blank" rel="noopener" class="campus-website-link"><i class="fas fa-external-link-alt mr-1"></i>Kunjungi Website</a>` : ''}
            </div>`;
        }).join('');

        container.innerHTML = `<div class="campus-top3-grid">${cards}</div>`;

        // Animate score bars after render
        requestAnimationFrame(() => {
            setTimeout(() => {
                container.querySelectorAll('.campus-score-bar-fill').forEach(bar => {
                    bar.style.width = (bar.dataset.target || 0) + '%';
                });
            }, 300);
        });
    }

    // ---- Render Top 10 sortable table ----
    function renderTop10Table(top10, container) {
        if (!container || !top10.length) return;

        let sortCol = 'totalScore';
        let sortAsc = false;

        function buildTable(data) {
            const rows = data.map((c, i) => `
                <tr class="campus-table-row">
                    <td class="campus-td text-center font-bold" style="color:var(--text-muted);">${i + 1}</td>
                    <td class="campus-td">
                        <div class="font-semibold" style="color:var(--text-primary);">${c.Nama_Kampus}</div>
                        <div class="text-xs" style="color:var(--text-muted);">${c.Jenis_Kampus}</div>
                    </td>
                    <td class="campus-td text-center">
                        <span class="campus-score-pill">${c.totalScore}</span>
                    </td>
                    <td class="campus-td text-center">
                        <span class="campus-akr-small campus-akr-${(c.Akreditasi||'').toLowerCase().replace(' ','-')}">${c.Akreditasi || 'N/A'}</span>
                    </td>
                    <td class="campus-td hidden sm:table-cell" style="color:var(--text-secondary);">${c.Provinsi}</td>
                    <td class="campus-td" style="color:var(--text-secondary);">${c.Jurusan}</td>
                </tr>`).join('');

            container.innerHTML = `
                <div class="overflow-x-auto rounded-2xl border" style="border-color:var(--card-border);">
                    <table class="w-full campus-table">
                        <thead>
                            <tr class="campus-thead-row">
                                <th class="campus-th w-10">#</th>
                                <th class="campus-th cursor-pointer" onclick="STARSCampus.sortTable('name')">Universitas <i class="fas fa-sort text-[10px] ml-1"></i></th>
                                <th class="campus-th cursor-pointer text-center" onclick="STARSCampus.sortTable('score')">Score <i class="fas fa-sort text-[10px] ml-1"></i></th>
                                <th class="campus-th text-center">Akreditasi</th>
                                <th class="campus-th hidden sm:table-cell">Provinsi</th>
                                <th class="campus-th">Jurusan</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>`;
        }

        buildTable(top10);

        // Expose sort function
        STARSCampus._top10 = top10.slice();
        STARSCampus._sortState = { col: 'totalScore', asc: false };

        STARSCampus.sortTable = function(col) {
            const state = STARSCampus._sortState;
            if (state.col === col) state.asc = !state.asc;
            else { state.col = col; state.asc = false; }

            const sorted = STARSCampus._top10.slice().sort((a, b) => {
                let va, vb;
                if (col === 'name') { va = a.Nama_Kampus; vb = b.Nama_Kampus; }
                else { va = a.totalScore; vb = b.totalScore; }
                if (va < vb) return state.asc ? -1 : 1;
                if (va > vb) return state.asc ? 1 : -1;
                return 0;
            });
            buildTable(sorted);
        };
    }

    // ---- Full Render Pipeline ----
    function renderCampusSection(predictedMajor, studentData, strengthScore, sectionContainer) {
        if (!sectionContainer) return;

        sectionContainer.classList.remove('hidden');

        // Header
        const headerEl = sectionContainer.querySelector('#campus-section-header');
        if (headerEl) {
            headerEl.innerHTML = `
                <div class="campus-section-title">
                    <div class="campus-section-icon"><i class="fas fa-university"></i></div>
                    <div>
                        <h3>Rekomendasi Kampus Terbaik</h3>
                        <p>Berdasarkan jurusan <strong>${predictedMajor}</strong>, lokasi, dan profil kamu</p>
                    </div>
                </div>`;
        }

        const top10 = rankCampuses(predictedMajor, studentData, strengthScore).slice(0, 10);
        const top3Container  = sectionContainer.querySelector('#campus-top3');
        const tableContainer = sectionContainer.querySelector('#campus-table');

        renderTop3Cards(top10, top3Container);

        // Toggle for table
        const tableToggle = sectionContainer.querySelector('#campus-table-toggle');
        if (tableToggle && tableContainer) {
            tableToggle.addEventListener('click', () => {
                const hidden = tableContainer.classList.toggle('hidden');
                tableToggle.querySelector('span').textContent = hidden ? 'Lihat 10 Kampus Terbaik' : 'Sembunyikan Tabel';
                tableToggle.querySelector('i').classList.toggle('fa-rotate-180');
                if (!hidden && !tableContainer.innerHTML.trim()) {
                    renderTop10Table(top10, tableContainer);
                }
            });
        }
    }

    // ---- Init: load campus CSV via fetch ----
    function init(csvPath) {
        if (campusData.length) return Promise.resolve(campusData);
        return fetch(csvPath)
            .then(r => r.text())
            .then(text => {
                const lines = text.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                campusData = lines.slice(1).map(line => {
                    // Handle commas inside keunggulan column
                    const cols = line.split(',');
                    const obj = {};
                    headers.forEach((h, idx) => {
                        obj[h] = (cols[idx] || '').trim();
                    });
                    // Merge keunggulan columns (col 6 onwards until Website)
                    if (cols.length > headers.length) {
                        const extra = cols.slice(6, cols.length - 1).join(', ');
                        obj['Keunggulan'] = extra.trim();
                        obj['Website']   = cols[cols.length - 1].trim();
                    }
                    return obj;
                });
                return campusData;
            })
            .catch(err => {
                console.warn('STARS Campus: failed to load CSV', err);
                return [];
            });
    }

    return { init, renderCampusSection, sortTable: () => {} };
})();
