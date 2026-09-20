<?php
// STARS Contact & Suggestion Page
require_once __DIR__ . '/includes/header.php';
?>

<!-- Ambient Background Glows -->
<div class="relative min-h-[70vh] flex items-center justify-center py-16 px-4 overflow-hidden">
    <!-- Ambient background light blobs for Light Mode -->
    <div class="light-blob blob-tl"></div>
    <div class="light-blob blob-tr"></div>
    <div class="light-blob blob-br"></div>

    <div class="glow-spot top-10 left-1/4"></div>
    <div class="glow-spot bottom-10 right-1/4"></div>

    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        <!-- Left Side: Information & Social placeholders -->
        <div class="lg:col-span-5 flex flex-col justify-center space-y-8" data-aos="fade-right">
            <div>
                <span class="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Hubungi Kami</span>
                <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mt-2 leading-tight">
                    Mari Berdiskusi dengan <span class="text-gradient-silver">STARS Team</span>
                </h1>
                <p class="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed">
                    Punya pertanyaan mengenai algoritma Decision Tree kami, ketepatan prediksi, saran pengembangan dataset, atau tertarik untuk mengintegrasikan model STARS pada sistem kampus Anda? Jangan ragu mengirimkan pesan.
                </p>
            </div>

            <!-- Social Card -->
            <div class="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--card-shadow)] space-y-6">
                <h3 class="text-base font-bold text-[var(--text-primary)]">Media Sosial Admin</h3>
                
                <div class="space-y-4">
                    <a href="https://www.instagram.com/mr_ivanzs?igsh=cm5iNTc0aHV5dG5v" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <span class="h-10 w-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            <i class="fab fa-instagram text-lg"></i>
                        </span>
                        <div>
                            <p class="text-xs text-[var(--text-muted)] font-medium">Instagram</p>
                            <p class="text-sm text-[var(--text-primary)] font-semibold">@mr_ivanzs</p>
                        </div>
                    </a>

                    <a href="https://github.com/ivanbowo20" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <span class="h-10 w-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            <i class="fab fa-github text-lg"></i>
                        </span>
                        <div>
                            <p class="text-xs text-[var(--text-muted)] font-medium">GitHub</p>
                            <p class="text-sm text-[var(--text-primary)] font-semibold">github.com/ivanbowo20</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Right Side: Contact Form -->
        <div class="lg:col-span-7" data-aos="fade-left">
            <div class="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--card-border)]">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-[var(--text-primary)]">Kirim Pesan & Saran</h2>
                    <p class="text-xs text-[var(--text-muted)] mt-1">Kami akan membalas pesan Anda sesegera mungkin.</p>
                </div>

                <!-- Alert Message Container -->
                <div id="contact-alert-container" class="hidden"></div>

                <form id="contact-form" class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label for="nama" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Nama Lengkap</label>
                            <input type="text" id="nama" name="nama" required placeholder="Masukkan nama Anda" 
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                        </div>
                        <div>
                            <label for="email" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Email Aktif</label>
                            <input type="email" id="email" name="email" required placeholder="example@email.com" 
                                class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                        </div>
                    </div>

                    <div>
                        <label for="kategori" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Kategori Pesan</label>
                        <select id="kategori" name="kategori" required
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-1)] transition-all appearance-none cursor-pointer">
                            <option value="" disabled selected>-- Pilih Kategori --</option>
                            <option value="Saran">💡 Saran</option>
                            <option value="Kritik">📝 Kritik</option>
                            <option value="Bug Report">🐛 Bug Report</option>
                            <option value="Pertanyaan">❓ Pertanyaan</option>
                        </select>
                    </div>

                    <div>
                        <label for="subjek" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Subjek Pesan</label>
                        <input type="text" id="subjek" name="subjek" required placeholder="Pertanyaan / Kritik / Saran STARS" 
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all">
                    </div>

                    <div>
                        <label for="pesan" class="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Isi Pesan</label>
                        <textarea id="pesan" name="pesan" rows="5" required placeholder="Tuliskan pesan Anda secara detail..." 
                            class="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--accent-1)] transition-all resize-none"></textarea>
                    </div>

                    <button type="submit" id="contact-submit-btn" 
                        class="w-full py-4 px-6 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <span>Kirim Pesan</span>
                        <i class="fas fa-paper-plane text-sm ml-1"></i>
                    </button>
                </form>
            </div>
        </div>

    </div>
</div>

<script src="assets/js/contact.js"></script>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
