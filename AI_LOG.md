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

## Pengembangan terpisah — feat/material-updates

Berangkat dari `main` commit `30505f7`. Materi diperluas menjadi 24 bagian pada tiga ID bacaan yang sama; sumber penerbit ditelusuri melalui web dan dirujuk per bagian. Ditambahkan prasyarat, daftar isi, tabel, contoh hitung, ringkasan, serta refleksi. Tidak ada penggabungan fitur eksternal atau akun. Bank soal dan versi diagnostik dipertahankan. Build, enam uji logika, delapan skenario browser baseline, dan satu skenario bacaan mendalam lulus.
