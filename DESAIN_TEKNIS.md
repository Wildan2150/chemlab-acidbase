# Desain teknis

Panel guru menggunakan pemeriksaan email terverifikasi di UI dan Firestore Rules. `teacherData.js` menyimpan profil pemilik dan membuka listener pembacaan kelas dengan sesi Firebase sementara di memori; `teacherReport.js` menghitung rekap/ekspor dari data ternormalisasi. Detail kontrak dan hak akses: [TEACHER_PANEL.md](docs/TEACHER_PANEL.md).

Perkembangan `main`: Firebase Auth mengelola akun; Firestore menyimpan progres per UID, sedangkan antrean/salinan browser mempertahankan alur lokal. Service `firestoreProgress.js`, controller `progressSession.js`, dan hook `useLearningProgress.js` memisahkan akses database dari tampilan. Materi/hasil tetap mengikuti versi instrumen masing-masing. Kontrak terbaru: [DATABASE.md](DATABASE.md) dan [panduan Firestore](docs/FIRESTORE_SETUP.md). Penjelasan baseline di bawah mendokumentasikan versi lokal awal.

## Pilihan implementasi

React + Vite mengikuti materi kuliah. JavaScript biasa, pemisahan data, komponen fungsional, props, state, dan CSS Variables memudahkan mahasiswa menemukan bagian yang akan diubah. Navigasi hash menghindari backend/router tambahan. Penyimpanan lokal hanya untuk tamu tunggal pada satu browser.

`App.jsx` memegang progres, navigasi, dan dialog. Halaman menerima data serta callback. `chemistry.js` memisahkan perhitungan dari tampilan. `storage.js` menangani validasi serta kegagalan akses. Native `<dialog>` menyediakan pemblokiran latar, fokus dialog, dan Esc. Radio native dan input range mendukung keyboard.

Font Plus Jakarta Sans dipaketkan melalui Fontsource; ikon Lucide diimpor berdasarkan nama; visual laboratorium memakai SVG lokal. Tidak ada fetch data siswa, CDN runtime, analytics, atau sematan luar. Tautan sumber hanya dibuka jika pengguna memilihnya.

## Asumsi dan target kualitas

- Perangkat utama: laptop pengajar/mahasiswa; tata letak ponsel juga disediakan. Asumsi jaringan pengujian performa lanjutan: ponsel dengan 4G.
- Aplikasi belajar terbuka, bukan halaman yang mengandalkan SEO atau aplikasi berautentikasi. SPA dipilih karena kurikulum menetapkan React + Vite.
- Target LCP p75 ≤ 2.500 ms, INP p75 ≤ 200 ms, CLS p75 ≤ 0,1; ini target, belum ukuran lapangan.
- Anggaran JavaScript awal ≤ 200 KB gzip. Semua halaman masuk bundle awal; tidak ada tambahan bundle per navigasi. Hasil build dicatat di `TESTING.md`.
- Target Lighthouse lanjutan: aksesibilitas ≥ 95, performa ≥ 90; belum dijalankan dan tidak diklaim tercapai.
- Target aksesibilitas implementasi: WCAG 2.1 AA pada aturan otomatis yang diuji. Penanggung jawab pemeriksaan teknis versi ini: Codex; penerimaan isi dan uji pengguna oleh pengajar menyusul. Audit otomatis bukan sertifikasi penuh WCAG.

## Batas model kimia

Skala pH 0–14 merupakan rentang eksplorasi, bukan batas mutlak pH. H₃O⁺ dan OH⁻ memakai pendekatan ideal pada 25 °C; angka ditampilkan bersama klasifikasi teks. Indikator dan gelembung bersifat ilustratif. Sampel sehari-hari adalah nilai contoh, bukan hasil pengukuran.

Model HCl hanya menerima 0,1; 0,01; dan 0,001 mol/L, dengan disosiasi sempurna, aktivitas didekati konsentrasi, dan kontribusi air diabaikan. Tidak digunakan untuk asam lemah atau asam sangat encer. Materi membedakan kuat/lemah, konsentrasi, serta pH netral yang bergantung suhu.

## Perubahan selanjutnya

Perubahan soal wajib menaikkan `QUESTION_VERSION` dan menentukan strategi migrasi/arsip sebelum menyimpan hasil nyata. Cloud memerlukan kontrak kepemilikan, autentikasi, antrean terikat akun, aturan akses server, dan uji negatif; menambah tombol login saja tidak mencukupi.
