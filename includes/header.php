<?php
// STARS Header Template
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/logo.php';

// Determine link paths dynamically
$current_page = basename($_SERVER['PHP_SELF']);
$is_home = ($current_page == 'index.php' || $current_page == '');

$home_link = $is_home ? '#home' : 'index.php#home';
$tentang_link = $is_home ? '#tentang' : 'index.php#tentang';
$prediksi_link = $is_home ? '#prediksi' : 'index.php#prediksi';
$kontak_active = ($current_page == 'kontak.php');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <script>
        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STARS - Student Talent And Recommendation System</title>
    
    <!-- Meta SEO -->
    <meta name="description" content="Temukan rekomendasi jurusan kuliah terbaik berdasarkan nilai, minat, hobi, dan prestasimu menggunakan kecerdasan buatan (Decision Tree Classifier) secara akurat dan realistis.">
    <meta name="keywords" content="rekomendasi jurusan, tes minat bakat, AI kuliah, decision tree, STARS, student talent, cPanel deploy">
    <meta name="author" content="STARS Team">
    
    <!-- Tailwind CSS & Flowbite CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        dark: {
                            950: '#030303',
                            900: '#09090b',
                            800: '#121214',
                            700: '#18181b',
                            600: '#27272a',
                            500: '#3f3f46',
                            400: '#a1a1aa'
                        },
                        silver: {
                            100: '#f4f4f5',
                            200: '#e4e4e7',
                            300: '#d4d4d8',
                            400: '#a1a1aa',
                            500: '#71717a'
                        }
                    }
                }
            }
        }
    </script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
    
    <!-- Animate On Scroll (AOS) -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col min-h-screen">

    <!-- Sticky Navbar -->
    <nav id="main-nav" class="fixed top-0 left-0 right-0 z-50 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] backdrop-blur-md transition-all duration-300">
        <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <!-- Logo -->
            <a href="<?php echo $is_home ? '#home' : 'index.php'; ?>" class="flex items-center space-x-3 group">
                <?php echo get_stars_logo("h-11 w-11 transition-transform group-hover:scale-105"); ?>
                <div class="flex flex-col">
                    <span class="text-xl font-extrabold tracking-widest text-[var(--text-primary)]">STARS</span>
                    <span class="text-[9px] text-[var(--text-muted)] tracking-wider font-semibold uppercase -mt-1 hidden sm:block">Student Talent & Rec. System</span>
                </div>
            </a>

            <!-- Desktop Links -->
            <div class="hidden lg:flex items-center space-x-8">
                <a href="<?php echo $home_link; ?>" class="text-sm font-medium tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Beranda</a>
                <a href="<?php echo $tentang_link; ?>" class="text-sm font-medium tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Tentang AI</a>
                <a href="<?php echo $prediksi_link; ?>" class="text-sm font-medium tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Prediksi Jurusan</a>
                
                <!-- Theme Toggle Button Desktop -->
                <button id="theme-toggle" type="button" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full p-2 text-sm transition-all focus:outline-none" aria-label="Toggle Theme">
                    <!-- Sun icon -->
                    <svg id="theme-toggle-light-icon" class="theme-toggle-light-icon w-5 h-5 transition-transform duration-300 hover:rotate-45" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-2.293 4a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM6.293 14.707a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-5.707a1 1 0 011.414 0L7 5.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 6a4 4 0 100 8 4 4 0 000-8z"></path>
                    </svg>
                    <!-- Moon icon -->
                    <svg id="theme-toggle-dark-icon" class="theme-toggle-dark-icon w-5 h-5 transition-transform duration-300 hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                </button>

                <a href="kontak.php" class="text-sm font-medium tracking-wide px-4 py-2 rounded-full border border-[var(--input-border)] bg-[var(--input-bg)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all <?php echo $kontak_active ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'; ?>">Kontak & Saran</a>
            </div>

            <!-- Mobile Toggle & Hamburger -->
            <div class="flex items-center space-x-2 lg:hidden">
                <!-- Theme Toggle Button Mobile -->
                <button id="theme-toggle-mobile" type="button" class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full p-2 text-sm transition-all focus:outline-none" aria-label="Toggle Theme">
                    <!-- Sun icon -->
                    <svg id="theme-toggle-light-icon-mobile" class="theme-toggle-light-icon w-5 h-5 transition-transform duration-300 hover:rotate-45" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-2.293 4a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM6.293 14.707a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-5.707a1 1 0 011.414 0L7 5.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 6a4 4 0 100 8 4 4 0 000-8z"></path>
                    </svg>
                    <!-- Moon icon -->
                    <svg id="theme-toggle-dark-icon-mobile" class="theme-toggle-dark-icon w-5 h-5 transition-transform duration-300 hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                </button>

                <button id="mobile-menu-btn" type="button" class="inline-flex flex-col items-center justify-center p-2 w-10 h-10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none relative transition-colors">
                    <span class="sr-only">Open main menu</span>
                    <span class="hamburger-line top-line w-5 h-[2px] bg-current rounded-full transition-transform duration-300 origin-center"></span>
                    <span class="hamburger-line middle-line w-5 h-[2px] bg-current rounded-full transition-opacity duration-300 mt-1.5"></span>
                    <span class="hamburger-line bottom-line w-5 h-[2px] bg-current rounded-full transition-transform duration-300 origin-center mt-1.5"></span>
                </button>
            </div>
        </div>

        <!-- Floating Mobile Menu -->
        <div id="mobile-menu-container" class="fixed inset-x-4 top-24 z-40 lg:hidden opacity-0 pointer-events-none transition-all duration-500 transform -translate-y-4">
            <div class="glass-card rounded-3xl border border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-xl shadow-2xl p-4 flex flex-col space-y-2">
                <a href="<?php echo $home_link; ?>" class="mobile-link opacity-0 translate-y-4 block px-4 py-3.5 rounded-xl text-base font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all">Beranda</a>
                <a href="<?php echo $tentang_link; ?>" class="mobile-link opacity-0 translate-y-4 block px-4 py-3.5 rounded-xl text-base font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all">Tentang AI</a>
                <a href="<?php echo $prediksi_link; ?>" class="mobile-link opacity-0 translate-y-4 block px-4 py-3.5 rounded-xl text-base font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all">Prediksi Jurusan</a>
                <a href="kontak.php" class="mobile-link opacity-0 translate-y-4 block px-4 py-3.5 mt-2 rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] text-base font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center <?php echo $kontak_active ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : ''; ?>">Kontak & Saran</a>
            </div>
        </div>
        <!-- Global Theme Toggle Script -->
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const themeToggleBtn = document.getElementById('theme-toggle');
                const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

                function toggleTheme() {
                    const isLight = document.documentElement.classList.contains('light');
                    if (isLight) {
                        document.documentElement.classList.remove('light');
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                        localStorage.setItem('theme', 'light');
                    }
                }

                if (themeToggleBtn) {
                    themeToggleBtn.addEventListener('click', toggleTheme);
                }
                if (themeToggleMobileBtn) {
                    themeToggleMobileBtn.addEventListener('click', toggleTheme);
                }

                // Mobile Menu Logic
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const mobileLinks = document.querySelectorAll('.mobile-link');

                if (mobileMenuBtn) {
                    mobileMenuBtn.addEventListener('click', () => {
                        document.body.classList.toggle('mobile-menu-open');
                    });
                }

                // Auto-close menu when link is clicked
                mobileLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        document.body.classList.remove('mobile-menu-open');
                    });
                });
            });
        </script>
    </nav>

    <!-- Main Content wrapper to push footer down -->
    <main class="flex-grow pt-20">
