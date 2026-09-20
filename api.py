import os
import re
import html
import logging
import smtplib
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# --- Logging setup for contact errors (stdout for Serverless) ---
import sys
logging.basicConfig(
    stream=sys.stdout,
    level=logging.ERROR,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
contact_logger = logging.getLogger("contact")

# Get absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model_decision_tree.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "model", "encoders.pkl")

# Initialize Flask App
app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, 'public'),
    static_url_path='',
    template_folder=os.path.join(BASE_DIR, 'templates')
)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load model and encoders
if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
    raise FileNotFoundError(f"Model or Encoders file not found in: {os.path.join(BASE_DIR, 'model')}")

model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODER_PATH)
label_jurusan = encoders["Jurusan"].classes_

# Urutan kolom fitur — HARUS konsisten di seluruh kode (18 Fitur)
KOLOM_FITUR = [
    "Matematika", "Bahasa_Inggris", "IPA", "IPS",
    "Minat", "Hobi", "Kemampuan_Komputer", "Kemampuan_Komunikasi",
    "Kemampuan_Kepemimpinan", "Kemampuan_Analisis",
    "Kemampuan_Kreativitas", "Kemampuan_Problem_Solving",
    "Mata_Pelajaran_Favorit", "Gaya_Belajar", "Tujuan_Karier",
    "Aktivitas_Organisasi", "Prestasi_Akademik", "Prestasi_NonAkademik",
]

KOLOM_KATEGORIKAL = [
    "Minat", "Hobi", "Kemampuan_Komputer", "Kemampuan_Komunikasi",
    "Kemampuan_Kepemimpinan", "Kemampuan_Analisis",
    "Kemampuan_Kreativitas", "Kemampuan_Problem_Solving",
    "Mata_Pelajaran_Favorit", "Gaya_Belajar", "Tujuan_Karier",
    "Aktivitas_Organisasi", "Prestasi_Akademik", "Prestasi_NonAkademik",
    "Jurusan",
]

# 20 Majors and associated mappings from tes.py v6.0
ALTERNATIF = {
    "Teknik Informatika"      : ["Sistem Informasi",    "Teknik Elektro"],
    "Sistem Informasi"        : ["Teknik Informatika",  "Manajemen Bisnis"],
    "Teknik Elektro"          : ["Teknik Informatika",  "Teknik Mesin"],
    "Akuntansi"               : ["Manajemen",           "Administrasi Bisnis"],
    "Manajemen"               : ["Akuntansi",           "Manajemen Bisnis"],
    "Hukum"                   : ["Ilmu Komunikasi",     "Psikologi"],
    "Pendidikan"              : ["Psikologi",           "Ilmu Komunikasi"],
    "Desain Komunikasi Visual": ["Arsitektur",          "Ilmu Komunikasi"],
    "Ilmu Komunikasi"         : ["Hukum",               "Administrasi Bisnis"],
    "Ilmu Keolahragaan"       : ["Pendidikan",          "Psikologi"],
    "Manajemen Bisnis"        : ["Manajemen",           "Administrasi Bisnis"],
    "Kedokteran"              : ["Farmasi",             "Psikologi"],
    "Psikologi"               : ["Kedokteran",          "Pendidikan"],
    "Teknik Sipil"            : ["Arsitektur",          "Teknik Lingkungan"],
    "Teknik Mesin"            : ["Teknik Elektro",      "Teknik Industri"],
    "Teknik Industri"         : ["Teknik Mesin",        "Manajemen Bisnis"],
    "Teknik Lingkungan"       : ["Teknik Sipil",        "Farmasi"],
    "Farmasi"                 : ["Kedokteran",          "Teknik Lingkungan"],
    "Arsitektur"              : ["Teknik Sipil",        "Desain Komunikasi Visual"],
    "Administrasi Bisnis"     : ["Manajemen",           "Ilmu Komunikasi"],
}

