# Hasil pengujian demo

## 10 November 2026 WIB — integrasi seluruh branch ke main

Menggabungkan `feat/material-updates`, `feat/chapter-assessment`, `feat/interactive-activities`, dan `feat/login-page`. Lingkungan: Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright, dua worker, serta Firebase Auth Emulator dengan project ID `demo-chemlab`.

- `npm.cmd test`: **16 lulus**, 0 gagal, mencakup penilaian, versi/pemulihan asesmen, diagnostik, dan pemisahan key akun/tamu.
- `npm.cmd run test:e2e`: **25 lulus**, 0 gagal dalam 3,1 menit. Seluruh skenario branch belajar dan akun dijalankan bersama.
- Skenario integrasi baru memakai UI dan Auth Emulator untuk memeriksa bacaan, draf asesmen, serta catatan eksplorasi pada tamu dan dua akun. Data bertahan setelah reload/masuk ulang; reset akun aktif tidak menghapus data tamu.
- `npm.cmd run build`: **lulus**; JavaScript 146,81 KB gzip dan CSS 20,25 KB gzip.
- Pratinjau desktop, ponsel, serta pengantar asesmen diperbarui dari aplikasi gabungan; pratinjau beranda desktop/ponsel juga diperiksa secara visual.

Pengujian akun memakai emulator lokal. OAuth Google, pengiriman email nyata, dan domain produksi belum diuji. Bagian berikut mempertahankan hasil pemeriksaan masing-masing branch sebelum integrasi.

## Verifikasi branch asesmen akhir bab

Baseline `feat/material-updates` commit `834ee59`; tidak menggabungkan branch lain. Build produksi berhasil. **15 uji logika dan 13 skenario browser lulus**, termasuk sembilan uji logika penilaian/migrasi serta empat skenario browser asesmen. Acuan keenam hitungan diverifikasi dari rumus independen, selisih terhadap acuan tersimpan <10⁻⁸. Aksesibilitas otomatis diperiksa pada pengantar, soal pilihan, input angka, tinjauan, dan hasil; responsivitas hasil diperiksa pada 320, 390, 768, dan 1440 piksel. Rincian dan batas verifikasi ada di [CHAPTER_ASSESSMENT.md](docs/CHAPTER_ASSESSMENT.md). Bagian berikut mencatat riwayat branch induk dan baseline.

## Verifikasi branch materi

`feat/material-updates` berangkat langsung dari `main` commit `30505f7`. Build produksi dan enam uji logika lulus. Delapan skenario browser baseline serta satu skenario tambahan untuk daftar isi, fokus heading, refleksi, tabel ponsel, referensi, dan pemulihan progres lulus. Referensi dan pemeriksaan hitung dijabarkan di [MATERIAL_SOURCES.md](docs/MATERIAL_SOURCES.md). Bagian berikut merupakan riwayat pemeriksaan baseline.

## Verifikasi branch interaktif

`feat/interactive-activities` berangkat langsung dari `main` commit `30505f7`. Build dan enam uji logika baseline lulus. Delapan skenario browser baseline serta empat skenario aktivitas memeriksa pemulihan/reset catatan, pemuatan sematan atas permintaan, pendampingan saat sumber diblokir, pemilihan CID, respons PubChem, 404, kegagalan jaringan, aksesibilitas, serta ponsel. Endpoint PhET, 3Dmol, dan PubChem juga mengembalikan HTTP 200 pada pemeriksaan langsung. Detail: [INTERACTIVE_ACTIVITIES.md](docs/INTERACTIVE_ACTIVITIES.md). Bagian di bawah merupakan riwayat baseline.

## 9 November 2026 WIB — Google pada feat/login-page

