// STARS Application Main Javascript

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
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
    // ==========================================
    



    // ==========================================
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
    const totalSteps = 4;
    
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
            if (currentStep === 3) {
                nextBtn.innerHTML = `Lanjut Ke Review <i class="fas fa-arrow-right ml-2"></i>`;
                nextBtn.classList.remove('hidden');
                if (document.getElementById('submit-btn')) document.getElementById('submit-btn').classList.add('hidden');
            } else if (currentStep === 4) {
                nextBtn.classList.add('hidden'); // submit button will handle action in step 4
                if (document.getElementById('submit-btn')) document.getElementById('submit-btn').classList.remove('hidden');
            } else {
                nextBtn.innerHTML = `Berikutnya <i class="fas fa-arrow-right ml-2"></i>`;
                nextBtn.classList.remove('hidden');
                if (document.getElementById('submit-btn')) document.getElementById('submit-btn').classList.add('hidden');
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
        return isValid;
    }


    function populateReview() {
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent) return;
        
        const nama = document.getElementById('nama') ? document.getElementById('nama').value : 'Pengguna';
        const greeting = document.getElementById('review-greeting');
        if (greeting) greeting.innerHTML = `Hai <strong class="text-[var(--text-primary)]">${nama}</strong>, profilmu sudah siap dianalisis.`;

        // Calculate stats for review
        let countAkad = 4; // Wajib
        document.querySelectorAll('.subject-input-wrapper:not(.hidden) input').forEach(inp => {
            if(inp.value) countAkad++;
        });
        const rAkad = document.getElementById('rev-akademik');
        if(rAkad) rAkad.textContent = `${countAkad} Mapel`;

        const countMinat = document.querySelectorAll('input[name="Minat"]:checked').length;
        const rMinat = document.getElementById('rev-minat');
        if(rMinat) rMinat.textContent = `${countMinat}`;

        const countKarier = document.querySelectorAll('input[name="Karier"]:checked').length;
        const rKarier = document.getElementById('rev-karier');
        if(rKarier) rKarier.textContent = `${countKarier}`;

        const countKekuatan = document.querySelectorAll('input[name="Strength"]:checked').length;
        const rKekuatan = document.getElementById('rev-kekuatan');
        if(rKekuatan) rKekuatan.textContent = `${countKekuatan}`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log("nextBtn clicked, currentStep:", currentStep);
            const isValid = validateStep(currentStep);
            console.log("validateStep result:", isValid);
            if (isValid) {
                if (currentStep < totalSteps) {
                    const nextStep = currentStep + 1;
                    console.log("moving to nextStep:", nextStep);
                    if (nextStep === 4) {
                        // Step 4 = Review: populate review data
                        populateReview();
                        if (typeof runInputQualityValidation === 'function') {
                            runInputQualityValidation();
                        }
                    }
                    showStep(nextStep);
                }
            } else {
                console.log("Validation failed for step:", currentStep);
                // Focus first invalid element
                const activeStepEl = document.getElementById(`step-${currentStep}`);
                const invalidEl = activeStepEl ? activeStepEl.querySelector(':invalid') : null;
                if (invalidEl) {
                    invalidEl.focus();
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
    
    // ==========================================
    // Checkbox Limits Validation (V4.2)
    // ==========================================
    const limits = {
        'Favorit': 3,
        'Minat': 3,
        'Karier': 2,
        'Strength': 3,
        'Hobi': 3,
        'Ekskul': 2,
        'Prestasi': 2
    };

    Object.keys(limits).forEach(name => {
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                const checkedCount = document.querySelectorAll(`input[type="checkbox"][name="${name}"]:checked`).length;
                if (checkedCount > limits[name]) {
                    this.checked = false;
                    alert(`Maksimal ${limits[name]} pilihan untuk bagian ini.`);
                }
            });
        });
    });

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
            if (currentStep !== 4) {
                return;
            }

            

            // Check hard block (Input Quality INVALID)
            if (lastValidationResult && lastValidationResult.status === 'INVALID') {
                return;
            }

            // ── V5.1: Hybrid Reliability Gate ──────────────────────────
            const reliabilityScore = lastConfidenceResult ? lastConfidenceResult.score : 100;
            const bypassGate    = predictionForm.dataset.bypassGate === 'true';

            // STARS V4.2: We no longer block predictions based on reliability/consistency score.
            // The model is trained to handle multidimensional profiles.
            
            // Score >= 0: proceed normally

            // Score >= 50: proceed normally
            // Show Results section and Loading Skeleton
            resultContainer.classList.remove('hidden');
            resultLoading.classList.remove('hidden');
            resultData.classList.add('hidden');

            // Smooth scroll to results
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Prepare form data
            const formData = new FormData(this);
            const inputData = Object.fromEntries(formData.entries());
            
            
            // The form directly contains V4.2 names thanks to Phase 5.8.7.
            // We just need to parse checkboxes and numbers properly.
            // Checkboxes might be arrays if multiple are selected, or we just want 1/0 for each checkbox name/value.
            
            // Loop through all inputs in form
            const allInputs = predictionForm.querySelectorAll('input, select');
            allInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    if (input.checked) {
                        inputData[input.value] = 1;
                    }
                } else if (input.type === 'number') {
                    if (input.value === "") {
                        delete inputData[input.name];
                    } else {
                        inputData[input.name] = parseInt(input.value);
                    }
                } else if (input.name) {
                    inputData[input.name] = input.value;
                }
            });
            // -------------------------------------


            // Fetch AJAX to predict proxy
            fetch('/api/prediksi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputData)
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
        progressBar.textContent = matchPct;
        progressBar.style.color = tk.warna;

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
                        <div class="flex items-center justify-center min-w-[100px]">
                            <span class="text-sm font-mono font-bold" style="color: ${row.tingkat_kecocokan.warna}">${rowPct}%</span>
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

    // --- V4.2 FORM UX REDESIGN ADDITIONS ---
    // Subject card toggle
    const subjectCards = document.querySelectorAll('.subject-card');
    subjectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Ignore if they clicked the input itself
            if(e.target.tagName === 'INPUT') return;
            
            const wrapper = this.querySelector('.subject-input-wrapper');
            const input = this.querySelector('input');
            const indicator = this.querySelector('.toggle-indicator');
            
            if (wrapper.classList.contains('hidden')) {
                wrapper.classList.remove('hidden');
                indicator.innerHTML = '<i class="fas fa-check text-[10px] text-[var(--text-primary)]"></i>';
                indicator.classList.add('bg-[var(--text-primary)]', 'border-[var(--text-primary)]');
                this.classList.add('border-[var(--text-primary)]');
                input.focus();
            } else {
                wrapper.classList.add('hidden');
                indicator.innerHTML = '';
                indicator.classList.remove('bg-[var(--text-primary)]', 'border-[var(--text-primary)]');
                this.classList.remove('border-[var(--text-primary)]');
                input.value = ''; // clear when hidden
            }
        });
    });

    // Ekskul Form Toggle
    const btnTambahEkskul = document.getElementById('btn-tambah-ekskul');
    const btnTutupEkskul = document.getElementById('btn-tutup-ekskul');
    const ekskulIntro = document.getElementById('ekskul-intro');
    const ekskulForm = document.getElementById('ekskul-form');

    if (btnTambahEkskul) {
        btnTambahEkskul.addEventListener('click', () => {
            ekskulIntro.classList.add('hidden');
            ekskulForm.classList.remove('hidden');
        });
    }
    if (btnTutupEkskul) {
        btnTutupEkskul.addEventListener('click', () => {
            ekskulForm.classList.add('hidden');
            ekskulIntro.classList.remove('hidden');
            // Uncheck everything
            ekskulForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
    }

    // Prestasi Form Toggle
    const btnTambahPrestasi = document.getElementById('btn-tambah-prestasi');
    const btnTutupPrestasi = document.getElementById('btn-tutup-prestasi');
    const prestasiIntro = document.getElementById('prestasi-intro');
    const prestasiForm = document.getElementById('prestasi-form');

    if (btnTambahPrestasi) {
        btnTambahPrestasi.addEventListener('click', () => {
            prestasiIntro.classList.add('hidden');
            prestasiForm.classList.remove('hidden');
        });
    }
    if (btnTutupPrestasi) {
        btnTutupPrestasi.addEventListener('click', () => {
            prestasiForm.classList.add('hidden');
            prestasiIntro.classList.remove('hidden');
            prestasiForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
    }
    
});