KARIER = {
    "Teknik Informatika"      : ["Software Engineer","Data Scientist","Mobile Developer","Cybersecurity Analyst","AI/ML Engineer","Game Developer"],
    "Sistem Informasi"        : ["Business Analyst","IT Project Manager","Systems Analyst","ERP Consultant","Database Administrator"],
    "Teknik Elektro"          : ["Electrical Engineer","IoT Developer","Network Engineer","Automation Engineer","Robotics Engineer"],
    "Akuntansi"               : ["Akuntan Publik","Auditor Internal","Tax Consultant","Financial Analyst","Controller Keuangan"],
    "Manajemen"               : ["Manajer Operasional","HR Manager","Marketing Manager","Business Development","Entrepreneur"],
    "Hukum"                   : ["Pengacara/Advokat","Notaris","Jaksa","Legal Consultant","Corporate Lawyer","Hakim"],
    "Pendidikan"              : ["Guru","Dosen","Curriculum Developer","Education Consultant","School Principal"],
    "Desain Komunikasi Visual": ["Graphic Designer","UI/UX Designer","Art Director","Motion Graphic Designer","Creative Director"],
    "Ilmu Komunikasi"         : ["Jurnalis","Public Relations","Content Creator","Broadcaster","Digital Marketing Specialist"],
    "Ilmu Keolahragaan"       : ["Pelatih Olahraga","Guru Olahraga","Sport Analyst","Fitness Trainer","Sports Manager"],
    "Manajemen Bisnis"        : ["Entrepreneur","Business Analyst","Product Manager","Operations Manager","Startup Founder"],
    "Kedokteran"              : ["Dokter Umum","Dokter Spesialis","Peneliti Medis","Dokter Puskesmas","Medical Consultant"],
    "Psikologi"               : ["Psikolog Klinis","HRD Specialist","Konselor","Peneliti Perilaku","Psikolog Pendidikan"],
    "Teknik Sipil"            : ["Insinyur Sipil","Quantity Surveyor","Project Manager Konstruksi","Site Engineer"],
    "Teknik Mesin"            : ["Mechanical Engineer","Production Engineer","Automotive Engineer","R&D Engineer"],
    "Teknik Industri"         : ["Industrial Engineer","Supply Chain Manager","Quality Control Engineer","Lean Consultant"],
    "Teknik Lingkungan"       : ["Konsultan Lingkungan","Environmental Engineer","AMDAL Specialist","Sustainability Officer"],
    "Farmasi"                 : ["Apoteker","Pharmaceutical Researcher","Medical Representative","Regulatory Affairs"],
    "Arsitektur"              : ["Arsitek","Urban Planner","Interior Designer","BIM Specialist","Landscape Architect"],
    "Administrasi Bisnis"     : ["Office Manager","Executive Assistant","Business Administrator","Administrative Analyst"],
}

