# ChemLab — demo pembelajaran asam–basa dan pH

`main` menggabungkan `feat/material-updates`, `feat/chapter-assessment`, `feat/interactive-activities`, dan `feat/login-page`.

**Onboarding** menampilkan sambutan saat kunjungan pertama dan tur dengan balon yang menunjuk menu sebenarnya, sorotan target, serta latar redup. Tur bisa dilewati dan dibuka ulang lewat **Tur fitur**. **Bantuan kontekstual** muncul saat pertama membuka tab PhET, model molekul, atau PubChem, serta setelah kendala berulang pada pencarian, pengumpulan jawaban, dan muat ulang simulasi. Bantuan otomatis bisa dinonaktifkan melalui **Panduan belajar**; **Petunjuk fitur ini** di Eksplorasi tetap tersedia manual. Lihat [aturan dan alasan desain UX](docs/ONBOARDING.md).

Petunjuk PhET, model molekul, dan PubChem muncul otomatis saat pertama membuka masing-masing tab Eksplorasi, sebelum menekan **Buka aktivitas**. Untuk menguji ulang dari awal, pilih **Panduan belajar → Ulangi semua petunjuk**; progres belajar tetap ada. Hard refresh dan clear cache HTTP tetap menyimpan status kunjungan di browser.

**Materi belajar** memuat tiga bacaan dengan 24 bagian, contoh hitung, tabel, daftar isi, refleksi, dan sumber per bagian. Baca [peta materi dan sumber](docs/MATERIAL_SOURCES.md).

**Asesmen akhir bab** menyediakan 15 soal (9 pilihan ganda dan 6 jawaban angka), draf tersimpan, tinjauan/konfirmasi pengumpulan, hasil per cakupan, pembahasan, riwayat, serta ekspor. Baca [kisi-kisi dan kontrak asesmen](docs/CHAPTER_ASSESSMENT.md). Buka `/#asesmen` melalui menu atau akhir bacaan ketiga.

**Eksplorasi kimia** mencakup PhET asam–basa, 36 model molekul 3Dmol dengan pencarian nama/rumus/CID dan filter kelompok, pencarian properti PubChem, serta catatan pengamatan yang ikut tersimpan/diekspor bersama progres. Pustaka dan rekaman struktur 3D dipaketkan lokal; model dimuat saat dibuka. Lihat [pemetaan Lampiran F dan sumber](docs/INTERACTIVE_ACTIVITIES.md) serta [katalog CID](docs/MOLECULE_CATALOGUE.md).

**Firebase Auth** menyediakan masuk/daftar dengan email atau Google, verifikasi email, pemulihan password, pengelolaan profil/email/password, logout, dan hapus akun. Seluruh progres belajar, termasuk asesmen dan catatan eksplorasi, dipisahkan per akun/tamu di browser. Panduan lengkap ada di [FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md).

**Cloud Firestore** menyimpan progres akun, memulihkannya pada perangkat lain, dan menyinkronkan perubahan yang menunggu koneksi. Tamu tetap lokal. Pasang aturan akses mengikuti [panduan Firestore](docs/FIRESTORE_SETUP.md); konfigurasi memakai proyek Firebase yang sama dengan Auth.

**Panel guru** menampilkan progres siswa nyata dari akun yang tersinkron. Hanya akun terverifikasi `wildannashihin@gmail.com` yang dapat membukanya. Rekap diagnostik/asesmen, rincian percobaan, catatan eksplorasi, serta ekspor JSON/CSV tersedia. Aturan akses guru sudah dipasang ke produksi; lihat [panduan panel guru](docs/TEACHER_PANEL.md).

Contoh produk yang dapat dikembangkan mahasiswa dalam kuliah **Vibe Coding React untuk Web Pembelajaran Kimia**. Sasaran contoh: siswa kelas XI. Dibuat dengan React, Vite, JavaScript, dan CSS biasa agar data, tampilan, dan interaksinya mudah dipelajari.

## Jalankan

Prasyarat: Node.js 22.12+ atau Node.js 24. Lingkungan pembuatan memakai Node.js 24.20.0. Dari folder mata kuliah:

```powershell
cd ProyekContoh
npm.cmd ci --ignore-scripts
npm.cmd run dev
```

Konfigurasi produksi lokal sudah mengarah ke proyek `chemlab-web`, dengan Firestore `(default)`, Rules/indeks terpasang, serta Email/Password dan Google aktif. Jalankan aplikasi lalu masuk untuk menyinkronkan progres akun. Untuk instalasi baru, isi `.env.local` mengikuti `.env.example` dan [panduan Firestore](docs/FIRESTORE_SETUP.md). Tombol Google juga dapat dicoba dengan identitas fiktif melalui Auth Emulator.

