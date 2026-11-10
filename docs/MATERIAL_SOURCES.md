# Cakupan bacaan dan verifikasi sumber

Branch ini dikembangkan langsung dari `main` pada commit `30505f7`, tanpa menggabungkan branch fitur lain.

Tiga ID bacaan dipertahankan agar penanda selesai tetap sesuai. Masing-masing kini mempunyai delapan bagian, prasyarat, rangkuman, referensi per bagian, tabel perbandingan, latihan refleksi, dan contoh hitung yang disusun untuk aplikasi ini. Bank lima soal diagnostik serta versinya tetap sama.

## Peta isi

| Bacaan                | Isi utama                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Kenali asam & basa    | Arrhenius, Brønsted–Lowry, pasangan konjugasi/amfiprotik, Lewis, kekuatan vs konsentrasi, Kₐ/Kᵦ, poliprotik                  |
| Membaca skala pH      | Autoprotolisis, aktivitas/pH/pOH, suhu, molaritas, pengenceran, asam/basa kuat, pendekatan lemah dan kuadrat, kontribusi air |
| Kimia di sekitar kita | Netralisasi dan pereaksi berlebih, hidrolisis garam, buffer, indikator, titrasi, interpretasi bukti                          |

Rujukan utamanya ialah [OpenStax Chemistry 2e](https://openstax.org/details/books/chemistry-2e), terutama bagian 3.3, 4.2, 13.3, 14.1–14.7, dan 15.2. URL spesifik tersedia pada setiap bagian bacaan serta `src/data/readingContent.js`. Sumber ditinjau melalui situs penerbit, bukan salinan tidak resmi. Naskah merupakan uraian asli berbahasa Indonesia; contoh hitung, pertanyaan, dan tabel belajar disusun untuk aplikasi, bukan salinan bab atau gambar buku. Lisensi penerbit tetap berlaku pada sumber aslinya.

## Pemeriksaan hitung

- HCl 2,0 × 10⁻³ mol/L → pH ≈ 2,70.
- NaOH 2,5 × 10⁻³ mol/L → pH ≈ 11,40 pada 25 °C.
- HA 0,10 mol/L, Kₐ 1,8 × 10⁻⁵: pendekatan akar pH ≈ 2,87; kuadrat ≈ 2,88; fraksi ionisasi sekitar 1,3%.
- HCl 10⁻⁸ mol/L dengan kontribusi air → pH ≈ 6,98.
- Campuran 25 mL HCl 0,100 mol/L dan 20 mL NaOH 0,100 mol/L → pH ≈ 1,95, dengan volume aditif.
- CH₃COONa 0,10 mol/L, Kₐ 1,8 × 10⁻⁵ → pH ≈ 8,87.
- Buffer 0,010 mol HA dan 0,010 mol A⁻, pKₐ 4,74, ditambah 0,0010 mol OH⁻ → pH ≈ 4,83.

Seluruh angka memakai asumsi ideal dan kondisi yang dituliskan pada soal. Suhu, satuan, rentang model, serta keterbatasan pendekatan dicantumkan. Validasi pengajar atas kesesuaian tingkat kelas dan pedagogik tetap diperlukan.