PROFIL_SKOR = {
    "Teknik Informatika"      : {"minat":["Teknologi"],"hobi":["Coding","Game Development","Mobile Development","Web Development","Robotika","Esport"],"mapel":["Informatika","Matematika"],"tujuan":["Software Engineer","Data Scientist"],"komp":["Tinggi"]},
    "Sistem Informasi"        : {"minat":["Teknologi","Bisnis"],"hobi":["Coding","UI/UX Design","Web Development","Mobile Development"],"mapel":["Informatika","Ekonomi"],"tujuan":["Business Analyst","UI UX Designer"],"komp":["Tinggi","Sedang"]},
    "Teknik Elektro"          : {"minat":["Teknik","Teknologi"],"hobi":["Coding","Robotika","Merakit Elektronik"],"mapel":["Fisika","Matematika"],"tujuan":["Network Engineer","Insinyur Mesin"],"komp":["Tinggi","Sedang"]},
    "Akuntansi"               : {"minat":["Bisnis"],"hobi":["Investasi","Menulis","Berjualan"],"mapel":["Ekonomi","Matematika"],"tujuan":["Akuntan","Business Analyst"],"komp":["Sedang"]},
    "Manajemen"               : {"minat":["Bisnis"],"hobi":["Public Speaking","Content Creator","Investasi"],"mapel":["Ekonomi","Sosiologi"],"tujuan":["Manajer","Entrepreneur"],"komp":["Sedang"]},
    "Hukum"                   : {"minat":["Sosial"],"hobi":["Debat","Menulis","Public Speaking"],"mapel":["Sosiologi","Bahasa Indonesia"],"tujuan":["Pengacara","Dosen"],"komp":["Sedang"]},
    "Pendidikan"              : {"minat":["Pendidikan"],"hobi":["Menulis","Membaca","Public Speaking"],"mapel":["Bahasa Indonesia","Sosiologi"],"tujuan":["Guru","Dosen"],"komp":["Sedang"]},
    "Desain Komunikasi Visual": {"minat":["Seni"],"hobi":["Menggambar","Fotografi","Desain Grafis","UI/UX Design","Video Editing"],"mapel":["Seni Budaya","Informatika"],"tujuan":["UI UX Designer","Content Creator"],"komp":["Sedang","Tinggi"]},
    "Ilmu Komunikasi"         : {"minat":["Sosial"],"hobi":["Content Creator","Menulis","Public Speaking","Video Editing"],"mapel":["Bahasa Indonesia","Bahasa Inggris"],"tujuan":["Content Creator","Manajer"],"komp":["Sedang"]},
    "Ilmu Keolahragaan"       : {"minat":["Olahraga"],"hobi":["Atletik","Basket","Renang","Sepak Bola","Taekwondo","Olahraga"],"mapel":["PJOK","Biologi"],"tujuan":["Pelatih Olahraga","Dosen"],"komp":["Rendah","Sedang"]},
    "Manajemen Bisnis"        : {"minat":["Bisnis"],"hobi":["Investasi","Berjualan","Content Creator"],"mapel":["Ekonomi","Matematika"],"tujuan":["Entrepreneur","Manajer"],"komp":["Sedang"]},
    "Kedokteran"              : {"minat":["Kesehatan"],"hobi":["Penelitian","Volunteering","Membaca","PMR"],"mapel":["Biologi","Kimia"],"tujuan":["Dokter","Dosen"],"komp":["Sedang"]},
    "Psikologi"               : {"minat":["Psikologi","Sosial"],"hobi":["Penelitian","Menulis","Volunteering","Membaca"],"mapel":["Sosiologi","Biologi"],"tujuan":["Psikolog","Dosen"],"komp":["Sedang"]},
    "Teknik Sipil"            : {"minat":["Teknik"],"hobi":["Penelitian","Merakit Elektronik","Membaca"],"mapel":["Fisika","Matematika"],"tujuan":["Insinyur Sipil","Konsultan Lingkungan"],"komp":["Sedang"]},
    "Teknik Mesin"            : {"minat":["Teknik"],"hobi":["Robotika","Merakit Elektronik","Penelitian"],"mapel":["Fisika","Matematika"],"tujuan":["Insinyur Mesin","Insinyur Sipil"],"komp":["Sedang","Tinggi"]},
    "Teknik Industri"         : {"minat":["Teknik","Bisnis"],"hobi":["Penelitian","Investasi","Membaca"],"mapel":["Matematika","Fisika"],"tujuan":["Insinyur Mesin","Business Analyst"],"komp":["Sedang"]},
    "Teknik Lingkungan"       : {"minat":["Lingkungan"],"hobi":["Volunteering","Penelitian","Membaca"],"mapel":["Biologi","Kimia"],"tujuan":["Konsultan Lingkungan","Dosen"],"komp":["Sedang"]},
    "Farmasi"                 : {"minat":["Kesehatan","Sains"],"hobi":["Penelitian","Volunteering","Membaca"],"mapel":["Kimia","Biologi"],"tujuan":["Apoteker","Dosen"],"komp":["Sedang"]},
    "Arsitektur"              : {"minat":["Seni","Teknik"],"hobi":["Fotografi","Penelitian","Desain Grafis"],"mapel":["Seni Budaya","Fisika"],"tujuan":["Arsitek","UI UX Designer"],"komp":["Sedang","Tinggi"]},
    "Administrasi Bisnis"     : {"minat":["Bisnis"],"hobi":["Menulis","Investasi","Membaca"],"mapel":["Ekonomi","Sosiologi"],"tujuan":["Manajer","Akuntan"],"komp":["Sedang"]},
}

