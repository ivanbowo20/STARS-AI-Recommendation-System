<?php
// STARS Main Landing Page
require_once __DIR__ . '/includes/header.php';
?>

<!-- ================================================================ -->
<!-- 1. HERO SECTION -->
<!-- ================================================================ -->
<section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden py-12 px-4 border-b border-[var(--footer-border)]">
    <!-- Live Video Background -->
    <div class="hero-video-wrapper">
        <!-- Video Dark Mode -->
        <video class="hero-video video-dark" autoplay loop muted playsinline disablePictureInPicture>
            <source src="image live/hero-dark.mp4" type="video/mp4">
        </video>
        
        <!-- Video Light Mode -->
        <video class="hero-video video-light" autoplay loop muted playsinline disablePictureInPicture>
            <source src="image live/hero-light.mp4" type="video/mp4">
        </video>

        <!-- Overlay Layer untuk Kontras Teks & Blur Edge Masking -->
        <div class="hero-video-overlay"></div>
    </div>

    <!-- Hero Content -->
    <div class="max-w-5xl mx-auto text-center relative z-10 space-y-8 mt-8">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] backdrop-blur-md mb-2" data-aos="fade-down" data-aos-duration="1000">
            <span class="h-2 w-2 rounded-full bg-[var(--text-primary)] animate-pulse"></span>
            <span class="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-widest">Decision Tree Classifier v6.0</span>
        </div>
        
        <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight" data-aos="fade-up" data-aos-duration="1000">
            <span class="text-gradient-silver">STARS</span> <br>
            <span class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide text-[var(--text-muted)] uppercase">Student Talent And Recommendation System</span>
        </h1>
        
        <p class="text-base md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
            Temukan rekomendasi jurusan kuliah yang paling sesuai dengan kemampuan akademik, minat bakat, hobi, serta prestasi akademik maupun non-akademikmu menggunakan algoritma Machine Learning yang presisi.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
            <a href="#prediksi" class="w-full sm:w-auto px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold rounded-full hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-2">
                <span>Mulai Prediksi</span>
                <i class="fas fa-sparkles text-sm ml-1"></i>
            </a>
            <a href="#tentang" class="w-full sm:w-auto px-8 py-4 border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold rounded-full transition-all flex items-center justify-center">
                <span>Pelajari AI</span>
            </a>
        </div>
    </div>
</section>


