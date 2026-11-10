# Hasil pengujian demo

## Verifikasi branch asesmen akhir bab

Baseline `feat/material-updates` commit `834ee59`; tidak menggabungkan branch lain. Build produksi berhasil. **15 uji logika dan 13 skenario browser lulus**, termasuk sembilan uji logika penilaian/migrasi serta empat skenario browser asesmen. Acuan keenam hitungan diverifikasi dari rumus independen, selisih terhadap acuan tersimpan <10⁻⁸. Aksesibilitas otomatis diperiksa pada pengantar, soal pilihan, input angka, tinjauan, dan hasil; responsivitas hasil diperiksa pada 320, 390, 768, dan 1440 piksel. Rincian dan batas verifikasi ada di [CHAPTER_ASSESSMENT.md](docs/CHAPTER_ASSESSMENT.md). Bagian berikut mencatat riwayat branch induk dan baseline.

## Verifikasi branch materi

`feat/material-updates` berangkat langsung dari `main` commit `30505f7`. Build produksi dan enam uji logika lulus. Delapan skenario browser baseline serta satu skenario tambahan untuk daftar isi, fokus heading, refleksi, tabel ponsel, referensi, dan pemulihan progres lulus. Referensi dan pemeriksaan hitung dijabarkan di [MATERIAL_SOURCES.md](docs/MATERIAL_SOURCES.md). Bagian berikut merupakan riwayat pemeriksaan baseline.

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