Untuk mencoba alur akun sepenuhnya tanpa proyek produksi:

```powershell
npm.cmd run dev:emulator
```

Buka **http://127.0.0.1:5174**. Auth dan Firestore Emulator berjalan lokal; Firestore Emulator memerlukan Java 21+. Tautan verifikasi/reset tersedia melalui emulator/terminal, bukan email sungguhan.

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
- Panel guru khusus akun yang ditetapkan: rekap siswa tersinkron, diagnostik awal/asesmen terbaru, pencarian/filter, rincian jawaban dan catatan, serta ekspor JSON/CSV.
- Pencarian konsep, navigasi keyboard, dialog, dan tampilan ponsel.
- Login/registrasi Firebase, verifikasi email, pemulihan password, pengelolaan akun, serta pemisahan progres tiap UID dan tamu.

Nama **ChemLab**, desain hijau, dan sasaran kelas XI adalah keputusan awal yang dapat disesuaikan. Versi awal lokal telah dikembangkan menjadi akun tersinkron dan panel guru terbatas sesuai arahan pengajar.

Antarmuka menggunakan bahasa aplikasi belajar untuk siswa dan guru, tanpa narasi proses pembuatan. Panel guru menjelaskan bahwa datanya berasal dari progres akun yang tersinkron. Konteks penggunaan untuk kuliah dijelaskan dalam dokumentasi ini.

## Batas versi ini

Aplikasi memakai **Firebase Auth untuk identitas akun** dan **Cloud Firestore untuk progres akun**. Belajar tanpa masuk tetap tersedia. Catatan tamu tetap lokal, sementara progres akun disinkronkan setelah login. Status simpan membedakan progres yang sudah dikonfirmasi server dari perubahan yang masih menunggu. Guru membaca progres tersinkron dari seluruh akun siswa aplikasi pada proyek ini; belum ada pembagian kelas atau guru kedua.

`localStorage` menyimpan progres tamu serta salinan/antrean akun pada origin browser yang sama; berganti port berarti berganti origin. Progres akun yang sudah tersimpan di Firestore dapat dipulihkan pada perangkat lain. Jika penyimpanan browser ditolak, gunakan ekspor sebelum menutup sesi. Ekspor JSON merupakan salinan untuk dibaca; fitur impor belum dibuat. Aplikasi bukan PWA; membuka pertama kali tanpa koneksi ke server belum didukung. Batas ukuran payload dan kebijakan perubahan bersamaan dijelaskan pada panduan Firestore.

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
6. Masuk dengan akun guru terverifikasi, buka **Panel guru**, filter hasil yang sudah tersinkron, tinjau jawaban/catatan siswa, dan ekspor rekap yang diperlukan. Akun biasa tidak dapat membuka data siswa lain.
7. Ekspor progres, lalu tunjukkan reset berkonfirmasi jika diperlukan.

## Pengujian

```powershell
npm.cmd test
npm.cmd run test:e2e
```

Uji browser otomatis memakai Microsoft Edge pada Windows. Pada OS lain, pasang Chromium Playwright terlebih dahulu dengan `npx playwright install chromium`. Konfigurasi akan menjalankan server Vite sendiri bila port 5173 belum digunakan. Detail hasil serta batas pengujian terdapat di [TESTING.md](TESTING.md).

Pengujian juga menjalankan Auth Emulator pada port 9099, Firestore Emulator pada port 8080, serta aplikasi uji pada port 5175. Java 21+ diperlukan pada `PATH`. Gunakan `--project=learning` untuk skenario belajar atau `--project=firebase-auth` untuk akun/Firestore; kedua server tetap dikelola konfigurasi Playwright.

Pratinjau tersimpan di [desktop](docs/preview-desktop.png) dan [ponsel](docs/preview-mobile.png).

## Dokumen pendamping

[PRD](PRD.md) · [Alur pengguna](USER_FLOW.md) · [Desain teknis](DESAIN_TEKNIS.md) · [Kontrak data](DATABASE.md) · [Backlog & keputusan lanjutan](BACKLOG.md) · [Tim](TEAM.md) · [Log AI](AI_LOG.md) · [Aturan agent](AGENTS.md)

Referensi teknis: [Vite Getting Started](https://vite.dev/guide/), [React: build an app from scratch](https://react.dev/learn/build-a-react-app-from-scratch). Referensi konsep utama: [OpenStax Chemistry 2e, 14.2](https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh); rujukan tambahan tercantum di aplikasi.
