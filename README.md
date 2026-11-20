# ChemLab — Contoh Pengajar

Contoh isian README dari Lampiran A handout **Vibe Coding React untuk Web Pembelajaran Kimia**. Dokumen pengarah di repo memakai bagian/urutan templat yang sama, lalu diisi dengan keputusan ChemLab. Mulai dari [PRD](PRD.md), lalu ikuti [alur pengguna](USER_FLOW.md), [desain teknis](DESAIN_TEKNIS.md), dan [kontrak data](DATABASE.md) sambil membuka web.

## Tujuan dan pengguna

ChemLab membantu siswa kelas XI mempelajari asam–basa dan pH melalui bacaan, representasi, perhitungan, dan diagnostik. Guru menggunakan jawaban per butir serta catatan siswa untuk menentukan tindak lanjut. Mahasiswa Pendidikan Kimia membaca repo ini untuk melihat penerapan dokumen handout pada produk.

Modul 1 adalah satu materi Asam–Basa dan pH. Tiga bacaan **Kenali asam & basa**, **Membaca skala pH**, dan **Kimia di sekitar kita** adalah bagian materi tersebut. ChemLab memilih tema hijau, JavaScript/CSS biasa, serta fitur pendamping berikut.

| Kebutuhan di PRD | Hasil pada web |
| --- | --- |
| Mengenali teori dan contoh | Tiga bacaan/24 bagian dengan sumber, refleksi, tabel dan contoh hitung |
| Memahami skala logaritmik | Laboratorium pH, [H₃O⁺]/[OH⁻], pOH, serta model HCl tiga konsentrasi pada 25 °C |
| Mengumpulkan bukti awal | Lima soal diagnostik, draf, pembahasan sesudah pengumpulan, latihan ulang terpisah |
| Mengumpulkan bukti setelah belajar | Asesmen akhir bab 15 soal, tinjauan, konfirmasi dan snapshot instrumen |
| Mengeksplorasi konsep | PhET, 36 model molekul lokal, PubChem dan catatan prediksi/pengamatan/penjelasan |
| Melanjutkan dan mendampingi belajar | Akun/progres Firestore, panel guru, pencarian, tur/bantuan, tampilan ponsel |

Contoh hubungan konkret: tujuan skala pH → aktivitas pH 3/5 → q2 dengan jawaban rasio 100 → jawaban tersimpan → rekap guru → tindak lanjut. [Panduan membaca contoh](docs/PANDUAN_REPLIKASI.md) menunjukkan dokumen/berkas dan tahap handoutnya. Seluruh pengembangan ChemLab tidak menjadi kewajiban seragam mahasiswa.

## Tautan

