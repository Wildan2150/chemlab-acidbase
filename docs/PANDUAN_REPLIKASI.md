# Membaca dan Mereplikasi Contoh Penerapan Handout: ChemLab

**Untuk mahasiswa S1 Pendidikan Kimia · 20 November 2026**

[README](../README.md) · [PRD](../PRD.md) · [Alur](../USER_FLOW.md) · [Desain](../DESAIN_TEKNIS.md) · [Database](../DATABASE.md)

## 1. Cocokkan templat handout dengan dokumen yang sudah diisi

Repo ini memperlihatkan penerapan handout pada produk ChemLab. Buka Lampiran A di samping dokumen repo: nama bagian, urutan, serta isian pokoknya dipertahankan. Isi keputusan proyek adalah asam–basa/pH, kelas XI, tema hijau, serta fitur dan kontrak ChemLab.

| Templat Lampiran A | Contoh isian | Yang dicocokkan dengan hasil web |
| --- | --- | --- |
| PRD: pengguna, tujuan, cakupan, rancangan penilaian | [PRD.md](../PRD.md) | Tujuan dan alasan adanya materi, lab, q1–q5, asesmen, serta panel |
| AGENTS: aturan kerja 1–15 | [AGENTS.md](../AGENTS.md) | Batas kerja agent untuk data, fitur, sumber dan akses |
| TEAM: proyek, peran, kesepakatan, layanan | [TEAM.md](../TEAM.md) | Pelaksana contoh pengajar dan bukti yang nyata |
| BACKLOG: MVP, rincian interaksi, tindak lanjut | [BACKLOG.md](../BACKLOG.md) | Kebutuhan menjadi pekerjaan dengan alasan/kriteria penerimaan |
| USER_FLOW: alur inti, keadaan lain, jalur fitur | [USER_FLOW.md](../USER_FLOW.md) | Tindakan siswa/guru dan hasil yang muncul |
| DESAIN_TEKNIS: struktur, navigasi, data, perilaku | [DESAIN_TEKNIS.md](../DESAIN_TEKNIS.md) | Berkas yang mengatur halaman, hitungan dan state |
| DATABASE: lingkup, sumber, akses, sinkronisasi, uji | [DATABASE.md](../DATABASE.md) | Draf/jawaban tersimpan dan pemisahan UID/tamu |
| AI_LOG: tugas, bantuan, keputusan, verifikasi | [AI_LOG.md](../AI_LOG.md) | Cara perubahan diperiksa dan bukti aktual |
| TESTING: identitas, status, matriks, rilis | [TESTING.md](../TESTING.md) | Langkah, harapan, aktual, status dan uji ulang |
| README: tujuan, tautan, menjalankan, build, data, status | [README.md](../README.md) | Cara orang lain menjalankan dan memahami produk |