<!-- ================================================================ -->
<!-- 2. TENTANG AI SECTION -->
<!-- ================================================================ -->
<section id="tentang" class="relative py-24 bg-[var(--bg-secondary)] border-b border-[var(--footer-border)]">
    <div class="glow-spot top-1/2 right-10"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <!-- Description -->
            <div class="space-y-6" data-aos="fade-right">
                <span class="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Teknologi di Balik STARS</span>
                <h2 class="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-tight">
                    Rekomendasi Pintar dengan <br>
                    <span class="text-gradient-silver">Machine Learning Decision Tree</span>
                </h2>
                <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
                    STARS menggunakan algoritma **Decision Tree Classifier** untuk memetakan kepribadian, nilai, dan kompetensi siswa ke dalam kelompok jurusan kuliah yang paling ideal. Model dilatih menggunakan dataset komprehensif berisi riwayat minat dan prestasi dari ribuan profil pelajar.
                </p>
                <div class="space-y-4 pt-2">
                    <div class="flex items-start space-x-3">
                        <span class="h-6 w-6 rounded-md bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)]"><i class="fas fa-database text-xs"></i></span>
                        <div>
                            <h4 class="text-sm font-bold text-[var(--text-primary)]">Analisis Profil 10.000 Siswa</h4>
                            <p class="text-xs text-[var(--text-muted)] leading-relaxed">Model dioptimasi berdasarkan pola sebaran nilai dan kecenderungan hobi dari data riil lulusan.</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3">
                        <span class="h-6 w-6 rounded-md bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)]"><i class="fas fa-graduation-cap text-xs"></i></span>
                        <div>
                            <h4 class="text-sm font-bold text-[var(--text-primary)]">20 Pilihan Jurusan Kuliah Utama</h4>
                            <p class="text-xs text-[var(--text-muted)] leading-relaxed">Meliputi rumpun Sains & Teknologi, Bisnis & Ekonomi, Sosial Humaniora, Pendidikan, Seni, hingga Olahraga.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Counters -->
            <div class="grid grid-cols-2 gap-6" data-aos="fade-left">
                <!-- Data Siswa Card -->
                <div class="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] text-center flex flex-col justify-center min-h-[160px]">
                    <span class="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center justify-center">
                        <span class="stat-counter" data-target="10000">0</span>+
                    </span>
                    <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-2">Data Siswa</span>
                </div>
                
                <!-- Jurusan Card -->
                <div class="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] text-center flex flex-col justify-center min-h-[160px]">
                    <span class="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center justify-center">
                        <span class="stat-counter" data-target="20">0</span>
                    </span>
                    <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-2">Jurusan</span>
                </div>
                
                <!-- AI Model Card -->
                <div class="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] text-center flex flex-col justify-center min-h-[160px] col-span-2 sm:col-span-1">
                    <span class="text-sm font-bold text-[var(--text-primary)] flex items-center justify-center min-h-[40px]">
                        AI Decision Tree
                    </span>
                    <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-2">Engine Classifier</span>
                </div>
                
                <!-- Online Card -->
                <div class="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] text-center flex flex-col justify-center min-h-[160px] col-span-2 sm:col-span-1">
                    <span class="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center justify-center">
                        <span class="stat-counter" data-target="100">0</span>%
                    </span>
                    <span class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-2">Online</span>
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ================================================================ -->
<!-- 3. FORM PREDIKSI SECTION -->
<!-- ================================================================ -->
<section id="prediksi" class="relative py-24 px-4">
    <div class="glow-spot bottom-10 left-10"></div>
    
    <div class="max-w-4xl mx-auto relative z-10">
        <div class="text-center mb-16" data-aos="fade-up">
            <span class="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Mulai Asesmen</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-2">Formulir Rekomendasi Jurusan</h2>
            <p class="text-sm text-[var(--text-secondary)] mt-3 max-w-lg mx-auto">Isi data nilai akademik dan minat bakat Anda secara jujur untuk mendapatkan hasil klasifikasi optimal.</p>
        </div>

        <form id="prediction-form" class="space-y-6 glass-card p-6 sm:p-10 rounded-3xl border border-white/5 shadow-2xl" data-aos="fade-up">
            
            <!-- Stepper Header -->
            <div class="mb-10 border-b border-white/5 pb-8">
                <!-- Stepper Circles -->
                <div class="flex items-center justify-between relative mb-8 px-2 max-w-xl mx-auto">
                    <!-- Connecting Line Background -->
                    <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0"></div>
                    <!-- Active Connecting Line -->
                    <div id="active-line" class="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] -translate-y-1/2 z-0 transition-all duration-300" style="width: 0%"></div>
                    
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)] step-active" data-step="1">
                            <span class="step-num">1</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Akademik</span>
                    </div>
                    <!-- Step 2 -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)]" data-step="2">
                            <span class="step-num">2</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Minat</span>
                    </div>
                    <!-- Step 3 -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)]" data-step="3">
                            <span class="step-num">3</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Karakter</span>
                    </div>
                    <!-- Step 4 -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)]" data-step="4">
                            <span class="step-num">4</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Prestasi</span>
                    </div>
                    <!-- Step 5 (NEW: Lokasi) -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)]" data-step="5">
                            <span class="step-num">5</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Lokasi</span>
                    </div>
                    <!-- Step 6 -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)]" data-step="6">
                            <span class="step-num">6</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Tinjau</span>
                    </div>
                    <!-- Step 7 -->
                    <div class="flex flex-col items-center z-10">
                        <div class="step-circle border-2 border-zinc-200 dark:border-zinc-800 bg-[var(--bg-secondary)] text-[var(--text-secondary)]" data-step="7">
                            <span class="step-num">7</span>
                        </div>
                        <span class="text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-[var(--text-muted)] hidden sm:block">Hasil</span>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Progress Evaluasi</span>
                    <span class="text-xs font-mono text-zinc-400" id="step-indicator">Langkah 1 dari 7</span>
                </div>
                <!-- Progress Bar Container -->
                <div class="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div id="form-progress" class="h-2 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]" style="width: 16.66%; background: var(--accent-gradient);"></div>
                </div>
            </div>

            <!-- STEP 1: DATA AKADEMIK -->
            <div class="form-step active-step space-y-6" id="step-1">
                <div class="space-y-1 mb-4">
                    <h3 class="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
                        <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-graduation-cap"></i></span>
                        <span>Data & Nilai Akademik</span>
                    </h3>
                    <p class="text-xs text-[var(--text-muted)]">Masukkan nama lengkap dan rata-rata nilai rapor mata pelajaran pokok Anda.</p>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label for="nama" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Nama Lengkap</label>
                        <input type="text" id="nama" name="nama" required placeholder="Contoh: Ivan Rizky"
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <!-- Matematika -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label for="matematika" class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Matematika</label>
                                <input type="number" id="matematika" name="matematika" min="0" max="100" value="80" required
                                    class="w-16 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-center py-1 text-xs text-[var(--input-text)] font-mono focus:outline-none focus:border-[var(--accent-1)]">
                            </div>
                            <input type="range" id="matematika_slider" min="0" max="100" value="80" 
                                class="w-full h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer">
                        </div>

                        <!-- Bahasa Inggris -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label for="bahasa_inggris" class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Bahasa Inggris</label>
                                <input type="number" id="bahasa_inggris" name="bahasa_inggris" min="0" max="100" value="80" required
                                    class="w-16 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-center py-1 text-xs text-[var(--input-text)] font-mono focus:outline-none focus:border-[var(--accent-1)]">
                            </div>
                            <input type="range" id="bahasa_inggris_slider" min="0" max="100" value="80" 
                                class="w-full h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer">
                        </div>

                        <!-- IPA -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label for="ipa" class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">IPA</label>
                                <input type="number" id="ipa" name="ipa" min="0" max="100" value="75" required
                                    class="w-16 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-center py-1 text-xs text-[var(--input-text)] font-mono focus:outline-none focus:border-[var(--accent-1)]">
                            </div>
                            <input type="range" id="ipa_slider" min="0" max="100" value="75" 
                                class="w-full h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer">
                        </div>

                        <!-- IPS -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label for="ips" class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">IPS</label>
                                <input type="number" id="ips" name="ips" min="0" max="100" value="75" required
                                    class="w-16 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-center py-1 text-xs text-[var(--input-text)] font-mono focus:outline-none focus:border-[var(--accent-1)]">
                            </div>
                            <input type="range" id="ips_slider" min="0" max="100" value="75" 
                                class="w-full h-1 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <!-- Mata Pelajaran Favorit -->
                        <div>
                            <label for="mata_pelajaran_favorit" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Mata Pelajaran Favorit</label>
                            <select id="mata_pelajaran_favorit" name="mata_pelajaran_favorit" required
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                                <option value="" disabled selected>Pilih Mata Pelajaran</option>
                                <option value="Matematika">Matematika</option>
                                <option value="Fisika">Fisika</option>
                                <option value="Kimia">Kimia</option>
                                <option value="Biologi">Biologi</option>
                                <option value="Ekonomi">Ekonomi</option>
                                <option value="Informatika">Informatika</option>
                                <option value="Bahasa Inggris">Bahasa Inggris</option>
                                <option value="Geografi">Geografi</option>
                                <option value="Sejarah">Sejarah</option>
                                <option value="Sosiologi">Sosiologi</option>
                                <option value="Seni Budaya">Seni Budaya</option>
                                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                                <option value="PJOK">PJOK (Olahraga)</option>
                            </select>
                        </div>

                        <!-- Gaya Belajar -->
                        <div>
                            <label for="gaya_belajar" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Gaya Belajar</label>
                            <select id="gaya_belajar" name="gaya_belajar" required
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                                <option value="" disabled selected>Pilih Gaya Belajar</option>
                                <option value="Visual">Visual (Gambar/Grafis)</option>
                                <option value="Auditori">Auditori (Mendengar/Diskusi)</option>
                                <option value="Kinestetik">Kinestetik (Praktek/Gerak)</option>
                                <option value="Membaca/Menulis">Membaca / Menulis</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- STEP 2: MINAT & HOBI -->
            <div class="form-step hidden space-y-6" id="step-2">
                <div class="space-y-1 mb-4">
                    <h3 class="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
                        <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-heart"></i></span>
                        <span>Minat & Hobi</span>
                    </h3>
                    <p class="text-xs text-[var(--text-muted)]">Pilih bidang minat utama Anda beserta hobi yang paling mewakili keseharian.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Minat -->
                    <div>
                        <label for="minat" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Rumpun Minat Utama</label>
                        <select id="minat" name="minat" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Rumpun Minat</option>
                            <option value="Teknologi">Teknologi</option>
                            <option value="Bisnis">Bisnis</option>
                            <option value="Seni">Seni</option>
                            <option value="Pendidikan">Pendidikan</option>
                            <option value="Olahraga">Olahraga</option>
                            <option value="Sosial">Sosial</option>
                            <option value="Teknik">Teknik</option>
                            <option value="Kesehatan">Kesehatan</option>
                            <option value="Sains">Sains</option>
                            <option value="Psikologi">Psikologi</option>
                            <option value="Lingkungan">Lingkungan</option>
                        </select>
                    </div>

                    <!-- Searchable Hobi Dropdown -->
                    <div class="relative">
                        <label class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Pilih Hobi Utama</label>
                        <button type="button" id="hobi-dropdown-btn"
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-left text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all flex items-center justify-between">
                            <span class="text-[var(--input-placeholder)]">Pilih Hobi</span>
                            <i class="fas fa-chevron-down text-xs text-[var(--input-placeholder)]"></i>
                        </button>
                        
                        <!-- Hidden input to submit with the form -->
                        <input type="hidden" id="hobi-hidden" name="hobi" required>

                        <!-- Expandable searchable dropdown list -->
                        <div id="hobi-dropdown-list" class="hidden absolute left-0 right-0 mt-2 p-2 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl shadow-[var(--card-shadow)] z-20">
                            <input type="text" id="hobi-search-input" placeholder="Cari hobi..." 
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-xs text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] mb-2">
                            <div class="searchable-dropdown-list space-y-1 max-h-48 overflow-y-auto">
                                <?php
                                $hobi_list = [
                                    "Coding", "Membaca", "Menggambar", "Taekwondo", "Sepak Bola",
                                    "Musik", "Menulis", "Berjualan", "Robotika", "Web Development",
                                    "UI/UX Design", "Mobile Development", "Video Editing", "Public Speaking",
                                    "Content Creator", "Esport", "Atletik", "Basket", "Renang",
                                    "Fotografi", "Desain Grafis", "Game Development", "Merakit Elektronik",
                                    "Penelitian", "Volunteering", "PMR", "Pramuka", "Debat", "Investasi", "Olahraga"
                                ];
                                foreach($hobi_list as $h):
                                ?>
                                <button type="button" data-value="<?php echo $h; ?>" 
                                    class="hobi-option w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                    <?php echo $h; ?>
                                </button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Minat Spesifik -->
                    <div>
                        <label for="minat_spesifik" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Minat Spesifik <span class="text-[10px] text-[var(--text-muted)] font-medium">(Opsional)</span></label>
                        <input type="text" id="minat_spesifik" name="minat_spesifik" placeholder="Contoh: AI, Cyber Security, Dokter Anak"
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                    </div>

                    <!-- Hobi Tambahan -->
                    <div>
                        <label for="hobi_tambahan" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Hobi Tambahan <span class="text-[10px] text-[var(--text-muted)] font-medium">(Opsional)</span></label>
                        <input type="text" id="hobi_tambahan" name="hobi_tambahan" placeholder="Contoh: Menonton film, Hiking, Memasak"
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                    </div>
                </div>
            </div>

            <!-- STEP 3: KEMAMPUAN & KARAKTER -->
            <div class="form-step hidden space-y-6" id="step-3">
                <div class="space-y-1 mb-4">
                    <h3 class="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
                        <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-brain"></i></span>
                        <span>Kemampuan & Karakter</span>
                    </h3>
                    <p class="text-xs text-[var(--text-muted)]">Evaluasi tingkat kecakapan diri Anda untuk beberapa keahlian penting berikut.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Kemampuan Komputer -->
                    <div>
                        <label for="kemampuan_komputer" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kemampuan Komputer</label>
                        <select id="kemampuan_komputer" name="kemampuan_komputer" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Tingkat</option>
                            <option value="Rendah">Rendah (Dasar/Mengetik)</option>
                            <option value="Sedang">Sedang (Office/Desain Dasar)</option>
                            <option value="Tinggi">Tinggi (Coding/Hardware/Analisis)</option>
                        </select>
                    </div>

                    <!-- Kemampuan Komunikasi -->
                    <div>
                        <label for="kemampuan_komunikasi" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kemampuan Komunikasi</label>
                        <select id="kemampuan_komunikasi" name="kemampuan_komunikasi" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Tingkat</option>
                            <option value="Rendah">Rendah (Tertutup/Pendengar)</option>
                            <option value="Sedang">Sedang (Rata-rata/Interaksi Biasa)</option>
                            <option value="Tinggi">Tinggi (Negosiasi/Public Speaking)</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Kemampuan Kepemimpinan -->
                    <div>
                        <label for="kemampuan_kepemimpinan" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kemampuan Kepemimpinan</label>
                        <select id="kemampuan_kepemimpinan" name="kemampuan_kepemimpinan" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Tingkat</option>
                            <option value="Rendah">Rendah (Kurang Aktif Memimpin)</option>
                            <option value="Sedang" selected>Sedang (Aktif dalam Kelompok)</option>
                            <option value="Tinggi">Tinggi (Sering Menjadi Pemimpin)</option>
                        </select>
                    </div>

                    <!-- Kemampuan Analisis -->
                    <div>
                        <label for="kemampuan_analisis" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kemampuan Analisis</label>
                        <select id="kemampuan_analisis" name="kemampuan_analisis" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Tingkat</option>
                            <option value="Rendah">Rendah (Berpikir Berdasarkan Fakta Sederhana)</option>
                            <option value="Sedang">Sedang (Mampu Menganalisis Hubungan Sebab-Akibat)</option>
                            <option value="Tinggi">Tinggi (Kritis, Menyukai Data & Logika Matematika)</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Kemampuan Kreativitas -->
                    <div>
                        <label for="kemampuan_kreativitas" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kemampuan Kreativitas</label>
                        <select id="kemampuan_kreativitas" name="kemampuan_kreativitas" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Tingkat</option>
                            <option value="Rendah">Rendah (Lebih Suka Mengikuti Metode yang Sudah Ada)</option>
                            <option value="Sedang">Sedang (Dapat Memodifikasi Ide & Membuat Variasi Baru)</option>
                            <option value="Tinggi">Tinggi (Suka Berimajinasi & Menemukan Solusi Out-of-the-box)</option>
                        </select>
                    </div>

                    <!-- Kemampuan Problem Solving -->
                    <div>
                        <label for="kemampuan_problem_solving" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kemampuan Problem Solving</label>
                        <select id="kemampuan_problem_solving" name="kemampuan_problem_solving" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Tingkat</option>
                            <option value="Rendah">Rendah (Cenderung Menunggu Bantuan Saat Menghadapi Masalah)</option>
                            <option value="Sedang">Sedang (Mampu Mengatasi Masalah yang Bersifat Terstruktur)</option>
                            <option value="Tinggi">Tinggi (Solutif & Mandiri dalam Mengurai Masalah Rumit)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- STEP 4: ORGANISASI & PRESTASI -->
            <div class="form-step hidden space-y-6" id="step-4">
                <div class="space-y-1 mb-4">
                    <h3 class="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
                        <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-users"></i></span>
                        <span>Organisasi, Karier & Prestasi</span>
                    </h3>
                    <p class="text-xs text-[var(--text-muted)]">Pilih riwayat organisasi sekolah/komunitas, tujuan karier impian, serta sertifikat prestasi Anda.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Aktivitas Organisasi -->
                    <div>
                        <label for="aktivitas_organisasi" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Aktivitas Organisasi</label>
                        <select id="aktivitas_organisasi" name="aktivitas_organisasi" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Keaktifan Organisasi</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                            <option value="OSIS">OSIS</option>
                            <option value="MPK">MPK</option>
                            <option value="BEM">BEM</option>
                            <option value="Pramuka">Pramuka</option>
                            <option value="PMR">PMR</option>
                            <option value="Paskibra">Paskibra</option>
                            <option value="Komunitas IT">Komunitas IT</option>
                            <option value="Komunitas Seni">Komunitas Seni</option>
                            <option value="Komunitas Olahraga">Komunitas Olahraga</option>
                            <option value="Karang Taruna">Karang Taruna</option>
                            <option value="Organisasi Keagamaan">Organisasi Keagamaan</option>
                            <option value="Volunteering">Volunteering (Relawan)</option>
                        </select>
                    </div>

                    <!-- Tujuan Karier -->
                    <div>
                        <label for="tujuan_karier" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Tujuan Karier</label>
                        <select id="tujuan_karier" name="tujuan_karier" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                            <option value="" disabled selected>Pilih Sasaran Karier</option>
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="Dokter">Dokter</option>
                            <option value="Psikolog">Psikolog</option>
                            <option value="Arsitek">Arsitek</option>
                            <option value="Akuntan">Akuntan</option>
                            <option value="Pengacara">Pengacara</option>
                            <option value="Guru">Guru</option>
                            <option value="Dosen">Dosen</option>
                            <option value="Entrepreneur">Entrepreneur (Pengusaha)</option>
                            <option value="Business Analyst">Business Analyst</option>
                            <option value="UI UX Designer">UI UX Designer</option>
                            <option value="Content Creator">Content Creator</option>
                            <option value="Apoteker">Apoteker</option>
                            <option value="Insinyur Sipil">Insinyur Sipil</option>
                            <option value="Insinyur Mesin">Insinyur Mesin</option>
                            <option value="Konsultan Lingkungan">Konsultan Lingkungan</option>
                            <option value="Manajer">Manajer</option>
                            <option value="Pelatih Olahraga">Pelatih Olahraga</option>
                            <option value="Network Engineer">Network Engineer</option>
                        </select>
                    </div>
                </div>

                <!-- Prestasi Akademik -->
                <div class="p-5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--card-border)] space-y-4">
                    <span class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Prestasi Akademik</span>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="prestasi_akademik_tingkat" class="block text-xs font-medium text-[var(--text-secondary)] mb-2">Tingkat Prestasi</label>
                            <select id="prestasi_akademik_tingkat" name="prestasi_akademik_tingkat" required
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                                <option value="Tidak Ada" selected>Tidak Ada</option>
                                <option value="Sekolah">Sekolah</option>
                                <option value="Kecamatan">Kecamatan</option>
                                <option value="Kabupaten">Kabupaten</option>
                                <option value="Provinsi">Provinsi</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">Internasional</option>
                            </select>
                        </div>
                        <div id="prestasi_akademik_bidang_container" class="hidden">
                            <label for="prestasi_akademik_bidang" class="block text-xs font-medium text-[var(--text-secondary)] mb-2">Bidang Prestasi</label>
                            <select id="prestasi_akademik_bidang" name="prestasi_akademik_bidang"
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                                <option value="Matematika" selected>Matematika</option>
                                <option value="Fisika">Fisika</option>
                                <option value="Kimia">Kimia</option>
                                <option value="Biologi">Biologi</option>
                                <option value="Informatika">Informatika</option>
                                <option value="Debat">Debat</option>
                                <option value="Bahasa Inggris">Bahasa Inggris</option>
                                <option value="Sains">Sains / IPA</option>
                                <option value="Ekonomi">Ekonomi / IPS</option>
                                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Prestasi Non-Akademik -->
                <div class="p-5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--card-border)] space-y-4">
                    <span class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Prestasi Non-Akademik</span>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="prestasi_non_akademik_tingkat" class="block text-xs font-medium text-[var(--text-secondary)] mb-2">Tingkat Prestasi</label>
                            <select id="prestasi_non_akademik_tingkat" name="prestasi_non_akademik_tingkat" required
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                                <option value="Tidak Ada" selected>Tidak Ada</option>
                                <option value="Sekolah">Sekolah</option>
                                <option value="Kecamatan">Kecamatan</option>
                                <option value="Kabupaten">Kabupaten</option>
                                <option value="Provinsi">Provinsi</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">Internasional</option>
                            </select>
                        </div>
                        <div id="prestasi_non_akademik_bidang_container" class="hidden">
                            <label for="prestasi_non_akademik_bidang" class="block text-xs font-medium text-[var(--text-secondary)] mb-2">Bidang Prestasi</label>
                            <select id="prestasi_non_akademik_bidang" name="prestasi_non_akademik_bidang"
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                                <option value="Olahraga" selected>Olahraga</option>
                                <option value="Seni">Seni</option>
                                <option value="Organisasi">Organisasi</option>
                                <option value="Kepemimpinan">Kepemimpinan</option>
                                <option value="PMR">PMR</option>
                                <option value="Pramuka">Pramuka</option>
                                <option value="Paskibra">Paskibra</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- STEP 5 (NEW): LOKASI SISWA -->
            <div class="form-step hidden space-y-6" id="step-5">
                <div class="space-y-1 mb-4">
                    <h3 class="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
                        <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-map-marker-alt"></i></span>
                        <span>Lokasi Kamu</span>
                    </h3>
                    <p class="text-xs text-[var(--text-muted)]">Informasi lokasi digunakan untuk merekomendasikan kampus terdekat yang paling sesuai dengan profilmu.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <!-- Provinsi -->
                    <div class="space-y-2">
                        <label for="provinsi" class="block text-sm font-semibold text-[var(--text-secondary)]">Provinsi <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <select id="provinsi" name="provinsi" required
                                class="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-all appearance-none pr-10">
                                <option value="">-- Pilih Provinsi --</option>
                            </select>
                            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] pointer-events-none"></i>
                        </div>
                    </div>

                    <!-- Kota/Kabupaten -->
                    <div class="space-y-2">
                        <label for="kota" class="block text-sm font-semibold text-[var(--text-secondary)]">Kota / Kabupaten <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <select id="kota" name="kota" required
                                class="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-all appearance-none pr-10">
                                <option value="">-- Pilih Provinsi Terlebih Dahulu --</option>
                            </select>
                            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] pointer-events-none"></i>
                        </div>
                    </div>
                </div>

                <!-- Info Card -->
                <div class="rounded-2xl border border-[var(--card-border)] p-4 flex items-start gap-3" style="background:var(--bg-tertiary);">
                    <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-blue-400" style="background:rgba(59,130,246,0.1);">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <p class="text-xs" style="color:var(--text-secondary);">
                        Sistem akan menggunakan data lokasi ini untuk menghitung <strong>Campus Match Score</strong> dan merekomendasikan universitas yang paling dekat dan sesuai dengan minat serta karier kamu.
                    </p>
                </div>
            </div>

            <!-- STEP 6: REVIEW DATA (was step 5) -->
            <div class="form-step hidden space-y-6" id="step-6">
                <div class="space-y-1 mb-4">
                    <h3 class="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
                        <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-clipboard-check"></i></span>
                        <span>Tinjau Profil Evaluasi Anda</span>
                    </h3>
                    <p class="text-xs text-[var(--text-muted)]">Tinjau kembali data di bawah ini sebelum menyerahkan form kepada model rekomendasi.</p>
                </div>
                
                <div id="review-content" class="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--card-border)] p-4 sm:p-6 max-h-[350px] overflow-y-auto space-y-4 divide-y divide-[var(--card-border)] text-sm text-[var(--text-secondary)]">
                    <!-- Populated by JavaScript -->
                </div>
            </div>

            <!-- STEP 7: SUBMIT PREDICTION (was step 6) -->
            <div class="form-step hidden text-center space-y-6 py-6" id="step-7">
                <div class="space-y-3">
                    <div class="w-16 h-16 mx-auto rounded-full bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-primary)] text-2xl animate-pulse">
                        <i class="fas fa-sparkles"></i>
                    </div>
                    <h3 class="text-xl font-extrabold text-[var(--text-primary)]">Asesmen Siap Dijalankan</h3>
                    <p class="text-xs text-[var(--text-secondary)] max-w-md mx-auto">Kami akan memproses data Anda menggunakan model Decision Tree STARS v6.0 yang dioptimasi dengan profil 10.000 siswa dan 20 program studi.</p>
                </div>

                <!-- V5: Student Profile Analysis — Unified Intelligence Dashboard -->
                <div id="student-profile-analysis-dashboard" class="hidden text-left mt-4"></div>

                <!-- Submit Button (shown/hidden by validation) -->
                <div id="validation-submit-wrapper">
                    <button type="submit" id="submit-prediction-btn"
                        class="w-full py-4 px-6 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <span>Mulai Hitung Rekomendasi</span>
                        <i class="fas fa-magic text-sm ml-1 animate-pulse"></i>
                    </button>
                </div>

                <!-- Blocked message (shown when INVALID) -->
                <div id="validation-blocked-msg" class="hidden">
                    <button type="button" id="fix-input-btn"
                        class="w-full py-4 px-6 rounded-xl border-2 border-red-500/30 bg-red-500/5 text-red-500 font-bold transition-all flex items-center justify-center space-x-2">
                        <i class="fas fa-arrow-left text-sm mr-2"></i>
                        <span>Perbaiki Data Input</span>
                    </button>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center pt-6 border-t border-[var(--card-border)] mt-6">
                <button type="button" id="prev-step-btn" class="hidden px-5 py-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs font-semibold rounded-xl transition-all">
                    <i class="fas fa-arrow-left mr-2"></i> Sebelumnya
                </button>
                <div class="flex-grow"></div>
                <button type="button" id="next-step-btn" class="px-5 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-bold rounded-xl transition-all">
                    Berikutnya <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>

        </form>
    </div>
