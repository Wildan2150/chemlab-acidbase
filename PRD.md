# PRD — ChemLab

Contoh isian kebutuhan produk berdasarkan Lampiran A handout. Dokumen ini mengarahkan aplikasi ChemLab yang ada pada repo: satu materi asam–basa/pH, dengan tiga bagian bacaan dan fitur pendamping. Rujukan teknis fitur berada di `docs/`; hubungan dokumen dengan hasil web dapat diikuti pada [panduan membaca contoh](docs/PANDUAN_REPLIKASI.md).

## Pengguna dan masalah belajar

- Sasaran pengguna/jenjang: siswa kelas XI yang mempelajari asam–basa dan pH. Guru menggunakan jawaban siswa untuk menentukan pendampingan.
- Pengetahuan awal yang dibutuhkan: ion, persamaan reaksi sederhana, molaritas, pangkat sepuluh, dan penggunaan logaritma dasar.
- Masalah belajar yang ingin ditangani: membaca skala pH secara linear, menyamakan kuat/lemah dengan pekat/encer, dan menganggap semua pencampuran asam–basa menghasilkan pH 7.
- Bukti awal/alasan memilih masalah: ketiga hubungan konsep tersebut memerlukan penjelasan dan representasi yang dapat dibandingkan. Laboratorium pH, contoh hitung, dan pilihan diagnostik dirancang untuk memperlihatkan cara siswa menalar. Alasan ini adalah dasar desain pengajar; penelitian kebutuhan siswa dan validasi pedagogik belum dicatat sebagai selesai.
- Peran mahasiswa dalam contoh ini: mempelajari bagaimana kebutuhan di PRD diterjemahkan menjadi alur, komponen, data, dan pengujian. Sasaran pengguna aplikasi tetap siswa/guru.

## Tujuan pembelajaran

Setelah menggunakan Modul 1 Asam–Basa dan pH, pengguna dapat mengenali peran H₃O⁺/OH⁻, membandingkan konsentrasi dari dua nilai pH, menghitung pH HCl dalam batas model, membedakan kekuatan dari konsentrasi, serta menafsirkan netralisasi dengan asumsi yang jelas.

Tiga bagian materi pada web adalah **Kenali asam & basa**, **Membaca skala pH**, dan **Kimia di sekitar kita**. Ketiganya mengembangkan satu materi, bukan tiga topik proyek yang terpisah.

## Cakupan produk

- Modul 1/topik inti: asam–basa dan pH, dengan tiga bacaan yang masing-masing mempunyai delapan bagian.
- Materi dan representasi yang dibutuhkan: uraian teori, rumus, tabel, contoh hitung, refleksi, diagram larutan, skala pH, dan model struktur molekul dengan sumber.
- Kuis diagnostik: lima soal q1–q5 dengan kunci, pembahasan, tag konsep, dan tindak lanjut; versi `asam-basa-v1`. Jawaban awal dikumpulkan sebelum pembahasan; latihan ulang menjadi percobaan terpisah.
- Satu materi, satu kelas, dan satu akun guru: ChemLab dipakai sebagai satu ruang belajar dengan satu guru yang ditetapkan. Pada implementasi contoh, ruang tersebut mencakup seluruh akun siswa aplikasi; daftar anggota kelas terpisah belum disediakan.
- Materi/soal di `src/data`, jawaban per butir dan progres lokal/reset: draf disimpan setiap pilihan; riwayat mempunyai ID percobaan tetap; reset harus dikonfirmasi dan hanya berlaku pada identitas aktif.
- Login Google opsional bagi pengguna: siswa tetap dapat belajar sebagai tamu. Akun juga mendukung email/password. Kemampuan menyimpan progres akun dan panel guru tersedia pada produk.
- Penyimpanan hasil sendiri, riwayat, antrean kirim, dan panel guru: Firebase Auth menetapkan UID; Firestore menyimpan progres per UID. Status tersimpan menunggu konfirmasi server; guru membaca hasil tersinkron tanpa mengubah hasil siswa lain.
- Fitur MVP di luar fondasi: laboratorium pH, asesmen akhir bab 15 soal, PhET, katalog 36 model molekul lokal, pencarian properti PubChem, catatan pengamatan, pencarian materi, serta tur/bantuan.
- Keputusan penyimpanan khas ChemLab: progres akun mencakup draf, riwayat, materi, dan catatan sekaligus. Progres tamu tetap terpisah dari akun; reset akun turut mereset progres cloud. Rinciannya ditetapkan pada [DATABASE.md](DATABASE.md).

## Rancangan penilaian

