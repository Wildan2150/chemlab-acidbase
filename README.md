# ChemLab — demo pembelajaran asam–basa dan pH

Branch `feat/login-page` menambahkan Firebase Auth: masuk/daftar dengan email atau Google, verifikasi email, pemulihan password, pengelolaan profil/email/password, logout, dan hapus akun. Berangkat langsung dari `main`; tidak memuat perubahan branch materi maupun interaktif. Panduan lengkap ada di [FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md).

Contoh produk yang dapat dikembangkan mahasiswa dalam kuliah **Vibe Coding React untuk Web Pembelajaran Kimia**. Sasaran contoh: siswa kelas XI. Dibuat dengan React, Vite, JavaScript, dan CSS biasa agar data, tampilan, dan interaksinya mudah dipelajari.

## Jalankan

Prasyarat: Node.js 22.12+ atau Node.js 24. Lingkungan pembuatan memakai Node.js 24.20.0. Dari folder mata kuliah:

```powershell
cd ProyekContoh
npm.cmd ci --ignore-scripts
npm.cmd run dev
```

Untuk memakai akun nyata, isi `.env.local` mengikuti `.env.example`, aktifkan Email/Password serta Google di Firebase Console, dan atur domain serta email action URL sesuai panduan. Konfigurasi proyek produksi belum diisi. Tombol Google dapat dicoba dengan identitas fiktif melalui pemilih akun pada Auth Emulator.

Untuk mencoba alur akun sepenuhnya tanpa proyek produksi:

```powershell
npm.cmd run dev:emulator
```

Buka **http://127.0.0.1:5174**. Auth Emulator berjalan lokal; tautan verifikasi dan reset tersedia melalui emulator/terminal, bukan email sungguhan.

Buka alamat yang dicetak Vite, biasanya **http://127.0.0.1:5173**. `npm.cmd` bisa diganti `npm` jika PowerShell mengizinkan skrip npm. Jangan membuka `index.html` langsung dengan klik ganda.

```powershell
npm.cmd run build
npm.cmd run preview
```

Build siap hosting tersedia di `dist/`. Aplikasi menggunakan URL hash, sehingga tautan seperti `/#laboratorium` tidak memerlukan aturan rewrite di hosting statis. `base: './'` mendukung penempatan di subfolder.

## Yang dapat dicoba

- Beranda dengan jalur belajar dan eksperimen pH langsung.
- Tiga bagian materi, tujuan belajar, pertanyaan refleksi, dan penanda selesai.
- Laboratorium pH 0–14 pada 25 °C: indikator skematis, [H₃O⁺], [OH⁻], pOH, contoh sehari-hari, dan model HCl terbatas.
- Lima soal diagnostik. Setiap pilihan disimpan; pembahasan baru dibuka setelah seluruh jawaban dikumpulkan.
- Percobaan awal dan latihan ulang memiliki ID berbeda. Riwayat menyimpan jawaban per butir, konsep, versi soal, dan skor.
- Progres tamu, ekspor JSON, serta reset dengan konfirmasi.
- Panel guru dengan **enam siswa fiktif**, agregat per konsep, pencarian/filter, rincian jawaban, dan contoh tindak lanjut.
- Pencarian konsep, navigasi keyboard, dialog, dan tampilan ponsel.
- Login/registrasi Firebase, verifikasi email, pemulihan password, pengelolaan akun, serta pemisahan progres tiap UID dan tamu.

Nama **ChemLab**, desain hijau, dan sasaran kelas XI adalah keputusan awal yang dapat disesuaikan. Topik asam–basa, bentuk aplikasi siswa, serta mode lokal/data guru fiktif sudah dipilih pengajar melalui percakapan.

Antarmuka menggunakan bahasa aplikasi belajar untuk siswa dan guru, tanpa label demo maupun narasi proses pembuatan. Asal data latihan fiktif pada panel guru dicantumkan satu kali sebagai keterangan sumber. Konteks penggunaan untuk kuliah dijelaskan dalam dokumentasi ini.

## Batas versi ini

Branch ini memakai **Firebase Auth untuk identitas akun**, dengan konfigurasi proyek produksi menyusul. Belajar tanpa masuk tetap tersedia. Progres akun dan tamu dipisahkan pada browser; Firestore, sinkronisasi hasil antarperangkat, antrean kirim, serta pembacaan hasil nyata oleh guru belum ditambahkan. Panel guru tetap memakai data latihan fiktif.

