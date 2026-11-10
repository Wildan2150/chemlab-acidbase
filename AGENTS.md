# Panduan perubahan ProyekContoh

- Ini demo React + Vite berbahasa Indonesia untuk topik asam–basa/pH.
- Main menggabungkan materi mendalam, asesmen akhir bab, aktivitas interaktif, serta Firebase Auth sesuai arahan pengajar. Pisahkan asesmen akhir bab dari kuis diagnostik; progres tetap lokal per UID/tamu dan panel guru memakai data fiktif.
- Simpan data di `src/data/`: metadata dan diagnostik di `chemData.js`, bacaan di `readingContent.js`, instrumen asesmen di `chapterAssessment.js`, serta aktivitas di `activities.js`. Pisahkan perhitungan dan penyimpanan dari komponen tampilan.
- Jangan mengubah dokumen mata kuliah di luar `ProyekContoh` untuk perubahan demo.
- Jangan menyebut login/cloud berhasil tanpa integrasi dan bukti aktual. Panel guru contoh harus tetap berlabel fiktif.
- Uji akun menggunakan Auth Emulator dengan project ID `demo-chemlab`; jangan memakai akun/proyek produksi untuk uji yang membuat atau menghapus pengguna. Konfigurasi produksi menyusul.
- Google memakai Firebase SDK; pertahankan urutan persistensi local/session yang konsisten antar-tab. Akun khusus Google tidak diminta password ChemLab untuk penghapusan; lakukan autentikasi ulang dengan provider yang sama dan tetap minta konfirmasi hapus.
- Teks antarmuka berbicara langsung kepada siswa/guru sebagai pengguna aplikasi. Jangan menampilkan label demo atau narasi tentang kuliah, prototipe, maupun implementasi. Asal data latihan dijelaskan singkat pada keterangan sumber panel guru, bukan banner atau label pada setiap elemen.
- Pertahankan draf per pilihan, ID percobaan stabil, pemisahan diagnostik awal dan latihan ulang, serta reset berkonfirmasi.
- Jangan memakai `localStorage.clear()`. Perubahan soal memerlukan keputusan versi dan migrasi data.
- Asesmen memiliki versi sendiri dan salinan instrumen per hasil. Hasil yang sudah dikumpulkan tidak boleh berubah saat draf atau bank aktif berubah. Pemulihan field asesmen tidak boleh menghapus progres materi/diagnostik yang masih valid.
- Pertahankan akses keyboard, label, kontras teks, dan tampilan ponsel; angka/label harus mendampingi warna.
- Untuk perubahan logika data atau kuis, jalankan uji relevan. Sebelum menyerahkan perubahan aplikasi, jalankan build dan cek alur yang terkena.
- Isi `AI_LOG.md` dan `TESTING.md` sesuai hasil nyata, tanpa mengklaim validasi pengajar atau pengujian produksi yang belum dilakukan.