FAKTOR = {
    "Teknik Informatika"      : {"minat":["Teknologi"],"hobi":["Coding","Game Development","Mobile Development","Web Development","Robotika","Esport"],"nilai":["Matematika","IPA"],"komp":["Tinggi"],"mapel":["Informatika","Matematika"]},
    "Sistem Informasi"        : {"minat":["Teknologi","Bisnis"],"hobi":["Coding","UI/UX Design","Web Development","Mobile Development"],"nilai":["Matematika","IPA"],"komp":["Tinggi","Sedang"],"mapel":["Informatika","Ekonomi"]},
    "Teknik Elektro"          : {"minat":["Teknik","Teknologi"],"hobi":["Coding","Robotika","Merakit Elektronik"],"nilai":["IPA","Matematika"],"komp":["Tinggi","Sedang"],"mapel":["Fisika","Matematika"]},
    "Akuntansi"               : {"minat":["Bisnis"],"hobi":["Investasi","Menulis","Berjualan"],"nilai":["Matematika","IPS"],"komp":["Sedang","Tinggi"],"mapel":["Ekonomi","Matematika"]},
    "Manajemen"               : {"minat":["Bisnis"],"hobi":["Public Speaking","Content Creator","Investasi"],"nilai":["IPS","Bahasa_Inggris"],"komp":["Sedang"],"mapel":["Ekonomi","Sosiologi"]},
    "Hukum"                   : {"minat":["Sosial"],"hobi":["Debat","Menulis","Public Speaking"],"nilai":["IPS","Bahasa_Inggris"],"komp":["Sedang"],"mapel":["Sosiologi","Bahasa Indonesia"]},
    "Pendidikan"              : {"minat":["Pendidikan"],"hobi":["Menulis","Membaca","Public Speaking"],"nilai":["Bahasa_Inggris"],"komp":["Sedang"],"mapel":["Bahasa Indonesia","Sosiologi"]},
    "Desain Komunikasi Visual": {"minat":["Seni"],"hobi":["Menggambar","Fotografi","Desain Grafis","UI/UX Design","Video Editing"],"nilai":[],"komp":["Sedang","Tinggi"],"mapel":["Seni Budaya","Informatika"]},
    "Ilmu Komunikasi"         : {"minat":["Sosial"],"hobi":["Content Creator","Menulis","Public Speaking","Video Editing"],"nilai":["Bahasa_Inggris","IPS"],"komp":["Sedang"],"mapel":["Bahasa Indonesia","Bahasa Inggris"]},
    "Ilmu Keolahragaan"       : {"minat":["Olahraga"],"hobi":["Atletik","Basket","Renang","Sepak Bola","Taekwondo","Olahraga"],"nilai":["IPA"],"komp":["Rendah","Sedang"],"mapel":["PJOK","Biologi"]},
    "Manajemen Bisnis"        : {"minat":["Bisnis"],"hobi":["Investasi","Berjualan","Content Creator"],"nilai":["IPS","Bahasa_Inggris"],"komp":["Sedang"],"mapel":["Ekonomi","Matematika"]},
    "Kedokteran"              : {"minat":["Kesehatan"],"hobi":["Penelitian","Volunteering","Membaca","PMR"],"nilai":["IPA","Matematika"],"komp":["Sedang"],"mapel":["Biologi","Kimia"]},
    "Psikologi"               : {"minat":["Psikologi","Sosial"],"hobi":["Penelitian","Menulis","Volunteering","Membaca"],"nilai":["IPA","IPS"],"komp":["Sedang"],"mapel":["Sosiologi","Biologi"]},
    "Teknik Sipil"            : {"minat":["Teknik"],"hobi":["Penelitian","Merakit Elektronik","Membaca"],"nilai":["IPA","Matematika"],"komp":["Sedang"],"mapel":["Fisika","Matematika"]},
    "Teknik Mesin"            : {"minat":["Teknik"],"hobi":["Robotika","Merakit Elektronik","Penelitian"],"nilai":["IPA","Matematika"],"komp":["Sedang","Tinggi"],"mapel":["Fisika","Matematika"]},
    "Teknik Industri"         : {"minat":["Teknik","Bisnis"],"hobi":["Penelitian","Investasi","Membaca"],"nilai":["Matematika","IPA"],"komp":["Sedang"],"mapel":["Matematika","Fisika"]},
    "Teknik Lingkungan"       : {"minat":["Lingkungan"],"hobi":["Volunteering","Penelitian","Membaca"],"nilai":["IPA","Matematika"],"komp":["Sedang"],"mapel":["Biologi","Kimia"]},
    "Farmasi"                 : {"minat":["Kesehatan","Sains"],"hobi":["Penelitian","Volunteering","Membaca"],"nilai":["IPA","Matematika"],"komp":["Sedang"],"mapel":["Kimia","Biologi"]},
    "Arsitektur"              : {"minat":["Seni","Teknik"],"hobi":["Fotografi","Penelitian","Desain Grafis"],"nilai":["Matematika","IPA"],"komp":["Sedang","Tinggi"],"mapel":["Seni Budaya","Fisika"]},
    "Administrasi Bisnis"     : {"minat":["Bisnis"],"hobi":["Menulis","Investasi","Membaca"],"nilai":["IPS"],"komp":["Sedang"],"mapel":["Ekonomi","Sosiologi"]},
}