</section>


<!-- ================================================================ -->
<!-- 4. HASIL PREDIKSI CONTAINER -->
<!-- ================================================================ -->
<section id="hasil-rekomendasi" class="relative bg-[var(--bg-secondary)]">
    <div id="result-container" class="hidden max-w-5xl mx-auto py-20 px-4">
        
        <!-- Case A: Loading Skeleton -->
        <div id="result-loading" class="hidden space-y-8">
            <div class="h-6 w-48 skeleton rounded mb-4"></div>
            <div class="p-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] space-y-6">
                <div class="h-8 w-1/3 skeleton rounded"></div>
                <div class="h-4 w-1/4 skeleton rounded"></div>
                <div class="h-4 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div class="h-4 skeleton rounded" style="width: 35%"></div>
                </div>
                <div class="space-y-3 pt-4 border-t border-[var(--card-border)]">
                    <div class="h-4 w-5/6 skeleton rounded"></div>
                    <div class="h-4 w-4/6 skeleton rounded"></div>
                    <div class="h-4 w-3/6 skeleton rounded"></div>
                </div>
            </div>
        </div>

        <!-- Case B: Loaded AI Results -->
        <div id="result-data" class="hidden space-y-12">
            
            <!-- Result Main Card -->
            <div class="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--card-border)] shadow-2xl relative overflow-hidden">
                <div class="glow-spot -top-20 -right-20"></div>
                
                <span class="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] block mb-2">Jurusan Rekomendasi Utama</span>
                <h2 id="res-jurusan-utama" class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient-silver mb-6">Teknik Informatika</h2>
                
                <!-- Match Level Progress Bar -->
                <div class="space-y-3 mb-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2 text-sm font-semibold">
                            <span class="text-[var(--text-secondary)]">Kecocokan:</span>
                            <span id="res-tingkat-label" class="text-[var(--text-primary)]">Sangat Tinggi</span>
                        </div>
                        <span id="res-tingkat-bintang" class="text-sm">⭐⭐⭐⭐⭐</span>
                    </div>
                    <div class="w-full bg-[var(--bg-tertiary)] rounded-full h-5 overflow-hidden">
                        <div id="res-progress-bar" class="h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-end px-3 transition-all duration-1000 animated-progress" style="width: 0%">0%</div>
                    </div>
                </div>

                <!-- Explanation / Reason List -->
                <div class="border-t border-[var(--card-border)] pt-8 space-y-4">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Mengapa Jurusan Ini Sesuai Untuk Anda?</h3>
                    <ul id="res-alasan-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Filled by JS -->
                    </ul>
                </div>
            </div>

            <!-- Alternative Majors (Top 3) -->
            <div class="space-y-6">
                <h3 class="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center space-x-2">
                    <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-exchange-alt"></i></span>
                    <span>Rekomendasi Alternatif</span>
                </h3>
                <div id="res-alternatif-cards" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <!-- Dynamic rendering -->
                </div>
            </div>

            <!-- Career Prospects -->
            <div class="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--card-border)] space-y-6">
                <h3 class="text-base font-bold text-[var(--text-primary)] tracking-tight flex items-center space-x-2">
                    <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-briefcase"></i></span>
                    <span>Prospek Karier Terkait</span>
                </h3>
                <div id="res-karier-badges" class="flex flex-wrap gap-3">
                    <!-- Dynamic rendering -->
                </div>
            </div>

            <!-- V4.5: Campus Recommendation Section -->
            <div id="campus-recommendation-section" class="hidden space-y-6">
                <div id="campus-section-header"></div>
                <div id="campus-top3"></div>

                <!-- Toggle Top 10 Table -->
                <div class="text-center">
                    <button type="button" id="campus-table-toggle"
                        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all"
                        style="border-color:var(--card-border); color:var(--text-secondary); background:var(--bg-secondary);">
                        <span>Lihat 10 Kampus Terbaik</span>
                        <i class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                    </button>
                </div>
                <div id="campus-table" class="hidden"></div>
            </div>

            <!-- All Majors Ranking Table -->
            <div class="space-y-6">
                <h3 class="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center space-x-2">
                    <span class="h-6 w-6 rounded bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] text-xs"><i class="fas fa-list-ol"></i></span>
                    <span>Peringkat Kecocokan Seluruh Jurusan</span>
                </h3>
                
                <div class="glass-card rounded-3xl border border-[var(--card-border)] overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-[var(--card-border)] bg-[var(--bg-secondary)]">
                                    <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center w-16">Peringkat</th>
                                    <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Jurusan</th>
                                    <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Indeks Kecocokan</th>
                                    <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right w-32">Kategori</th>
                                </tr>
                            </thead>
                            <tbody id="res-ranking-tbody">
                                <!-- Filled by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- ================================================================ -->
