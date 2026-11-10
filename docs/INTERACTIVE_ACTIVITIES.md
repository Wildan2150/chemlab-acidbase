# Aktivitas eksternal asam–basa

Aktivitas dikembangkan pada `feat/interactive-activities` dari `main` commit `30505f7`, kemudian digabungkan ke `main` bersama materi, asesmen, dan akun pada 10 November 2026 WIB. Catatan eksplorasi mengikuti penyimpanan progres per UID/tamu.

| Lampiran F | Implementasi                                                                            | Bukti belajar                                                               |
| ---------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| F08 / I-03 | PhET Acid-Base Solutions dari sumber resmi                                              | Prediksi asam kuat/lemah, dua kondisi pengamatan, penjelasan ionisasi       |
| F07 / I-05 | 36 model 3D PubChem dengan 3Dmol.js lokal; pencarian nama/rumus/CID dan filter kelompok | Rumus/struktur, pengamatan ruang, alasan donor/akseptor proton              |
| F10 / I-07 | Pencarian PubChem PUG REST dengan nama berbahasa Inggris                                | Identitas CID, rumus, massa molar (g/mol), batas interpretasi sifat larutan |

Aktivitas dimuat setelah pengguna memilih membukanya. PhET tetap memakai iframe dari sumber resmi. Model molekul memakai dokumen viewer milik aplikasi dengan 3Dmol.js **2.5.5**, dipisahkan agar context WebGL, observer, dan event listener dibuang ketika molekul diganti atau halaman ditutup. Pustaka dimuat dinamis; data struktur SDF 3D untuk seluruh katalog disertakan lokal, sehingga viewer tidak meminta 3dmol.org, CDN, atau PubChem saat pengamatan. Pencarian properti PubChem tetap memakai layanan langsung. Lisensi lengkap 3Dmol.js disertakan pada `public/licenses/3dmol-LICENSE.txt`.

Viewer menjalankan `createViewer → addModel('sdf') → setStyle → zoomTo → resize → render`, memeriksa CID, jumlah/jenis atom, serta koordinat sebelum melaporkan siap. Komunikasi status/kontrol dibatasi pada origin, window, dan CID yang sesuai. Ada batas waktu pemuatan, pesan kegagalan berkas/WebGL, muat ulang, kontrol rotasi/zoom dengan keyboard, dan bacaan pendamping. Kehilangan context grafis memunculkan pesan dan dapat dipulihkan dengan muat ulang. Menyimpan catatan tidak bergantung pada status viewer.

Katalog dicari secara lokal menggunakan nama Indonesia/Inggris, alias, rumus Unicode/ASCII, serta CID. Angka CID dicocokkan tepat, sehingga `176` tidak memilih urea dengan CID `1176`. Pencarian/filter tidak mengganti model sampai pengguna memilih hasil. Pilihan saat ini tetap ditampilkan jika tidak sesuai filter; hasil kosong tidak membuang pilihan atau catatan. Lihat [daftar lengkap katalog](MOLECULE_CATALOGUE.md).

Catatan prediksi, pengamatan, penjelasan, dan pilihan CID tersimpan pada `activityNotes` di progres tamu. Versi skema tetap menerima data lama yang belum mempunyai catatan. Reset menghapus catatan bersama progres; ekspor membawa catatan. Menyimpan catatan lengkap adalah tindakan pengguna, bukan disimpulkan dari klik pada iframe. Aktivitas tambahan tidak mengubah makna lima langkah progres baseline.

PubChem diminta saat pencarian dikirim, bukan setiap ketikan. Nama di-encode, permintaan mempunyai batas waktu 12 detik, pembatalan, perlindungan hasil usang, serta jeda antarmulai pencarian minimal 700 ms. Status kosong, memuat, ditemukan, 404, layanan sibuk, respons rusak, dan jaringan gagal dibedakan. Tidak ada hasil lama yang ditampilkan sebagai hasil permintaan baru. Tidak ada pengulangan otomatis tanpa batas.

## Sumber

- [PhET Acid-Base Solutions](https://phet.colorado.edu/en/simulations/acid-base-solutions) dan [ketentuan penggunaan](https://phet.colorado.edu/en/licensing). Atribusi yang diminta PhET ditampilkan dekat sematan; identitas layanan tidak ditutupi. Skenario ini adalah pembelajaran nonkomersial.
- [3Dmol API tutorial](https://3dmol.org/doc/tutorial-code.html), [cara memakai modul](https://3dmol.org/doc/), dan [GLViewer](https://3dmol.org/doc/GLViewer.html), diperiksa pada 10 November 2026 WIB. Viewer API menerima `backgroundColor` di konfigurasi; URL viewer publik tidak menerima parameter `backgroundcolor` yang dahulu menghentikan pemuatan. Tautan tab baru kini hanya memakai parameter yang didokumentasikan, `cid` dan `style`. Model bola/batang memakai warna Jmol. Rotasi kamera tidak mengubah sudut ikatan; satu konformer tidak mewakili seluruh bentuk/kondisi larutan.
- Rekaman struktur diambil dari endpoint PubChem `compound/cid/{CID}/record/SDF?record_type=3d`. Identitas, rumus, jumlah atom/ikatan, URL sumber, dan SHA-256 dicatat pada [sources.json](../public/molecules/sources.json). Molekul tanpa rekaman 3D tidak dimasukkan; tidak ada koordinat yang direka atau struktur 2D yang diberi label 3D.
- [PubChem PUG REST](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) dan [tutorial resmi](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest-tutorial). Identitas dan properti selalu dapat ditelusuri melalui tautan CID.

## Verifikasi

Pemeriksaan awal HTTP 200 ternyata tidak cukup: viewer publik berhenti pada parameter `backgroundcolor`, tanpa mengirim permintaan struktur. Kegagalan tersebut direproduksi di Edge dan diperbaiki dengan API lokal. Pengujian baru memeriksa piksel struktur yang benar-benar tergambar, bukan hanya keberadaan iframe/canvas atau status HTTP. Hasil pengujian terbaru dicatat pada [TESTING.md](../TESTING.md).

Uji browser memakai respons jaringan terkontrol untuk memeriksa kegagalan, 404, data, dan penghapusan hasil usang, di samping pemeriksaan aksesibilitas, ponsel, pemulihan draf, serta reset. Catatan teknis ini bukan teks yang ditampilkan pada alur belajar siswa.
