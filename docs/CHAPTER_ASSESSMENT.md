# Asesmen akhir bab — Asam & Basa

Asesmen dikembangkan pada `feat/chapter-assessment` dari `feat/material-updates` commit `834ee59`, kemudian digabungkan ke `main` bersama fitur akun dan interaktif pada 10 November 2026 WIB. Seluruh 24 bagian bacaan tetap tersedia; hasil dan draf asesmen mengikuti penyimpanan per UID/tamu.

## Alur siswa

Beranda/menu atau akhir bacaan ketiga → pengantar asesmen → mulai → jawab 15 soal → tinjau semua jawaban → lengkapi/perbaiki jika diperlukan → konfirmasi pengumpulan → hasil per cakupan dan pembahasan → tinjau bacaan → percobaan baru.

Asesmen dapat dimulai meskipun penanda selesai bacaan belum lengkap; penanda tersebut hanya petunjuk aktivitas. Waktu 35 menit merupakan saran, tanpa timer atau pemaksaan pengumpulan. Kalkulator dapat dipakai. Draf tersimpan setiap pilihan, ketikan angka, dan perubahan posisi soal.

## Kisi-kisi dan tindak lanjut

| Cakupan                 | Butir | Tujuan yang diperiksa                                                                                   |
| ----------------------- | ----- | ------------------------------------------------------------------------------------------------------- |
| Teori & kesetimbangan   | a1–a5 | Donor proton, pasangan konjugasi, asam Lewis, kekuatan vs konsentrasi, proton yang dapat terionisasi    |
| Menalar & menghitung pH | b1–b5 | Rasio logaritmik, asam kuat, basa kuat, kesetimbangan lemah, kontribusi air                             |
| Menerapkan konsep       | c1–c5 | Pereaksi berlebih, hidrolisis, buffer setelah gangguan, ekuivalen asam lemah, indikator dan titik akhir |

Butir ditulis untuk aplikasi ini dan dipetakan ke tiga bacaan yang sudah mempunyai rujukan penerbit. Pembahasan dan tautan kembali ke bacaan ditampilkan setelah pengumpulan. Rujukan teori mengikuti [peta sumber materi](MATERIAL_SOURCES.md), terutama bagian 14.1–14.7 dan 15.2 dari OpenStax Chemistry 2e. Tidak ada penyalinan soal buku atau klaim instrumen sudah tervalidasi secara psikometrik.

## Penilaian

- 9 pilihan ganda dan 6 jawaban angka; setiap soal bernilai satu poin, tanpa pengurangan untuk jawaban salah.
- Skor = jumlah jawaban tepat / 15 × 100, dibulatkan ke bilangan bulat.
- Jawaban angka menyatakan pH, menerima koma atau titik desimal. Toleransi absolut setiap soal ±0,03; dua angka desimal cukup.
- Masukan kosong, campuran teks/satuan, NaN, Infinity, atau format ambigu tidak dianggap lengkap. Angka `0` adalah jawaban sah untuk diperiksa, bukan masukan kosong.
- Jawaban harus lengkap sebelum konfirmasi. Skor/pembahasan tidak ditampilkan selama pengerjaan atau tinjauan sebelum pengumpulan.
- Hasil menampilkan jumlah tepat dari lima butir per cakupan dan arah tindak lanjut, tanpa label lulus/gagal atau KKM yang belum ditetapkan pengajar.

Semua soal numerik menyebutkan kondisi/asumsi model. Acuan hasil: b2 ≈ 2,40; b3 ≈ 10,30; b4 ≈ 3,00; b5 ≈ 6,96; c1 ≈ 1,70; c3 ≈ 4,58. Nilai diperiksa lagi melalui persamaan kimia yang independen pada uji logika.

## Penyimpanan dan versi

Key progres tamu tetap `chemlab:guest:v1`, dengan field opsional `assessment: { draft, attempts }`. Data lama yang belum mempunyai field tersebut dipulihkan sebagai asesmen kosong tanpa menghapus materi/diagnostik. ID dan versi soal diagnostik tetap sama.

Draf asesmen memiliki UUID stabil, versi `asam-basa-akhir-bab-v1`, waktu mulai, posisi, dan jawaban mentah. Jawaban angka yang belum selesai diketik tetap dapat dipulihkan, tetapi tidak dapat dikumpulkan sampai valid. Pengumpulan dengan ID yang sama bersifat idempoten; percobaan ulang mendapat UUID baru.

Hasil menyimpan jawaban, waktu, versi, serta salinan instrumen dan domain yang dipakai. Saat dipulihkan, skor dihitung kembali dari salinan instrumen tersebut, sehingga hasil lama tidak dinilai dengan bank soal aktif yang berbeda. Format instrumen divalidasi; hasil yang masih valid dipertahankan bila catatan lain rusak. Draf dengan versi yang tidak dapat dilanjutkan diberi pemberitahuan; kebijakan migrasi draf perlu ditentukan sebelum mengganti versi aktif. Tidak ada penghapusan diam-diam seluruh progres hanya karena field asesmen rusak.

Hasil dapat dilihat kembali melalui `#asesmen/<ID>`, halaman Progres, atau ekspor JSON per hasil/seluruh progres. Reset berkonfirmasi menghapus asesmen bersama progres browser. Simpan ekspor sebelum berpindah ke versi aplikasi/branch yang lebih lama; versi lama belum mengenali field asesmen baru.

## Batas penggunaan

Bank soal, kunci, dan penilaian berada pada client. Fitur ini adalah asesmen belajar, bukan sistem ujian dengan integritas penilaian server. Hasil akhir bab dan diagnostik awal disimpan terpisah; selisih skor keduanya tidak otomatis menjadi bukti efektivitas pembelajaran. Panel guru baseline masih memakai data latihan diagnostik fiktif. Pengiriman hasil asesmen nyata, login, dan dashboard guru per akun belum ditambahkan pada branch ini.

Validasi isi, tingkat kesulitan, bobot, dan kesesuaian instrumen tetap menjadi keputusan pengajar sebelum digunakan untuk penilaian formal.

## Verifikasi dan pratinjau

- 15 uji logika lulus: 6 baseline dan 9 khusus asesmen.
- 13 skenario browser lulus: 8 baseline, 1 bacaan mendalam, dan 4 asesmen.
- Mencakup draf/reload, koma/titik dan angka nol, jawaban tidak lengkap, konfirmasi, hasil terkunci, percobaan terpisah, ekspor, pemulihan data lama/rusak, reset, aksesibilitas, dan lebar 320–1440 piksel.
- [Pratinjau desktop](preview-assessment.png) · [Pratinjau ponsel](preview-assessment-mobile.png).