<!-- V5.1: HYBRID RELIABILITY GATE MODALS                           -->
<!-- ================================================================ -->

<!-- Warning Modal (Reliability 30-49) -->
<div id="reliability-warning-modal"
     class="hidden fixed inset-0 z-[9999] flex items-center justify-center px-4"
     style="background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);">
    <div class="relative w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl"
         style="background:var(--bg-secondary); border-color:#f59e0b40;">
        <!-- Glow top -->
        <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-32 rounded-full pointer-events-none"
             style="background:radial-gradient(circle,#f59e0b25 0%,transparent 70%); filter:blur(30px);"></div>
        <div class="p-7 relative z-10">
            <!-- Icon -->
            <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                     style="background:linear-gradient(135deg,#f59e0bcc,#f59e0b);">
                    <i class="fas fa-triangle-exclamation text-white"></i>
                </div>
            </div>
            <!-- Title -->
            <h3 class="text-base font-extrabold text-center mb-2" style="color:var(--text-primary);">Peringatan Kualitas Profil</h3>
            <p class="text-xs text-center leading-relaxed mb-6" style="color:var(--text-secondary);">
                Tingkat keandalan profil Anda cukup rendah. Hasil rekomendasi mungkin kurang akurat.<br>
                Anda masih dapat melanjutkan prediksi atau memeriksa kembali data terlebih dahulu.
            </p>
            <!-- Buttons -->
            <div class="flex flex-col gap-3">
                <button id="modal-review-btn" type="button"
                    class="w-full py-3 px-5 rounded-xl font-bold text-sm transition-all border"
                    style="border-color:#f59e0b50; color:#f59e0b; background:#f59e0b10;">
                    <i class="fas fa-arrow-left mr-2"></i>Periksa Ulang Data
                </button>
                <button id="modal-proceed-btn" type="button"
                    class="w-full py-3 px-5 rounded-xl font-bold text-sm text-white transition-all shadow-md"
                    style="background:linear-gradient(135deg,#f59e0bcc,#f59e0b);">
                    Lanjutkan Prediksi<i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Blocked Modal (Reliability < 30) -->
