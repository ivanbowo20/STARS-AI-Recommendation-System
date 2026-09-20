# ================================================================
#   STARS — Sistem Rekomendasi Jurusan Kuliah
#   Versi    : 6.0
#   Algoritma: DecisionTreeClassifier (Scikit-Learn)
#   Dataset  : 10.000 siswa, 20 jurusan, 18 fitur
#   Output   : Siap digunakan sebagai backend Flask website STARS
# ================================================================

# ════════════════════════════════════════════════════════════════
# BAGIAN 1 — IMPORT LIBRARY
# ════════════════════════════════════════════════════════════════
import joblib
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import (accuracy_score, classification_report,
                              confusion_matrix)


# ════════════════════════════════════════════════════════════════
# BAGIAN 2 — KONSTANTA & PILIHAN VALID SETIAP FITUR
#   Digunakan untuk: validasi input, dropdown form website,
#   soft-smoothing probabilitas, dan alasan rekomendasi.
# ════════════════════════════════════════════════════════════════

JURUSAN_LIST = [
    "Teknik Informatika", "Sistem Informasi", "Teknik Elektro",
    "Akuntansi", "Manajemen", "Hukum", "Pendidikan",
    "Desain Komunikasi Visual", "Ilmu Komunikasi", "Ilmu Keolahragaan",
    "Manajemen Bisnis", "Kedokteran", "Psikologi", "Teknik Sipil",
    "Teknik Mesin", "Teknik Industri", "Teknik Lingkungan",
    "Farmasi", "Arsitektur", "Administrasi Bisnis",
]

