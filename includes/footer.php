    </main>

     <!-- Footer Section -->
    <footer class="bg-[var(--footer-bg)] border-t border-[var(--footer-border)] py-12 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Branding column -->
                <div class="flex flex-col space-y-4">
                    <div class="flex items-center space-x-3">
                        <?php echo get_stars_logo("h-9 w-9"); ?>
                        <span class="text-lg font-bold tracking-widest text-[var(--text-primary)]">STARS</span>
                    </div>
                    <p class="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
                        Student Talent And Recommendation System. Platform berbasis AI untuk merekomendasikan jurusan kuliah secara akurat, objektif, dan terpercaya.
                    </p>
                </div>
                
                <!-- Quick links -->
                <div class="flex flex-col space-y-4">
                    <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Navigasi</span>
                    <ul class="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li><a href="<?php echo $home_link; ?>" class="hover:text-[var(--text-primary)] transition-colors">Beranda</a></li>
                        <li><a href="<?php echo $tentang_link; ?>" class="hover:text-[var(--text-primary)] transition-colors">Tentang AI</a></li>
                        <li><a href="<?php echo $prediksi_link; ?>" class="hover:text-[var(--text-primary)] transition-colors">Prediksi Jurusan</a></li>
                        <li><a href="kontak.php" class="hover:text-[var(--text-primary)] transition-colors">Kontak & Saran</a></li>
                    </ul>
                </div>
                
                <!-- Contact info & social links -->
                <div class="flex flex-col space-y-4">
                    <span class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Sosial Media</span>
                    <div class="flex space-x-3">

                        <!-- TikTok — Ivan -->
                        <a href="https://www.tiktok.com/@3tripower" target="_blank" rel="noopener noreferrer"
                           title="TikTok Ivan (@3tripower)"
                           class="group h-10 w-10 rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-transparent hover:bg-[#010101] transition-all"
                           aria-label="TikTok Ivan">
                            <i class="fab fa-tiktok text-base transition-colors"></i>
                        </a>

                        <!-- Instagram — Ivan -->
                        <a href="https://www.instagram.com/mr_ivanzs?igsh=cm5iNTc0aHV5dG5v" target="_blank" rel="noopener noreferrer"
                           title="Instagram Ivan (@mr_ivanzs)"
                           class="group h-10 w-10 rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-transparent transition-all"
                           style="--hover-bg: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);"
                           onmouseover="this.style.background='linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'"
                           onmouseout="this.style.background=''"
                           aria-label="Instagram Ivan">
                            <i class="fab fa-instagram text-lg transition-colors"></i>
                        </a>

                        <!-- Facebook — Anggun -->
                        <a href="https://www.facebook.com/profile.php?id=100034393385110" target="_blank" rel="noopener noreferrer"
                           title="Facebook Anggun"
                           class="group h-10 w-10 rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[#1877F2] hover:border-transparent transition-all"
                           aria-label="Facebook Anggun">
                            <i class="fab fa-facebook-f text-base transition-colors"></i>
                        </a>

                    </div>

                    <!-- Credit labels -->
                    <div class="space-y-1">
                        <p class="text-[10px] text-[var(--text-muted)]">
                            <i class="fab fa-tiktok mr-1"></i><i class="fab fa-instagram mr-1"></i> Ivan &nbsp;·&nbsp;
                            <i class="fab fa-facebook-f mr-1"></i> Anggun
                        </p>
                        <p class="text-xs text-[var(--text-muted)]">
                            Pertanyaan? Hubungi admin di <br>
                            <a href="mailto:ivanrizky8808@gmail.com" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">ivanrizky8808@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-[var(--footer-border)] my-8"></div>

            <!-- Bottom footer -->
            <div class="flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] space-y-4 sm:space-y-0 w-full pt-4 border-t border-[var(--footer-border)]">
                <div class="flex flex-col space-y-1 text-center sm:text-left">
                    <span>© 2026 STARS</span>
                    <span>Student Talent and Recommendation System</span>
                </div>
                <div class="text-center sm:text-right font-medium">
                    <span>Powered by Decision Tree AI</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Flowbite JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
    
    <!-- Animate On Scroll (AOS) JS -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    
    <!-- Custom scripts -->
    <script>
        // Initialize AOS
        document.addEventListener('DOMContentLoaded', function() {
            AOS.init({
                duration: 800,
                once: true,
                easing: 'ease-out',
                offset: 50
            });
        });
    </script>
</body>
</html>
