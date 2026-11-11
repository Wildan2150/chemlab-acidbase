# PRD — ChemLab demo lokal

Perkembangan `main`: materi mendalam, aktivitas interaktif, asesmen akhir bab, Firebase Auth, dan Firestore sudah ditambahkan. Panel guru kini membaca hasil siswa nyata dan dibatasi untuk email guru terverifikasi yang ditetapkan pengajar; tamu tetap lokal. Bagian berikut mempertahankan rancangan versi awal; kontrak terbaru ada di [DATABASE.md](DATABASE.md) dan [TEACHER_PANEL.md](docs/TEACHER_PANEL.md).

## Masalah dan pengguna

Siswa kelas XI sering membaca pH secara linear dan menyamakan kuat/lemah dengan pekat/encer. Demo menghubungkan representasi partikel, persamaan, skala pH, dan jawaban diagnostik. Mahasiswa Pendidikan Kimia memakainya sebagai contoh produk kuliah; guru melihat contoh pemanfaatan bukti per butir.

## Pengenalan fitur dan bantuan kontekstual — 11 November 2026 WIB

Pengguna baru perlu memahami lokasi fitur dan langkah pertama untuk memakainya. Sediakan sambutan otomatis dan **guided product tour** dengan balon petunjuk yang menunjuk menu nyata, sorotan target, serta latar redup sesuai referensi pengajar. Tur mencakup materi, laboratorium, eksplorasi, diagnostik, asesmen, dan progres. Siswa tetap bebas menentukan urutan belajar.

Tambahkan **contextual / behavior-triggered onboarding**: petunjuk penggunaan pertama PhET dan model molekul, serta bantuan setelah pencarian atau pengumpulan jawaban menemui kendala berulang. Bantuan menjelaskan tindakan konkret dan tidak memberi label bahwa pengguna bingung. Waktu membaca saja bukan sinyal. Di Eksplorasi, petunjuk menunjuk kontrol simulasi dan mencakup pengamatan serta pencatatan hasil.

Kriteria penerimaan tambahan:

- Tur muncul pada kunjungan pertama di halaman belajar; alur akun dan panel guru tidak disela. Tujuh langkah termasuk sambutan, tanpa perpindahan langkah otomatis.
- Pengguna dapat kembali, melewati, menutup dengan Escape, dan mengulang melalui Tur fitur/Panduan belajar. Selesai atau dilewati diingat pada browser yang sama.
- Sorotan dan balon menunjuk elemen sebenarnya, menyesuaikan viewport dan navigasi ponsel, serta memiliki fallback bila target tidak tersedia.
- Dua kendala sejenis memicu bantuan pencarian, diagnostik, asesmen, pemuatan ulang simulasi, atau PubChem. Petunjuk khusus PhET, molekul, dan PubChem muncul saat pertama membuka masing-masing tab, sebelum tombol aktivitas ditekan. Jika sambutan terbuka, petunjuk aktivitas menunggu tanpa ditandai sudah dilihat.
- Maksimal tiga saran kendala berulang per sesi, satu per topik, jeda minimal 60 detik; pencarian tanpa hasil menunggu kata kunci stabil 1,5 detik dan dua kata berbeda. Pengenalan aktivitas baru tidak tertahan kuota/jeda tersebut, tetap menghormati preferensi bantuan otomatis.
- Panduan belajar menyediakan Ulangi semua petunjuk untuk mengulang tur dan pengenalan aktivitas tanpa menghapus progres. Hard refresh/clear cache HTTP mempertahankan status yang disimpan di browser.
- Bantuan kontekstual tidak mengunci halaman atau mengambil fokus. Pengguna dapat menutup/menonaktifkannya dan tetap membuka petunjuk eksplorasi secara manual.
- Preferensi UI terpisah dari progres belajar/UID/Firestore; kegagalan storage tidak menghalangi belajar. Tidak ada pengiriman analitik atau pembacaan isi iframe PhET.
- Keyboard, layar 320 piksel, serta aksesibilitas otomatis diperiksa. Efektivitas UX tetap memerlukan uji pengguna tersendiri.

Aturan lengkap, alasan desain, kontrak penyimpanan, dan titik implementasi: [ONBOARDING.md](docs/ONBOARDING.md).

## Keputusan pengajar, 7 November 2026 WIB

1. Bentuk produk: aplikasi pembelajaran kimia untuk siswa.
2. Topik utama: asam–basa dan pH.
3. Versi pertama: lokal tanpa akun; panel guru menggunakan data contoh.

## Tujuan dan bukti

| Tujuan                                        | Aktivitas               | Butir | Bukti dan tindak lanjut                                                   |
| --------------------------------------------- | ----------------------- | ----- | ------------------------------------------------------------------------- |
| Mengenali H₃O⁺ sebagai ion penentu sifat asam | Materi 01               | q1    | Jawaban per butir; kembali ke ionisasi HCl                                |
| Memahami skala logaritmik                     | Materi 02 dan pH 3 vs 5 | q2    | Pilihan linear menjadi dugaan awal; minta alasan dan perbandingan pangkat |
| Menghitung pH HCl dalam rentang model         | Model HCl pada lab      | q3    | Periksa −log₁₀(c) untuk tiga konsentrasi                                  |
| Memisahkan kekuatan dan konsentrasi           | Materi 01               | q4    | Buat contoh asam kuat yang encer                                          |
| Menafsirkan netralisasi dengan asumsi         | Materi 03               | q5    | Tulis reaksi ionik dan periksa mol berlebih                               |

## Kriteria penerimaan

- Materi dan lima soal terpisah dari komponen di `src/data/`.
- Tanpa login, siswa dapat belajar, memilih jawaban, memuat ulang, serta melanjutkan.
- Hasil awal dikunci sebelum pembahasan; latihan ulang mendapat ID baru.
- Model pH mengeluarkan klasifikasi dan angka, serta menyebutkan suhu/asumsi.
- Guru dapat melihat rekap dan jawaban fiktif per siswa; data contoh ditandai jelas.
- Ekspor menghasilkan berkas JSON; reset hanya berjalan setelah konfirmasi.
- Semua halaman dapat digunakan pada desktop dan ponsel dengan keyboard dasar.

## Cakupan dan keberhasilan

Versi ini mendemonstrasikan produk lokal untuk tahapan materi, kuis, dan analisis penilaian. Belum mewakili seluruh capaian cloud dan deployment kuliah. Keberhasilan awal dinilai melalui skenario fungsi di `TESTING.md`; efektivitas pedagogik memerlukan validasi pengajar dan uji pengguna tersendiri.