PILIHAN = {
    "Minat": ["Teknologi","Bisnis","Seni","Pendidikan","Olahraga","Sosial",
               "Teknik","Kesehatan","Sains","Psikologi","Lingkungan"],
    "Hobi" : ["Coding","Membaca","Menggambar","Taekwondo","Sepak Bola","Musik",
               "Menulis","Berjualan","Robotika","Web Development","UI/UX Design",
               "Mobile Development","Video Editing","Public Speaking","Content Creator",
               "Esport","Atletik","Basket","Renang","Fotografi","Desain Grafis",
               "Game Development","Merakit Elektronik","Penelitian","Volunteering",
               "PMR","Pramuka","Debat","Investasi","Olahraga"],
    "Kemampuan_Komputer"       : ["Rendah","Sedang","Tinggi"],
    "Kemampuan_Komunikasi"     : ["Rendah","Sedang","Tinggi"],
    "Kemampuan_Kepemimpinan"   : ["Rendah","Sedang","Tinggi"],
    "Kemampuan_Analisis"       : ["Rendah","Sedang","Tinggi"],
    "Kemampuan_Kreativitas"    : ["Rendah","Sedang","Tinggi"],
    "Kemampuan_Problem_Solving": ["Rendah","Sedang","Tinggi"],
    "Mata_Pelajaran_Favorit"   : ["Matematika","Fisika","Kimia","Biologi","Ekonomi",
                                   "Informatika","Bahasa Inggris","Geografi","Sejarah",
                                   "Sosiologi","Seni Budaya","Bahasa Indonesia","PJOK"],
    "Gaya_Belajar"             : ["Visual","Auditori","Kinestetik","Membaca/Menulis"],
    "Tujuan_Karier"            : ["Software Engineer","Data Scientist","Dokter","Psikolog",
                                   "Arsitek","Akuntan","Pengacara","Guru","Dosen",
                                   "Entrepreneur","Business Analyst","UI UX Designer",
                                   "Content Creator","Apoteker","Insinyur Sipil",
                                   "Insinyur Mesin","Konsultan Lingkungan","Manajer",
                                   "Pelatih Olahraga","Network Engineer"],
    "Aktivitas_Organisasi"     : ["Tidak Aktif","OSIS","MPK","BEM","Pramuka","PMR",
                                   "Paskibra","Komunitas IT","Komunitas Seni",
                                   "Komunitas Olahraga","Karang Taruna",
                                   "Organisasi Keagamaan","Volunteering"],
    "Prestasi_Akademik"        : ["Tidak Ada",
                                   "Kecamatan - Matematika","Kecamatan - Fisika",
                                   "Kecamatan - Kimia","Kecamatan - Biologi",
                                   "Kecamatan - Informatika","Kecamatan - Debat",
                                   "Kecamatan - Bahasa Inggris","Kecamatan - Sains",
                                   "Kecamatan - Ekonomi","Kecamatan - Bahasa Indonesia",
                                   "Sekolah - Matematika","Sekolah - Fisika",
                                   "Sekolah - Kimia","Sekolah - Biologi",
                                   "Sekolah - Informatika","Sekolah - Debat",
                                   "Sekolah - Bahasa Inggris","Sekolah - Sains",
                                   "Sekolah - Ekonomi","Sekolah - Bahasa Indonesia",
                                   "Kabupaten - Matematika","Kabupaten - Fisika",
                                   "Kabupaten - Kimia","Kabupaten - Biologi",
                                   "Kabupaten - Informatika","Kabupaten - Debat",
                                   "Kabupaten - Bahasa Inggris","Kabupaten - Sains",
                                   "Kabupaten - Ekonomi","Kabupaten - Bahasa Indonesia",
                                   "Provinsi - Matematika","Provinsi - Fisika",
                                   "Provinsi - Kimia","Provinsi - Biologi",
                                   "Provinsi - Informatika","Provinsi - Debat",
                                   "Provinsi - Bahasa Inggris","Provinsi - Sains",
                                   "Provinsi - Ekonomi","Provinsi - Bahasa Indonesia",
                                   "Nasional - Matematika","Nasional - Fisika",
                                   "Nasional - Kimia","Nasional - Biologi",
                                   "Nasional - Informatika","Nasional - Debat",
                                   "Nasional - Bahasa Inggris","Nasional - Sains",
                                   "Nasional - Ekonomi","Nasional - Bahasa Indonesia",
                                   "Internasional - Matematika","Internasional - Fisika",
                                   "Internasional - Kimia","Internasional - Biologi",
                                   "Internasional - Informatika","Internasional - Debat",
                                   "Internasional - Bahasa Inggris","Internasional - Sains",
                                   "Internasional - Ekonomi","Internasional - Bahasa Indonesia"],
    "Prestasi_NonAkademik"     : ["Tidak Ada",
                                   "Olahraga - Sekolah","Olahraga - Kecamatan",
                                   "Olahraga - Kabupaten","Olahraga - Provinsi",
                                   "Olahraga - Nasional","Olahraga - Internasional",
                                   "Seni - Sekolah","Seni - Kecamatan",
                                   "Seni - Kabupaten","Seni - Provinsi",
                                   "Seni - Nasional","Seni - Internasional",
                                   "Organisasi - Sekolah","Organisasi - Kecamatan",
                                   "Organisasi - Kabupaten","Organisasi - Provinsi",
                                   "Organisasi - Nasional","Organisasi - Internasional",
                                   "Kepemimpinan - Sekolah","Kepemimpinan - Kecamatan",
                                   "Kepemimpinan - Kabupaten","Kepemimpinan - Provinsi",
                                   "Kepemimpinan - Nasional","Kepemimpinan - Internasional",
                                   "PMR - Sekolah","PMR - Kecamatan","PMR - Kabupaten",
                                   "PMR - Provinsi","PMR - Nasional","PMR - Internasional",
                                   "Pramuka - Sekolah","Pramuka - Kecamatan",
                                   "Pramuka - Kabupaten","Pramuka - Provinsi",
                                   "Pramuka - Nasional","Pramuka - Internasional",
                                   "Paskibra - Sekolah","Paskibra - Kecamatan",
                                   "Paskibra - Kabupaten","Paskibra - Provinsi",
                                   "Paskibra - Nasional","Paskibra - Internasional"],
}

# Urutan kolom fitur — HARUS konsisten di seluruh kode
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


# ════════════════════════════════════════════════════════════════
# BAGIAN 3 — LOAD DATASET
# ════════════════════════════════════════════════════════════════
print("=" * 70)
print("   STARS — Sistem Rekomendasi Jurusan Kuliah  v6.0")
print("=" * 70)

CSV_PATH = "dataset_jurusan_10000.csv"
df = pd.read_csv(CSV_PATH)
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