<div id="reliability-blocked-modal"
     class="hidden fixed inset-0 z-[9999] flex items-center justify-center px-4"
     style="background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);">
    <div class="relative w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl"
         style="background:var(--bg-secondary); border-color:#ef444440;">
        <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-32 rounded-full pointer-events-none"
             style="background:radial-gradient(circle,#ef444425 0%,transparent 70%); filter:blur(30px);"></div>
        <div class="p-7 relative z-10">
            <!-- Icon -->
            <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                     style="background:linear-gradient(135deg,#ef4444cc,#ef4444);">
                    <i class="fas fa-ban text-white"></i>
                </div>
            </div>
            <!-- Title -->
            <h3 class="text-base font-extrabold text-center mb-2" style="color:var(--text-primary);">Profil Terlalu Tidak Konsisten</h3>
            <p class="text-xs text-center leading-relaxed mb-6" style="color:var(--text-secondary);">
                Sistem menemukan terlalu banyak ketidaksesuaian pada data yang Anda masukkan.<br>
                Prediksi tidak dapat dijalankan karena hasil yang dihasilkan tidak akan akurat.
            </p>
            <!-- Button -->
            <button id="modal-back-btn" type="button"
                class="w-full py-3 px-5 rounded-xl font-bold text-sm text-white transition-all shadow-md"
                style="background:linear-gradient(135deg,#ef4444cc,#ef4444);">
                <i class="fas fa-arrow-left mr-2"></i>Kembali Perbaiki Data
            </button>
        </div>
    </div>
</div>

<!-- Include App Logic scripts -->
<script src="assets/js/validation.js"></script>
<script src="assets/js/location_data.js"></script>
<script src="assets/js/campus.js"></script>
<script src="assets/js/main.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