| Tujuan/konsep | Aktivitas/butir dan versi | Bukti jawaban | Cara menafsirkan | Tindak lanjut guru |
| --- | --- | --- | --- | --- |
| Mengenali ion penentu sifat asam | Bacaan Kenali asam & basa; q1, `asam-basa-v1` | Pilihan ion ketika HCl dilarutkan dalam air | Pilihan OH⁻ menunjukkan perlunya memeriksa hubungan asam dan spesies; minta alasan sebelum menyimpulkan | Tulis persamaan HCl + H₂O dan identifikasi H₃O⁺ |
| Membandingkan konsentrasi pada skala logaritmik | Bacaan Membaca skala pH; laboratorium pH 3 vs 5; q2, `asam-basa-v1` | Pilihan rasio 2, 1/100, 100, atau sama | Rasio 2 mengarah pada penalaran linear; 1/100 mengarah pada arah perbandingan yang terbalik | Bandingkan 10⁻³ dan 10⁻⁵ pada laboratorium, lalu jelaskan rasio 100 |
| Menghitung pH asam kuat dalam batas model | Model HCl 0,1; 0,01; 0,001 mol/L; q3, `asam-basa-v1` | Pilihan pH untuk HCl 0,001 mol/L | Cocokkan pemakaian −log₁₀(c), konsentrasi, suhu, dan asumsi | Kerjakan tiga konsentrasi acuan; jelaskan alasan perubahan satu satuan pH |
| Membedakan kekuatan dan konsentrasi | Bacaan Kenali asam & basa; q4, `asam-basa-v1` | Pilihan hubungan ionisasi dan banyaknya zat per volume | Jawaban “asam kuat selalu pekat” menunjukkan dua konsep perlu dipisahkan | Buat contoh asam kuat encer dan bandingkan dengan asam lemah |
| Menafsirkan netralisasi | Bacaan Kimia di sekitar kita; q5, `asam-basa-v1` | Pilihan sifat hasil HCl–NaOH dengan mol sama pada 25 °C | Periksa apakah siswa mempertimbangkan mol, reaksi ionik, garam, dan suhu | Tulis reaksi ionik neto; ulangi dengan pereaksi berlebih |
| Menggabungkan teori, hitungan, dan penerapan | Asesmen a1–a5, b1–b5, c1–c5; `asam-basa-akhir-bab-v1` | Sembilan pilihan ganda dan enam jawaban angka beserta snapshot instrumen | Gunakan hasil per cakupan dan rincian soal; tidak langsung menyamakan skor dengan diagnostik | Kembali ke bacaan/konsep yang terkait pembahasan |
| Menjelaskan hasil pengamatan | PhET, molekul, dan PubChem | Prediksi, pengamatan, penjelasan, dan pilihan CID pada catatan | Periksa alasan yang ditulis siswa; klik iframe tidak dianggap jawaban | Diskusikan bukti, sumber, serta batas model/interpretasi sifat larutan |

## Kriteria penerimaan

- Pengguna membuka materi dari beranda/menu dan dapat kembali; tautan langsung bacaan tetap berfungsi setelah refresh.
- Materi, notasi, satuan, kunci, dan pembahasan dapat ditelusuri ke sumber; hasil hitung acuan diperiksa terpisah dari komponen.
- Kuis menahan pengumpulan tidak lengkap, memberi skor jumlah benar × 20, dan membuka pembahasan setelah lima jawaban dikumpulkan.
- Refresh mempertahankan pilihan, ID, dan versi draf; latihan ulang tidak mengubah diagnostik pertama.
- Laboratorium menampilkan angka serta klasifikasi teks, [H₃O⁺]/[OH⁻], dan pOH dengan kondisi 25 °C. pH 3 dan 5 menghasilkan rasio [H₃O⁺] 100.
- Progres akun dibaca dari server sebelum ditulis; antrean tetap milik UID; kegagalan jaringan/izin tidak diberi status tersimpan.
- Guru terverifikasi dapat membaca rekap dan rincian akun tersinkron. Tamu/akun siswa tidak dapat membaca data UID lain.
- Ekspor menghasilkan berkas yang sesuai identitas/filter; reset memerlukan konfirmasi dan mempertahankan data identitas lain.
- Kontrol inti, dialog, rumus/tabel, dan umpan balik dapat dipakai pada ponsel serta keyboard; informasi tidak hanya dibedakan dengan warna.
- Tur/bantuan dapat dilewati, ditutup, dan diulang tanpa reset belajar; sumber eksternal memiliki alternatif ketika gagal.

Bukti pemenuhan dan batas cakupannya dicatat pada [TESTING.md](TESTING.md). Kriteria adalah sasaran pemeriksaan; pencantumannya bukan pernyataan bahwa semua pemeriksaan manusia/produksi sudah selesai.

## Pilihan dan pekerjaan lanjutan

- Fitur yang dikerjakan bila dipilih: impor ekspor tervalidasi dan PWA. Keduanya belum tersedia; kebutuhan belajar/pemulihan data ditinjau sebelum implementasi.
- Alasan pilihan fitur yang sudah ada: lab memvisualkan hubungan logaritmik; asesmen mengumpulkan bukti setelah belajar; PhET/3D/PubChem mendampingi penjelasan; tur membantu menemukan fitur.
- Pekerjaan lanjutan: validasi kimia/pedagogik, uji mandiri dengan mahasiswa pemula, uji aksesibilitas manual, evaluasi ukuran bundle, serta pencatatan/uji rilis hosting.
- Kemungkinan pengembangan data: daftar anggota kelas, pemilihan hasil tamu, riwayat per percobaan pada server, dan arsip diagnostik. Ini tidak mengubah kontrak ChemLab saat ini dan tidak dikerjakan otomatis dalam penyelarasan dokumen.