NAMA_KOLOM = {
    "Matematika":"Matematika","Bahasa_Inggris":"Bahasa Inggris",
    "IPA":"IPA","IPS":"IPS",
}

def hitung_skor_kemiripan(siswa: dict) -> dict:
    """
    Hitung skor kemiripan (0.0–1.0) antara data siswa
    dengan profil setiap jurusan. Digunakan untuk blending.
    """
    skor = {}
    for jurusan, k in PROFIL_SKOR.items():
        poin  = 0
        total = 5   # minat, hobi, mapel, tujuan, komputer

        if siswa.get("Minat")                 in k["minat"]  : poin += 1
        if siswa.get("Hobi")                  in k["hobi"]   : poin += 1
        if siswa.get("Mata_Pelajaran_Favorit") in k["mapel"]  : poin += 1
        if siswa.get("Tujuan_Karier")          in k["tujuan"] : poin += 1
        if siswa.get("Kemampuan_Komputer")     in k["komp"]   : poin += 1

        skor[jurusan] = poin / total

    total_skor = sum(skor.values()) or 1.0
    return {j: s / total_skor for j, s in skor.items()}

def soft_proba(proba_model: np.ndarray, siswa: dict, alpha: float = 0.70) -> np.ndarray:
    """
    Gabungkan proba model (70%) dengan skor kemiripan (30%).
    Hasilnya: distribusi lebih realistis, total tetap 1.0.
    """
    skor_sim = hitung_skor_kemiripan(siswa)
    sim_arr  = np.array([skor_sim.get(j, 0.0) for j in label_jurusan])
    blended  = alpha * proba_model + (1 - alpha) * sim_arr
    total    = blended.sum()
    return blended / total if total > 0 else blended

def proba_ke_kategori(prob: float) -> dict:
    """Ubah float probabilitas → label + bintang + warna hex."""
    pct = prob * 100
    if   pct >= 90: return {"label":"Sangat Tinggi","bintang":"⭐⭐⭐⭐⭐","warna":"#1a7f37"}
    elif pct >= 75: return {"label":"Tinggi",        "bintang":"⭐⭐⭐⭐",  "warna":"#0969da"}
    elif pct >= 60: return {"label":"Cukup Tinggi",  "bintang":"⭐⭐⭐",    "warna":"#9a6700"}
    elif pct >= 45: return {"label":"Sedang",        "bintang":"⭐⭐",      "warna":"#cf6900"}
    else:           return {"label":"Rendah",        "bintang":"⭐",        "warna":"#cf222e"}

