# PRD — ChemLab demo lokal

## Masalah dan pengguna

Siswa kelas XI sering membaca pH secara linear dan menyamakan kuat/lemah dengan pekat/encer. Demo menghubungkan representasi partikel, persamaan, skala pH, dan jawaban diagnostik. Mahasiswa Pendidikan Kimia memakainya sebagai contoh produk kuliah; guru melihat contoh pemanfaatan bukti per butir.

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
