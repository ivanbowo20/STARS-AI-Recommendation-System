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

// ─── Custom Glassmorphic Popover Dropdown ─────────────────────────────
function initCustomKategoriDropdown() {
    const dropdownContainer = document.getElementById('custom-kategori-dropdown');
    if (!dropdownContainer) return;

    const hiddenInput   = document.getElementById('kategori');
    const trigger       = document.getElementById('kategori-trigger');
    const selectedText  = document.getElementById('kategori-selected-text');
    const chevron       = document.getElementById('kategori-chevron');
    const menu          = document.getElementById('kategori-menu');
    const options       = menu ? menu.querySelectorAll('.kategori-option') : [];

    if (!hiddenInput || !trigger || !menu) return;

    let isOpen = false;

    function openMenu() {
        if (isOpen) return;
        isOpen = true;
        menu.classList.remove('hidden', 'pointer-events-none');
        menu.classList.add('pointer-events-auto');
        requestAnimationFrame(() => {
            menu.classList.remove('opacity-0', 'translate-y-1');
            menu.classList.add('opacity-100', 'translate-y-0');
        });
        trigger.setAttribute('aria-expanded', 'true');
        if (chevron) chevron.classList.add('rotate-180');
        trigger.classList.add('border-[var(--accent-1)]');

        // Focus selected option or first option
        let targetOption = null;
        options.forEach(opt => {
            if (opt.getAttribute('data-value') === hiddenInput.value) {
                targetOption = opt;
            }
        });
        if (!targetOption && options.length > 0) {
            targetOption = options[0];
        }
        if (targetOption) {
            targetOption.focus();
        }
    }

    function closeMenu(focusTrigger = false) {
        if (!isOpen) return;
        isOpen = false;
        menu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        menu.classList.add('opacity-0', 'translate-y-1', 'pointer-events-none');
        setTimeout(() => {
            if (!isOpen) menu.classList.add('hidden');
        }, 200);
        trigger.setAttribute('aria-expanded', 'false');
        if (chevron) chevron.classList.remove('rotate-180');
        trigger.classList.remove('border-[var(--accent-1)]');
        if (focusTrigger) {
            trigger.focus();
        }
    }

    function selectOption(opt) {
        const val = opt.getAttribute('data-value');
        hiddenInput.value = val;

        if (selectedText) {
            selectedText.textContent = val;
            selectedText.classList.remove('text-[var(--input-placeholder)]');
            selectedText.classList.add('text-[var(--input-text)]', 'font-medium');
        }

        trigger.classList.remove('border-red-500');

        options.forEach(o => {
            const isMatch = o === opt;
            o.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            const check = o.querySelector('.kategori-check');
            if (check) check.classList.toggle('opacity-100', isMatch);
            o.classList.toggle('bg-black/5', isMatch);
            o.classList.toggle('dark:bg-white/5', isMatch);
        });

        closeMenu(true);
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Trigger click
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Trigger keydown
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isOpen) {
                openMenu();
            } else if (options.length > 0) {
                options[0].focus();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
        }
    });

    // Options click & keyboard navigation
    options.forEach((opt, idx) => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption(opt);
        });

        opt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(opt);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIdx = (idx + 1) % options.length;
                options[nextIdx].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIdx = (idx - 1 + options.length) % options.length;
                options[prevIdx].focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeMenu(true);
            } else if (e.key === 'Tab') {
                closeMenu();
            }
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (isOpen && !dropdownContainer.contains(e.target)) {
            closeMenu();
        }
    });

    // Form reset listener
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('reset', () => {
            hiddenInput.value = '';
            if (selectedText) {
                selectedText.textContent = 'Pilih kategori pesan...';
                selectedText.classList.remove('text-[var(--input-text)]', 'font-medium');
                selectedText.classList.add('text-[var(--input-placeholder)]');
            }
            trigger.classList.remove('border-red-500');
            options.forEach(o => {
                o.setAttribute('aria-selected', 'false');
                const check = o.querySelector('.kategori-check');
                if (check) check.classList.remove('opacity-100');
                o.classList.remove('bg-black/5', 'dark:bg-white/5');
            });
            closeMenu();
        });
    }
}

// ─── Main Contact Form Logic ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    initCustomKategoriDropdown();

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
            if (!kategori) {
                const trigger = document.getElementById('kategori-trigger');
                if (trigger) {
                    trigger.classList.add('border-red-500');
                    trigger.focus();
                }
            }
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
            const response = await fetch('/api/contact', {
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