def buat_alasan(siswa: dict, jurusan: str) -> list:
    """
    Hasilkan poin-poin alasan berdasarkan kesesuaian data siswa
    dengan profil jurusan yang direkomendasikan.
    """
    f      = FAKTOR.get(jurusan, {})
    alasan = []

    # Minat
    minat = siswa.get("Minat","")
    cocok = minat in f.get("minat",[])
    alasan.append(f"Minat {minat} {'sangat sesuai' if cocok else 'dapat berkembang'} di bidang {jurusan}")

    # Hobi
    hobi = siswa.get("Hobi","")
    if hobi in f.get("hobi",[]):
        alasan.append(f"Hobi {hobi} mendukung keahlian yang dibutuhkan jurusan ini")

    # Mata pelajaran favorit
    mapel = siswa.get("Mata_Pelajaran_Favorit","")
    if mapel in f.get("mapel",[]):
        alasan.append(f"Mata pelajaran favorit {mapel} relevan dengan materi kuliah jurusan ini")

    # Nilai akademik
    for col in f.get("nilai",[]):
        v = siswa.get(col, 0)
        lbl = NAMA_KOLOM.get(col, col)
        if   v >= 85: alasan.append(f"Nilai {lbl} sangat tinggi ({v}) — mendukung kuat bidang ini")
        elif v >= 75: alasan.append(f"Nilai {lbl} baik ({v}) — sesuai tuntutan jurusan")

    # Kemampuan komputer
    komp = siswa.get("Kemampuan_Komputer","")
    if komp in f.get("komp",[]):
        alasan.append(f"Kemampuan Komputer {komp} mendukung bidang ini")

    # Tujuan karier
    tujuan = siswa.get("Tujuan_Karier","")
    if tujuan in PROFIL_SKOR.get(jurusan,{}).get("tujuan",[]):
        alasan.append(f"Tujuan karier '{tujuan}' sangat selaras dengan lulusan jurusan ini")

    # Kemampuan analisis / problem solving
    for kap, label in [("Kemampuan_Analisis","Analisis"),("Kemampuan_Problem_Solving","Problem Solving")]:
        if siswa.get(kap) == "Tinggi":
            alasan.append(f"Kemampuan {label} tinggi menjadi nilai plus di jurusan ini")
            break

    # Prestasi akademik
    pa = siswa.get("Prestasi_Akademik","")
    if pa != "Tidak Ada":
        alasan.append(f"Memiliki prestasi akademik: {pa}")

    # Prestasi non-akademik
    pn = siswa.get("Prestasi_NonAkademik","")
    if pn != "Tidak Ada":
        alasan.append(f"Aktif berprestasi non-akademik: {pn}")

    return alasan

def prediksi_jurusan(data_siswa: dict) -> dict:
    inp = data_siswa.copy()

    # Preprocess categorical inputs using loaded LabelEncoders
    for kolom in KOLOM_KATEGORIKAL:
        if kolom == "Jurusan":
            continue
        if kolom in inp:
            le = encoders[kolom]
            try:
                inp[kolom] = le.transform([str(inp[kolom])])[0]
            except ValueError:
                # Nilai tidak dikenal → pakai nilai paling umum (mode)
                inp[kolom] = int(le.transform([le.classes_[0]])[0])

    # Buat DataFrame agar sklearn mengenali nama kolom
    baris = pd.DataFrame(
        [[inp.get(k, 0) for k in KOLOM_FITUR]],
        columns=KOLOM_FITUR
    )

    # Probabilitas Decision Tree
    proba_raw = model.predict_proba(baris)[0]

    # Soft smoothing -> distribusi lebih realistis (alpha=0.70)
    proba_smooth = soft_proba(proba_raw, data_siswa, alpha=0.70)

    # Ranking semua jurusan
    pasangan = sorted(
        zip(label_jurusan, proba_smooth),
        key=lambda x: x[1], reverse=True
    )

    ranking = [
        {
            "rank"             : i + 1,
            "jurusan"          : j,
            "probabilitas"     : round(float(p), 4),
            "persen"           : f"{p * 100:.1f}%",
            "tingkat_kecocokan": proba_ke_kategori(p),
        }
        for i, (j, p) in enumerate(pasangan)
    ]

    jurusan_utama = ranking[0]["jurusan"]
    prob_utama    = ranking[0]["probabilitas"]

    # Alternatif: dari mapping statis + proba aktual
    alt_list = []
    for nama in ALTERNATIF.get(jurusan_utama, []):
        p_alt = next((r["probabilitas"] for r in ranking if r["jurusan"] == nama), 0.0)
        alt_list.append({
            "jurusan"          : nama,
            "tingkat_kecocokan": proba_ke_kategori(p_alt),
        })

    return {
        "status"           : "success",
        "jurusan_utama"    : jurusan_utama,
        "tingkat_kecocokan": proba_ke_kategori(prob_utama),
        "alasan"           : buat_alasan(data_siswa, jurusan_utama),
        "alternatif"       : alt_list,
        "prospek_karier"   : KARIER.get(jurusan_utama, []),
        "ranking"          : ranking,
    }

# Flask Routes
@app.route("/")
@app.route("/api/index")
@app.route("/api")
def index():
    return render_template("index.html")

@app.route("/kontak")
@app.route("/api/kontak")
def kontak():
    return render_template("kontak.html")

