# Panel guru dan data siswa

Guru ditetapkan untuk akun Firebase Auth dengan email **wildannashihin@gmail.com** yang sudah terverifikasi. Akun produksi tersebut sudah ditemukan, aktif, terverifikasi, dan terhubung Google. Masuk dengan akun itu lalu pilih **Panel guru**. Setelah pembaruan aplikasi, muat ulang halaman bila panel masih menampilkan pesan izin dari sesi sebelumnya.

## Hak akses

- Menu guru tampil hanya untuk akun guru terverifikasi. Tamu yang membuka `/#guru` diminta masuk; siswa biasa mendapat halaman akses khusus guru. Akun dengan email guru yang belum terverifikasi diminta menyelesaikan verifikasi.
- Firestore Rules memeriksa `request.auth.token.email` dan `email_verified`. Email dibandingkan tanpa membedakan huruf besar/kecil. Nama tampilan, `localStorage`, dan field role buatan pada profil tidak memberikan hak guru.
- Guru dapat membaca daftar profil serta progres siswa. Guru tidak dapat mengubah hasil belajar atau menghapus profil akun lain. Siswa tetap hanya dapat membaca/menulis data miliknya sendiri.
- Data kelas dibaca dengan sesi Firebase terpisah yang hanya memakai memori. Sesi tersebut beserta listener-nya dibuang saat panel ditutup, akses gagal, akun berganti, atau pengguna keluar. Data kelas tidak dimasukkan ke cache client progres siswa maupun localStorage.
- Seluruh akun siswa pada proyek aplikasi yang memiliki profil/progres tersinkron dapat muncul; belum ada pembagian kelas atau guru kedua.

Rules ini sudah dipasang ke proyek `chemlab-web`. Bukti sumber Rules, akun guru, dan simulasi izin produksi tersedia di [firestore-production-check.json](firestore-production-check.json).

## Data dan rekap

Panel menggabungkan `learnerProfiles/{UID}` dengan `learningProgress/{UID}`. Profil memuat nama tampilan, email dari Firebase Auth, dan timestamp server. Profil dibuat/diperbarui saat siswa masuk atau mengubah nama/email. Dua profil akun lama yang sudah memiliki progres produksi dilengkapi dari metadata Firebase Auth; tidak ada hasil belajar yang diubah. Bukti migrasi hanya memuat jumlah, tanpa identitas siswa: [teacher-profile-backfill.json](teacher-profile-backfill.json).

Dokumen progres yang sudah ditandai terhapus dan akun guru tidak dimasukkan ke daftar siswa. Akun lama tanpa profil tetap dapat ditampilkan menggunakan ID sebagai pengenal. Catatan yang rusak ditandai untuk diperiksa dan dikeluarkan dari perhitungan skor; tidak diganti dengan siswa/hasil contoh.

- **Diagnostik awal** memakai percobaan diagnostik pertama per siswa, terpisah dari latihan ulang.
- **Asesmen akhir bab** memakai hasil terbaru per siswa, dengan instrumen dan pembahasan dari snapshot hasil tersebut.
- Rata-rata dihitung hanya dari hasil yang sudah dikumpulkan. Belum mengumpulkan ditampilkan terpisah, bukan dianggap bernilai nol.
- Ambang pendampingan awal adalah 80 dan dapat diubah pada panel. Penanda ini membantu prioritas pembelajaran, bukan menetapkan nilai akhir.
- Rekap diagnostik menghitung jawaban tepat per butir terhadap jumlah siswa yang mengumpulkan. Rekap asesmen menghitung jawaban tepat per cakupan instrumen; versi instrumen ditampilkan saat mengelompokkan cakupan.
- Panel memperbarui catatan dari server. Saat koneksi terputus, data terakhir ditandai; kegagalan izin tidak menampilkan tabel lama sebagai pengganti data yang ditolak.

Skor berasal dari jawaban dan perhitungan aplikasi siswa. Akses database terlindungi, tetapi penilaian formal tetap memerlukan validasi guru/server agar perubahan data client tidak dianggap nilai resmi.

## Pencarian, rincian, dan ekspor

Cari nama, email, kode, atau UID. Filter membedakan siswa yang perlu pendampingan, sudah mengumpulkan, belum mengumpulkan, dan catatan yang perlu diperiksa. Rekap bagian atas mencakup semua siswa termuat; ekspor mengikuti pencarian/filter tabel.

Tombol rincian menampilkan materi selesai, riwayat diagnostik/latihan/asesmen, jawaban per soal, pembahasan, serta prediksi/pengamatan/penjelasan eksplorasi. Mengganti percobaan pada rincian tidak mengubah hasil siswa.

Ekspor JSON membawa hasil dan snapshot instrumen yang ditinjau beserta progres lengkap akun yang terpilih. Ekspor CSV membawa identitas, progres materi, skor awal/akhir, status, serta waktu sinkronisasi. Sel yang dapat dianggap formula spreadsheet diberi perlindungan saat ekspor. Data pribadi siswa hanya tersedia pada panel guru dan ekspor guru.

## Pengujian

- Uji logika: penetapan email terverifikasi, pemilihan hasil pertama/terbaru, penanganan catatan rusak/terhapus, rata-rata/denominator, pencarian/filter, ekspor, dan perlindungan formula CSV.
- Uji browser melalui Auth/Firestore Emulator: tamu/siswa/guru belum terverifikasi ditolak; guru terverifikasi dapat melihat progres nyata fixture yang berubah langsung; guru tidak dapat menulis hasil akun lain; perubahan profil/localStorage tidak memberi akses; rincian dan ekspor bekerja; ponsel, keyboard, dan pemeriksaan aksesibilitas otomatis lulus.
- Pemeriksaan produksi memakai akun guru yang sudah ada dan simulasi Rules; tidak membuat atau menghapus pengguna produksi. Profil akun lama saja yang dilengkapi dari Firebase Auth.

Hasil aktual dan batas pemeriksaan tercatat di [TESTING.md](../TESTING.md). Pratinjau [desktop](preview-teacher.png) dan [ponsel](preview-teacher-mobile.png) berasal dari pengujian emulator, bukan data siswa produksi.