## Arah desain dan referensi

- Kebutuhan tata letak materi, rumus, contoh, dan kuis: navigasi tetap mudah ditemukan, bacaan bertahap dengan daftar isi, tabel yang dapat dibaca pada layar sempit, opsi kuis jelas, dan pembahasan terhubung ke materi.
- Hierarki, tipografi, warna, serta alasan pilihan: tema hijau dan kartu berwarna lembut membedakan bagian; Plus Jakarta Sans memberi tipografi yang konsisten; angka/label mendampingi indikator warna. SVG gelas memudahkan penyandingan perubahan pH dengan representasi.
- Skill desain yang dipilih, sumber, dan versi bila diketahui: riwayat pembuatan UI tidak menetapkan satu skill desain tertentu sebagai acuan yang dapat diklaim. Skill `natural-writing` dipakai untuk penyuntingan dokumen, bukan sebagai sumber desain UI.
- Referensi media sosial yang telah ditelusuri ke repo/dokumentasi asli: tidak ada referensi media sosial yang dicatat sebagai sumber desain. Rujukan implementasi/sumber aset dicatat pada dokumen teknis.
- Pemeriksaan desain sebelum/sesudah serta aksesibilitas: riwayat pengujian mencatat koreksi viewer 3D, onboarding, dan header desktop/ponsel; screenshot serta batas uji tersedia pada TESTING.
- Detail tur dan bantuan: tujuh langkah termasuk sambutan; petunjuk pertama per tab Eksplorasi menunggu tur tutup; saran kendala dibatasi tiga per sesi dengan jeda minimal 60 detik. Kontrak lengkap di [ONBOARDING.md](docs/ONBOARDING.md).

## Batas produk

- Profil menggunakan UID, nama tampilan, serta email dari Firebase Auth. Email dipakai pada profil/pencarian guru; hasil siswa tidak ditampilkan ke publik.
- Siswa hanya membaca/menulis progres sendiri; satu guru terverifikasi membaca seluruh akun siswa aplikasi. Belum ada daftar keanggotaan atau banyak kelas/guru.
- Data tamu tidak dipilih/diimpor ke akun. Pada akun, seluruh progres termasuk draf disinkronkan; reset akun juga mengosongkan progres cloud.
- Rules menjaga kepemilikan/metadata payload; perubahan jawaban lama oleh pemilik belum dicegah sebagai aturan keutuhan per hasil di server.
- Asesmen menyimpan snapshot instrumen. Diagnostik masih memakai bank aktif; perubahan versi memerlukan arsip/migrasi sebelum diterbitkan.
- Skor/kunci berada di client, persentase progres adalah aktivitas, dan pembukaan pertama offline belum didukung.
- Pengamanan ujian, penilaian terverifikasi server, dan klaim keefektifan pedagogik memerlukan pengembangan/penelitian tersendiri.

## Sumber isi

- Judul, penulis/lembaga, bagian/halaman, tautan: OpenStax, *Chemistry 2e*, bagian 3.3, 4.2, 13.3, 14.1–14.7, dan 15.2. Pemetaan bacaan dan tautan per bagian terdapat pada [MATERIAL_SOURCES.md](docs/MATERIAL_SOURCES.md) serta `src/data/readingContent.js`.
- Instrumen: lima soal diagnostik dan 15 soal akhir bab disusun untuk ChemLab; bukan klaim instrumen terstandar/tervalidasi psikometrik.
- Hak penggunaan gambar/simulasi/data: atribusi PhET dipertahankan; lisensi 3Dmol tersedia di `public/licenses/3dmol-LICENSE.txt`; SDF 3D PubChem memiliki manifest sumber/checksum di `public/molecules/sources.json`. Font/ikon dipaketkan melalui dependency dan diagram laboratorium berupa SVG lokal.
- Peta sumber/ketentuan aktivitas: [INTERACTIVE_ACTIVITIES.md](docs/INTERACTIVE_ACTIVITIES.md) dan [MOLECULE_CATALOGUE.md](docs/MOLECULE_CATALOGUE.md).

## Riwayat keputusan scope

- 7 November 2026: pengajar menetapkan aplikasi siswa asam–basa/pH dengan versi awal lokal. Tujuan awal diwujudkan melalui materi, lab, diagnostik, dan progres.
- 10 November: materi mendalam, asesmen, eksplorasi, Firebase Auth/Firestore, serta panel data tersinkron diintegrasikan. Panel fiktif versi awal tidak menjadi sumber panel aktif.
- 11–17 November: tur, bantuan kontekstual, serta header desktop/ponsel disempurnakan; rincian keputusan/uji berada pada AI_LOG dan TESTING.
- 20 November: pengajar menegaskan bahwa dokumen pengarah harus menjadi contoh isian handout yang dapat dipadankan langsung dengan hasil web. Struktur Lampiran A diterapkan; keunikan dan kontrak fitur ChemLab dipertahankan.
