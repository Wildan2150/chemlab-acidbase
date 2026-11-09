# Log bantuan AI

## 7 November 2026 WIB — pembuatan demo

**Permintaan:** membuat web demo kuliah di `ProyekContoh` dan meminta beberapa keputusan pengajar.

**Konteks yang dibaca:** kerangka kuliah, indeks kurikulum, catatan local first, katalog interaktif, dan panduan pemisahan data serta jawaban diagnostik. Skill teknis yang digunakan: `senior-frontend`.

**Keputusan manusia:** aplikasi pembelajaran untuk siswa; topik asam–basa dan pH; versi lokal tanpa akun dengan data contoh di panel guru.

**Bantuan agent:** membuat struktur React + Vite, konten awal, lima butir, model pH, state/draf lokal, panel contoh, visual SVG, styling, dokumentasi, dan uji otomatis.

**Koreksi dari verifikasi:** perbaikan kontras dan ukuran teks; penahanan overflow tabel pada ponsel; label pencarian ketika teks disembunyikan; pemisahan selector dialog pada tes; pengujian storage ditolak harus memuat ulang dokumen, bukan sekadar berpindah hash.

**Verifikasi:** lihat `TESTING.md` untuk hasil aktual. Uji teknis tidak menggantikan validasi isi/asesmen oleh pengajar. Login, cloud, dan deployment tidak dilakukan pada versi ini.

## 9 November 2026 WIB — bahasa antarmuka

**Arahan pengajar:** hilangkan bias meta; tujuan pembuatan sebagai demo tidak perlu menjadi label pada aplikasi.

**Perubahan:** menghapus badge demo, banner demonstrasi, dan narasi perkuliahan/implementasi dari antarmuka. Panduan menjelaskan cara belajar; footer, deskripsi halaman, referensi, serta tombol memakai bahasa produk. Panel guru memakai nama/kode siswa netral dan menyebut asal data latihan fiktif satu kali pada keterangan sumber. Konteks pengembangan tetap tersedia dalam dokumentasi proyek.

**Pemeriksaan:** selector uji yang mengikuti nama tombol diperbarui; pemeriksaan halaman dan panduan pada skenario browser memastikan label/narasi demo tidak tampil. Hasil akhir dicatat di `TESTING.md`.

## Pengembangan terpisah — feat/login-page

Berangkat dari `main` commit `30505f7`. Pengajar memilih Firebase Auth dan konfigurasi proyek menyusul. Ditambahkan alur email/password, registrasi, verifikasi, pemulihan sekali pakai, profil, perubahan email/password dengan autentikasi ulang, logout, dan hapus akun berkonfirmasi. State/progres dipisahkan per UID dan tamu. Tidak ada penggabungan branch materi atau interaktif.

Integrasi diuji melalui Firebase Auth Emulator yang sesungguhnya menggunakan fixture unik, tanpa kredensial/akun produksi. Dua instalasi npm sempat bentrok; dependency dipulihkan melalui pemasangan bersih dari lockfile sebelum uji. Override kompatibel grpc menghilangkan advisory produksi. Build, tujuh uji logika, delapan skenario belajar, dan empat skenario Auth Emulator lulus. Email nyata dan domain produksi belum diuji karena konfigurasi belum diberikan.

## 9 November 2026 WIB — Google di feat/login-page

**Arahan pengajar:** tambahkan tombol login Google dan tetap pada `feat/login-page`.

**Perubahan:** tombol “Lanjutkan dengan Google” pada masuk/daftar, memakai `GoogleAuthProvider` dan pop-up Firebase dengan pilihan akun serta persistensi sesuai “Ingat saya”. Akun khusus Google menampilkan pengaturan email/password di Google dan mengonfirmasi penghapusan akun ChemLab melalui autentikasi ulang Google. Konfirmasi hapus tetap wajib; SDK menolak identitas berbeda. Pesan pembatalan/pemblokiran pop-up serta kesalahan provider/domain ditangani. Dokumentasi aktivasi provider dan pratinjau diperbarui.

**Temuan dan perbaikan:** tab baru dapat memigrasikan persistensi default SDK ke penyimpanan berbeda sehingga tab sebelumnya keluar. `initializeAuth` kini memakai urutan local/session yang konsisten dengan layanan masuk. Uji menunggu halaman pemilih emulator siap dan toleransi penutupan pop-up Firebase; verifikasi penghapusan memakai endpoint admin lokal emulator yang sesuai.

**Hasil nyata:** build produksi, tujuh uji logika, dan seluruh 15 skenario browser lulus, termasuk tiga skenario Google. Pemeriksaan mencakup sesi antar-tab/per-tab, progres terpisah, pembatalan, penolakan identitas salah, hapus akun, aksesibilitas, ponsel, serta keadaan tanpa konfigurasi. Tidak ada dependency baru, akun produksi, atau penggabungan branch lain. Google OAuth produksi tetap menunggu konfigurasi proyek pengguna.