- Repo: [Wildan2150/chemlab-acidbase](https://github.com/Wildan2150/chemlab-acidbase).
- URL produksi: belum dicatat sebagai rilis hosting terverifikasi pada repo.
- Commit sumber rilis yang diuji: pemeriksaan lokal/emulator 20 November memakai `c26d58c3cdf823df353150313605dccc9c97876c`; rilis hosting belum dicatat.
- Identitas deployment: belum dicatat; tindak lanjut REL-01 pada [BACKLOG.md](BACKLOG.md).
- Catatan jawaban contoh/aturan cloud yang diuji: [TESTING.md](TESTING.md), `firestore.rules`, [DATABASE.md](DATABASE.md). [Bukti Rules/konfigurasi project pengajar](docs/firestore-production-check.json) bertanggal 10 November.
- Backlog/Issues dan PR/review: [BACKLOG.md](BACKLOG.md), [AI_LOG.md](AI_LOG.md), dan riwayat Git. Kontribusi/PR mahasiswa tidak direka.
- Handout: [repo handout pengajar](https://github.com/Wildan2150/handout-web-based-learning-kimia); Lampiran A berisi templat yang diisi pada dokumen-dokumen ini.

## Menjalankan source

1. Clone lewat Source Control IDE/terminal, lalu buka folder dengan `package.json`: `ProyekContoh` pada bundel kuliah atau `chemlab-acidbase` pada clone terpisah.
2. Gunakan Node ≥22.12.0 sesuai `package.json`. Pasang dependency dari lockfile dengan `npm.cmd ci --ignore-scripts`. `npm.cmd`/`npx.cmd` adalah bentuk Windows; gunakan `npm`/`npx` jika sesuai terminal/OS.
3. Pada salinan bersih, jalankan `npm.cmd run dev`; buka Local Vite, biasanya **http://127.0.0.1:5173**. Materi/lab/kuis tamu berjalan tanpa konfigurasi cloud. Jangan membuka `index.html` langsung.
4. Untuk akun/cloud lokal, sediakan Java 21+ pada PATH lalu jalankan `npm.cmd run dev:emulator`. Buka **http://127.0.0.1:5174**. Script memakai `demo-chemlab`, Auth 9099, Firestore 8080 dan hub 4400. Google memakai identitas fiktif emulator; tautan verifikasi/reset tersedia di emulator/terminal. Data sementara selama proses hidup.
5. Untuk project sendiri, salin `.env.example` ke `.env.local` dan isi konfigurasi Web App dari pengelola layanan Anda. Ikuti [Auth](docs/FIREBASE_AUTH_SETUP.md), [Firestore](docs/FIRESTORE_SETUP.md), dan [penetapan guru](docs/TEACHER_PANEL.md); restart Vite setelah perubahan.
6. Hentikan dengan Ctrl + C. Tutup stack manual sebelum suite browser agar port tidak bertabrakan.

Clone tidak membawa `.env.local` atau akses pengajar. Petunjuk clone, emulator, dan troubleshooting lengkap ada pada panduan membaca contoh.

## Build

- Perintah build: `npm.cmd run build`.
- Output yang dipakai hosting: `dist/`, termasuk `molecule-viewer.html`, aset molekul, pustaka dan font lokal.
- Cara preview paket: `npm.cmd run preview`, buka alamat tercetak, biasanya **http://127.0.0.1:4173**.
- Navigasi hash seperti `/#materi/kenali` dan `base: './'` tidak memerlukan rewrite history; uji tautan langsung/refresh tetap dilakukan pada hosting.
- Origin/port berbeda mempunyai localStorage berbeda. Konfigurasi emulator aktif pada produksi menonaktifkan akun; build berhasil saja belum membuktikan login bekerja.
- Uji logika: `npm.cmd test`. Uji browser: `npm.cmd run test:e2e`, memakai Edge pada Windows atau Chromium Playwright pada OS lain. Suite menyiapkan server 5173 dan stack emulator/aplikasi 5175; Java 21+ diperlukan.
- Pemeriksaan 20 November: 43 uji logika, 14 skenario akun/cloud/guru, build dan walkthrough preview lulus. Cakupan serta peringatan ada di TESTING.

## Data dan konfigurasi

- Provider, nama variabel tanpa nilai, dan dokumen DATABASE: Firebase Auth/Firestore; `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIRESTORE_DATABASE_ID`, `VITE_FIREBASE_USE_EMULATOR`. Lihat [DATABASE.md](DATABASE.md) dan `.env.example`.
- Batas akses siswa/guru dan daftar akun kelas: siswa hanya progres sendiri; satu guru terverifikasi yang ditetapkan pada UI/Rules membaca seluruh akun siswa aplikasi. Daftar keanggotaan kelas terpisah belum dibuat.
- Data belajar: materi/soal di `src/data`; tamu di `chemlab:guest:v1`; akun/antrean pada key UID; cloud di `learningProgress/{UID}` dan `learnerProfiles/{UID}`.
- Keputusan khas: seluruh progres akun, termasuk draf/riwayat/materi/catatan, disinkronkan. Tamu tetap terpisah; reset akun juga mereset cloud. Ekspor belum mempunyai impor.
- Guru tidak menulis hasil siswa lain. Skor/kunci berada di client; Rules menjaga kepemilikan/metadata, bukan keutuhan tiap jawaban di payload.
- Font/ikon/SDF/3Dmol lokal; PhET, pencarian PubChem dan Firebase memakai layanan luar. Gagal memuat aktivitas tidak menghalangi catatan.

## Status produk

- MVP yang sudah diuji: materi/diagnostik/progres, hitungan pH, akun/Firestore, panel guru; fitur pengembangan memiliki kontrak dan bukti di `docs/` serta TESTING.
- Lingkungan dan tanggal uji: Windows, Node 24.20.0, Edge headless, Java 21.0.13; salinan bersih, preview dan emulator `demo-chemlab`, 20 November 2026.
- Keterbatasan/issue terbuka: validasi isi/pedagogik, uji mahasiswa pemula, aksesibilitas manual, evaluasi bundle, serta identitas/uji rilis hosting. Arsip diagnostik perlu dirancang sebelum bank diganti; belum PWA/ujian dengan penilaian server.
- Checkpoint terakhir: source contoh `c26d58c` di `main`; checkpoint kelas tidak direka. Pada proyek mahasiswa isi checkpoint dan H−1 sesuai pekerjaan nyata.
- Keunikan dan kontrak ChemLab dipertahankan; PRD, alur, desain, data dan uji menjelaskan keputusan yang sama.

## Portofolio

| Dokumen sesuai handout | Isian konkret dalam repo |
| --- | --- |
| [TEAM](TEAM.md) | Proyek bersama, pelaksana/peran, kesepakatan dan layanan |
| [PRD](PRD.md) | Pengguna, tujuan, cakupan, rancangan penilaian, desain, sumber dan batas |
| [USER_FLOW](USER_FLOW.md) | Alur inti, keadaan lain dan jalur fitur yang terlihat di web |
| [DESAIN_TEKNIS](DESAIN_TEKNIS.md) | Berkas, navigasi, data, perilaku, keputusan dan risiko |
| [DATABASE](DATABASE.md) | Lingkup, data/akses, sinkronisasi, konfigurasi dan hasil uji |
| [AGENTS](AGENTS.md) | Aturan kerja 1–15 dari templat dan ketentuan khusus ChemLab |
| [BACKLOG](BACKLOG.md) | MVP, alasan/kriteria, rincian fitur, temuan dan tindak lanjut |
| [AI_LOG](AI_LOG.md) | Tugas, bantuan, keputusan, aktual, bukti dan keterbatasan |
| [TESTING](TESTING.md) | Identitas/lingkungan, matriks langkah–harapan–aktual–status, dan rilis |

Sumber/lisensi materi, gambar dan data: [MATERIAL_SOURCES](docs/MATERIAL_SOURCES.md), [INTERACTIVE_ACTIVITIES](docs/INTERACTIVE_ACTIVITIES.md), [MOLECULE_CATALOGUE](docs/MOLECULE_CATALOGUE.md). Kontrak tambahan: [asesmen](docs/CHAPTER_ASSESSMENT.md), [onboarding](docs/ONBOARDING.md). [Pratinjau desktop](docs/preview-desktop.png) dan [ponsel](docs/preview-mobile.png) adalah bukti tahap pengembangan; periksa source berjalan untuk perilaku terbaru.