@app.route("/api/prediksi", methods=["POST"])
def route_prediksi():
    # Support both JSON and form data
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()

    if not data:
        return jsonify({"status": "error", "error": "Request body is empty"}), 400
        
    # Validation of fields
    for col in KOLOM_FITUR:
        # Note: form data might have different keys for Prestasi depending on how JS sends it
        # The frontend JS actually sends formData which matches the HTML input names, but JS validation
        # logic has historically handled some preprocessing. We'll extract them cleanly.
        if col not in data and col not in ["Prestasi_Akademik", "Prestasi_NonAkademik"]:
            # If mapped from form, JS might send lowercase or specific names
            pass
            
    try:
        # Map frontend form fields to KOLOM_FITUR if they are sent in form format
        if not request.is_json:
            mapped_data = {}
            for col in KOLOM_FITUR:
                mapped_data[col] = data.get(col) or data.get(col.lower()) or data.get(col.replace("_", "").lower())
            
            # Handle special nested prestige logic from predict.php
            if "Prestasi_Akademik" not in data:
                pa_tingkat = data.get("prestasi_akademik_tingkat", "")
                pa_bidang = data.get("prestasi_akademik_bidang", "")
                if not pa_tingkat or pa_tingkat == "Tidak Ada" or not pa_bidang:
                    mapped_data["Prestasi_Akademik"] = "Tidak Ada"
                else:
                    mapped_data["Prestasi_Akademik"] = f"{pa_tingkat} - {pa_bidang}"
                    
            if "Prestasi_NonAkademik" not in data:
                pna_tingkat = data.get("prestasi_non_akademik_tingkat", "")
                pna_bidang = data.get("prestasi_non_akademik_bidang", "")
                if not pna_tingkat or pna_tingkat == "Tidak Ada" or not pna_bidang:
                    mapped_data["Prestasi_NonAkademik"] = "Tidak Ada"
                else:
                    mapped_data["Prestasi_NonAkademik"] = f"{pna_bidang} - {pna_tingkat}"
                    
            # Set the mapped data back to data for the prediction
            for col in KOLOM_FITUR:
                if mapped_data.get(col) is None:
                    mapped_data[col] = "0" if col in ["Matematika", "Bahasa_Inggris", "IPA", "IPS"] else ""
            data = mapped_data

        # Normalize numeric inputs to float/int
        for col in ["Matematika", "Bahasa_Inggris", "IPA", "IPS"]:
            data[col] = float(data[col])
            
        result = prediksi_jurusan(data)
        
        # Append supplementary fields from frontend
        if not request.is_json:
            result['nama_siswa'] = request.form.get("nama", "")
            result['minat_spesifik'] = request.form.get("minat_spesifik", "")
            result['hobi_tambahan'] = request.form.get("hobi_tambahan", "")
            result['prestasi_akademik'] = data.get("Prestasi_Akademik", "")
            result['prestasi_non_akademik'] = data.get("Prestasi_NonAkademik", "")
            
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# ─────────────────────────────────────────────
# Route: POST /api/contact  — Kirim Pesan/Saran
# ─────────────────────────────────────────────

KATEGORI_VALID = {"Saran", "Kritik", "Bug Report", "Pertanyaan"}

def sanitize(text: str, max_len: int = 2000) -> str:
    """Strip, limit length, escape HTML."""
    return html.escape(str(text).strip()[:max_len])

def is_valid_email(email: str) -> bool:
    pattern = r'^[\w.+\-]+@[\w\-]+(\.[\w\-]{2,})+$'
    return bool(re.match(pattern, email))

