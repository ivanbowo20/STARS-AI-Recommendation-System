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

        // Change Next button text and toggle Step 4 Action Cluster (Submit & Mulai Ulang)
        const step4Actions = document.getElementById('step-4-actions');
        const submitBtn = document.getElementById('submit-btn');

        if (currentStep === 4) {
            if (nextBtn) nextBtn.classList.add('hidden');
            if (step4Actions) step4Actions.classList.remove('hidden');
            if (submitBtn) submitBtn.classList.remove('hidden');
        } else {
            if (step4Actions) step4Actions.classList.add('hidden');
            if (submitBtn) submitBtn.classList.add('hidden');
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
                if (currentStep === 3) {
                    nextBtn.innerHTML = `Lanjut Ke Review <i class="fas fa-arrow-right ml-2"></i>`;
                } else {
                    nextBtn.innerHTML = `Berikutnya <i class="fas fa-arrow-right ml-2"></i>`;
                }
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

    // ==========================================
    // FORM VALIDATION & INLINE NOTIFICATIONS
    // ==========================================
    function showInlineError(errorElId, message) {
        const errorEl = document.getElementById(errorElId);
        if (errorEl) {
            if (message) {
                const textSpan = errorEl.querySelector('span:not(.fas):not(.far)') || errorEl.querySelector('span');
                if (textSpan) textSpan.textContent = message;
            }
            errorEl.classList.remove('hidden');
        }
    }

    function hideInlineError(errorElId) {
        const errorEl = document.getElementById(errorElId);
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }

    function checkMapelPilihanValidity() {
        const activeWrappers = document.querySelectorAll('#step-1 .subject-input-wrapper:not(.hidden)');
        if (activeWrappers.length === 0) return false;
        
        for (let wrapper of activeWrappers) {
            const inp = wrapper.querySelector('input');
            if (!inp) return false;
            const rawVal = inp.value.trim();
            const numVal = parseFloat(rawVal);
            if (rawVal === '' || isNaN(numVal) || numVal < 0 || numVal > 100) {
                return false;
            }
        }
        hideInlineError('mapel-pilihan-error');
        return true;
    }

    function validateStep(stepNum) {
        const activeStepEl = document.getElementById(`step-${stepNum}`);
        if (!activeStepEl) return true;

        let isValid = true;
        let firstInvalidEl = null;

        const markInvalid = (el) => {
            isValid = false;
            if (el) {
                el.classList.add('border-red-500');
                if (!firstInvalidEl) firstInvalidEl = el;
            }
        };

        // --- STEP 1: AKADEMIK ---
        if (stepNum === 1) {
            // 1. Nama Lengkap
            const namaInput = document.getElementById('nama');
            const namaVal = namaInput ? namaInput.value.trim() : '';
            if (!namaVal || namaVal.length < 2) {
                showInlineError('nama-error', 'Nama lengkap wajib diisi.');
                markInvalid(namaInput);
            } else {
                hideInlineError('nama-error');
                if (namaInput) namaInput.classList.remove('border-red-500');
            }

            // 2. 4 Mata Pelajaran Umum
            const mapelUmumConfig = [
                { id: 'Nilai_Matematika_Umum', name: 'Matematika Umum' },
                { id: 'Nilai_Bahasa_Indonesia', name: 'Bahasa Indonesia' },
                { id: 'Nilai_Bahasa_Inggris_Umum', name: 'Bahasa Inggris' },
                { id: 'Nilai_Pendidikan_Pancasila', name: 'Pend. Pancasila' }
            ];

            let firstMapelErrorMsg = null;
            mapelUmumConfig.forEach(item => {
                const inp = document.getElementById(item.id);
                if (inp) {
                    const rawVal = inp.value.trim();
                    const numVal = parseFloat(rawVal);
                    if (rawVal === '' || isNaN(numVal) || numVal < 0 || numVal > 100) {
                        inp.classList.add('border-red-500');
                        if (!firstMapelErrorMsg) {
                            firstMapelErrorMsg = `Nilai ${item.name} wajib diisi antara 0 hingga 100.`;
                        }
                        if (!firstInvalidEl) firstInvalidEl = inp;
                        isValid = false;
                    } else {
                        inp.classList.remove('border-red-500');
                    }
                }
            });

            if (firstMapelErrorMsg) {
                showInlineError('mapel-umum-error', firstMapelErrorMsg);
            } else {
                hideInlineError('mapel-umum-error');
            }

            // 3. Mata Pelajaran Pilihan (Minimal 1 aktif, dan setiap aktif wajib bernilai 0-100)
            const activeWrappers = document.querySelectorAll('#step-1 .subject-input-wrapper:not(.hidden)');
            if (activeWrappers.length === 0) {
                showInlineError('mapel-pilihan-error', 'Pilih minimal 1 mata pelajaran pilihan dan isi nilainya.');
                const firstCard = document.querySelector('#step-1 .subject-card');
                if (!firstInvalidEl && firstCard) firstInvalidEl = firstCard;
                isValid = false;
            } else {
                let firstPilihanErrorMsg = null;
                activeWrappers.forEach(wrapper => {
                    const inp = wrapper.querySelector('input');
                    const card = wrapper.closest('.subject-card');
                    const subjectSpan = card ? card.querySelector('span') : null;
                    const subjectName = subjectSpan ? subjectSpan.textContent.trim() : 'Pilihan';
                    
                    if (inp) {
                        const rawVal = inp.value.trim();
                        const numVal = parseFloat(rawVal);
                        if (rawVal === '' || isNaN(numVal) || numVal < 0 || numVal > 100) {
                            inp.classList.add('border-red-500');
                            if (card) card.classList.add('border-red-500');
                            if (!firstPilihanErrorMsg) {
                                firstPilihanErrorMsg = `Nilai ${subjectName} belum diisi (0–100).`;
                            }
                            if (!firstInvalidEl) firstInvalidEl = inp;
                            isValid = false;
                        } else {
                            inp.classList.remove('border-red-500');
                            if (card) card.classList.remove('border-red-500');
                        }
                    }
                });

                if (firstPilihanErrorMsg) {
                    showInlineError('mapel-pilihan-error', firstPilihanErrorMsg);
                } else {
                    hideInlineError('mapel-pilihan-error');
                }
            }
        }

        // --- STEP 2: MINAT & ASPIRASI ---
        else if (stepNum === 2) {
            // 1. Minat Bidang Keilmuan (Wajib minimal 1)
            const countMinat = document.querySelectorAll('input[name="Minat"]:checked').length;
            if (countMinat === 0) {
                showInlineError('minat-error', 'Pilih minimal 1 bidang minat keilmuan.');
                const groupMinat = document.getElementById('group-minat');
                if (groupMinat && !firstInvalidEl) firstInvalidEl = groupMinat;
                isValid = false;
            } else {
                hideInlineError('minat-error');
            }

            // 2. Tujuan Karier Impian (Wajib minimal 1)
            const countKarier = document.querySelectorAll('input[name="Karier"]:checked').length;
            if (countKarier === 0) {
                showInlineError('karier-error', 'Pilih minimal 1 tujuan karier impian.');
                const groupKarier = document.getElementById('group-karier');
                if (groupKarier && !firstInvalidEl) firstInvalidEl = groupKarier;
                isValid = false;
            } else {
                hideInlineError('karier-error');
            }

            // 3. Preferensi Lokasi Kampus (Provinsi & Kabupaten/Kota) — PRESERVE EXISTING LOGIC
            const provinsiEl = document.getElementById('provinsi');
            const kotaEl = document.getElementById('kota');
            if (provinsiEl) {
                const searchProxy = document.getElementById('provinsi-search');
                const errorEl = document.getElementById('provinsi-error');
                if (searchProxy) searchProxy.classList.remove('border-red-500');
                if (errorEl) errorEl.classList.add('hidden');
                if (!provinsiEl.value.trim()) {
                    if (searchProxy) searchProxy.classList.add('border-red-500');
                    if (errorEl) errorEl.classList.remove('hidden');
                    if (!firstInvalidEl && searchProxy) firstInvalidEl = searchProxy;
                    isValid = false;
                }
            }
            if (kotaEl) {
                const searchProxy = document.getElementById('kota-search');
                const errorEl = document.getElementById('kota-error');
                if (searchProxy) searchProxy.classList.remove('border-red-500');
                if (errorEl) errorEl.classList.add('hidden');
                if (!kotaEl.value.trim()) {
                    if (searchProxy) searchProxy.classList.add('border-red-500');
                    if (errorEl) errorEl.classList.remove('hidden');
                    if (!firstInvalidEl && searchProxy) firstInvalidEl = searchProxy;
                    isValid = false;
                }
            }
        }

        // --- STEP 3: KEKUATAN & AKTIVITAS ---
        else if (stepNum === 3) {
            // 1. Kekuatan Diri (Strength) — Wajib minimal 1
            const countStrength = document.querySelectorAll('input[name="Strength"]:checked').length;
            if (countStrength === 0) {
                showInlineError('strength-error', 'Pilih minimal 1 kekuatan diri Anda.');
                const groupStrength = document.getElementById('group-strength');
                if (groupStrength && !firstInvalidEl) firstInvalidEl = groupStrength;
                isValid = false;
            } else {
                hideInlineError('strength-error');
            }

            // 2. Hobi & Waktu Luang — Wajib minimal 1
            const countHobi = document.querySelectorAll('input[name="Hobi"]:checked').length;
            if (countHobi === 0) {
                showInlineError('hobi-error', 'Pilih minimal 1 hobi atau aktivitas waktu luang.');
                const groupHobi = document.getElementById('group-hobi');
                if (groupHobi && !firstInvalidEl) firstInvalidEl = groupHobi;
                isValid = false;
            } else {
                hideInlineError('hobi-error');
            }

            // 3. Organisasi & Ekskul: SEPENUHNYA OPSIONAL! (Tidak ada pengecekan)
        }

        // --- STEP 4: PRESTASI & REVIEW ---
        else if (stepNum === 4) {
            // Prestasi: SEPENUHNYA OPSIONAL!
            return true;
        }

        // Focus & smooth scroll to first error if invalid
        if (!isValid && firstInvalidEl) {
            try {
                firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (typeof firstInvalidEl.focus === 'function' && firstInvalidEl.tagName !== 'DIV') {
                    firstInvalidEl.focus();
                }
            } catch (err) {
                // Fail-safe
            }
        }

        return isValid;
    }

    // Auto-dismiss and real-time input handlers
    const namaInput = document.getElementById('nama');
    if (namaInput) {
        namaInput.addEventListener('input', function() {
            if (this.value.trim().length >= 2) {
                hideInlineError('nama-error');
                this.classList.remove('border-red-500');
            }
        });
    }

    const mapelUmumIds = ['Nilai_Matematika_Umum', 'Nilai_Bahasa_Indonesia', 'Nilai_Bahasa_Inggris_Umum', 'Nilai_Pendidikan_Pancasila'];
    mapelUmumIds.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.addEventListener('input', function() {
                const rawVal = this.value.trim();
                const numVal = parseFloat(rawVal);
                if (rawVal !== '' && !isNaN(numVal) && numVal >= 0 && numVal <= 100) {
                    this.classList.remove('border-red-500');
                    const allValid = mapelUmumIds.every(itemId => {
                        const el = document.getElementById(itemId);
                        if (!el) return true;
                        const v = parseFloat(el.value.trim());
                        return el.value.trim() !== '' && !isNaN(v) && v >= 0 && v <= 100;
                    });
                    if (allValid) hideInlineError('mapel-umum-error');
                }
            });
        }
    });

    document.querySelectorAll('.subject-input-wrapper input').forEach(inp => {
        inp.addEventListener('input', function() {
            const rawVal = this.value.trim();
            const numVal = parseFloat(rawVal);
            const card = this.closest('.subject-card');
            if (rawVal !== '' && !isNaN(numVal) && numVal >= 0 && numVal <= 100) {
                this.classList.remove('border-red-500');
                if (card) card.classList.remove('border-red-500');
                checkMapelPilihanValidity();
            }
        });
    });

    function setupCheckboxGroup(name, maxLimit, errorElId) {
        const cbs = document.querySelectorAll(`input[name="${name}"]`);
        cbs.forEach(cb => {
            cb.addEventListener('change', function() {
                const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
                if (maxLimit && checked.length > maxLimit) {
                    this.checked = false;
                    return;
                }
                if (errorElId && checked.length >= 1) {
                    hideInlineError(errorElId);
                }
            });
        });
    }

    setupCheckboxGroup('Favorit', 3, null);
    setupCheckboxGroup('Minat', 3, 'minat-error');
    setupCheckboxGroup('Karier', 2, 'karier-error');
    setupCheckboxGroup('Strength', 3, 'strength-error');
    setupCheckboxGroup('Hobi', 3, 'hobi-error');
    setupCheckboxGroup('Ekskul', 2, null);
    setupCheckboxGroup('Prestasi', 2, null);


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
    const provinsiInput = document.getElementById('provinsi');
    const provinsiSearch = document.getElementById('provinsi-search');
    const provinsiDropdown = document.getElementById('provinsi-dropdown');
    const provinsiIcon = document.getElementById('provinsi-icon');
    
    const kotaInput = document.getElementById('kota');
    const kotaSearch = document.getElementById('kota-search');
    const kotaDropdown = document.getElementById('kota-dropdown');
    const kotaIcon = document.getElementById('kota-icon');

    let currentFocus = -1;
    let availableCities = [];
    let currentKotaFocus = -1;

    if (provinsiInput && provinsiSearch && typeof STARS_LOCATION_DATA !== 'undefined') {
        const provinces = Object.keys(STARS_LOCATION_DATA).sort();

        const closeProvinsiDropdown = (skipAutoMatch = false) => {
            if (!provinsiDropdown) return;
            provinsiDropdown.classList.add('hidden');
            if (provinsiIcon) provinsiIcon.classList.remove('rotate-180');
            currentFocus = -1;
            
            if (!skipAutoMatch) {
                const typedVal = (provinsiSearch.value || '').trim().toLowerCase();
                const matchedProv = provinces.find(p => p.toLowerCase() === typedVal);
                if (matchedProv && matchedProv !== provinsiInput.value) {
                    selectProvince(matchedProv);
                    return;
                }
            }
            
            // Validation on close: reset if invalid
            if (!provinces.includes(provinsiSearch.value)) {
                provinsiSearch.value = provinsiInput.value || '';
            }
        };

        const closeKotaDropdown = () => {
            if (!kotaDropdown) return;
            kotaDropdown.classList.add('hidden');
            if (kotaIcon) kotaIcon.classList.remove('rotate-180');
            currentKotaFocus = -1;
            
            // Validation on close: reset if invalid
            if (!availableCities.includes(kotaSearch.value)) {
                kotaSearch.value = kotaInput.value || '';
            }
        };

        const selectProvince = (prov) => {
            provinsiSearch.value = prov;
            provinsiInput.value = prov;
            provinsiSearch.classList.remove('border-red-500');
            const err = document.getElementById('provinsi-error');
            if (err) err.classList.add('hidden');
            closeProvinsiDropdown(true);
            // Trigger change for existing validation and kota logic
            provinsiInput.dispatchEvent(new Event('change', { bubbles: true }));
        };

        const selectKota = (city) => {
            if(kotaSearch) {
                kotaSearch.value = city;
                kotaSearch.classList.remove('border-red-500');
            }
            if(kotaInput) kotaInput.value = city;
            const err = document.getElementById('kota-error');
            if (err) err.classList.add('hidden');
            closeKotaDropdown();
            // Trigger change just in case anything else listens
            if(kotaInput) kotaInput.dispatchEvent(new Event('change', { bubbles: true }));
        };

        const renderProvinsiDropdown = (filterText = '') => {
            provinsiDropdown.innerHTML = '';
            const filtered = provinces.filter(p => p.toLowerCase().includes(filterText.toLowerCase().trim()));
            
            if (filtered.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'px-4 py-3 text-sm text-[var(--text-muted)] italic';
                empty.textContent = 'Tidak ada provinsi ditemukan.';
                provinsiDropdown.appendChild(empty);
            } else {
                filtered.forEach((prov) => {
                    const item = document.createElement('div');
                    item.className = 'px-4 py-3 text-sm font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent-1)] transition-colors dropdown-item';
                    item.textContent = prov;
                    item.dataset.value = prov;
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectProvince(prov);
                    });
                    provinsiDropdown.appendChild(item);
                });
            }
        };

        const renderKotaDropdown = (filterText = '') => {
            if (!kotaDropdown) return;
            kotaDropdown.innerHTML = '';
            const filtered = availableCities.filter(c => c.toLowerCase().includes(filterText.toLowerCase().trim()));
            
            if (filtered.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'px-4 py-3 text-sm text-[var(--text-muted)] italic';
                empty.textContent = 'Tidak ada kota/kabupaten ditemukan.';
                kotaDropdown.appendChild(empty);
            } else {
                filtered.forEach((city) => {
                    const item = document.createElement('div');
                    item.className = 'px-4 py-3 text-sm font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent-1)] transition-colors dropdown-item';
                    item.textContent = city;
                    item.dataset.value = city;
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectKota(city);
                    });
                    kotaDropdown.appendChild(item);
                });
            }
        };

        provinsiSearch.addEventListener('focus', () => {
            renderProvinsiDropdown(provinsiSearch.value !== provinsiInput.value ? provinsiSearch.value : '');
            provinsiDropdown.classList.remove('hidden');
            if (provinsiIcon) provinsiIcon.classList.add('rotate-180');
        });

        provinsiSearch.addEventListener('click', (e) => {
            e.stopPropagation();
            renderProvinsiDropdown(provinsiSearch.value !== provinsiInput.value ? provinsiSearch.value : '');
            provinsiDropdown.classList.remove('hidden');
            if (provinsiIcon) provinsiIcon.classList.add('rotate-180');
        });

        provinsiSearch.addEventListener('input', (e) => {
            const typedVal = e.target.value.trim().toLowerCase();
            renderProvinsiDropdown(e.target.value);
            provinsiDropdown.classList.remove('hidden');
            if (provinsiIcon) provinsiIcon.classList.add('rotate-180');
            
            const matchedProv = provinces.find(p => p.toLowerCase() === typedVal);
            if (matchedProv) {
                // Exact match while typing! Auto commit.
                selectProvince(matchedProv);
            }
        });

        provinsiSearch.addEventListener('keydown', (e) => {
            const items = provinsiDropdown.querySelectorAll('.dropdown-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentFocus++;
                if (currentFocus >= items.length) currentFocus = 0;
                addActive(items, currentFocus);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentFocus--;
                if (currentFocus < 0) currentFocus = items.length - 1;
                addActive(items, currentFocus);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentFocus > -1 && items[currentFocus]) {
                    items[currentFocus].click();
                } else if (items.length === 1 && provinsiDropdown.querySelector('.dropdown-item')) {
                    items[0].click();
                } else {
                    const typedVal = (provinsiSearch.value || '').trim().toLowerCase();
                    const matchedProv = provinces.find(p => p.toLowerCase() === typedVal);
                    if (matchedProv) {
                        selectProvince(matchedProv);
                    }
                }
            } else if (e.key === 'Escape') {
                closeProvinsiDropdown();
            }
        });

        // Kota Event Listeners
        function showKotaFeedback() {
            const feedback = document.getElementById('kota-locked-feedback');
            if (feedback) {
                feedback.classList.remove('hidden');
                setTimeout(() => feedback.classList.remove('opacity-0'), 10);
                setTimeout(() => {
                    feedback.classList.add('opacity-0');
                    setTimeout(() => feedback.classList.add('hidden'), 300);
                }, 3000);
            }
        }

        if (kotaSearch) {
            kotaSearch.addEventListener('focus', () => {
                if (kotaSearch.disabled) {
                    showKotaFeedback();
                    return;
                }
                renderKotaDropdown(kotaSearch.value !== kotaInput.value ? kotaSearch.value : '');
                kotaDropdown.classList.remove('hidden');
                if (kotaIcon) kotaIcon.classList.add('rotate-180');
            });

            kotaSearch.addEventListener('click', (e) => {
                e.stopPropagation();
                if (kotaSearch.disabled) {
                    showKotaFeedback();
                    return;
                }
                renderKotaDropdown(kotaSearch.value !== kotaInput.value ? kotaSearch.value : '');
                kotaDropdown.classList.remove('hidden');
                if (kotaIcon) kotaIcon.classList.add('rotate-180');
            });

            kotaSearch.addEventListener('input', (e) => {
                if (kotaSearch.disabled) return;
                renderKotaDropdown(e.target.value);
                kotaDropdown.classList.remove('hidden');
                if (kotaIcon) kotaIcon.classList.add('rotate-180');
                // User is typing, clear the actual valid value
                if (kotaInput) kotaInput.value = ''; 
            });

            kotaSearch.addEventListener('keydown', (e) => {
                if (kotaSearch.disabled) return;
                const items = kotaDropdown.querySelectorAll('.dropdown-item');
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentKotaFocus++;
                    if (currentKotaFocus >= items.length) currentKotaFocus = 0;
                    addActive(items, currentKotaFocus);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentKotaFocus--;
                    if (currentKotaFocus < 0) currentKotaFocus = items.length - 1;
                    addActive(items, currentKotaFocus);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentKotaFocus > -1 && items[currentKotaFocus]) {
                        items[currentKotaFocus].click();
                    } else if (items.length === 1 && kotaDropdown.querySelector('.dropdown-item')) {
                        items[0].click();
                    }
                } else if (e.key === 'Escape') {
                    closeKotaDropdown();
                }
            });
        }

        function addActive(items, focusIndex) {
            if (!items || items.length === 0) return;
            removeActive(items);
            if (focusIndex >= items.length) focusIndex = 0;
            if (focusIndex < 0) focusIndex = items.length - 1;
            items[focusIndex].classList.add('bg-[var(--bg-tertiary)]', 'text-[var(--accent-1)]');
            items[focusIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        function removeActive(items) {
            items.forEach(item => {
                item.classList.remove('bg-[var(--bg-tertiary)]', 'text-[var(--accent-1)]');
            });
        }

        document.addEventListener('click', (e) => {
            const pContainer = document.getElementById('provinsi-container');
            if (pContainer && !pContainer.contains(e.target)) {
                closeProvinsiDropdown();
            }
            const kContainer = document.getElementById('kota-container');
            if (kContainer && !kContainer.contains(e.target)) {
                closeKotaDropdown();
            }
        });

        // Setup kotaLockedOverlay
        const kotaLockedOverlay = document.getElementById('kota-locked-overlay');
        if (kotaLockedOverlay) {
            kotaLockedOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                showKotaFeedback();
            });
        }

        // Retain exact existing logic for Kota processing on change
        provinsiInput.addEventListener('change', function () {
            if (kotaInput) kotaInput.value = '';
            if (kotaSearch) kotaSearch.value = '';
            availableCities = [];
            
            const selectedProv = this.value;
            
            if (selectedProv && STARS_LOCATION_DATA[selectedProv]) {
                if (kotaSearch) kotaSearch.disabled = false;
                if (kotaLockedOverlay) kotaLockedOverlay.classList.add('hidden');
                availableCities = STARS_LOCATION_DATA[selectedProv].slice().sort();
            } else {
                if (kotaSearch) kotaSearch.disabled = true;
                if (kotaLockedOverlay) kotaLockedOverlay.classList.remove('hidden');
                closeKotaDropdown();
            }
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

            // Validate that we are on the final step
            if (currentStep !== 4) {
                return;
            }

            // Sanity pre-flight checks across all steps 1-3 with user feedback
            if (!validateStep(1)) {
                showStep(1);
                validateStep(1);
                alert('Mohon lengkapi data nilai akademik pada Langkah 1 sebelum mengirimkan rekomendasi.');
                return;
            }
            if (!validateStep(2)) {
                showStep(2);
                validateStep(2);
                alert('Mohon lengkapi data minat, karier, dan preferensi lokasi pada Langkah 2 sebelum mengirimkan rekomendasi.');
                return;
            }
            if (!validateStep(3)) {
                showStep(3);
                validateStep(3);
                alert('Mohon lengkapi data kekuatan diri dan hobi pada Langkah 3 sebelum mengirimkan rekomendasi.');
                return;
            }

            // Button loading state & double-submit prevention
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                if (submitBtn.disabled) return;
                submitBtn.disabled = true;
                submitBtn.dataset.originalHtml = submitBtn.innerHTML;
                submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
                submitBtn.innerHTML = `Memproses rekomendasi... <svg class="animate-spin -mr-1 ml-2 h-4 w-4 text-current inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            }

            const restoreSubmitBtn = () => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                    if (submitBtn.dataset.originalHtml) {
                        submitBtn.innerHTML = submitBtn.dataset.originalHtml;
                    }
                }
            };

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
                restoreSubmitBtn();
                
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
                restoreSubmitBtn();
                resultData.innerHTML = `
                    <div class="p-8 text-center border border-red-500/20 bg-red-500/5 rounded-3xl max-w-2xl mx-auto glass-card">
                        <i class="fas fa-wifi text-4xl text-red-500 mb-4"></i>
                        <h4 class="text-xl font-bold text-[var(--text-primary)] mb-2">Koneksi Terputus</h4>
                        <p class="text-sm text-[var(--text-secondary)] mb-6">Gagal menghubungi server. Periksa koneksi internet Anda atau pastikan server Python backend aktif.</p>
                        <button id="retry-predict-btn" class="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold rounded-xl transition-all shadow-md">Hubungkan Ulang</button>
                    </div>
                `;
                resultData.classList.remove('hidden');

                const retryBtn = document.getElementById('retry-predict-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', function() {
                        if (predictionForm) predictionForm.dispatchEvent(new Event('submit'));
                    });
                }
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

    // ──────────────────────────────────────────────────────────────
    // V4.2: MULAI ULANG ASESMEN (SOFT RESET WIZARD) & MODAL GUARDRAIL
    // ──────────────────────────────────────────────────────────────
    const resetWizardBtn = document.getElementById('reset-wizard-btn') || document.getElementById('reset-assessment-btn');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');
    const resetModal = document.getElementById('reset-confirmation-modal');

    function openResetModal() {
        if (resetModal) resetModal.classList.remove('hidden');
    }

    function closeResetModal() {
        if (resetModal) resetModal.classList.add('hidden');
    }

    function softResetAssessment() {
        if (!predictionForm) return;

        // a. Eksekusi form.reset()
        predictionForm.reset();

        // b. Reset Step 1: Kosongkan #nama, set nilai 4 mapel umum ke default '80'.
        //    Hapus border aktif dan bersihkan nilai pada 13 kartu mapel pilihan.
        const namaInput = document.getElementById('nama');
        if (namaInput) {
            namaInput.value = '';
            namaInput.classList.remove('border-red-500');
        }

        const mapelUmumConfig = [
            'Nilai_Matematika_Umum',
            'Nilai_Bahasa_Indonesia',
            'Nilai_Bahasa_Inggris_Umum',
            'Nilai_Pendidikan_Pancasila'
        ];
        mapelUmumConfig.forEach(id => {
            const inp = document.getElementById(id);
            if (inp) {
                inp.value = '80';
                inp.classList.remove('border-red-500');
            }
        });

        const subjectCards = document.querySelectorAll('#step-1 .subject-card');
        subjectCards.forEach(card => {
            card.classList.remove('border-[var(--text-primary)]', 'border-red-500');
            const wrapper = card.querySelector('.subject-input-wrapper');
            const input = card.querySelector('input');
            const indicator = card.querySelector('.toggle-indicator');
            if (wrapper) wrapper.classList.add('hidden');
            if (input) {
                input.value = '';
                input.classList.remove('border-red-500');
            }
            if (indicator) {
                indicator.innerHTML = '';
                indicator.className = 'h-5 w-5 sm:h-4 sm:w-4 rounded-full border border-[var(--text-muted)] flex items-center justify-center toggle-indicator transition-all';
            }
        });

        // c. Reset Step 2: Uncheck semua checkbox Favorit, Minat, Karier. Kosongkan #provinsi dan #kota.
        const step2CheckboxGroups = ['Favorit', 'Minat', 'Karier'];
        step2CheckboxGroups.forEach(name => {
            const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
        });

        if (provinsiInput) provinsiInput.value = '';
        if (provinsiSearch) {
            provinsiSearch.value = '';
            provinsiSearch.classList.remove('border-red-500');
        }
        if (provinsiDropdown) {
            provinsiDropdown.classList.add('hidden');
            provinsiDropdown.innerHTML = '';
        }
        if (provinsiIcon) provinsiIcon.classList.remove('rotate-180');

        if (kotaInput) kotaInput.value = '';
        if (kotaSearch) {
            kotaSearch.value = '';
            kotaSearch.disabled = true;
            kotaSearch.classList.remove('border-red-500');
        }
        if (kotaDropdown) {
            kotaDropdown.classList.add('hidden');
            kotaDropdown.innerHTML = '';
        }
        if (kotaIcon) kotaIcon.classList.remove('rotate-180');
        const lockedOverlay = document.getElementById('kota-locked-overlay');
        if (lockedOverlay) lockedOverlay.classList.remove('hidden');

        availableCities = [];
        currentFocus = -1;
        currentKotaFocus = -1;

        // d. Reset Step 3 & Step 4: Uncheck checkbox Strength, Hobi, Ekskul, Prestasi,
        //    serta reset ringkasan #rev-akademik s/d #rev-kekuatan kembali ke '-'.
        const step34CheckboxGroups = ['Strength', 'Hobi', 'Ekskul', 'Peran', 'Prestasi', 'PrestasiTingkat'];
        step34CheckboxGroups.forEach(name => {
            const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
        });

        const ekskulIntro = document.getElementById('ekskul-intro');
        const ekskulForm = document.getElementById('ekskul-form');
        if (ekskulIntro) ekskulIntro.classList.remove('hidden');
        if (ekskulForm) ekskulForm.classList.add('hidden');

        const prestasiIntro = document.getElementById('prestasi-intro');
        const prestasiForm = document.getElementById('prestasi-form');
        if (prestasiIntro) prestasiIntro.classList.remove('hidden');
        if (prestasiForm) prestasiForm.classList.add('hidden');

        const revAkad = document.getElementById('rev-akademik');
        const revMinat = document.getElementById('rev-minat');
        const revKarier = document.getElementById('rev-karier');
        const revKekuatan = document.getElementById('rev-kekuatan');
        const revGreeting = document.getElementById('review-greeting');
        if (revAkad) revAkad.textContent = '-';
        if (revMinat) revMinat.textContent = '-';
        if (revKarier) revKarier.textContent = '-';
        if (revKekuatan) revKekuatan.textContent = '-';
        if (revGreeting) revGreeting.innerHTML = 'Hai, silakan periksa ringkasan profilmu sebelum dikirim ke AI.';

        // e. Sembunyikan seluruh pesan error inline.
        if (typeof STARSValidator !== 'undefined' && typeof STARSValidator.clearValidationErrors === 'function') {
            STARSValidator.clearValidationErrors();
        } else {
            [
                'nama-error', 'mapel-umum-error', 'mapel-pilihan-error',
                'minat-error', 'karier-error', 'provinsi-error',
                'kota-error', 'strength-error', 'hobi-error'
            ].forEach(errId => {
                const el = document.getElementById(errId);
                if (el) el.classList.add('hidden');
            });
            document.querySelectorAll('.border-red-500').forEach(el => {
                el.classList.remove('border-red-500');
            });
        }

        // State evaluasi internal
        lastValidationResult = null;
        lastStrengthResult = null;
        lastConsistencyResult = null;
        lastConfidenceResult = null;
        delete predictionForm.dataset.bypassGate;

        // Bersihkan area tampilan hasil prediksi jika ada
        if (resultContainer) resultContainer.classList.add('hidden');
        if (resultLoading) resultLoading.classList.add('hidden');
        if (resultData) {
            resultData.classList.add('hidden');
            resultData.innerHTML = '';
        }

        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            if (submitBtn.dataset.originalHtml) {
                submitBtn.innerHTML = submitBtn.dataset.originalHtml;
            }
        }

        // g. Panggil closeResetModal()
        closeResetModal();

        // f. Panggil showStep(1) untuk mengembalikan tampilan visual ke Bagian 1 dan perbarui progress bar ke 25%
        showStep(1);

        // h. Lakukan smooth scroll ke bagian atas form
        const prediksiSection = document.getElementById('prediksi');
        if (prediksiSection) {
            prediksiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const resetWizardForm = softResetAssessment;

    if (resetWizardBtn) {
        resetWizardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openResetModal();
        });
    }

    if (cancelResetBtn) {
        cancelResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeResetModal();
        });
    }

    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            softResetAssessment();
        });
    }

    if (resetModal) {
        resetModal.addEventListener('click', (e) => {
            if (e.target === resetModal) closeResetModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resetModal && !resetModal.classList.contains('hidden')) {
            closeResetModal();
        }
    });

    // Helper to format output rendering dynamically (Matt Pocock Defensive Style)
    function renderPredictionResults(data) {
        if (!data) return;

        // 1. Jurusan Utama
        const resJurusan = document.getElementById('res-jurusan-utama');
        if (resJurusan) resJurusan.textContent = data.jurusan_utama || '-';
        
        // 2. Tingkat Kecocokan & Bintang
        const tk = data.tingkat_kecocokan || {};
        const resLabel = document.getElementById('res-tingkat-label');
        if (resLabel) resLabel.textContent = tk.label || '';
        const resBintang = document.getElementById('res-tingkat-bintang');
        if (resBintang) resBintang.textContent = tk.bintang || '';
        
        // Match percentage calculating (taking the main ranking percent)
        if (Array.isArray(data.ranking) && data.ranking.length > 0) {
            const primaryRank = data.ranking[0];
            const matchPct = (primaryRank.probabilitas * 100).toFixed(1) + '%';
            const progressBar = document.getElementById('res-progress-bar');
            if (progressBar) {
                progressBar.textContent = matchPct;
                if (tk.warna) progressBar.style.color = tk.warna;
            }
        }

        // 3. Alasan Rekomendasi
        const alasanContainer = document.getElementById('res-alasan-list');
        if (alasanContainer && Array.isArray(data.alasan)) {
            alasanContainer.innerHTML = '';
            data.alasan.forEach(alasan => {
                alasanContainer.innerHTML += `
                    <li class="flex items-start space-x-3 text-sm text-[var(--text-secondary)]">
                        <span class="text-green-500 mt-0.5"><i class="fas fa-check-circle"></i></span>
                        <span>${alasan}</span>
                    </li>
                `;
            });
        }

        // 4. Jurusan Alternatif (Top 3)
        const altContainer = document.getElementById('res-alternatif-cards');
        if (altContainer && Array.isArray(data.alternatif)) {
            altContainer.innerHTML = '';
            const rankTitles = ['Pilihan Ke-2', 'Pilihan Ke-3'];
            data.alternatif.forEach((alt, idx) => {
                const icons = ['fa-graduation-cap', 'fa-book-open', 'fa-award'];
                const rankTitle = rankTitles[idx] || `Pilihan Ke-${idx + 2}`;
                const tkAlt = alt.tingkat_kecocokan || {};
                altContainer.innerHTML += `
                    <div class="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] flex flex-col justify-between hover:border-[var(--accent-1)] transition-all">
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">${rankTitle}</span>
                                <span class="h-8 w-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)]">
                                    <i class="fas ${icons[idx+1] || 'fa-graduation-cap'} text-xs"></i>
                                </span>
                            </div>
                            <h4 class="text-base font-bold text-[var(--text-primary)] mb-2 leading-tight">${alt.jurusan}</h4>
                        </div>
                        <div class="mt-4 flex items-center space-x-2">
                            <span class="text-xs font-medium px-2 py-0.5 rounded" style="background-color: ${tkAlt.warna || '#4F46E5'}20; color: ${tkAlt.warna || '#4F46E5'}">${tkAlt.label || ''}</span>
                            <span class="text-[10px] text-[var(--text-muted)]">${tkAlt.bintang || ''}</span>
                        </div>
                    </div>
                `;
            });
        }

        // 5. Prospek Karier
        const karierContainer = document.getElementById('res-karier-badges');
        if (karierContainer && Array.isArray(data.prospek_karier)) {
            karierContainer.innerHTML = '';
            data.prospek_karier.forEach(job => {
                karierContainer.innerHTML += `
                    <span class="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-default">
                        <i class="fas fa-briefcase text-[10px] mr-1.5 text-[var(--text-muted)]"></i> ${job}
                    </span>
                `;
            });
        }

        // 6. Ranking Tabel Seluruh Jurusan (20 Jurusan)
        const rankingBody = document.getElementById('res-ranking-tbody');
        if (rankingBody && Array.isArray(data.ranking)) {
            rankingBody.innerHTML = '';
            data.ranking.forEach(row => {
                const rowPct = (row.probabilitas * 100).toFixed(1);
                const tkRow = row.tingkat_kecocokan || {};
                rankingBody.innerHTML += `
                    <tr class="border-b border-[var(--card-border)] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                        <td class="px-6 py-4 text-sm font-semibold text-[var(--text-muted)] text-center">${row.rank}</td>
                        <td class="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">${row.jurusan}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center justify-center min-w-[100px]">
                                <span class="text-sm font-mono font-bold" style="color: ${tkRow.warna || '#4F46E5'}">${rowPct}%</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <span class="text-xs font-medium px-2.5 py-0.5 rounded" style="background-color: ${tkRow.warna || '#4F46E5'}15; color: ${tkRow.warna || '#4F46E5'}">
                                ${tkRow.label || ''}
                            </span>
                        </td>
                    </tr>
                `;
            });
        }
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
                this.classList.remove('border-[var(--text-primary)]', 'border-red-500');
                input.value = ''; // clear when hidden
                input.classList.remove('border-red-500');
            }
            if (typeof checkMapelPilihanValidity === 'function') {
                checkMapelPilihanValidity();
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
            if (ekskulIntro) ekskulIntro.classList.add('hidden');
            if (ekskulForm) ekskulForm.classList.remove('hidden');
        });
    }
    if (btnTutupEkskul) {
        btnTutupEkskul.addEventListener('click', () => {
            if (ekskulForm) {
                ekskulForm.classList.add('hidden');
                ekskulForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            }
            if (ekskulIntro) ekskulIntro.classList.remove('hidden');
        });
    }

    // Prestasi Form Toggle
    const btnTambahPrestasi = document.getElementById('btn-tambah-prestasi');
    const btnTutupPrestasi = document.getElementById('btn-tutup-prestasi');
    const prestasiIntro = document.getElementById('prestasi-intro');
    const prestasiForm = document.getElementById('prestasi-form');

    if (btnTambahPrestasi) {
        btnTambahPrestasi.addEventListener('click', () => {
            if (prestasiIntro) prestasiIntro.classList.add('hidden');
            if (prestasiForm) prestasiForm.classList.remove('hidden');
        });
    }
    if (btnTutupPrestasi) {
        btnTutupPrestasi.addEventListener('click', () => {
            if (prestasiForm) {
                prestasiForm.classList.add('hidden');
                prestasiForm.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            }
            if (prestasiIntro) prestasiIntro.classList.remove('hidden');
        });
    }

    // ==========================================
    // Desktop Navbar Glassy Dock Indicator
    // ==========================================
    const desktopNavContainer = document.getElementById('desktop-nav-container');
    const navIndicator = document.getElementById('nav-indicator');
    
    if (desktopNavContainer && navIndicator) {
        const navLinks = desktopNavContainer.querySelectorAll('.stars-nav-link');
        let hideTimeout;
        let isHovered = false;
        
        const moveIndicator = (el) => {
            clearTimeout(hideTimeout);
            const containerRect = desktopNavContainer.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            
            // Calculate relative position within the container
            const left = elRect.left - containerRect.left;
            const width = elRect.width;
            
            if (!isHovered) {
                // Snap instantly to the first hovered item
                navIndicator.style.transition = 'none';
                navIndicator.style.transform = `translateX(${left}px)`;
                navIndicator.style.width = `${width}px`;
                
                // Force reflow
                void navIndicator.offsetWidth;
                
                // Restore CSS transition
                navIndicator.style.transition = '';
                navIndicator.style.opacity = '1';
                isHovered = true;
            } else {
                // Slide smoothly between items
                navIndicator.style.transform = `translateX(${left}px)`;
                navIndicator.style.width = `${width}px`;
                navIndicator.style.opacity = '1';
            }
        };
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                moveIndicator(this);
            });
        });
        
        desktopNavContainer.addEventListener('mouseleave', function(e) {
            // Ignore if moving within the container children
            if (e.relatedTarget && desktopNavContainer.contains(e.relatedTarget)) return;
            
            hideTimeout = setTimeout(() => {
                navIndicator.style.opacity = '0';
                isHovered = false;
            }, 100);
        });

        // Hide indicator if hovering over non-navigation elements inside the container (like Theme Toggle or CTA)
        const nonNavElements = desktopNavContainer.querySelectorAll('button, .stars-nav-cta');
        nonNavElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                hideTimeout = setTimeout(() => {
                    navIndicator.style.opacity = '0';
                    isHovered = false;
                }, 100);
            });
        });
    }
    
});
