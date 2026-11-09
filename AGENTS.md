# Panduan perubahan ProyekContoh

- Ini demo React + Vite berbahasa Indonesia untuk topik asam–basa/pH.
- Branch asesmen berangkat dari `feat/material-updates` commit `834ee59`. Pertahankan bacaan mendalam dan pisahkan asesmen akhir bab dari kuis diagnostik; jangan menggabungkan branch akun/interaktif tanpa arahan.
- Ruang lingkup yang dipilih pengajar: aplikasi siswa, lokal tanpa akun, panel guru data fiktif.
- Simpan materi/soal/sumber di `src/data/chemData.js`; perhitungan dan penyimpanan terpisah dari komponen tampilan.
- Jangan mengubah dokumen mata kuliah di luar `ProyekContoh` untuk perubahan demo.
- Jangan menyebut login/cloud berhasil tanpa integrasi dan bukti aktual. Panel guru contoh harus tetap berlabel fiktif.
- Teks antarmuka berbicara langsung kepada siswa/guru sebagai pengguna aplikasi. Jangan menampilkan label demo atau narasi tentang kuliah, prototipe, maupun implementasi. Asal data latihan dijelaskan singkat pada keterangan sumber panel guru, bukan banner atau label pada setiap elemen.
- Pertahankan draf per pilihan, ID percobaan stabil, pemisahan diagnostik awal dan latihan ulang, serta reset berkonfirmasi.
- Jangan memakai `localStorage.clear()`. Perubahan soal memerlukan keputusan versi dan migrasi data.
- Asesmen memiliki versi sendiri dan salinan instrumen per hasil. Hasil yang sudah dikumpulkan tidak boleh berubah saat draf atau bank aktif berubah. Pemulihan field asesmen tidak boleh menghapus progres materi/diagnostik yang masih valid.
- Pertahankan akses keyboard, label, kontras teks, dan tampilan ponsel; angka/label harus mendampingi warna.
- Untuk perubahan logika data atau kuis, jalankan uji relevan. Sebelum menyerahkan perubahan aplikasi, jalankan build dan cek alur yang terkena.
- Isi `AI_LOG.md` dan `TESTING.md` sesuai hasil nyata, tanpa mengklaim validasi pengajar atau pengujian produksi yang belum dilakukan.