- Build produksi lulus: JavaScript **125,29 KB gzip**, CSS **16,85 KB gzip**.
- **7 uji logika** dan **15 skenario browser** lulus dalam pemeriksaan terakhir: 8 skenario belajar, 4 email/password, dan 3 Google. Lingkungan Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright; dua worker, Auth Emulator proyek `demo-chemlab`.
- Google diuji melalui pemilih provider pada emulator menggunakan SDK aplikasi: daftar tanpa mengisi form password, masuk ulang dengan UID/progres yang sama, ubah nama, logout, pemisahan progres tamu, reload, sesi yang diingat antar-tab, serta sesi default per tab.
- Penghapusan akun Google diuji setelah penolakan identitas berbeda, pembatalan jendela, lalu autentikasi ulang yang benar. API emulator memastikan akun telah dihapus dan key progres akun hilang. Form tidak meminta password yang belum dibuat.
- Pembatalan masuk memulihkan tombol. Pemblokiran pop-up disimulasikan dengan `window.open` mengembalikan `null`; keberhasilan autentikasi tetap menggunakan Firebase SDK dan emulator, tanpa mock sukses.
- Pemeriksaan otomatis WCAG AA dan lebar 390 px mencakup layar masuk serta tiga tab akun Google. Pratinjau masuk/daftar diperbarui dan tampilan ponsel diperiksa secara visual. Tanpa konfigurasi, tombol Google pada masuk/daftar tetap terlihat dan nonaktif dengan pesan layanan belum tersedia.
- Pengujian awal menemukan sesi yang diingat dapat berakhir ketika tab lain memigrasikan penyimpanan default SDK. Inisialisasi local/session diseragamkan; pemeriksaan lengkap di atas lulus setelah perbaikan. Pengujian pembatalan menunggu toleransi penutupan pop-up SDK, bukan menganggap penutupan langsung menghasilkan callback.

OAuth Google pada proyek/domain produksi, consent screen, Safari/Firefox, dan ponsel fisik belum diuji. Provider Google serta konfigurasi proyek perlu diisi mengikuti [panduan Firebase](docs/FIREBASE_AUTH_SETUP.md). Catatan di bawah merupakan riwayat versi sebelumnya.

## Verifikasi branch Firebase Auth

`feat/login-page` berangkat langsung dari `main` commit `30505f7`. Build produksi lulus (JavaScript 127,00 KB gzip; CSS 16,75 KB gzip). Tujuh uji logika lulus, termasuk pemisahan key tamu/dua akun. Delapan skenario browser baseline serta empat skenario Firebase Auth Emulator lulus: registrasi/verifikasi, sesi, profil, password benar/salah, hapus/batal, reset sekali pakai, penggantian email setelah verifikasi, dan draf per identitas. Pemeriksaan aksesibilitas serta ponsel mencakup halaman masuk/daftar/pemulihan dan tiga tab akun.

Hasil browser diverifikasi melalui pemeriksaan lengkap (10 lulus) dan verifikasi ulang dua skenario setelah selector input password serta field `newEmail` pada pembacaan kode emulator diperbaiki. Tidak ada mock keberhasilan autentikasi. Audit dependency produksi: 0 temuan. Dependency Firebase CLI untuk development masih memiliki advisory moderate; CLI tidak dikirim ke browser. Konfigurasi proyek/domain produksi serta email sungguhan belum diuji. Panduan: [FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md). Bagian di bawah merupakan riwayat baseline.

Tanggal: **7 November 2026 WIB**. Lingkungan: Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright. Seluruh pemeriksaan berikut dilakukan pada proyek lokal; tidak ada pengujian akun/cloud atau URL publik.

## Hasil aktual

