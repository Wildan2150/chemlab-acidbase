# Log bantuan AI

## 10 November 2026 WIB — merge seluruh branch

**Arahan pengajar:** gabungkan semua branch repo dan selesaikan konflik.

**Perubahan:** memperbarui referensi remote, menyimpan posisi awal `main` pada `backup/main-before-merge-20261110`, lalu menggabungkan asesmen (yang sudah mencakup materi), aktivitas interaktif, dan akun melalui merge commit. Konflik diselesaikan dengan mempertahankan seluruh rute, tombol beranda, riwayat asesmen, catatan eksplorasi, stylesheet, serta penyimpanan per UID/tamu. Panduan branch dan dokumentasi disesuaikan dengan cakupan `main`; riwayat pengembangan dipertahankan. Gambar pratinjau yang berkonflik diperbarui melalui pengujian aplikasi gabungan.

**Verifikasi:** 16 uji logika, 25 skenario browser, serta build produksi lulus. Skenario integrasi tambahan memeriksa pemulihan bacaan/draf asesmen/catatan eksplorasi saat berganti akun, reload, dan reset akun aktif tanpa menghapus data tamu. Akun diuji dengan Auth Emulator `demo-chemlab`; pengujian OAuth/domain/email produksi tidak dilakukan. Rincian ada di `TESTING.md`. Branch fitur dipertahankan dan perubahan belum didorong ke remote.

## 9 November 2026 WIB — feat/chapter-assessment

Arahan pengajar: menambahkan branch asesmen akhir bab dengan baseline `feat/material-updates`. Branch dibuat dari `834ee59`, tanpa mengambil fitur akun/interaktif atau mengubah induk.

Agent menyusun 15 soal baru yang dipetakan ke bacaan lengkap, penilaian pilihan/angka dengan toleransi, penguncian sebelum pembahasan, UUID/versi serta snapshot instrumen, riwayat/ekspor, dan pemulihan kompatibel data lama. Enam acuan numerik diperiksa secara independen. Build, 15 uji logika, dan 13 skenario browser lulus. Validasi formal isi dan penggunaan untuk nilai tetap memerlukan peninjauan pengajar. Rincian ada di `docs/CHAPTER_ASSESSMENT.md`.

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

## Pengembangan terpisah — feat/material-updates

Berangkat dari `main` commit `30505f7`. Materi diperluas menjadi 24 bagian pada tiga ID bacaan yang sama; sumber penerbit ditelusuri melalui web dan dirujuk per bagian. Ditambahkan prasyarat, daftar isi, tabel, contoh hitung, ringkasan, serta refleksi. Tidak ada penggabungan fitur eksternal atau akun. Bank soal dan versi diagnostik dipertahankan. Build, enam uji logika, delapan skenario browser baseline, dan satu skenario bacaan mendalam lulus.

## Pengembangan terpisah — feat/interactive-activities

Berangkat dari `main` commit `30505f7`. Memilih F08 (PhET), F07 (3Dmol), dan F10 (PubChem) dari Lampiran F, dengan pendampingan yang terkait asam–basa. Sumber resmi dan dokumentasi API diperiksa; ketiga endpoint diperiksa langsung dan mengembalikan HTTP 200. Catatan siswa disimpan lokal bersama progres, tanpa mengklaim pembacaan isi iframe. Pengujian meliputi jaringan gagal/404, respons API, aksesibilitas, ponsel, draf, dan reset. Tidak ada perubahan materi mendalam atau login pada branch ini.

## Pengembangan terpisah — feat/login-page

Berangkat dari `main` commit `30505f7`. Pengajar memilih Firebase Auth dan konfigurasi proyek menyusul. Ditambahkan alur email/password, registrasi, verifikasi, pemulihan sekali pakai, profil, perubahan email/password dengan autentikasi ulang, logout, dan hapus akun berkonfirmasi. State/progres dipisahkan per UID dan tamu. Tidak ada penggabungan branch materi atau interaktif.

Integrasi diuji melalui Firebase Auth Emulator yang sesungguhnya menggunakan fixture unik, tanpa kredensial/akun produksi. Dua instalasi npm sempat bentrok; dependency dipulihkan melalui pemasangan bersih dari lockfile sebelum uji. Override kompatibel grpc menghilangkan advisory produksi. Build, tujuh uji logika, delapan skenario belajar, dan empat skenario Auth Emulator lulus. Email nyata dan domain produksi belum diuji karena konfigurasi belum diberikan.

## 9 November 2026 WIB — Google di feat/login-page

**Arahan pengajar:** tambahkan tombol login Google dan tetap pada `feat/login-page`.

**Perubahan:** tombol “Lanjutkan dengan Google” pada masuk/daftar, memakai `GoogleAuthProvider` dan pop-up Firebase dengan pilihan akun serta persistensi sesuai “Ingat saya”. Akun khusus Google menampilkan pengaturan email/password di Google dan mengonfirmasi penghapusan akun ChemLab melalui autentikasi ulang Google. Konfirmasi hapus tetap wajib; SDK menolak identitas berbeda. Pesan pembatalan/pemblokiran pop-up serta kesalahan provider/domain ditangani. Dokumentasi aktivasi provider dan pratinjau diperbarui.

**Temuan dan perbaikan:** tab baru dapat memigrasikan persistensi default SDK ke penyimpanan berbeda sehingga tab sebelumnya keluar. `initializeAuth` kini memakai urutan local/session yang konsisten dengan layanan masuk. Uji menunggu halaman pemilih emulator siap dan toleransi penutupan pop-up Firebase; verifikasi penghapusan memakai endpoint admin lokal emulator yang sesuai.

**Hasil nyata:** build produksi, tujuh uji logika, dan seluruh 15 skenario browser lulus, termasuk tiga skenario Google. Pemeriksaan mencakup sesi antar-tab/per-tab, progres terpisah, pembatalan, penolakan identitas salah, hapus akun, aksesibilitas, ponsel, serta keadaan tanpa konfigurasi. Tidak ada dependency baru, akun produksi, atau penggabungan branch lain. Google OAuth produksi tetap menunggu konfigurasi proyek pengguna.