# Pastikan kolom lengkap
kolom_kurang = [c for c in KOLOM_FITUR + ["Jurusan"] if c not in df.columns]
if kolom_kurang:
    raise ValueError(f"Kolom berikut tidak ada di CSV: {kolom_kurang}")

# Hapus baris dengan missing value
df = df.dropna(subset=KOLOM_FITUR + ["Jurusan"]).reset_index(drop=True)

print(f"\n📂 Dataset   : {CSV_PATH}")
print(f"   Baris    : {len(df):,}  |  Fitur: {len(KOLOM_FITUR)}  |  Jurusan: {df['Jurusan'].nunique()}")

print(f"\n📋 Distribusi Jurusan:")
for j, n in df["Jurusan"].value_counts().items():
    bar = "█" * (n // 25)
    print(f"   {j:32s}: {n:5d}  {bar}")

print(f"\n📊 Statistik Nilai:")
print(df[["Matematika","Bahasa_Inggris","IPA","IPS"]].describe().round(1).to_string())


# ════════════════════════════════════════════════════════════════
# BAGIAN 4 — ENCODING
#   LabelEncoder mengubah teks → angka untuk setiap kolom
#   kategorikal. Encoder disimpan ke encoders.pkl agar bisa
#   dipakai ulang saat prediksi di Flask tanpa training ulang.
# ════════════════════════════════════════════════════════════════
encoders = {}
df_enc   = df.copy()

for kolom in KOLOM_KATEGORIKAL:
    le = LabelEncoder()
    df_enc[kolom] = le.fit_transform(df[kolom].astype(str))
    encoders[kolom] = le

print(f"\n🔢 Encoding selesai — {len(encoders)} kolom di-encode.")

# Split fitur & target
X = df_enc[KOLOM_FITUR]
y = df_enc["Jurusan"]

# Split training & testing (80/20, stratify agar seimbang)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"✂️  Split  → Training: {len(X_train):,}  |  Testing: {len(X_test):,}")


# ════════════════════════════════════════════════════════════════
# BAGIAN 5 — TRAINING
#   Parameter dioptimalkan untuk 10.000 data dan 20 kelas:
#     max_depth=15        — cukup dalam untuk pola kompleks
#     min_samples_split=30— cegah split pada node kecil
#     min_samples_leaf=15 — setiap daun ≥15 sampel
#                           → predict_proba() tidak 100%/0%
#     class_weight=balanced — kompensasi kelas tidak seimbang
# ════════════════════════════════════════════════════════════════
model = DecisionTreeClassifier(
    max_depth=15,
    min_samples_split=30,
    min_samples_leaf=15,
    criterion="gini",
    class_weight="balanced",
    random_state=42,
)
model.fit(X_train, y_train)
print("\n✅ Model berhasil dilatih.")


# ════════════════════════════════════════════════════════════════
# BAGIAN 6 — EVALUASI
# ════════════════════════════════════════════════════════════════
label_jurusan = encoders["Jurusan"].classes_

y_pred_train = model.predict(X_train)
y_pred_test  = model.predict(X_test)

acc_train = accuracy_score(y_train, y_pred_train) * 100
acc_test  = accuracy_score(y_test,  y_pred_test)  * 100

print(f"\n{'─'*70}")
print(f"  📈 Akurasi Training : {acc_train:.2f}%")
print(f"  📉 Akurasi Testing  : {acc_test:.2f}%")
print(f"{'─'*70}")

print("\n📄 Classification Report (Test Set):")
print(classification_report(
    y_test, y_pred_test,
    target_names=label_jurusan,
    zero_division=0,
))

# Confusion matrix teks
cm    = confusion_matrix(y_test, y_pred_test)
cm_df = pd.DataFrame(cm, index=label_jurusan, columns=label_jurusan)
print("🔲 Confusion Matrix (Test Set):")
print(cm_df.to_string())


# ════════════════════════════════════════════════════════════════
# BAGIAN 7 — VISUALISASI
# ════════════════════════════════════════════════════════════════

# 7a. Heatmap Confusion Matrix
print("\n🌡️  Membuat heatmap confusion matrix...")
fig_cm, ax_cm = plt.subplots(figsize=(18, 14))
sns.heatmap(
    cm_df, annot=True, fmt="d", cmap="Blues",
    linewidths=0.4, ax=ax_cm,
    cbar_kws={"label": "Jumlah Prediksi"},
    annot_kws={"size": 7},
)
ax_cm.set_title(
    "Confusion Matrix — STARS Rekomendasi Jurusan v6.0 (Test Set)",
    fontsize=14, fontweight="bold", pad=15,
)
ax_cm.set_xlabel("Prediksi", fontsize=11)
ax_cm.set_ylabel("Aktual",   fontsize=11)
ax_cm.set_xticklabels(ax_cm.get_xticklabels(), rotation=45, ha="right", fontsize=8)
ax_cm.set_yticklabels(ax_cm.get_yticklabels(), rotation=0,  fontsize=8)
CM_PATH = "confusion_matrix.png"
plt.tight_layout()
plt.savefig(CM_PATH, dpi=130, bbox_inches="tight")
plt.close()
print(f"   ✅ Heatmap → {CM_PATH}")

# 7b. Pohon Keputusan
print("🌳 Membuat visualisasi pohon keputusan (depth=4 untuk keterbacaan)...")
fig_t, ax_t = plt.subplots(figsize=(50, 26))

# Buat sub-model dengan depth lebih pendek khusus visualisasi
model_vis = DecisionTreeClassifier(max_depth=4, random_state=42)
model_vis.fit(X_train, y_train)

plot_tree(
    model_vis,
    feature_names=KOLOM_FITUR,
    class_names=label_jurusan,
    filled=True, rounded=True,
    fontsize=7, ax=ax_t, impurity=False,
)
ax_t.set_title(
    "Pohon Keputusan — STARS v6.0 (20 Jurusan, 18 Fitur)",
    fontsize=18, fontweight="bold", pad=20,
)
TREE_PATH = "pohon_keputusan.png"
plt.tight_layout()
plt.savefig(TREE_PATH, dpi=100, bbox_inches="tight")
plt.close()
print(f"   ✅ Pohon   → {TREE_PATH}")


# ════════════════════════════════════════════════════════════════
# BAGIAN 8 — PENYIMPANAN MODEL
# ════════════════════════════════════════════════════════════════
MODEL_PATH   = "model_decision_tree.pkl"
ENCODER_PATH = "encoders.pkl"

joblib.dump(model,    MODEL_PATH)
joblib.dump(encoders, ENCODER_PATH)

print(f"\n💾 Model    → {MODEL_PATH}")
print(f"💾 Encoders → {ENCODER_PATH}")
print("   (Muat ulang di Flask: joblib.load(...)  tanpa perlu training ulang)")


# ════════════════════════════════════════════════════════════════
# BAGIAN 9 — KONTEN STATIS PER JURUSAN
#   Digunakan untuk membangun output ramah pengguna website.
# ════════════════════════════════════════════════════════════════

# 9a. Jurusan alternatif (bidang berkaitan)
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

# 9b. Prospek karier per jurusan
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

# 9c. Profil kemiripan fitur per jurusan
#     Digunakan oleh fungsi soft_proba() untuk smoothing
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

# 9d. Faktor analisis alasan (untuk teks penjelasan)
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


# ════════════════════════════════════════════════════════════════
# BAGIAN 10 — SOFT PROBABILITY SMOOTHING
#   Masalah Decision Tree: daun tunggal → proba 100%/0%.
#   Solusi: blending proba model dengan skor kemiripan fitur.
#
#   Formula: p_final = α × p_model + (1-α) × p_similarity
#   α = 0.70  (model lebih dominan, tapi tidak ekstrem)
# ════════════════════════════════════════════════════════════════

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


def soft_proba(proba_model: np.ndarray, siswa: dict,
               alpha: float = 0.70) -> np.ndarray:
    """
    Gabungkan proba model (70%) dengan skor kemiripan (30%).
    Hasilnya: distribusi lebih realistis, total tetap 1.0.
    """
    skor_sim = hitung_skor_kemiripan(siswa)
    sim_arr  = np.array([skor_sim.get(j, 0.0) for j in label_jurusan])
    blended  = alpha * proba_model + (1 - alpha) * sim_arr
    total    = blended.sum()
    return blended / total if total > 0 else blended


# ════════════════════════════════════════════════════════════════
# BAGIAN 11 — FUNGSI PENDUKUNG OUTPUT
# ════════════════════════════════════════════════════════════════

def proba_ke_kategori(prob: float) -> dict:
    """Ubah float probabilitas → label + bintang + warna hex."""
    pct = prob * 100
    if   pct >= 90: return {"label":"Sangat Tinggi","bintang":"⭐⭐⭐⭐⭐","warna":"#1a7f37"}
    elif pct >= 75: return {"label":"Tinggi",        "bintang":"⭐⭐⭐⭐",  "warna":"#0969da"}
    elif pct >= 60: return {"label":"Cukup Tinggi",  "bintang":"⭐⭐⭐",    "warna":"#9a6700"}
    elif pct >= 45: return {"label":"Sedang",        "bintang":"⭐⭐",      "warna":"#cf6900"}
    else:           return {"label":"Rendah",        "bintang":"⭐",        "warna":"#cf222e"}


NAMA_KOLOM = {
    "Matematika":"Matematika","Bahasa_Inggris":"Bahasa Inggris",
    "IPA":"IPA","IPS":"IPS",
}

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


# ════════════════════════════════════════════════════════════════
# BAGIAN 12 — FUNGSI PREDIKSI UTAMA
#   Siap dipanggil dari endpoint Flask:
#     @app.route("/api/prediksi", methods=["POST"])
#     def route_prediksi():
#         return jsonify(prediksi_jurusan(request.get_json()))
# ════════════════════════════════════════════════════════════════

def prediksi_jurusan(data_siswa: dict) -> dict:
    """
    Terima data siswa → encode → prediksi → return dict lengkap.

    Parameter
    ----------
    data_siswa : dict
        Semua 18 fitur dengan nilai asli (belum di-encode).

    Return
    ------
    dict siap di-jsonify:
      jurusan_utama      : str
      tingkat_kecocokan  : dict  {label, bintang, warna}
      alasan             : list[str]
      alternatif         : list[dict]  {jurusan, tingkat_kecocokan}
      prospek_karier     : list[str]
      top3               : list[dict]  {rank, jurusan, persen, ...}
      ranking            : list[dict]  semua jurusan
    """
    inp = data_siswa.copy()

    # Encode kolom kategorikal
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
    proba_raw    = model.predict_proba(baris)[0]

    # Soft smoothing → distribusi lebih realistis
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
        "jurusan_utama"    : jurusan_utama,
        "tingkat_kecocokan": proba_ke_kategori(prob_utama),
        "alasan"           : buat_alasan(data_siswa, jurusan_utama),
        "alternatif"       : alt_list,
        "prospek_karier"   : KARIER.get(jurusan_utama, []),
        "top3"             : ranking[:3],
        "ranking"          : ranking,
    }


