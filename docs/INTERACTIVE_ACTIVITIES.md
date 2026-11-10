# Aktivitas eksternal asam–basa

Aktivitas dikembangkan pada `feat/interactive-activities` dari `main` commit `30505f7`, kemudian digabungkan ke `main` bersama materi, asesmen, dan akun pada 10 November 2026 WIB. Catatan eksplorasi mengikuti penyimpanan progres per UID/tamu.

| Lampiran F | Implementasi | Bukti belajar |
| --- | --- | --- |
| F08 / I-03 | PhET Acid-Base Solutions dari sumber resmi | Prediksi asam kuat/lemah, dua kondisi pengamatan, penjelasan ionisasi |
| F07 / I-05 | Viewer 3Dmol dengan molekul air (CID 962), amonia (222), dan asam asetat (176) dari PubChem | Rumus/struktur, pengamatan ruang, alasan donor/akseptor proton |
| F10 / I-07 | Pencarian PubChem PUG REST dengan nama berbahasa Inggris | Identitas CID, rumus, massa molar (g/mol), batas interpretasi sifat larutan |

Sematan dimuat setelah pengguna memilih membuka aktivitas. Judul iframe, kontrol tab baru, muat ulang, atribusi, dan bacaan pendamping selalu disediakan. `onLoad` tidak dipakai sebagai bukti simulasi berhasil; aplikasi tidak membaca aktivitas di dalam layanan lintas domain. Tidak ada pustaka atau situs luar yang disalin ke repo.

Catatan prediksi, pengamatan, penjelasan, dan pilihan CID tersimpan pada `activityNotes` di progres tamu. Versi skema tetap menerima data lama yang belum mempunyai catatan. Reset menghapus catatan bersama progres; ekspor membawa catatan. Menyimpan catatan lengkap adalah tindakan pengguna, bukan disimpulkan dari klik pada iframe. Aktivitas tambahan tidak mengubah makna lima langkah progres baseline.

PubChem diminta saat pencarian dikirim, bukan setiap ketikan. Nama di-encode, permintaan mempunyai batas waktu 12 detik, pembatalan, perlindungan hasil usang, serta jeda antarmulai pencarian minimal 700 ms. Status kosong, memuat, ditemukan, 404, layanan sibuk, respons rusak, dan jaringan gagal dibedakan. Tidak ada hasil lama yang ditampilkan sebagai hasil permintaan baru. Tidak ada pengulangan otomatis tanpa batas.

## Sumber

- [PhET Acid-Base Solutions](https://phet.colorado.edu/en/simulations/acid-base-solutions) dan [ketentuan penggunaan](https://phet.colorado.edu/en/licensing). Atribusi yang diminta PhET ditampilkan dekat sematan; identitas layanan tidak ditutupi. Skenario ini adalah pembelajaran nonkomersial.
- [3Dmol URL viewer](https://3dmol.org/doc/tutorial-url.html), dengan pengenal `cid` dan gaya stick. Rotasi kamera tidak dianggap perubahan sudut ikatan; molekul statis tidak menunjukkan seluruh konformasi.
- [PubChem PUG REST](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) dan [tutorial resmi](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest-tutorial). Identitas dan properti selalu dapat ditelusuri melalui tautan CID.

## Verifikasi

Permintaan langsung ke HTML PhET, HTML viewer 3Dmol, serta API PubChem berhasil HTTP 200 pada lingkungan pengembangan. Pencarian etanol mengembalikan CID 702, C2H6O, dan massa molar 46,07 g/mol. Ketersediaan layanan luar dapat berubah. Pemeriksaan HTTP tidak membuktikan setiap interaksi visual di dalam iframe bekerja pada semua perangkat.

Uji browser memakai respons jaringan terkontrol untuk memeriksa kegagalan, 404, data, dan penghapusan hasil usang, di samping pemeriksaan aksesibilitas, ponsel, pemulihan draf, serta reset. Catatan teknis ini bukan teks yang ditampilkan pada alur belajar siswa.
