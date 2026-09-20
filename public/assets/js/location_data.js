// ============================================================
// STARS V4.5 — Location Data
// Province → City/Regency mapping from kampus_indonesia.csv
// ============================================================

const STARS_LOCATION_DATA = {
    "Aceh":                   ["Banda Aceh"],
    "Bali":                   ["Badung", "Denpasar", "Singaraja"],
    "Banten":                 ["Serang", "Tangerang"],
    "Bengkulu":               ["Bengkulu"],
    "DI Yogyakarta":          ["Bantul", "Sleman", "Yogyakarta"],
    "DKI Jakarta":            ["Jakarta"],
    "Gorontalo":              ["Gorontalo"],
    "Jambi":                  ["Jambi"],
    "Jawa Barat":             ["Bandung", "Bekasi", "Bogor", "Cianjur", "Cirebon", "Depok", "Garut", "Sukabumi", "Sumedang", "Tasikmalaya"],
    "Jawa Tengah":            ["Banyumas", "Klaten", "Magelang", "Pati", "Pekalongan", "Purwokerto", "Salatiga", "Semarang", "Solo", "Surakarta", "Tegal"],
    "Jawa Timur":             ["Banyuwangi", "Blitar", "Gresik", "Jember", "Kediri", "Lumajang", "Madiun", "Malang", "Mojokerto", "Pasuruan", "Sidoarjo", "Surabaya"],
    "Kalimantan Barat":       ["Pontianak", "Singkawang"],
    "Kalimantan Selatan":     ["Banjarbaru", "Banjarmasin"],
    "Kalimantan Tengah":      ["Palangka Raya", "Sampit"],
    "Kalimantan Timur":       ["Balikpapan", "Bontang", "Samarinda"],
    "Kalimantan Utara":       ["Tarakan", "Nunukan"],
    "Kepulauan Bangka Belitung": ["Pangkal Pinang"],
    "Kepulauan Riau":         ["Batam", "Tanjung Pinang"],
    "Lampung":                ["Bandar Lampung", "Metro"],
    "Maluku":                 ["Ambon", "Tual"],
    "Maluku Utara":           ["Ternate", "Tidore Kepulauan"],
    "Nusa Tenggara Barat":    ["Bima", "Mataram", "Sumbawa"],
    "Nusa Tenggara Timur":    ["Ende", "Kupang", "Maumere"],
    "Papua":                  ["Jayapura", "Merauke"],
    "Papua Barat":            ["Manokwari", "Sorong"],
    "Riau":                   ["Dumai", "Pekanbaru"],
    "Sulawesi Barat":         ["Majene", "Mamuju"],
    "Sulawesi Selatan":       ["Makassar", "Parepare", "Palopo"],
    "Sulawesi Tengah":        ["Palu", "Poso"],
    "Sulawesi Tenggara":      ["Kendari", "Baubau"],
    "Sulawesi Utara":         ["Manado", "Bitung", "Tomohon"],
    "Sumatera Barat":         ["Bukittinggi", "Padang", "Padang Panjang", "Payakumbuh", "Solok"],
    "Sumatera Selatan":       ["Lubuklinggau", "Prabumulih", "Palembang"],
    "Sumatera Utara":         ["Binjai", "Medan", "Pematangsiantar", "Sibolga", "Tanjung Balai"],
};

// Island groupings for location scoring
const STARS_ISLAND_MAP = {
    "Jawa": ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten"],
    "Sumatera": ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung"],
    "Kalimantan": ["Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara"],
    "Sulawesi": ["Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat"],
    "Bali & Nusa Tenggara": ["Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur"],
    "Maluku": ["Maluku", "Maluku Utara"],
    "Papua": ["Papua", "Papua Barat"],
};

/**
 * Returns the island name for a given province
 */
function getIslandForProvince(province) {
    for (const [island, provinces] of Object.entries(STARS_ISLAND_MAP)) {
        if (provinces.includes(province)) return island;
    }
    return null;
}