# ════════════════════════════════════════════════════════════════
# BAGIAN 13 — TAMPILAN OUTPUT FORMAT WEBSITE
# ════════════════════════════════════════════════════════════════

NAMA_DISPLAY = {
    "Matematika":"Matematika","Bahasa_Inggris":"Bahasa Inggris",
    "IPA":"IPA","IPS":"IPS","Minat":"Minat","Hobi":"Hobi",
    "Kemampuan_Komputer":"Kemampuan Komputer",
    "Kemampuan_Komunikasi":"Kemampuan Komunikasi",
    "Kemampuan_Kepemimpinan":"Kemampuan Kepemimpinan",
    "Kemampuan_Analisis":"Kemampuan Analisis",
    "Kemampuan_Kreativitas":"Kemampuan Kreativitas",
    "Kemampuan_Problem_Solving":"Kemampuan Problem Solving",
    "Mata_Pelajaran_Favorit":"Mata Pelajaran Favorit",
    "Gaya_Belajar":"Gaya Belajar",
    "Tujuan_Karier":"Tujuan Karier",
    "Aktivitas_Organisasi":"Aktivitas Organisasi",
    "Prestasi_Akademik":"Prestasi Akademik",
    "Prestasi_NonAkademik":"Prestasi Non-Akademik",
}

