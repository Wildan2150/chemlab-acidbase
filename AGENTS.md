# Panduan perubahan ProyekContoh

- Ini demo React + Vite berbahasa Indonesia untuk topik asam–basa/pH.
- Ruang lingkup yang dipilih pengajar: aplikasi siswa, lokal tanpa akun, panel guru data fiktif.
- Simpan materi/soal/sumber di `src/data/chemData.js`; perhitungan dan penyimpanan terpisah dari komponen tampilan.
- Jangan mengubah dokumen mata kuliah di luar `ProyekContoh` untuk perubahan demo.
- Jangan menyebut login/cloud berhasil tanpa integrasi dan bukti aktual. Panel guru contoh harus tetap berlabel fiktif.
- Teks antarmuka berbicara langsung kepada siswa/guru sebagai pengguna aplikasi. Jangan menampilkan label demo atau narasi tentang kuliah, prototipe, maupun implementasi. Asal data latihan dijelaskan singkat pada keterangan sumber panel guru, bukan banner atau label pada setiap elemen.
- Pertahankan draf per pilihan, ID percobaan stabil, pemisahan diagnostik awal dan latihan ulang, serta reset berkonfirmasi.
- Jangan memakai `localStorage.clear()`. Perubahan soal memerlukan keputusan versi dan migrasi data.
- Pertahankan akses keyboard, label, kontras teks, dan tampilan ponsel; angka/label harus mendampingi warna.
- Untuk perubahan logika data atau kuis, jalankan uji relevan. Sebelum menyerahkan perubahan aplikasi, jalankan build dan cek alur yang terkena.
- Isi `AI_LOG.md` dan `TESTING.md` sesuai hasil nyata, tanpa mengklaim validasi pengajar atau pengujian produksi yang belum dilakukan.