`localStorage` menyimpan data pada origin browser yang sama. Data tidak berpindah perangkat, dan berganti port berarti berganti origin. Jika penyimpanan ditolak, aplikasi tetap berjalan dalam memori dan memberi informasi untuk mengekspor progres. Data yang rusak atau tidak sesuai versi diganti sesi baru. Ekspor JSON merupakan salinan untuk dibaca; fitur impor belum dibuat. Aplikasi bukan PWA; membuka pertama kali tanpa koneksi ke server belum didukung.

Kata sandi diproses melalui Firebase SDK, tidak disimpan oleh aplikasi di localStorage. Perubahan email/password dan penghapusan akun meminta autentikasi ulang. Penggantian email akun password memakai verifikasi alamat baru terlebih dahulu. Akun khusus Google mengelola email/password melalui Google dan mengonfirmasi penghapusan akun ChemLab melalui pop-up Google.

Skor dan kunci tersedia di sisi browser. Gunakan sebagai alat belajar dan demo diagnostik, bukan ujian dengan penilaian server. Persentase progres mengukur aktivitas, bukan penguasaan konsep.

## Struktur yang penting untuk kuliah

| Lokasi                                   | Dipakai untuk                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `src/data/chemData.js`                   | Materi, tujuan, soal/kunci/pembahasan, versi soal, sumber, dan siswa fiktif |
| `src/App.jsx`                            | Navigasi, state, dan penghubung fitur                                       |
| `src/pages/`                             | Beranda, materi, laboratorium, kuis, progres, panel guru                    |
| `src/components/`                        | Diagram SVG, ikon, dan dialog                                               |
| `src/lib/chemistry.js`                   | Model pH, penilaian, dan pembentukan hasil                                  |
| `src/lib/storage.js`                     | Draf ber-ID, validasi, penyimpanan, dan pemulihan lokal                     |
| `src/styles.css`, `src/styles-pages.css` | Tema, tata letak, dan responsivitas                                         |
| `tests/`                                 | Uji logika serta alur browser dan aksesibilitas otomatis                    |

Font dan ikon dipaketkan lokal; aplikasi tidak bergantung pada CDN saat dijalankan. Diagram gelas kimia merupakan SVG buatan untuk demo, bukan pengukuran nyata.

## Skenario demo 5–7 menit

1. Di beranda, geser pH: perhatikan angka, klasifikasi, dan warna berubah bersama.
2. Buka **Kuis diagnostik**, pilih satu jawaban, muat ulang halaman: jawaban tetap terpilih.
3. Selesaikan lima soal dan tunjukkan pembahasan serta tindak lanjut per konsep.
4. Mulai latihan baru: hasil diagnostik awal tetap ada di **Progres saya**.
5. Buka materi, tandai selesai, lalu eksplorasi pH 3 dan 5 di laboratorium. Konsentrasi H₃O⁺ berubah 100 kali.
6. Buka **Panel guru**: jelaskan data fiktif, filter hasil, buka rincian siswa, dan tunjukkan interpretasi soal logaritmik.
7. Ekspor progres, lalu tunjukkan reset berkonfirmasi jika diperlukan.

## Pengujian

```powershell
npm.cmd test
npm.cmd run test:e2e
```

Uji browser otomatis memakai Microsoft Edge pada Windows. Pada OS lain, pasang Chromium Playwright terlebih dahulu dengan `npx playwright install chromium`. Konfigurasi akan menjalankan server Vite sendiri bila port 5173 belum digunakan. Detail hasil serta batas pengujian terdapat di [TESTING.md](TESTING.md).

Pada branch akun, pengujian juga menjalankan stack Auth Emulator pada port 9099 dan aplikasi uji pada port 5175. Gunakan `--project=learning` untuk skenario belajar saja atau `--project=firebase-auth` untuk skenario akun; kedua server tetap dikelola konfigurasi Playwright.

Pratinjau tersimpan di [desktop](docs/preview-desktop.png) dan [ponsel](docs/preview-mobile.png).

## Dokumen pendamping

[PRD](PRD.md) · [Alur pengguna](USER_FLOW.md) · [Desain teknis](DESAIN_TEKNIS.md) · [Kontrak data](DATABASE.md) · [Backlog & keputusan lanjutan](BACKLOG.md) · [Tim](TEAM.md) · [Log AI](AI_LOG.md) · [Aturan agent](AGENTS.md)

Referensi teknis: [Vite Getting Started](https://vite.dev/guide/), [React: build an app from scratch](https://react.dev/learn/build-a-react-app-from-scratch). Referensi konsep utama: [OpenStax Chemistry 2e, 14.2](https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh); rujukan tambahan tercantum di aplikasi.