@app.route("/api/contact", methods=["POST"])
def route_contact():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "error": "Request body kosong atau bukan JSON."}), 400

    # Ambil field
    nama     = sanitize(data.get("nama", ""),     100)
    email    = sanitize(data.get("email", ""),    200)
    kategori = sanitize(data.get("kategori", ""), 50)
    subjek   = sanitize(data.get("subjek", ""),   200)
    pesan    = sanitize(data.get("pesan", ""),    2000)

    # Validasi
    errors = []
    if len(nama) < 3:
        errors.append("Nama minimal 3 karakter.")
    if not is_valid_email(email):
        errors.append("Format email tidak valid.")
    if kategori not in KATEGORI_VALID:
        errors.append(f"Kategori harus salah satu dari: {', '.join(KATEGORI_VALID)}.")
    if len(subjek) < 5:
        errors.append("Subjek minimal 5 karakter.")
    if len(pesan) < 15:
        errors.append("Pesan minimal 15 karakter.")

    if errors:
        return jsonify({"status": "error", "error": " | ".join(errors)}), 422

    # Konfigurasi SMTP dari .env
    smtp_user  = os.getenv("EMAIL_USER",    "")
    smtp_pass  = os.getenv("EMAIL_PASSWORD","")
    admin_email= os.getenv("ADMIN_EMAIL",   "")

    if not smtp_user or not smtp_pass or not admin_email:
        contact_logger.error("Konfigurasi EMAIL_USER / EMAIL_PASSWORD / ADMIN_EMAIL tidak ditemukan di .env")
        return jsonify({"status": "error", "error": "Konfigurasi email server belum diatur."}), 500

    # Susun subject email
    email_subject = f"[STARS][{kategori}] {subjek}"

    # Susun body email HTML
    tanggal = datetime.now().strftime("%d %B %Y, %H:%M WIB")
    email_body = f"""\
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff;
                  border-radius: 12px; overflow: hidden;
                  box-shadow: 0 4px 16px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
               padding: 28px 32px; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 2px; }}
    .header p  {{ color: #a0aec0; margin: 4px 0 0; font-size: 13px; }}
    .badge {{ display: inline-block; background: #f6ad55; color: #1a202c;
               padding: 3px 10px; border-radius: 20px; font-size: 11px;
               font-weight: bold; letter-spacing: 1px; margin-top: 10px; }}
    .body {{ padding: 32px; }}
    .field {{ margin-bottom: 18px; }}
    .label {{ font-size: 11px; font-weight: bold; color: #718096;
               text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }}
    .value {{ font-size: 15px; color: #2d3748; padding: 10px 14px;
               background: #f7fafc; border-left: 3px solid #f6ad55;
               border-radius: 0 6px 6px 0; }}
    .message-box {{ font-size: 14px; color: #2d3748; padding: 14px;
                    background: #f7fafc; border-left: 3px solid #f6ad55;
                    border-radius: 0 6px 6px 0; white-space: pre-wrap; line-height: 1.6; }}
    .footer {{ background: #f7fafc; padding: 16px 32px; font-size: 11px;
               color: #a0aec0; text-align: center; border-top: 1px solid #e2e8f0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#9733; S.T.A.R.S</h1>
      <p>Student Talent and Recommendation System</p>
      <span class="badge">{kategori}</span>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Nama Pengirim</div>
        <div class="value">{nama}</div>
      </div>
      <div class="field">
        <div class="label">Email Pengirim</div>
        <div class="value">{email}</div>
      </div>
      <div class="field">
        <div class="label">Kategori</div>
        <div class="value">{kategori}</div>
      </div>
      <div class="field">
        <div class="label">Tanggal Kirim</div>
        <div class="value">{tanggal}</div>
      </div>
      <div class="field">
        <div class="label">Isi Pesan</div>
        <div class="message-box">{pesan}</div>
      </div>
    </div>
    <div class="footer">
      Pesan ini dikirim otomatis dari website STARS &mdash; jangan balas email ini langsung.
    </div>
  </div>
</body>
</html>
"""

    # Kirim via SMTP Gmail
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = email_subject
        msg["From"]    = smtp_user
        msg["To"]      = admin_email
        msg["Reply-To"]= email
        msg.attach(MIMEText(email_body, "html", "utf-8"))

        with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, admin_email, msg.as_string())

        return jsonify({
            "status" : "success",
            "message": "Pesan berhasil dikirim. Terima kasih atas masukan Anda!"
        })

    except smtplib.SMTPAuthenticationError:
        contact_logger.error("SMTP Auth gagal — periksa EMAIL_USER / EMAIL_PASSWORD di .env")
        return jsonify({"status": "error", "error": "Autentikasi email gagal. Hubungi admin."}), 500
    except smtplib.SMTPException as e:
        contact_logger.error(f"SMTPException: {e}")
        return jsonify({"status": "error", "error": "Server email error. Coba beberapa saat lagi."}), 500
    except Exception as e:
        contact_logger.error(f"Unexpected error saat kirim email: {e}")
        return jsonify({"status": "error", "error": "Terjadi kesalahan internal."}), 500


if __name__ == "__main__":
    # Run locally on port 5000
    app.run(debug=True, host="127.0.0.1", port=5000)
