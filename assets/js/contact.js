// STARS Contact Form Handler — V6 (Python Backend via /api/contact)
'use strict';

// ─── Toast Notification System ───────────────────────────────────────
function showToast(type, message) {
    // Remove existing toasts
    document.querySelectorAll('.stars-toast').forEach(t => t.remove());

    const isSuccess = type === 'success';
    const toast = document.createElement('div');
    toast.className = 'stars-toast';
    const isMobile = window.innerWidth <= 480;
    toast.style.cssText = `
        position: fixed;
        bottom: ${isMobile ? '16px' : '28px'};
        right: ${isMobile ? '16px' : '28px'};
        z-index: 9999;
        max-width: ${isMobile ? 'calc(100vw - 32px)' : '380px'};
        min-width: ${isMobile ? 'calc(100vw - 32px)' : '280px'};
        padding: 16px 20px;
        border-radius: 14px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        border: 1px solid ${isSuccess ? 'rgba(72,199,142,0.3)' : 'rgba(251,113,133,0.3)'};
        background: ${isSuccess ? 'rgba(6,78,59,0.95)' : 'rgba(69,10,10,0.95)'};
        color: ${isSuccess ? '#6ee7b7' : '#fca5a5'};
        transform: translateY(24px);
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    `;

    const icon = isSuccess
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    toast.innerHTML = `
        <span style="flex-shrink:0;margin-top:1px">${icon}</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left:auto;flex-shrink:0;background:none;border:none;cursor:pointer;color:inherit;opacity:0.6;padding:0;line-height:1">&times;</button>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
    });

    // Auto dismiss
    const duration = isSuccess ? 5000 : 7000;
    setTimeout(() => {
        toast.style.transform = 'translateY(24px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// ─── Client-side Validation ───────────────────────────────────────────
function validateForm(nama, email, kategori, subjek, pesan) {
    const emailRegex = /^[\w.+\-]+@[\w\-]+(\.[a-zA-Z]{2,})+$/;
    if (nama.length < 3)          return 'Nama minimal 3 karakter.';
    if (!emailRegex.test(email))  return 'Format email tidak valid.';
    if (!kategori)                return 'Pilih kategori pesan terlebih dahulu.';
    if (subjek.length < 5)        return 'Subjek minimal 5 karakter.';
    if (pesan.length < 15)        return 'Pesan minimal 15 karakter.';
    return null;
}

// ─── Main Contact Form Logic ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const contactForm      = document.getElementById('contact-form');
    const submitBtn        = document.getElementById('contact-submit-btn');
    const alertContainer   = document.getElementById('contact-alert-container');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Hide old alert container (legacy)
        if (alertContainer) {
            alertContainer.innerHTML = '';
            alertContainer.classList.add('hidden');
        }

        // Read values
        const nama     = (document.getElementById('nama')?.value     || '').trim();
        const email    = (document.getElementById('email')?.value    || '').trim();
        const kategori = (document.getElementById('kategori')?.value || '').trim();
        const subjek   = (document.getElementById('subjek')?.value   || '').trim();
        const pesan    = (document.getElementById('pesan')?.value    || '').trim();

        // Client-side validation
        const validationError = validateForm(nama, email, kategori, subjek, pesan);
        if (validationError) {
            showToast('error', validationError);
            return;
        }

        // Loading state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin" style="display:inline-block;width:18px;height:18px;margin-right:8px;vertical-align:middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mengirim...
        `;

        try {
            const response = await fetch('http://127.0.0.1:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama, email, kategori, subjek, pesan })
            });

            const data = await response.json();

            if (data.status === 'success') {
                showToast('success', '✅ ' + (data.message || 'Pesan berhasil dikirim. Terima kasih atas masukan Anda!'));
                contactForm.reset();
            } else {
                showToast('error', '❌ ' + (data.error || 'Pesan gagal dikirim. Silakan coba beberapa saat lagi.'));
            }

        } catch (err) {
            console.error('[STARS Contact] Network error:', err);
            showToast('error', '❌ Koneksi ke server gagal. Pastikan Python backend aktif, lalu coba lagi.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }
    });
});
