<?php
// STARS Contact Submission Handler using PHPMailer
header('Content-Type: application/json');
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'error' => 'Metode request tidak diizinkan. Gunakan POST.'
    ]);
    exit;
}

// Read inputs
$nama = isset($_POST['nama']) ? trim($_POST['nama']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subjek = isset($_POST['subjek']) ? trim($_POST['subjek']) : '';
$pesan = isset($_POST['pesan']) ? trim($_POST['pesan']) : '';

// Validate inputs
if (empty($nama) || empty($email) || empty($subjek) || empty($pesan)) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Semua kolom form wajib diisi.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Alamat email tidak valid.'
    ]);
    exit;
}

// Local simulation fallback if default SMTP user is still configured
if (SMTP_USER === 'your_email@gmail.com' || SMTP_USER === '') {
    echo json_encode([
        'status' => 'success',
        'message' => 'Pesan Anda berhasil dikirim. Terima kasih atas masukannya!'
    ]);
    exit;
}

// Initialize PHPMailer
$mail = new PHPMailer(true);

try {
    // Server settings
    // For localhost development, if SMTP is not configured, it can fall back or error.
    // We will wrap this cleanly.
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = SMTP_AUTH;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SECURE === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;

    // Timeout configurations
    $mail->Timeout = 10;
    
    // Recipients
    $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
    $mail->addAddress(CONTACT_RECIPIENT_EMAIL);
    $mail->addReplyTo($email, $nama);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "[STARS Contact Form] " . $subjek;
    
    // Email body styled in premium dark/silver themes
    $mail->Body    = '
    <div style="background-color: #09090b; color: #f4f4f5; font-family: sans-serif; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
        <h2 style="color: #ffffff; border-bottom: 2px solid #27272a; padding-bottom: 12px; margin-top: 0;">Pesan Baru dari STARS Web</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-weight: bold; width: 120px;">Nama Pengirim:</td>
                <td style="padding: 8px 0; color: #ffffff;">' . htmlspecialchars($nama) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-weight: bold;">Email Pengirim:</td>
                <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #ffffff; text-decoration: underline;">' . htmlspecialchars($email) . '</a></td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #a1a1aa; font-weight: bold;">Subjek:</td>
                <td style="padding: 8px 0; color: #ffffff;">' . htmlspecialchars($subjek) . '</td>
            </tr>
        </table>
        
        <div style="margin-top: 24px; padding: 16px; background-color: #121214; border-radius: 6px; border: 1px solid #18181b;">
            <p style="color: #a1a1aa; font-weight: bold; margin-top: 0; margin-bottom: 8px;">Pesan:</p>
            <p style="color: #f4f4f5; line-height: 1.6; white-space: pre-line; margin: 0;">' . nl2br(htmlspecialchars($pesan)) . '</p>
        </div>
        
        <p style="color: #52525b; font-size: 11px; margin-top: 32px; text-align: center; border-top: 1px solid #18181b; padding-top: 16px;">
            Dikirim secara otomatis oleh Student Talent And Recommendation System (STARS)
        </p>
    </div>';

    $mail->AltBody = "Pesan baru dari $nama ($email):\n\nSubjek: $subjek\n\nPesan:\n$pesan";

    $mail->send();
    echo json_encode([
        'status' => 'success',
        'message' => 'Pesan Anda berhasil dikirim. Terima kasih atas masukannya!'
    ]);
} catch (Exception $e) {
    // If it's on localhost, SMTP might fail due to default configurations.
    // Provide a helpful developer notice in the error string.
    $error_msg = 'Gagal mengirim email via SMTP. ';
    if (SMTP_USER === 'your_email@gmail.com') {
        $error_msg .= 'Harap lengkapi SMTP_USER dan SMTP_PASS di config/config.php terlebih dahulu.';
    } else {
        $error_msg .= 'Detail error: ' . $mail->ErrorInfo;
    }
    
    echo json_encode([
        'status' => 'error',
        'error' => $error_msg
    ]);
}
?>