def tampilkan_hasil(hasil: dict, siswa: dict):
    """Cetak output prediksi dalam format kartu website."""
    LINE = "═" * 65
    DASH = "─" * 65

    print(f"\n{LINE}")
    print("   📋  HASIL REKOMENDASI JURUSAN  — STARS v6.0")
    print(f"{LINE}")

    # 1. Data input siswa
    print("\n   📝 Data Siswa:")
    for k, v in siswa.items():
        print(f"      {NAMA_DISPLAY.get(k,k):<30}: {v}")

    # 2. Jurusan utama
    print(f"\n{DASH}")
    print(f"   🎓  JURUSAN REKOMENDASI UTAMA")
    print(f"       {hasil['jurusan_utama']}")

    # 3. Tingkat kecocokan
    tk = hasil["tingkat_kecocokan"]
    print(f"\n   ⭐  TINGKAT KECOCOKAN")
    print(f"       {tk['label']}  {tk['bintang']}")

    # 4. Alasan rekomendasi
    print(f"\n   ✅  ALASAN REKOMENDASI")
    for a in hasil["alasan"]:
        print(f"       ✓  {a}")

    # 5. Prospek karier
    print(f"\n   💼  PROSPEK KARIER")
    for k_ in hasil["prospek_karier"]:
        print(f"       •  {k_}")

    # 6. Top 3 alternatif
    print(f"\n   🔄  JURUSAN ALTERNATIF")
    medali = ["🥈","🥉"]
    for i, alt in enumerate(hasil["alternatif"]):
        tk_a = alt["tingkat_kecocokan"]
        print(f"       {medali[i]}  {alt['jurusan']:<34} {tk_a['label']}  {tk_a['bintang']}")

    # 7. Ranking lengkap semua jurusan
    print(f"\n{DASH}")
    print("   📊  RANKING KECOCOKAN SEMUA JURUSAN")
    print(f"{DASH}")
    print(f"   {'No':>3}  {'Jurusan':<32}  {'%':>6}  Kategori")
    print(f"   {'─'*3}  {'─'*32}  {'─'*6}  {'─'*24}")
    for item in hasil["ranking"]:
        tk_r = item["tingkat_kecocokan"]
        print(f"   {item['rank']:>3}  {item['jurusan']:<32}  "
              f"{item['persen']:>6}  {tk_r['label']}  {tk_r['bintang']}")

    print(f"\n{LINE}")