Handout dapat dibuka dari [repo pengajar](https://github.com/Wildan2150/handout-web-based-learning-kimia) atau salinan kelas. Word mahasiswa Revisi 03 dan sumber Markdown memuat tahapan local first. Nama berkas lama dapat masih menyebut database cloud; gunakan judul bab/prosedurnya.

## 2. Telusuri satu kebutuhan sampai menjadi hasil web

Gunakan kebutuhan “siswa dapat membandingkan konsentrasi pada dua nilai pH” sebagai contoh lengkap.

| Langkah penerapan | Isian/hasil ChemLab |
| --- | --- |
| PRD — Tujuan pembelajaran | Membandingkan konsentrasi dari dua nilai pH |
| PRD — Rancangan penilaian | Aktivitas pH 3 vs 5 dan diagnostik q2; pilihan rasio linear ditindaklanjuti |
| BACKLOG — MVP dan rincian interaksi | Lab lokal: siswa mengubah, mengamati angka, lalu menjelaskan |
| USER_FLOW — Alur inti | Baca skala pH → Laboratorium → bandingkan 3/5 → diagnostik → pembahasan |
| DESAIN_TEKNIS — Struktur/alur data | `Laboratory.jsx` menerima input; `phInfo` di `chemistry.js` menghitung; `chemData.js` menyimpan q2 |
| Hasil pada web | [H₃O⁺] 10⁻³ dan 10⁻⁵; rasio 100 pada pendekatan ideal 25 °C |
| DATABASE — Sumber data | Jawaban q2 adalah indeks pilihan dalam draf/riwayat; akun menyinkronkan payload UID |
| Panel guru | Jawaban per siswa dan rekap q2; diagnostik pertama berbeda dari latihan ulang |
| TESTING — Matriks | Angka/hitungan, skor, draf/refresh, sinkronisasi dan rekap diperiksa |
| Tindak lanjut | Siswa menjelaskan 10⁻³/10⁻⁵ = 100 dan arah perbandingan |

Ilustrasi jawaban `{ q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 }` menghasilkan 100 pada bank aktif. Ini contoh skema, bukan hasil siswa nyata atau bukti produksi.

Terapkan cara baca yang sama pada fitur lain: kebutuhan → alasan/kriteria backlog → tindakan pengguna → berkas dan data → bukti uji. Tiga bacaan/24 bagian, lab pH, asesmen 15 soal, PhET, 36 molekul, PubChem dan tur adalah pilihan ChemLab. Pilih kedalaman/fitur proyek sendiri sesuai tujuan dan waktu.

## 3. Peta baca kode

Buka folder yang memuat `package.json` pada Explorer IDE. Gunakan Ctrl + P untuk menemukan berkas; tidak perlu membaca semua source sekaligus. Nama komponen pada handout dapat berbeda, misalnya `QuizSection.jsx` setara tanggung jawabnya dengan halaman kuis ChemLab, bukan berkas yang hilang.

| Yang ingin dipahami | Titik awal pada ChemLab | Periksa |
| --- | --- | --- |
| Tujuan, kartu materi, lima soal | `src/data/chemData.js` | `lessons`, `questions`, `QUESTION_VERSION`; ID dan indeks opsi |
| Isi bacaan dan sumber | `src/data/readingContent.js`, `src/pages/Materials.jsx` | Hubungan data, tampilan, daftar isi, dan referensi |
| Navigasi, komponen, props/state/event | `src/App.jsx`, `src/pages/Home.jsx` | Klik menu → rute hash → halaman; ikuti satu callback |
| Skor/pH | `src/lib/chemistry.js`, `src/pages/Laboratory.jsx`, `src/pages/Quiz.jsx` | Perhitungan terpisah dari input/tampilan |
| Draf, riwayat, reset, ekspor | `src/lib/storage.js`, `src/pages/Progress.jsx`, `src/hooks/useLearningProgress.js` | Satu percobaan, satu ID; key tamu/UID |
| Login/akun | `src/services/firebaseClient.js`, `src/services/account.js`, `src/contexts/AuthContext.jsx` | SDK provider, persistensi, pergantian UID |
| Sinkronisasi seluruh progres | `src/lib/progressSession.js`, `src/services/firestoreProgress.js` | Baca server → antrean → transaksi; berbeda dari `firebaseService.js` Lampiran B |
| Guru dan rekap | `src/lib/teacherAccess.js`, `src/services/teacherData.js`, `src/lib/teacherReport.js`, `src/pages/TeacherDashboard.jsx`, `firestore.rules` | Izin UI dan server; penyebut rekap |
| Asesmen akhir bab | `src/data/chapterAssessment.js`, `src/lib/chapterAssessment.js` | Versi/snapshot terpisah dari diagnostik |
| PhET/3D/PubChem dan catatan | `src/data/activities.js`, `src/data/molecules.js`, `src/pages/Exploration.jsx`, `public/molecules/sources.json` | Aktivitas siswa, sumber, checksum, dan kegagalan |
| Tema serta bantuan | `src/styles.css`, `src/styles-pages.css`, `src/components/OnboardingTour.jsx` | Warna/angka, ponsel, keyboard, preferensi UI terpisah |

Latihan literasi minimum: pilih satu teks pada beranda, temukan sumbernya, ubah tanpa AI, lihat hasil, lalu jelaskan diff. Setelah itu telusuri satu input pH dari event ke perhitungan dan tampilan. Jika menyunting soal/kunci, jangan menjalankan latihan tersebut dengan data hasil yang perlu dipertahankan: perubahan instrumen memerlukan keputusan versi/migrasi.

## 4. Membangun bertahap mengikuti tujuh pertemuan

Setiap tahap dimulai dari hasil tahap sebelumnya. Kerjakan Git lewat Source Control IDE sesuai Lampiran E; gunakan terminal jika itu jalur Anda. Sejak Bab 2, simpan pekerjaan melalui issue → branch → commit/push → PR → review → merge → ambil `main` terbaru → uji. Catat hasil aktual pada AI_LOG/TESTING milik Anda. Nama checkpoint di bawah adalah target kerja, bukan klaim bahwa repo ChemLab mempunyai tujuh snapshot kuliah siap checkout.

### Pertemuan 1 — Beranda individual dan dokumen pengarah

**Buka:** [Bab 1](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_01_Fondasi_dan_Setup_Proyek.md), prosedur 1-01–1-09, termasuk skills/desain 1-05B; Lampiran A dan D.

1. Ikuti pemeriksaan Node/IDE dan pembuatan React/Vite pada 1-04 di folder kerja baru. Jalankan perintah pembuatan proyek hanya sekali; jangan menjalankannya di dalam folder ChemLab yang sudah memiliki `package.json`.
2. Tulis pengguna, masalah, pengetahuan awal, dan satu tujuan yang dapat diperiksa. Buat PRD, AGENTS, AI_LOG dari templat Lampiran A; isi keputusan, bukan menyalin klaim PASS contoh.
3. Buat beranda bertema hijau dengan judul, tujuan, dan tautan ke materi. Jika memakai tiga kartu seperti ChemLab, beri arti sebagai bagian materi asam–basa. Konten lengkap dilanjutkan pada Bab 2.
4. Lakukan latihan satu perubahan teks tanpa AI dan periksa layar ponsel.

Contoh instruksi agent:

```text
Baca PRD dan AGENTS proyek yang sudah ada. Kerjakan hanya beranda
untuk siswa kelas XI pada materi asam–basa/pH. Gunakan React/Vite,
JavaScript dan CSS biasa. Pisahkan metadata dari komponen; tampilkan
tujuan dan navigasi yang dapat dipakai dengan keyboard. Pertahankan
arah visual hijau yang disepakati. Jelaskan props, state/event bila
dipakai, berkas yang diubah, langkah uji, dan hal yang belum dibuat.
```

**Sebelum lanjut:** aplikasi terbuka dari alamat Vite; tujuan terbaca; Anda dapat menemukan berkas yang diubah dan menjelaskan satu perubahan. Simpan `checkpoint-pertemuan-01.zip` tanpa `node_modules`, `.env.local`, kredensial, atau data siswa.

### Pertemuan 2 — Satu proyek kelompok dan isi materi

**Buka:** [Bab 2](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_02_Proyek_Kelompok_dan_GitHub.md), 2-01–2-15; Lampiran E.

1. Pilih satu beranda individual sebagai baseline, simpan karya anggota lain, dan isi TEAM: alasan, peran, reviewer, pengelola repo/layanan.
2. Buat repo bersama dan undang anggota. Setiap anggota clone repo yang sama dan memakai akun pribadi.
3. Isi USER_FLOW, DESAIN_TEKNIS, dan backlog. Tulis satu bagian materi lengkap beserta sumber, contoh, notasi, refleksi, dan tindak lanjut.
4. Gunakan peta kode bagian 3 untuk mempelajari pemisahan data/tampilan ChemLab. Jangan langsung memindahkan semua tiga bacaan dan fitur ke proyek baru.

```text
Pada issue materi ini, tampilkan naskah asam–basa yang telah kami
periksa. Pisahkan isi/sumber di src/data dari komponen. Hubungkan
tujuan, contoh, refleksi, dan navigasi kembali. Pertahankan ID yang
sudah disepakati. Jangan menambah akun/simulasi. Jelaskan diff dan
minta kami memeriksa rumus, satuan, sumber, dan keyboard.
```

**Sebelum lanjut:** anggota lain dapat menjalankan proyek dan menjelaskan kontribusinya; satu PR telah direview; isi sumber tidak tercampur dengan JSX tampilan. Setelah integrasi diuji, buat `checkpoint: pertemuan 02` sesuai prosedur handout.

### Pertemuan 3 — Lima soal dan jawaban local first

**Buka:** [Bab 3](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_03_Modul_Interaktif_dan_Database_Cloud.md), 3-01–3-10; Lampiran B, B-01–B-03.

1. Isi Rancangan penilaian pada PRD: tujuan → aktivitas/butir → bukti → interpretasi → tindak lanjut. ChemLab mengisinya untuk q1–q5, bukan hanya daftar soal.
2. Isi Sumber data pada DATABASE: ChemLab memilih `asam-basa-v1`, indeks pilihan 0–3, draf ber-ID tetap dan riwayat per percobaan. Contoh umum handout memakai A/B/C/D; bentuk jawaban harus konsisten dengan kode proyek.
3. Hubungkan `questions` dengan halaman kuis; pisahkan penilaian dan penyimpanan seperti `chemistry.js` dan `storage.js`. Nama berkas dapat berbeda dari layanan contoh handout; tanggung jawabnya tetap dapat dipadankan.
4. Simpan setiap pilihan sebelum jaringan, tahan pengumpulan belum lengkap, buka pembahasan setelah terkumpul, dan bedakan percobaan awal/ulang.
5. Tuntaskan interaksi yang dipilih pada backlog: ChemLab membandingkan pH 3 dan 5 serta menjelaskan rasio 100.

```text
Baca PRD, USER_FLOW, DESAIN_TEKNIS dan DATABASE proyek ini.
Tampilkan lima soal yang diperiksa dari src/data. Ikuti versi/bentuk
jawaban pada DATABASE; simpan pilihan dan ID setelah refresh.
Pisahkan diagnostik awal dari latihan ulang dan jangan buka pembahasan
sebelum pengumpulan. Pada tahap ini tuntaskan penyimpanan lokal.
Jelaskan berkas, state/event, diff, serta uji data rusak/storage gagal.
```

**Sebelum lanjut:** pilih sebagian jawaban, refresh dan cocokkan ID/pilihan. Uji belum lengkap, benar/salah, percobaan baru serta batal reset. Rekap cocok hitungan manual. Isi kontrak/uji dan integrasikan `checkpoint: pertemuan 03` sesuai pekerjaan nyata.

### Pertemuan 4 — Login, hasil sendiri, dan panel guru awal

**Buka:** [Bab 4](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_04_Sprint_Integrasi_dan_Debugging.md), 4-01–4-11; Lampiran B jalur Firebase, B-04–B-06.

1. Gunakan project Firebase latihan sendiri. Isi Lingkup dan pengelola serta Akses dan aturan pada DATABASE, dan cocokkan dengan pengelolaan layanan pada TEAM.
2. Baca contoh keputusan ChemLab: UID memisahkan akun/tamu, Firestore menyimpan seluruh progres akun, dan satu guru terverifikasi membaca siswa. Setiap pilihan tersebut ditulis pada PRD/alur/desain/data secara konsisten.
3. Telusuri `firebaseClient.js`, `account.js`, `useLearningProgress.js`, `progressSession.js` dan `firestoreProgress.js`. Polanya sama-sama identitas → penyimpanan lokal → antrean → server → riwayat, dengan bentuk payload yang dipilih proyek.
4. Hubungkan panel guru dengan data akun tersinkron; jangan memasukkan hasil fiktif sebagai pengganti data kosong. Uji siswa A/B, tamu, guru terverifikasi/belum terverifikasi, dan koneksi gagal.
5. Latihan konflik Git mengikuti 4-07–4-09 pada berkas latihan; baca diff dan ulangi alur sesudah integrasi.

```text
Tambahkan Firebase pada aplikasi yang sudah berjalan mengikuti
cakupan dan kontrak pada PRD/DATABASE. Pertahankan data serta fitur
lokal. Antrean selalu milik UID aktif dan status tersimpan menunggu
konfirmasi server. Tampilkan riwayat sendiri serta panel satu guru
yang diizinkan Rules. Jelaskan alur data, uji A/B/tamu/guru,
pergantian akun saat request, dan batas implementasi.
```

**Sebelum lanjut:** perilaku login/sinkronisasi cocok dengan USER_FLOW dan DATABASE. Siswa tidak membaca UID lain, guru tidak menulis hasil siswa, serta antrean tidak berganti pemilik. Catat hasil nyata pada matriks TESTING; integrasikan `checkpoint: pertemuan 04` setelah review/uji.

### Pertemuan 5 — Rekap, interpretasi, dan calon rilis

**Buka:** [Bab 5](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_05_Pengujian_dan_Kesiapan_Rilis.md), 5-01–5-10 dan penyempurnaan panel; Lampiran A, B-06–B-07, F/I-08.

1. Tetapkan percobaan yang direkap: diagnostik pertama per siswa, latihan terakhir bila diperlukan. Belum mengirim bukan skor nol. Tampilkan versi, jawaban per butir, distribusi, jumlah hasil diterima, serta pembaruan data.
2. Bandingkan rekap dua siswa uji dengan hitungan manual; tulis dugaan kesulitan dan tindak lanjut, bukan menyimpulkan miskonsepsi hanya dari satu pilihan.
3. Isi TC-01–TC-23 dengan langkah, harapan, aktual, status dan bukti sesuai kontrak proyek. Jelaskan penyesuaian skenario/batas pada dokumen; periksa antar-akun/perangkat, hasil/versi, akses negatif, storage, 375 px dan keyboard. Uji silang oleh kelompok lain dicatat dengan penguji, langkah, aktual, dan uji ulang.
4. Jalankan build dan preview. Tuntaskan blocker sebelum menambah pengayaan.

```text
Perbaiki hanya temuan pada TESTING/issue prioritas kami. Cocokkan
rekap dengan dua hasil acuan; jelaskan penyebut dan versi instrumen.
Pertahankan jawaban diterima, isolasi UID, navigasi, dan reset.
Periksa ponsel, keyboard, label, rumus/tabel, loading/kosong/gagal.
Laporkan hasil aktual dan keterbatasan; jangan menandai PASS otomatis.
```

**Sebelum lanjut:** fungsi minimum, aturan akses, isi, dan build sesuai kriteria kelompok; setiap kegagalan memiliki tindak lanjut. Simpan calon rilis dan `checkpoint: pertemuan 05`.

### Pertemuan 6 — Deploy dari GitHub dan finalisasi

**Buka:** [Bab 6](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_06_Deploy_Pengujian_Produksi_dan_Finalisasi_Produk.md); Lampiran B, B-08 dan templat pengumpulan Lampiran A.

1. Pilih Vercel atau Netlify sesuai praktik kelas dan hubungkan repo kelompok. Gunakan `npm run build` dengan output `dist`, atur root ke folder `package.json` (root repo untuk clone ChemLab).
2. Isi variabel client pada dashboard hosting dari project kelompok; konfigurasi emulator harus nonaktif. Tambahkan domain produksi ke pengaturan Auth yang dipakai.
3. Untuk source ChemLab, pertahankan `molecule-viewer.html` dan aset molekul pada output. Navigasi hash tidak memerlukan rewrite history; tetap uji tautan langsung dan refresh. Untuk aplikasi baru, ikuti model navigasi aktual pada Bab 6.
4. Uji URL tanpa sesi login hosting: login Google, simpan progres akun, baca riwayat, guru, penolakan akses, refresh, koneksi gagal, fitur pilihan, ponsel, dan keyboard. Uji lokal maupun Rules API saja belum membuktikan alur publik berhasil.
5. Catat URL, commit sumber, identitas deployment, aturan yang diuji, hasil contoh/versi, bukti bebas data pribadi, dan keterbatasan. Buat `checkpoint: pertemuan 06` setelah review/uji.

**Sebelum lanjut:** paling lambat H−1 Pertemuan 7, kumpulkan `checkpoint: final`, identitas deployment, portofolio, draf refleksi individual, dan bahan/cadangan demo dari versi yang sama. Tanggal/jam WIB mengikuti pengajar. Perbaikan setelah batas dilaporkan dengan versi baru dan uji ulang.

### Pertemuan 7 — Demo dan pertanggungjawaban

**Buka:** [Bab 7](https://github.com/Wildan2150/handout-web-based-learning-kimia/blob/main/Bab_07_Presentasi_Produk_dan_Pertanggungjawaban_Individual.md).

Demo harus memperlihatkan tujuan → aktivitas → jawaban → penyimpanan → pembacaan guru → interpretasi/tindak lanjut. Setiap anggota menjelaskan satu keputusan, perubahan, review/uji, serta koreksi terhadap bantuan AI berdasarkan bukti sendiri. Riwayat source ChemLab tidak menggantikan kontribusi anggota.

Sesi merujuk versi final H−1; tidak perlu checkpoint baru saat presentasi. Setelah sesi, lengkapi refleksi individual pada hari yang sama; masukan produk menjadi backlog. Rubrik tetap 65% produk kelompok dan 35% tanggung jawab individual. Durasi mengikuti pembagian 140 menit per jumlah kelompok setelah pembukaan 10 menit.

## 5. Menjalankan contoh jadi untuk membandingkan hasil

### Folder dan prasyarat

Gunakan Windows, IDE pilihan kelas, serta Edge/Chrome. Periksa `node --version` dan `npm.cmd --version`; source ini menetapkan Node ≥22.12.0. Stack akun/Firestore memerlukan Java 21+; periksa `java -version` pada terminal yang sama. Java hanya diperlukan untuk Firestore Emulator, bukan untuk materi tamu atau build.

Jika sudah menerima folder mata kuliah, buka `ProyekContoh`. Jika mengunduh repo terpisah, gunakan **Git: Clone** pada IDE dengan URL repo di bawah lalu pilih **Open**. Padanan terminalnya:

```powershell
git clone https://github.com/Wildan2150/chemlab-acidbase.git
cd chemlab-acidbase
```

Jangan menjalankan kedua jalur pengunduhan sekaligus. Di root yang benar harus terlihat `package.json`, `src`, serta README. Clone tidak membawa `.env.local` pengajar.

### Pilihan A — Materi tamu tanpa konfigurasi cloud

Di root salinan repo bersih:

```powershell
npm.cmd ci --ignore-scripts
npm.cmd run dev
```

Buka alamat **Local** yang dicetak Vite, biasanya `http://127.0.0.1:5173`. Akun tidak aktif tanpa konfigurasi, tetapi materi/laboratorium/kuis dan progres tamu dapat dicoba. Tutup server dengan Ctrl + C. Jangan membuka `index.html` langsung.

### Pilihan B — Akun dan cloud lokal melalui emulator

Setelah dependensi terpasang dan Java 21+ tersedia:

```powershell
npm.cmd run dev:emulator
```

Buka `http://127.0.0.1:5174`. Script menyediakan konfigurasi uji `demo-chemlab`, Auth 9099 dan Firestore 8080, terpisah dari produksi. Emulator hub memakai 4400; port tersebut juga harus tersedia. Data emulator sementara selama proses berjalan. Ctrl + C menghentikan stack.

1. Lewati/tuntaskan tur. Kerjakan satu jawaban tamu lalu refresh: pilihan tetap ada.
2. Masuk melalui Google → **Add new account** pada pemilih emulator → isi identitas fiktif. Ini bukan login ke akun Google nyata. Anda juga dapat mendaftar email/password latihan; tautan verifikasi/reset muncul lewat emulator/terminal.
3. Perhatikan bahwa jawaban tamu tidak berpindah ke akun. Kerjakan aktivitas sebagai akun, tunggu **Progres tersimpan di akun**, lalu login dengan identitas sama pada konteks browser lain untuk memeriksa pemulihan.
4. Logout dan pastikan jawaban tamu kembali. Untuk panel guru, hanya dalam emulator, gunakan identitas email guru pada source dan pastikan status terverifikasi. Identitas fiktif emulator tidak memberikan akses produksi. Skenario otomatis guru menyediakan fixture terverifikasi dan uji penolakan.
5. Jangan mencoba reset pada hasil yang perlu dipertahankan: reset akun juga mengosongkan progres cloud akun emulator tersebut.

Jalur ini memperlihatkan hasil isian dokumen ChemLab: tamu/akun terpisah, progres UID tersinkron, serta satu guru membaca hasil.

### Build, preview, dan pemeriksaan yang tersedia

Pada terminal di root:

```powershell
npm.cmd run build
npm.cmd run preview
```

Buka alamat preview yang dicetak Vite, biasanya port 4173. Build menghasilkan `dist`. Origin berbeda memakai localStorage berbeda; draf tamu port 5173 tidak otomatis muncul pada 4173. Akun hanya pulih jika konfigurasi cloud untuk build benar. Pada mode produksi, aplikasi menonaktifkan layanan akun jika konfigurasi emulator aktif; build tetap dapat terbentuk. Gunakan server development emulator untuk latihan akun lokal.

```powershell
npm.cmd test
npm.cmd run test:e2e
```

Uji logika memakai Node. Uji browser memakai Edge di Windows dan mengelola server 5173, stack emulator dengan aplikasi 5175, serta port Auth/Firestore/hub di atas. Hentikan stack manual sebelum menjalankan suite agar port tidak bertabrakan. Di OS lain, pasang Chromium Playwright sesuai README. `npm.cmd run test:e2e -- --project=firebase-auth` memilih uji akun/cloud/guru, tetapi konfigurasi tetap menyiapkan kedua server. Hasil, tanggal, dan batas uji ada di TESTING.

### Project Firebase sendiri untuk source ChemLab

Ikuti [setup Auth](FIREBASE_AUTH_SETUP.md), [Firestore](FIRESTORE_SETUP.md), dan [guru](TEACHER_PANEL.md). Buat konfigurasi sendiri dari `.env.example`; jangan menyalin `.env.local` pengajar atau memakai project `chemlab-web` untuk latihan.

Jika mengadaptasi source ini untuk guru lain, sesuaikan `TEACHER_EMAIL` di `src/lib/teacherAccess.js` dan pemeriksaan email di `firestore.rules` secara berpasangan, lalu uji ulang fixture guru dan aturan akses. Itu perubahan source yang harus direview, bukan pengaturan peran pada UI siswa.Cakupan anggota serta batas kontrak mengikuti DATABASE ChemLab. Untuk aplikasi baru yang mengikuti handout, gunakan kontrak keanggotaan Lampiran B sejak awal.

## 6. Mempertahankan keunikan tanpa memperbesar fondasi

| Pilihan khas | Alasan belajar | Versi minimum yang dapat direplikasi | Pemeriksaan/rujukan |
| --- | --- | --- | --- |
| Laboratorium pH dan desain hijau | Menghubungkan angka, klasifikasi, [H₃O⁺]/[OH⁻], serta pengamatan | Slider, angka/teks dan satu pertanyaan penjelasan | pH 3 vs 5 memberi rasio 100; asumsi 25 °C; [desain teknis](../DESAIN_TEKNIS.md) |
| Tiga bacaan/24 bagian | Memberi urutan teori, hitungan, penerapan | Satu bagian lengkap lebih dahulu | Rumus, satuan, sumber dan keterbacaan; [sumber materi](MATERIAL_SOURCES.md) |
| Asesmen akhir bab 15 soal | Membedakan bukti awal dari hasil setelah belajar | Tambahkan setelah diagnostik stabil | Versi/snapshot sendiri; 9 pilihan ganda dan 6 angka; [asesmen](CHAPTER_ASSESSMENT.md) |
| PhET | Prediksi, pengamatan dua kondisi, penjelasan ionisasi | Satu sematan dengan pertanyaan pendamping | Catatan disimpan di aplikasi sendiri; alternatif bila gagal; [aktivitas](INTERACTIVE_ACTIVITIES.md) |
| 36 molekul/3Dmol lokal | Menelaah struktur dan donor/akseptor proton | Satu model valid, misalnya air CID 962, dengan sumber | Struktur benar-benar tergambar; tidak mengarang koordinat/menyebut 2D sebagai 3D; [katalog](MOLECULE_CATALOGUE.md) |
| PubChem | Menelusuri identitas/sumber properti | Satu pencarian dan interpretasi rumus/massa molar | Kosong/gagal/jaringan, satuan g/mol; struktur tunggal tidak menentukan pH larutan |
| Tur dan bantuan | Menemukan menu/kontrol yang relevan | Panduan manual singkat dahulu | Keyboard, lewati/ulang, progres tetap; [onboarding](ONBOARDING.md) |

Pilihan fitur dicatat melalui I-01 Lampiran F pada backlog. Gunakan pola: siswa **memprediksi → mengubah → mengamati → menjelaskan**. Jangan menyamakan persentase aktivitas, jumlah klik, atau selisih skor diagnostik–asesmen dengan penguasaan konsep maupun efektivitas media tanpa pemeriksaan yang sesuai.

## 7. Jika tersendat dan sebelum mengumpulkan

| Gejala | Tindakan dan hasil yang diperiksa |
| --- | --- |
| `package.json` tidak ditemukan | Periksa folder terminal/Explorer; pindah ke root aplikasi. Jangan membuat proyek Vite kedua |
| `npm.ps1` diblokir | Gunakan `npm.cmd`/`npx.cmd` atau ikuti diagnosis PowerShell Lampiran C; jangan mengubah policy untuk error npm yang berbeda |
| Emulator gagal/Java terlalu lama | Periksa `java -version`; gunakan Java 21+ pada PATH terminal yang sama lalu buka ulang terminal bila instalasi mengubah PATH |
| Port dipakai | Hentikan server latihan milik Anda dengan Ctrl + C; periksa terminal lain. Jangan menghentikan proses yang tidak dikenal |
| Login tidak tersedia pada clone | Untuk latihan akun pilih `dev:emulator`; untuk layanan sendiri isi konfigurasi Auth, restart Vite, periksa provider/domain |
| Hasil berbeda sesudah pindah port | Periksa origin dan UID; localStorage berbeda per origin, tamu berbeda dari akun |
| Hasil tamu tidak muncul setelah masuk | Kontrak ChemLab memisahkan tamu/akun; logout memulihkan tamu. Lihat keputusan serta batas pada DATABASE |
| Guru ditolak | Periksa email serta status verifikasi, Rules yang dipasang, dan project yang benar; jangan menetapkan role lewat localStorage |
| 3D/PhET/PubChem gagal | Periksa pesan pertama, sumber/jaringan/WebGL; gunakan alternatif dan tetap tulis catatan. HTTP 200 saja bukan bukti struktur tergambar |

Sebelum pengumpulan, cocokkan portofolio dengan Lampiran A: TEAM, PRD, USER_FLOW, DESAIN_TEKNIS, DATABASE, AGENTS, AI_LOG, TESTING, README, serta `.env.example` tanpa kredensial. Isi repo/URL, versi sumber/deployment, data jawaban contoh, sumber/lisensi, PR/review, hasil uji, dan keterbatasan yang benar-benar ada. Jangan mengarang anggota, checkpoint, hasil uji, atau validasi pengajar untuk melengkapi tabel.

Jika masih perlu bantuan, sampaikan bab/prosedur, lokasi tindakan, tujuan, hasil aktual, dan pesan error pertama yang relevan. Catatan tersebut membantu Anda maupun pengajar mengulangi pemeriksaan tanpa membuka rahasia atau data siswa.

## 8. Catatan kontrak yang dipilih ChemLab

Handout menyediakan bentuk umum; dokumen contoh mengisinya dengan keputusan proyek yang spesifik. ChemLab menyinkronkan seluruh progres akun termasuk draf, memisahkan tamu dari UID, memberi satu guru akses baca seluruh akun siswa aplikasi, dan mereset cloud saat reset akun dikonfirmasi. Asesmen mempunyai snapshot instrumen; diagnostik masih memerlukan arsip/migrasi sebelum bank diganti.

Contoh umum Lampiran B menyimpan hasil per percobaan, dengan daftar anggota dan pemilihan hasil tamu. Menyalin source ChemLab berarti memakai service/Rules dan kontrak ChemLab yang berpasangan. Memilih bentuk lain pada proyek kelompok memerlukan penyesuaian PRD, alur, desain, data serta uji secara konsisten. Rincian batas tersedia pada [DATABASE.md](../DATABASE.md).

Pertahankan pola pengisian handout dan alasan belajar setiap fitur. Bentuk komponen, kedalaman bacaan/eksplorasi serta pilihan penyimpanan ditulis sesuai produk; jangan mengarang hasil atau menyalin klaim uji repo pengajar sebagai hasil sendiri.
