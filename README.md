# STARS
Smart Talent Academic Recommendation System

## 1. Deskripsi Project
**STARS (Student Talent Academic Recommendation System)** adalah aplikasi berbasis web cerdas yang bertujuan membantu calon mahasiswa menentukan program studi/jurusan kuliah yang paling sesuai dengan potensi mereka. STARS memanfaatkan algoritma **Decision Tree Classifier** untuk memprediksi rekomendasi jurusan berdasarkan analisis metrik akademik (nilai rapor) dan profil non-akademik (minat, hobi, dan keahlian lunak).

## 2. Fitur Utama
- **Form Assessment Terarah:** Input interaktif 7-langkah untuk mengumpulkan data nilai akademik, keahlian komputer/komunikasi, minat, dan prestasi.
- **Rekomendasi Jurusan Berbasis AI:** Prediksi cerdas dari model Machine Learning (Decision Tree) yang menyajikan hasil akurat dan personal.
- **Rekomendasi Kampus (Campus Match):** Menampilkan daftar 10 kampus terbaik di Indonesia dengan jurusan yang sesuai dan disortir berdasarkan akreditasi serta lokasi.
- **Analisis Pendukung:** Visualisasi radar chart keseimbangan kemampuan, validasi silang akademik vs prestasi, dan status probabilitas kelulusan keahlian (IQS, PCS, PSS, CIE).
- **Formulir Kontak Terintegrasi:** Fasilitas komunikasi interaktif menggunakan API Python untuk mengirim umpan balik.

## 3. Teknologi yang Digunakan
- **Frontend:** PHP (native), JavaScript, Tailwind CSS (via CDN), CSS kustom (Glassmorphism & animasi).
- **Backend AI:** Python, Flask, Flask-CORS.
- **Machine Learning:** Scikit-learn (Decision Tree Classifier), Joblib, Pandas, NumPy.
- **Email Service:** Python smtplib (dengan dotenv) & PHPMailer.

## 4. Arsitektur Sistem
Sistem ini menggunakan arsitektur hybrid (dual-stack) yang memisahkan tampilan antarmuka dan mesin inferensi:
- **Alur Prediksi:** 
  1. Pengguna mengisi form pada browser.
  2. Data disubmit ke `predict.php` yang akan melakukan Hard & Soft Validation.
  3. `predict.php` meneruskan data melalui cURL POST ke endpoint Flask `http://127.0.0.1:5000/api/prediksi`.
  4. Flask memproses data menggunakan model Decision Tree dan mengembalikan respons JSON.
  5. Frontend menampilkan hasil rekomendasi dan visualisasi chart.
- **Alur Kontak:** Form kontak disubmit menggunakan AJAX (JavaScript) di `assets/js/contact.js` langsung ke endpoint `http://127.0.0.1:5000/api/contact` milik backend Flask.

## 5. Struktur Folder Utama
```text
C:\laragon\www\Project web AI\
├── api.py                          # Entry point Backend Flask (AI & Contact)
├── index.php                       # Halaman utama aplikasi (Form Wizard)
├── kontak.php                      # Halaman form hubungi kami
├── predict.php                     # Proxy controller PHP ke API Python
├── config/
│   └── config.php                  # Konfigurasi aplikasi PHP
├── assets/
│   ├── css/                        # Custom styling dan animasi
│   ├── js/                         # Script interaksi UI dan validasi form
│   └── images/                     # Aset gambar dan logo
├── dataset/
│   └── kampus_indonesia.csv        # Database rekomendasi kampus (digunakan runtime)
├── model/
│   ├── model_decision_tree.pkl     # Model ML terlatih (siap pakai)
│   └── encoders.pkl                # Label encoder fitur
├── image live/                     # Aset video latar interaktif (Dark & Light)
├── requirements.txt                # Dependensi Python
├── composer.json                   # Dependensi PHP
└── .env.example                    # Template konfigurasi environment
```

## 6. Persyaratan Sistem
- **PHP:** Versi 8.0 atau lebih baru (dengan ekstensi `curl` dan `json` aktif).
- **Python:** Versi 3.10 atau lebih baru.
- **Web Server:** Laragon / XAMPP (Apache/Nginx).
- **Composer:** Jika ingin memperbarui modul PHP (PHPMailer).

## 7. Instalasi Lokal
1. **Clone Repository:**
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd "Project web AI"
   ```
2. **Setup Backend Python:**
   Pastikan Anda menginstal semua package yang diperlukan.
   ```bash
   pip install -r requirements.txt
   ```
3. **Konfigurasi Environment:**
   Salin template konfigurasi dan sesuaikan isinya.
   ```bash
   cp .env.example .env
   ```
   *Buka `.env` dan isi kredensial email pengirim.*
4. **Jalankan Backend AI (Flask):**
   Di terminal terpisah, jalankan:
   ```bash
   python api.py
   ```
   *(Backend akan berjalan di `http://127.0.0.1:5000`)*
5. **Jalankan Frontend PHP:**
   Gunakan Laragon (pastikan document root mengarah ke direktori ini) atau jalankan PHP server bawaan:
   ```bash
   php -S localhost:8000
   ```
   *Buka browser dan akses `http://localhost:8000`.*

## 8. Konfigurasi Environment
Project ini memerlukan file `.env` di direktori root (pastikan untuk TIDAK meng-commit file ini ke Git). File `.env` diperlukan oleh backend Flask untuk fitur notifikasi kontak. Variabel yang dibutuhkan:
- `EMAIL_USER`: Alamat email yang digunakan untuk mengirim pesan.
- `EMAIL_PASSWORD`: App Password (sandhi aplikasi) email tersebut.
- `ADMIN_EMAIL`: Email tujuan penerima pesan masuk.

## 9. Model dan Dataset
- **Runtime Model:** Aplikasi memuat `model_decision_tree.pkl` dan `encoders.pkl` di direktori `model/` untuk menghasilkan prediksi real-time secara efisien.
- **Dataset Runtime:** File `dataset/kampus_indonesia.csv` dimuat secara dinamis oleh browser via JavaScript untuk merender rekomendasi kampus terdekat.
- **Dataset Training:** Tersedia `dataset/dataset_jurusan_10000.csv` dan script `training/tes.py` yang merupakan rekam jejak eksperimen awal untuk melatih model ini. File training tidak dipanggil saat runtime.

## 10. Keamanan
- **Proteksi Kredensial:** File `.env` telah didaftarkan pada `.gitignore`. DILARANG KERAS mempublikasikan file ini maupun App Password ke repository GitHub.
- **Informasi Sensitif:** Konfigurasi rahasia hanya dibaca melalui variabel environment dan tidak dipasang hardcoded di dalam source code.
- **Mode Debug:** Pastikan Flask debug mode (`app.run(debug=True)`) dimatikan saat melakukan produksi skala besar, dan jangan commit folder cache seperti `__pycache__` atau log internal (`logs/`).

## 11. Status Deployment
- **Belum Dideploy (Local Development).** Aplikasi saat ini masih berstatus pra-produksi dan berjalan di environment lokal (Laragon/Localhost). Arsitektur hybrid ini direkomendasikan untuk dideploy pada VPS Linux atau setup split-deployment (Frontend via Hosting/cPanel dan Backend via layanan Cloud Containers).

## 12. Catatan Project Akademik
Project STARS dibangun sebagai inisiatif eksplorasi dan purwarupa pemanfaatan Machine Learning dalam membantu mahasiswa. Model, arsitektur, dan dataset yang disertakan disusun untuk mensimulasikan lingkungan sistem cerdas terintegrasi.