# ════════════════════════════════════════════════════════════════
# BAGIAN 14 — CONTOH PREDIKSI (4 PROFIL BERBEDA)
# ════════════════════════════════════════════════════════════════

contoh_siswa = [
    {   # Profil: Teknologi / Coding
        "Matematika":88,"Bahasa_Inggris":80,"IPA":85,"IPS":72,
        "Minat":"Teknologi","Hobi":"Coding",
        "Kemampuan_Komputer":"Tinggi","Kemampuan_Komunikasi":"Sedang",
        "Kemampuan_Kepemimpinan":"Sedang","Kemampuan_Analisis":"Tinggi",
        "Kemampuan_Kreativitas":"Sedang","Kemampuan_Problem_Solving":"Tinggi",
        "Mata_Pelajaran_Favorit":"Informatika","Gaya_Belajar":"Visual",
        "Tujuan_Karier":"Software Engineer","Aktivitas_Organisasi":"Komunitas IT",
        "Prestasi_Akademik":"Kabupaten - Informatika",
        "Prestasi_NonAkademik":"Tidak Ada",
    },
    {   # Profil: Kesehatan / Kedokteran
        "Matematika":87,"Bahasa_Inggris":84,"IPA":91,"IPS":74,
        "Minat":"Kesehatan","Hobi":"Penelitian",
        "Kemampuan_Komputer":"Sedang","Kemampuan_Komunikasi":"Tinggi",
        "Kemampuan_Kepemimpinan":"Sedang","Kemampuan_Analisis":"Tinggi",
        "Kemampuan_Kreativitas":"Sedang","Kemampuan_Problem_Solving":"Tinggi",
        "Mata_Pelajaran_Favorit":"Biologi","Gaya_Belajar":"Membaca/Menulis",
        "Tujuan_Karier":"Dokter","Aktivitas_Organisasi":"PMR",
        "Prestasi_Akademik":"Provinsi - Biologi",
        "Prestasi_NonAkademik":"PMR - Kabupaten",
    },
    {   # Profil: Seni / DKV
        "Matematika":63,"Bahasa_Inggris":74,"IPA":62,"IPS":71,
        "Minat":"Seni","Hobi":"Desain Grafis",
        "Kemampuan_Komputer":"Sedang","Kemampuan_Komunikasi":"Sedang",
        "Kemampuan_Kepemimpinan":"Rendah","Kemampuan_Analisis":"Sedang",
        "Kemampuan_Kreativitas":"Tinggi","Kemampuan_Problem_Solving":"Sedang",
        "Mata_Pelajaran_Favorit":"Seni Budaya","Gaya_Belajar":"Visual",
        "Tujuan_Karier":"UI UX Designer","Aktivitas_Organisasi":"Komunitas Seni",
        "Prestasi_Akademik":"Tidak Ada",
        "Prestasi_NonAkademik":"Seni - Kabupaten",
    },
    {   # Profil: Teknik / Mesin (ambigu Teknik)
        "Matematika":84,"Bahasa_Inggris":71,"IPA":83,"IPS":65,
        "Minat":"Teknik","Hobi":"Robotika",
        "Kemampuan_Komputer":"Sedang","Kemampuan_Komunikasi":"Rendah",
        "Kemampuan_Kepemimpinan":"Rendah","Kemampuan_Analisis":"Tinggi",
        "Kemampuan_Kreativitas":"Sedang","Kemampuan_Problem_Solving":"Tinggi",
        "Mata_Pelajaran_Favorit":"Fisika","Gaya_Belajar":"Kinestetik",
        "Tujuan_Karier":"Insinyur Mesin","Aktivitas_Organisasi":"Tidak Aktif",
        "Prestasi_Akademik":"Kabupaten - Fisika",
        "Prestasi_NonAkademik":"Tidak Ada",
    },
]