| Pemeriksaan            | Hasil                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`             | **6 lulus**, 0 gagal                                                                                                             |
| `npm run test:e2e`     | **8 lulus**, 0 gagal; pelaksanaan akhir sekitar 41 detik                                                                         |
| `npm run build`        | **Lulus**; hasil tersedia di `dist/`                                                                                             |
| Preview produksi       | 7 rute dimuat; sampel pH dan pemulihan setelah reload berfungsi; tidak ada runtime error/request gagal                           |
| Aksesibilitas otomatis | Tidak ada pelanggaran terdeteksi pada tag WCAG 2 A/AA dan 2.1 AA yang diperiksa axe di 7 rute serta dialog pencarian pada ponsel |
| Ukuran viewport        | 320, 390, 768, 1024, dan 1440 piksel; tidak ada overflow halaman pada skenario yang diperiksa                                    |

Build akhir menghasilkan JavaScript awal **88,96 KB gzip** dan CSS **15,21 KB gzip**. Font Latin variable berukuran 27,34 KB sebelum kompresi transfer; subset font lain tersedia sebagai aset dengan unicode-range. Font dan ikon dipaketkan lokal. Smoke test produksi tidak menemukan request runtime ke origin eksternal.

## Cakupan uji logika

1. Titik acuan pH, klasifikasi, konsentrasi ion, netralitas pada 25 °C, dan rasio 100 kali antara pH 3 dan 5.
2. Model HCl menghasilkan pH 1, 2, dan 3; konsentrasi di luar model ditolak.
3. Pengumpulan memerlukan lima jawaban, menghasilkan skor, dan menyalin jawaban tanpa mengubah hasil sebelumnya.
4. ID draf, hasil, pH, progres, dan tanda materi bertahan melalui serialisasi/pemulihan.
5. Storage ditolak/penuh, JSON rusak, jawaban di luar rentang, dan versi tidak cocok ditangani.
6. Rekap guru dihitung dari enam contoh: rerata 70, dua skor <80, tiga jawaban tepat untuk soal logaritmik.

## Cakupan uji browser

1. Materi selesai dan pH bertahan setelah reload; draf kuis pulih; pembahasan tertahan sampai pengumpulan; hasil 100 dan 20 tersimpan sebagai percobaan berbeda; reset batal/konfirmasi berfungsi; tidak ada page error.
2. Kuis belum lengkap tidak dapat dikumpulkan dan diarahkan ke pertanyaan belum dijawab.
3. Pencarian konsep, filter/pencarian siswa contoh, dialog rincian, serta unduhan JSON progres/data contoh berfungsi.
4. JSON lokal rusak dan akses `localStorage` ditolak tidak memblokir penggunaan kuis.
5. Menu ponsel dan slider melalui keyboard bekerja; halaman utama tidak melampaui lebar viewport 390 piksel.
6. axe memeriksa beranda, daftar materi, materi skala pH, laboratorium, kuis awal, progres, dan guru.
7. Pratinjau desktop/ponsel diambil, dan judul hero ponsel tidak terpotong secara horizontal.
8. Lebar 320, 768, dan 1024 piksel diperiksa pada halaman utama; pencarian ponsel memiliki nama aksesibel dan lolos pemeriksaan axe pada dialog terbuka.

## Artefak

- [Pratinjau desktop](docs/preview-desktop.png)
- [Pratinjau ponsel](docs/preview-mobile.png)
- [Laporan smoke produksi](docs/production-smoke.json)
- Uji logika: `tests/domain.test.js`
- Uji browser: `tests/browser/app.spec.js`

## Batas dan tindak lanjut

Pemeriksaan otomatis tidak menggantikan uji pembaca layar, seluruh kombinasi zoom/ukuran teks, browser Safari/Firefox, atau pengujian pengguna pada ponsel fisik. Skor Lighthouse dan Core Web Vitals lapangan belum diukur; nilai pada desain teknis merupakan target. Konten/diagnostik masih memerlukan validasi pengajar, bukan klaim efektivitas pembelajaran.

Tidak diuji karena di luar cakupan versi lokal: login Google, database cloud, Rules/RLS, antrean sinkronisasi, pergantian akun, hosting publik, dan PWA. Data panel guru bersifat fiktif.

## Pembaruan 9 November 2026 WIB

Perubahan bahasa antarmuka menghapus label demo, banner demonstrasi, narasi perkuliahan, dan rincian implementasi dari alur belajar. Panduan, navigasi, footer, referensi, serta panel guru menggunakan bahasa aplikasi. Asal data latihan tetap disebut sekali pada keterangan sumber panel guru.

- Build produksi lulus: JavaScript **88,71 KB gzip**, CSS **15,03 KB gzip**.
- Pemeriksaan aksesibilitas dan responsivitas lulus pada halaman yang diperiksa; pratinjau desktop/ponsel diperbarui.
- Skenario pratinjau memeriksa bahwa narasi demo tidak tampil pada tujuh rute dan panduan belajar.
- Delapan skenario browser lulus: tujuh pada pemeriksaan lengkap dan satu melalui verifikasi ulang setelah selector label lama diperbaiki.
- Nama tombol/label pada pengujian diselaraskan dengan antarmuka baru. Riwayat pengujian 7 November di atas tetap berlaku sebagai catatan versi sebelumnya.
