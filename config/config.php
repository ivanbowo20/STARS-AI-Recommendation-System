<?php
// STARS Configuration File

// Python Backend API Config
define('PYTHON_API_URL', 'http://127.0.0.1:5000/api/prediksi');

// PHPMailer SMTP Config
define('SMTP_HOST', 'smtp.gmail.com');          // SMTP Host (e.g., smtp.gmail.com)
define('SMTP_PORT', 587);                       // SMTP Port (587 for TLS, 465 for SSL)
define('SMTP_AUTH', true);                      // Enable SMTP authentication
define('SMTP_SECURE', 'tls');                   // Encryption: 'tls' or 'ssl'
define('SMTP_USER', 'your_email@gmail.com');    // SMTP username (change in production)
define('SMTP_PASS', 'your_app_password');       // SMTP password/app password (change in production)
define('SMTP_FROM', 'stars.system.rekomendasi@gmail.com'); // From email
define('SMTP_FROM_NAME', 'STARS System');       // From name

// Contact Recipient Email
define('CONTACT_RECIPIENT_EMAIL', 'admin@example.com');
?>