for siswa in contoh_siswa:
    hasil = prediksi_jurusan(siswa)
    tampilkan_hasil(hasil, siswa)

print(f"\nFile output:")
print(f"  🤖 {MODEL_PATH}  |  {ENCODER_PATH}")
print(f"  🌳 {TREE_PATH}   |  {CM_PATH}")
print(f"  📄 dataset dimuat dari: {CSV_PATH}")


# ════════════════════════════════════════════════════════════════
# BAGIAN 15 — TEMPLATE FLASK  ← hapus # untuk mengaktifkan
#
#   pip install flask
#   python stars_rekomendasi.py
#
#   Endpoint:
#     GET  /                      → status
#     POST /api/prediksi          → prediksi jurusan (JSON body)
#     GET  /api/jurusan           → daftar 20 jurusan
#     GET  /api/fitur             → semua pilihan dropdown
#     GET  /api/karier/<jurusan>  → prospek karier
# ════════════════════════════════════════════════════════════════

# from flask import Flask, request, jsonify
# app = Flask(__name__)
#
# # Muat model yang sudah disimpan (tidak perlu training ulang)
# _model    = joblib.load("model_decision_tree.pkl")
# _encoders = joblib.load("encoders.pkl")
# _label    = _encoders["Jurusan"].classes_
#
# @app.route("/", methods=["GET"])
# def index():
#     return jsonify({"status":"ok","sistem":"STARS","versi":"6.0"})
#
# @app.route("/api/prediksi", methods=["POST"])
# def route_prediksi():
#     data = request.get_json()
#     if not data: return jsonify({"error":"Body JSON kosong"}), 400
#     try:    return jsonify(prediksi_jurusan(data))
#     except Exception as e: return jsonify({"error":str(e)}), 500
#
# @app.route("/api/jurusan")
# def route_jurusan():
#     return jsonify({"jurusan": JURUSAN_LIST})
#
# @app.route("/api/fitur")
# def route_fitur():
#     return jsonify(PILIHAN)
#
# @app.route("/api/karier/<jurusan>")
# def route_karier(jurusan):
#     k = KARIER.get(jurusan)
#     if not k: return jsonify({"error":"Jurusan tidak ditemukan"}), 404
#     return jsonify({"jurusan":jurusan,"prospek_karier":k})
#
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)