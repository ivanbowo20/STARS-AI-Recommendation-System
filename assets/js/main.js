// STARS Application Main Javascript

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. INPUT RANGE SLIDER AND NUMBER SYNC
    // ==========================================
    const academicScores = ['matematika', 'bahasa_inggris', 'ipa', 'ips'];
    
    academicScores.forEach(scoreId => {
        const slider = document.getElementById(scoreId + '_slider');
        const numberInput = document.getElementById(scoreId);
        
        if (slider && numberInput) {
            // Sync slider changes to number input
            slider.addEventListener('input', function() {
                numberInput.value = this.value;
            });
            
            // Sync number input changes to slider
            numberInput.addEventListener('input', function() {
                let val = parseInt(this.value);
                if (isNaN(val)) val = 0;
                if (val < 0) val = 0;
                if (val > 100) val = 100;
                this.value = val;
                slider.value = val;
            });
        }
    });

    // ==========================================
    // 2. SEARCHABLE DROPDOWN FOR HOBI
    // ==========================================
    const hobiDropdownBtn = document.getElementById('hobi-dropdown-btn');
    const hobiDropdownList = document.getElementById('hobi-dropdown-list');
    const hobiSearchInput = document.getElementById('hobi-search-input');
    const hobiHiddenInput = document.getElementById('hobi-hidden');
    const hobiOptions = document.querySelectorAll('.hobi-option');

    if (hobiDropdownBtn && hobiDropdownList) {
        // Toggle dropdown list visibility
        hobiDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hobiDropdownList.classList.toggle('hidden');
            if (!hobiDropdownList.classList.contains('hidden')) {
                hobiSearchInput.focus();
            }
        });

        // Search logic
        hobiSearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            hobiOptions.forEach(opt => {
                const text = opt.getAttribute('data-value').toLowerCase();
                if (text.includes(query)) {
                    opt.classList.remove('hidden');
                } else {
                    opt.classList.add('hidden');
                }
            });
        });

        // Select option logic
        hobiOptions.forEach(opt => {
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                const selectedVal = this.getAttribute('data-value');
                hobiHiddenInput.value = selectedVal;
                
                // Update button text
                hobiDropdownBtn.querySelector('span').textContent = selectedVal;
                hobiDropdownBtn.querySelector('span').classList.remove('text-zinc-500');
                hobiDropdownBtn.querySelector('span').classList.add('text-white');
                
                // Close dropdown
                hobiDropdownList.classList.add('hidden');
            });
        });

        // Close on click outside
        document.addEventListener('click', function() {
            hobiDropdownList.classList.add('hidden');
        });
        
        hobiDropdownList.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing when clicking inside the dropdown list
        });
    }

    // ==========================================
    // 3. SHOW/HIDE PRESTASI BIDANG BASED ON TINGKAT
    // ==========================================
    const paTingkat = document.getElementById('prestasi_akademik_tingkat');
    const paBidangContainer = document.getElementById('prestasi_akademik_bidang_container');
    if (paTingkat && paBidangContainer) {
        paTingkat.addEventListener('change', function() {
            if (this.value === 'Tidak Ada') {
                paBidangContainer.classList.add('hidden');
            } else {
                paBidangContainer.classList.remove('hidden');
            }
        });
    }

    const pnaTingkat = document.getElementById('prestasi_non_akademik_tingkat');
    const pnaBidangContainer = document.getElementById('prestasi_non_akademik_bidang_container');
    if (pnaTingkat && pnaBidangContainer) {
        pnaTingkat.addEventListener('change', function() {
            if (this.value === 'Tidak Ada') {
                pnaBidangContainer.classList.add('hidden');
            } else {
                pnaBidangContainer.classList.remove('hidden');
            }
        });
    }

    // ==========================================
    // 4. MULTI-STEP WIZARD NAVIGATION
    // ==========================================
    let currentStep = 1;
    const totalSteps = 7;
    
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const stepIndicator = document.getElementById('step-indicator');
    const progressFill = document.getElementById('form-progress');
    const formSteps = document.querySelectorAll('.form-step');

    function updateStepIndicator() {
        if (stepIndicator) {
            stepIndicator.textContent = `Langkah ${currentStep} dari ${totalSteps}`;
        }
        if (progressFill) {
            const pct = (currentStep / totalSteps) * 100;
            progressFill.style.width = `${pct}%`;
        }
        
        // Update Step Circles styling dynamically
        const stepCircles = document.querySelectorAll('.step-circle');
        stepCircles.forEach(circle => {
            const stepVal = parseInt(circle.getAttribute('data-step'));
            const circleNumSpan = circle.querySelector('.step-num');
            
            // Reset state
            circle.className = 'step-circle border-2 transition-all duration-300';
            
            if (stepVal === currentStep) {
                circle.classList.add('step-active');
                if (circleNumSpan) circleNumSpan.innerHTML = stepVal;
            } else if (stepVal < currentStep) {
                circle.classList.add('step-completed');
                if (circleNumSpan) circleNumSpan.innerHTML = '<i class="fas fa-check text-xs"></i>';
            } else {
                circle.classList.add('border-zinc-200', 'dark:border-zinc-800', 'bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]');
                if (circleNumSpan) circleNumSpan.innerHTML = stepVal;
            }
        });

        // Update active connecting line width
        const activeLine = document.getElementById('active-line');
        if (activeLine) {
            const activePct = ((currentStep - 1) / (totalSteps - 1)) * 100;
            activeLine.style.width = `${activePct}%`;
        }
        
        // Show/hide previous button
        if (prevBtn) {
            if (currentStep === 1) {
                prevBtn.classList.add('hidden');
            } else {
                prevBtn.classList.remove('hidden');
            }
        }

        // Change Next button text on Step 6 and Step 7
        if (nextBtn) {
            if (currentStep === 6) {
                nextBtn.innerHTML = `Lanjut Ke Analisis <i class="fas fa-arrow-right ml-2"></i>`;
                nextBtn.classList.remove('hidden');
            } else if (currentStep === 7) {
                nextBtn.classList.add('hidden'); // submit button will handle action in step 7
            } else {
                nextBtn.innerHTML = `Berikutnya <i class="fas fa-arrow-right ml-2"></i>`;
                nextBtn.classList.remove('hidden');
            }
        }
    }

    function showStep(stepNum) {
        formSteps.forEach(step => {
            step.classList.add('hidden');
            step.classList.remove('active-step');
        });
        
        const activeStep = document.getElementById(`step-${stepNum}`);
        if (activeStep) {
            activeStep.classList.remove('hidden');
            activeStep.classList.add('active-step');
        }
        
        currentStep = stepNum;
        updateStepIndicator();
        
        // Smooth scroll to the top of the form section
        const prediksiSection = document.getElementById('prediksi');
        if (prediksiSection) {
            prediksiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function validateStep(stepNum) {
        const activeStepEl = document.getElementById(`step-${stepNum}`);
        if (!activeStepEl) return true;

        const inputs = activeStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            input.classList.remove('border-red-500');
            if (!input.checkValidity()) {
                input.classList.add('border-red-500');
                isValid = false;
            }
        });

        // Special check for hobi in step 2
        if (stepNum === 2) {
            if (!hobiHiddenInput.value) {
                hobiDropdownBtn.classList.add('border-red-500');
                isValid = false;
            } else {
                hobiDropdownBtn.classList.remove('border-red-500');
            }
        }
        return isValid;
    }

    function populateReview() {
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent) return;

        const nama = document.getElementById('nama').value;
        const mtk = document.getElementById('matematika').value;
        const bing = document.getElementById('bahasa_inggris').value;
        const ipa = document.getElementById('ipa').value;
        const ips = document.getElementById('ips').value;
        const mapel = document.getElementById('mata_pelajaran_favorit').value;
        const gaya = document.getElementById('gaya_belajar').value;
        const minat = document.getElementById('minat').value;
        const hobi = document.getElementById('hobi-hidden').value;
        const minatSpesifik = document.getElementById('minat_spesifik').value || '-';
        const hobiTambahan = document.getElementById('hobi_tambahan').value || '-';
        
        const komputer = document.getElementById('kemampuan_komputer').value;
        const komunikasi = document.getElementById('kemampuan_komunikasi').value;
        const kepemimpinan = document.getElementById('kemampuan_kepemimpinan').value;
        const analisis = document.getElementById('kemampuan_analisis').value;
        const kreativitas = document.getElementById('kemampuan_kreativitas').value;
        const problemSolving = document.getElementById('kemampuan_problem_solving').value;

        const organisasi = document.getElementById('aktivitas_organisasi').value;
        const karier = document.getElementById('tujuan_karier').value;

        const paTingkatValue = document.getElementById('prestasi_akademik_tingkat').value;
        const paBidangValue = document.getElementById('prestasi_akademik_bidang').value;
        const paCombined = paTingkatValue === 'Tidak Ada' ? 'Tidak Ada' : `${paTingkatValue} - ${paBidangValue}`;

        const pnaTingkatValue = document.getElementById('prestasi_non_akademik_tingkat').value;
        const pnaBidangValue = document.getElementById('prestasi_non_akademik_bidang').value;
        const pnaCombined = pnaTingkatValue === 'Tidak Ada' ? 'Tidak Ada' : `${pnaBidangValue} - ${pnaTingkatValue}`;

        const provinsi = document.getElementById('provinsi').value || '-';
        const kota = document.getElementById('kota').value || '-';

        reviewContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                <div class="space-y-1">
                    <h4 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">1. DATA AKADEMIK</h4>
                    <p><span class="text-[var(--text-muted)]">Nama:</span> <span class="font-semibold text-[var(--text-primary)]">${nama}</span></p>
                    <p><span class="text-[var(--text-muted)]">Nilai:</span> <span class="font-mono text-[var(--text-secondary)]">MTK: ${mtk} | B.Ing: ${bing} | IPA: ${ipa} | IPS: ${ips}</span></p>
                    <p><span class="text-[var(--text-muted)]">Favorit Mapel:</span> <span class="text-[var(--text-secondary)]">${mapel}</span></p>
                    <p><span class="text-[var(--text-muted)]">Gaya Belajar:</span> <span class="text-[var(--text-secondary)]">${gaya}</span></p>
                </div>
                <div class="space-y-1 border-t md:border-t-0 md:border-l border-[var(--card-border)] pt-4 md:pt-0 md:pl-6">
                    <h4 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">2. MINAT &amp; HOBI</h4>
                    <p><span class="text-[var(--text-muted)]">Rumpun Minat:</span> <span class="text-[var(--text-secondary)]">${minat}</span></p>
                    <p><span class="text-[var(--text-muted)]">Hobi Utama:</span> <span class="text-[var(--text-secondary)]">${hobi}</span></p>
                    <p><span class="text-[var(--text-muted)]">Minat Spesifik:</span> <span class="text-[var(--text-muted)] italic">${minatSpesifik}</span></p>
                    <p><span class="text-[var(--text-muted)]">Hobi Tambahan:</span> <span class="text-[var(--text-muted)] italic">${hobiTambahan}</span></p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-t border-[var(--card-border)]">
                <div class="space-y-1">
                    <h4 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">3. KEMAMPUAN &amp; KARAKTER</h4>
                    <p><span class="text-[var(--text-muted)]">Komputer:</span> <span class="text-[var(--text-secondary)]">${komputer}</span></p>
                    <p><span class="text-[var(--text-muted)]">Komunikasi:</span> <span class="text-[var(--text-secondary)]">${komunikasi}</span></p>
                    <p><span class="text-[var(--text-muted)]">Kepemimpinan:</span> <span class="text-[var(--text-secondary)]">${kepemimpinan}</span></p>
                    <p><span class="text-[var(--text-muted)]">Analisis:</span> <span class="text-[var(--text-secondary)]">${analisis}</span></p>
                    <p><span class="text-[var(--text-muted)]">Kreativitas:</span> <span class="text-[var(--text-secondary)]">${kreativitas}</span></p>
                    <p><span class="text-[var(--text-muted)]">Problem Solving:</span> <span class="text-[var(--text-secondary)]">${problemSolving}</span></p>
                </div>
                <div class="space-y-1 border-t md:border-t-0 md:border-l border-[var(--card-border)] pt-4 md:pt-0 md:pl-6">
                    <h4 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">4. ORGANISASI &amp; PRESTASI</h4>
                    <p><span class="text-[var(--text-muted)]">Aktivitas Organisasi:</span> <span class="text-[var(--text-secondary)]">${organisasi}</span></p>
                    <p><span class="text-[var(--text-muted)]">Sasaran Karier:</span> <span class="text-[var(--text-secondary)]">${karier}</span></p>
                    <p><span class="text-[var(--text-muted)]">Prestasi Akademik:</span> <span class="text-[var(--text-primary)] font-semibold">${paCombined}</span></p>
                    <p><span class="text-[var(--text-muted)]">Prestasi Non-Akademik:</span> <span class="text-[var(--text-primary)] font-semibold">${pnaCombined}</span></p>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-6 pt-4 border-t border-[var(--card-border)]">
                <div class="space-y-1">
                    <h4 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">5. LOKASI EVALUASI</h4>
                    <p><span class="text-[var(--text-muted)]">Provinsi:</span> <span class="font-semibold text-[var(--text-primary)]">${provinsi}</span></p>
                    <p><span class="text-[var(--text-muted)]">Kota / Kabupaten:</span> <span class="font-semibold text-[var(--text-primary)]">${kota}</span></p>
                </div>
            </div>
        `;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    const nextStep = currentStep + 1;
                    if (nextStep === 6) {
                        // Step 6 = Review: populate review data
                        populateReview();
                    }
                    if (nextStep === 7) {
                        // Step 7 = Analisis: run input quality validation
                        runInputQualityValidation();
                    }
                    showStep(nextStep);
                }
            } else {
                // Focus first invalid element
                const activeStepEl = document.getElementById(`step-${currentStep}`);
                const invalidEl = activeStepEl.querySelector(':invalid');
                if (invalidEl) {
                    invalidEl.focus();
                } else if (currentStep === 2 && !hobiHiddenInput.value) {
                    hobiDropdownBtn.focus();
                }
            }
        });
    }

    // ==========================================
    // 4b. INPUT QUALITY VALIDATION — V5 UNIFIED DASHBOARD
    // Single unified "Student Profile Analysis" card
    // ==========================================
    let lastValidationResult = null;
    let lastStrengthResult   = null;
    let lastConsistencyResult = null;
    let lastConfidenceResult = null;

    function runInputQualityValidation() {
        if (typeof STARSValidator === 'undefined') return;

        const inputData = STARSValidator.collectInputs();

        // Run all scoring layers
        lastValidationResult  = STARSValidator.validate();
        lastConsistencyResult = STARSValidator.calculateConsistencyScore(inputData);
        lastStrengthResult    = STARSValidator.calculateStrengthScore(inputData);
        lastConfidenceResult  = STARSValidator.calculateConfidence(
            lastValidationResult.score,
            lastConsistencyResult.score,
            lastStrengthResult.totalScore,
            lastValidationResult.isHardBlocked
        );

        const submitWrapper  = document.getElementById('validation-submit-wrapper');
        const blockedMsg     = document.getElementById('validation-blocked-msg');
        const dashboard      = document.getElementById('student-profile-analysis-dashboard');

        // Always render the unified dashboard (shows even when blocked with score 0)
        if (dashboard && typeof STARSValidator.renderUnifiedDashboard === 'function') {
            STARSValidator.renderUnifiedDashboard(
                dashboard,
                lastValidationResult,
                lastConsistencyResult,
                lastStrengthResult,
                lastConfidenceResult,
                lastValidationResult.issues || []
            );
        }

        if (lastValidationResult.isHardBlocked) {
            if (submitWrapper) submitWrapper.classList.add('hidden');
            if (blockedMsg)    blockedMsg.classList.remove('hidden');
        } else {
            if (submitWrapper) submitWrapper.classList.remove('hidden');
            if (blockedMsg)    blockedMsg.classList.add('hidden');
        }
    }


    // Wire up "Perbaiki Data Input" button
    const fixInputBtn = document.getElementById('fix-input-btn');
    if (fixInputBtn) {
        fixInputBtn.addEventListener('click', function() {
            showStep(1);
        });
    }

    // ==========================================
    // 4c. LOCATION DROPDOWN (V4.5)
    // Province → City cascade using STARS_LOCATION_DATA
    // ==========================================
    const provinsiSelect = document.getElementById('provinsi');
    const kotaSelect     = document.getElementById('kota');

    if (provinsiSelect && typeof STARS_LOCATION_DATA !== 'undefined') {
        // Populate provinces
        Object.keys(STARS_LOCATION_DATA).sort().forEach(prov => {
            const opt = document.createElement('option');
            opt.value = prov;
            opt.textContent = prov;
            provinsiSelect.appendChild(opt);
        });

        // On province change → populate cities
        provinsiSelect.addEventListener('change', function () {
            const cities = STARS_LOCATION_DATA[this.value] || [];
            kotaSelect.innerHTML = '<option value="">-- Pilih Kota/Kabupaten --</option>';
            cities.sort().forEach(city => {
                const opt = document.createElement('option');
                opt.value = city;
                opt.textContent = city;
                kotaSelect.appendChild(opt);
            });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    }

    // ==========================================
    // 5. ANIMATED COUNTER STATISTICS
    // ==========================================
    const counterElements = document.querySelectorAll('.stat-counter');
    
    if (counterElements.length > 0) {
        const countUp = (el) => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 1500; // 1.5 seconds animation
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target.toLocaleString('id-ID');
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current).toLocaleString('id-ID');
                }
            }, stepTime);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    countUp(el);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    // ==========================================
    // 6. AJAX PREDICTION FETCH AND RENDERING
    // ==========================================
    const predictionForm = document.getElementById('prediction-form');
    const resultContainer = document.getElementById('result-container');
    const resultLoading = document.getElementById('result-loading');
    const resultData = document.getElementById('result-data');

    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate that we are on the final step and hobi is selected
            if (currentStep !== 7) {
                return;
            }

            if (!hobiHiddenInput.value) {
                alert('Pilih Hobi dari dropdown terlebih dahulu.');
                showStep(2);
                return;
            }

            // Check hard block (Input Quality INVALID)
            if (lastValidationResult && lastValidationResult.status === 'INVALID') {
                return;
            }

            // ── V5.1: Hybrid Reliability Gate ──────────────────────────
            const reliabilityScore = lastConfidenceResult ? lastConfidenceResult.score : 100;
            const warningModal  = document.getElementById('reliability-warning-modal');
            const blockedModal  = document.getElementById('reliability-blocked-modal');
            const bypassGate    = predictionForm.dataset.bypassGate === 'true';

            if (!bypassGate && reliabilityScore < 30) {
                // HARD BLOCK: show red modal, prevent prediction
                if (blockedModal) blockedModal.classList.remove('hidden');
                return;
            }

            if (!bypassGate && reliabilityScore < 50) {
                // SOFT WARN: show yellow modal, let user choose
                if (warningModal) warningModal.classList.remove('hidden');
                return;
            }

            // Score >= 50: proceed normally
            // Show Results section and Loading Skeleton
            resultContainer.classList.remove('hidden');
            resultLoading.classList.remove('hidden');
            resultData.classList.add('hidden');

            // Smooth scroll to results
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Prepare form data
            const formData = new FormData(this);

            // Fetch AJAX to predict proxy
            fetch('predict.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading
                resultLoading.classList.add('hidden');
                
                if (data.status === 'success') {
                    // Populate UI
                    renderPredictionResults(data);
                    resultData.classList.remove('hidden');

                    // --- V4.5: Campus Recommendation Engine ---
                    const campusSection = document.getElementById('campus-recommendation-section');
                    if (campusSection && typeof STARSCampus !== 'undefined') {
                        const studentData = {
                            provinsi:              (document.getElementById('provinsi')?.value || ''),
                            kota:                  (document.getElementById('kota')?.value || ''),
                            minat:                 (document.getElementById('minat')?.value || ''),
                            hobi:                  (document.getElementById('hobi-hidden')?.value || ''),
                            hobi_tambahan:         (document.getElementById('hobi_tambahan')?.value || ''),
                            minat_spesifik:        (document.getElementById('minat_spesifik')?.value || ''),
                            mata_pelajaran_favorit:(document.getElementById('mata_pelajaran_favorit')?.value || ''),
                            tujuan_karier:         (document.getElementById('tujuan_karier')?.value || ''),
                        };
                        const strengthScore = lastStrengthResult ? lastStrengthResult.totalScore : null;
                        STARSCampus.init('dataset/kampus_indonesia.csv').then(() => {
                            STARSCampus.renderCampusSection(
                                data.jurusan_utama, studentData, strengthScore, campusSection
                            );
                        });
                    }
                } else {
                    // Show error block
                    resultData.innerHTML = `
                        <div class="p-8 text-center border border-red-500/20 bg-red-500/5 rounded-3xl max-w-2xl mx-auto glass-card">
                            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4 animate-bounce"></i>
                            <h4 class="text-xl font-bold text-[var(--text-primary)] mb-2">Gagal Menjalankan Prediksi</h4>
                            <p class="text-sm text-[var(--text-secondary)] mb-6">${data.error || 'Server internal bermasalah.'}</p>
                            <button type="submit" class="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold rounded-xl transition-all shadow-md">Coba Lagi</button>
                        </div>
                    `;
                    resultData.classList.remove('hidden');
                }
            })
            .catch(error => {
                resultLoading.classList.add('hidden');
                resultData.innerHTML = `
                    <div class="p-8 text-center border border-red-500/20 bg-red-500/5 rounded-3xl max-w-2xl mx-auto glass-card">
                        <i class="fas fa-wifi text-4xl text-red-500 mb-4"></i>
                        <h4 class="text-xl font-bold text-[var(--text-primary)] mb-2">Koneksi Terputus</h4>
                        <p class="text-sm text-[var(--text-secondary)] mb-6">Gagal menghubungi server. Periksa koneksi internet Anda atau pastikan server Python backend aktif.</p>
                        <button id="retry-predict-btn" class="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold rounded-xl transition-all shadow-md">Hubungkan Ulang</button>
                    </div>
                `;
                resultData.classList.remove('hidden');

                document.getElementById('retry-predict-btn').addEventListener('click', function() {
                    predictionForm.dispatchEvent(new Event('submit'));
                });
            });
        });
    }

    // ──────────────────────────────────────────────────────────────
    // V5.1: Modal Button Handlers (Reliability Gate)
    // ──────────────────────────────────────────────────────────────
    (function wireReliabilityModals() {
        const warningModal = document.getElementById('reliability-warning-modal');
        const blockedModal = document.getElementById('reliability-blocked-modal');

        // "Periksa Ulang Data" — close warning modal, go back to step 1
        const reviewBtn = document.getElementById('modal-review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                if (warningModal) warningModal.classList.add('hidden');
                showStep(1);
            });
        }

        // "Lanjutkan Prediksi" — close warning modal, run prediction directly
        const proceedBtn = document.getElementById('modal-proceed-btn');
        if (proceedBtn && predictionForm) {
            proceedBtn.addEventListener('click', () => {
                if (warningModal) warningModal.classList.add('hidden');
                // Bypass gate by setting a flag and resubmitting
                predictionForm.dataset.bypassGate = 'true';
                predictionForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                delete predictionForm.dataset.bypassGate;
            });
        }

        // "Kembali Perbaiki Data" — close blocked modal, go back to step 1
        const backBtn = document.getElementById('modal-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (blockedModal) blockedModal.classList.add('hidden');
                showStep(1);
            });
        }

        // Close modals on backdrop click
        [warningModal, blockedModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.add('hidden');
                });
            }
        });
    })();

    // Helper to format output rendering dynamically
    function renderPredictionResults(data) {
        // 1. Jurusan Utama
        document.getElementById('res-jurusan-utama').textContent = data.jurusan_utama;
        
        // 2. Tingkat Kecocokan & Bintang
        const tk = data.tingkat_kecocokan;
        document.getElementById('res-tingkat-label').textContent = tk.label;
        document.getElementById('res-tingkat-bintang').textContent = tk.bintang;
        
        // Match percentage calculating (taking the main ranking percent)
        const primaryRank = data.ranking[0];
        const matchPct = (primaryRank.probabilitas * 100).toFixed(1) + '%';
        
        const progressBar = document.getElementById('res-progress-bar');
        progressBar.style.width = '0%';
        progressBar.textContent = matchPct;
        
        // Custom color classes for progress bar based on level
        progressBar.style.backgroundColor = tk.warna;
        
        setTimeout(() => {
            progressBar.style.width = matchPct;
        }, 100);

        // 3. Alasan Rekomendasi
        const alasanContainer = document.getElementById('res-alasan-list');
        alasanContainer.innerHTML = '';
        data.alasan.forEach(alasan => {
            alasanContainer.innerHTML += `
                <li class="flex items-start space-x-3 text-sm text-[var(--text-secondary)]">
                    <span class="text-green-500 mt-0.5"><i class="fas fa-check-circle"></i></span>
                    <span>${alasan}</span>
                </li>
            `;
        });

        // 4. Jurusan Alternatif (Top 3)
        const altContainer = document.getElementById('res-alternatif-cards');
        altContainer.innerHTML = '';
        
        data.alternatif.forEach((alt, idx) => {
            const icons = ['fa-graduation-cap', 'fa-book-open', 'fa-award'];
            const medali = ['🥈 Kedua', '🥉 Ketiga'];
            altContainer.innerHTML += `
                <div class="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] flex flex-col justify-between hover:border-[var(--accent-1)] transition-all">
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">${medali[idx]}</span>
                            <span class="h-8 w-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)]">
                                <i class="fas ${icons[idx+1] || 'fa-graduation-cap'} text-xs"></i>
                            </span>
                        </div>
                        <h4 class="text-base font-bold text-[var(--text-primary)] mb-2 leading-tight">${alt.jurusan}</h4>
                    </div>
                    <div class="mt-4 flex items-center space-x-2">
                        <span class="text-xs font-medium px-2 py-0.5 rounded" style="background-color: ${alt.tingkat_kecocokan.warna}20; color: ${alt.tingkat_kecocokan.warna}">${alt.tingkat_kecocokan.label}</span>
                        <span class="text-[10px] text-[var(--text-muted)]">${alt.tingkat_kecocokan.bintang}</span>
                    </div>
                </div>
            `;
        });

        // 5. Prospek Karier
        const karierContainer = document.getElementById('res-karier-badges');
        karierContainer.innerHTML = '';
        data.prospek_karier.forEach(job => {
            karierContainer.innerHTML += `
                <span class="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-default">
                    <i class="fas fa-briefcase text-[10px] mr-1.5 text-[var(--text-muted)]"></i> ${job}
                </span>
            `;
        });

        // 6. Ranking Tabel Seluruh Jurusan (20 Jurusan)
        const rankingBody = document.getElementById('res-ranking-tbody');
        rankingBody.innerHTML = '';
        
        data.ranking.forEach(row => {
            const rowPct = (row.probabilitas * 100).toFixed(1);
            rankingBody.innerHTML += `
                <tr class="border-b border-[var(--card-border)] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td class="px-6 py-4 text-sm font-semibold text-[var(--text-muted)] text-center">${row.rank}</td>
                    <td class="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">${row.jurusan}</td>
                    <td class="px-6 py-4">
                        <div class="flex items-center space-x-3 min-w-[150px]">
                            <div class="w-full bg-[var(--bg-tertiary)] rounded-full h-2 overflow-hidden">
                                <div class="h-2 rounded-full animated-progress" style="width: ${rowPct}%; background-color: ${row.tingkat_kecocokan.warna}"></div>
                            </div>
                            <span class="text-xs font-mono font-semibold text-[var(--text-secondary)] w-10 text-right">${rowPct}%</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <span class="text-xs font-medium px-2.5 py-0.5 rounded" style="background-color: ${row.tingkat_kecocokan.warna}15; color: ${row.tingkat_kecocokan.warna}">
                            ${row.tingkat_kecocokan.label}
                        </span>
                    </td>
                </tr>
            `;
        });
    }
});
