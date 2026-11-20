# Backlog Produk — ChemLab

Isian backlog mengikuti Lampiran A: kebutuhan pada [PRD](PRD.md) diubah menjadi pekerjaan, alasan belajar, kriteria penerimaan, pelaksana, dan bukti. Status merujuk fitur pada source; validasi manusia dan rilis mempunyai status tersendiri.

## MVP

| ID/issue | Pekerjaan | Alasan belajar | Kriteria penerimaan | Pelaksana/reviewer | Status/PR |
| --- | --- | --- | --- | --- | --- |
| MVP-01 | Modul 1 asam–basa/pH, lima soal diagnostik, progres/reset | Menghubungkan bacaan, representasi dan bukti awal q1–q5 | Materi/soal di data; skor benar; draf/ID pulih; pembahasan sesudah pengumpulan; ulang terpisah; reset dikonfirmasi | Codex; validasi isi pengajar belum dicatat selesai | TERIMPLEMENTASI; uji logika/preview 20 November dan riwayat uji belajar pada TESTING |
| MVP-02 | Login, penyimpanan progres akun, dan panel satu guru | Siswa melanjutkan belajar dan guru membaca bukti per siswa | Tamu/UID terpisah; antrean milik akun; konfirmasi server; hasil sendiri pulih; hanya guru terverifikasi membaca akun lain | Codex; pemeriksaan emulator tercatat, review isi oleh pengajar terpisah | TERIMPLEMENTASI; 14 skenario akun/cloud/guru 20 November lulus |
| MVP-03 | Lab pH, eksplorasi/asesmen, dan bantuan penggunaan | Memperjelas konsep melalui tindakan, penjelasan siswa dan bukti setelah belajar | pH 3 vs 5 memberi rasio 100; sumber/alternatif jelas; catatan tersimpan; asesmen terpisah; tur dapat dilewati/diulang | Codex; validasi pedagogik pengajar belum selesai | TERIMPLEMENTASI; kontrak serta bukti per fitur ditautkan di bawah |

ChemLab memilih sinkronisasi seluruh progres per UID, satu guru untuk seluruh akun siswa aplikasi, dan pemisahan tetap tamu/akun. Kriteria MVP-02 mengikuti keputusan tersebut pada [DATABASE.md](DATABASE.md). Ini contoh pengisian keputusan proyek yang spesifik; nama fitur, cakupan, serta bukti harus tetap cocok dengan implementasinya. Tautan PR/review mahasiswa tidak dibuat karena proyek ini contoh pengajar.

## Rincian fitur interaktif yang dipilih

### Laboratorium pH — ide kelompok

- ID/nama dari katalog atau ide kelompok: laboratorium pH lokal ChemLab.
- Tujuan belajar dan kesulitan siswa: membandingkan pH secara logaritmik, bukan sebagai selisih linear.
- Siswa mengubah / mengamati / menjelaskan: mengubah pH, melihat [H₃O⁺]/[OH⁻]/pOH dan klasifikasi, lalu menjelaskan dua kondisi.
- Versi minimum dan yang ditunda: slider serta angka/teks, model HCl tiga konsentrasi tersedia; model asam lemah interaktif bukan bagian lab ini.
- Jalur lokal / embed / API: perhitungan lokal dan SVG.
- Sumber, satuan, dan batas model kimia: pendekatan ideal 25 °C; rentang eksplorasi 0–14; HCl terdisosiasi sempurna, kontribusi air diabaikan pada 0,1; 0,01; 0,001 mol/L.
- Input/tindakan uji dan hasil acuan yang diperiksa manual: pH 3/5 → 10⁻³/10⁻⁵ = 100; HCl 0,001 mol/L → pH 3. Acuan ini juga diuji pada unit hitungan.
- Alternatif saat sumber luar gagal/tidak dapat digunakan: lab tidak mengambil perhitungan dari layanan luar; rumus dan contoh pada bacaan tetap tersedia.
- Pelaksana / reviewer / issue: Codex; acuan MVP-03, validasi isi pengajar belum dicatat selesai. Titik kode: `src/lib/chemistry.js`, `src/pages/Laboratory.jsx`.

### PhET — F08 / I-03

- ID/nama: PhET Acid-Base Solutions.
- Tujuan belajar: membandingkan asam kuat/lemah dan menjelaskan ionisasi.
- Siswa mengubah / mengamati / menjelaskan: memprediksi, mengubah kondisi simulasi, mengamati dua kondisi, menulis penjelasan di aplikasi.
- Versi minimum dan yang ditunda: satu sematan dengan catatan pendamping tersedia; pembacaan klik/interaksi di dalam iframe tidak dibuat.
- Jalur lokal / embed / API: iframe dari sumber resmi; catatan disimpan pada progres ChemLab.
- Sumber, satuan, batas: atribusi PhET dan batas representasi pada [panduan aktivitas](docs/INTERACTIVE_ACTIVITIES.md).
- Input/tindakan uji dan acuan: dua kondisi kuat/lemah dibandingkan dengan isi teori; uji pemuatan/kegagalan dan penyimpanan catatan pada riwayat pengujian aktivitas.
- Alternatif gagal: tab baru atau bacaan pendamping; catatan tetap dapat ditulis.
- Pelaksana/reviewer/issue: Codex, MVP-03; pemeriksaan pedagogik pengajar belum selesai.

### Model molekul 3D — F07 / I-05

- ID/nama: katalog 36 model lokal dengan 3Dmol.
- Tujuan belajar: mengamati struktur/gugus yang relevan dengan donor/akseptor proton tanpa menyimpulkan pH hanya dari struktur.
- Siswa mengubah / mengamati / menjelaskan: memilih/cari/filter molekul, memutar kamera, menulis pengamatan dan alasan.
- Versi minimum dan yang ditunda: satu model valid cukup untuk langkah awal mahasiswa; ChemLab sudah memilih 36 model. Molekul tanpa rekaman 3D tidak dimasukkan.
- Jalur lokal / embed / API: pustaka dan SDF 3D lokal; viewer aplikasi dimuat dinamis.
- Sumber, satuan, batas: identitas PubChem, komposisi, atom/ikatan, koordinat, dan checksum pada `public/molecules/sources.json`. Kamera tidak mengubah sudut ikatan.
- Input/tindakan uji dan acuan: air CID 962 serta seluruh katalog diperiksa identitas/komposisinya; uji browser riwayat memeriksa struktur benar-benar tergambar, bukan hanya HTTP 200.
- Alternatif gagal: pesan WebGL/berkas, muat ulang, bacaan dan catatan tetap tersedia.
- Pelaksana/reviewer/issue: Codex, MVP-03; [katalog](docs/MOLECULE_CATALOGUE.md) dan TESTING.

### Pencarian properti PubChem — F10 / I-07

- ID/nama: pencarian senyawa melalui PubChem PUG REST.
- Tujuan belajar: menelusuri identitas dan properti dari sumber, serta membatasi interpretasi terhadap larutan.
- Siswa mengubah / mengamati / menjelaskan: mengirim nama senyawa, membaca CID/rumus/massa molar, menulis hasil pengamatan.
- Versi minimum dan yang ditunda: satu pencarian dengan status/kegagalan dan tautan sumber; bukan katalog seluruh sifat atau kalkulator pH.
- Jalur lokal / embed / API: permintaan API hanya saat pencarian dikirim.
- Sumber, satuan, batas: PubChem, massa molar g/mol; identitas senyawa tidak langsung menetapkan pH tanpa konsentrasi/kondisi.
- Input/tindakan uji dan acuan: identitas/rumus/CID respons dibandingkan dengan sumber; riwayat uji mencakup 404, sibuk, rusak, timeout, dan hasil usang.
- Alternatif gagal: status/petunjuk yang dapat ditindaklanjuti dan bacaan lokal; tidak memakai hasil lama sebagai jawaban pencarian baru.
- Pelaksana/reviewer/issue: Codex, MVP-03; kontrak permintaan pada [panduan aktivitas](docs/INTERACTIVE_ACTIVITIES.md).

Asesmen akhir bab mengembangkan bukti setelah belajar: 15 soal, versi/snapshot sendiri, draf, tinjauan, konfirmasi, dan hasil per cakupan ([kontrak asesmen](docs/CHAPTER_ASSESSMENT.md)). Tur/bantuan mengembangkan akses penggunaan: tujuh langkah, petunjuk pertama tab, saran kendala berulang dengan jeda/kuota, serta pilihan manual/nonaktif ([kontrak onboarding](docs/ONBOARDING.md)).

## Jika waktu cukup

- Impor ekspor tervalidasi: membantu pemulihan dari salinan pengguna; belum tersedia dan memerlukan validasi versi, pemilik, serta konflik.
- PWA: membantu membuka ulang tanpa jaringan; belum tersedia. Belajar lokal setelah halaman termuat berbeda dari pembukaan pertama offline.
- Pengembangan tambahan dipilih setelah fondasi dan kebutuhan belajar diperiksa, bukan karena seluruh fitur katalog wajib dibuat.

## Pekerjaan lanjutan

- REL-01: catat/uji rilis hosting GitHub → Vercel/Netlify dengan URL, commit/deployment, domain Auth, dan alur siswa–guru. Belum ada identitas rilis hosting terverifikasi di repo ini.
- QA-01: validasi isi/instrumen, tingkat kesulitan, interpretasi, dan tindak lanjut oleh pengajar; belum dicatat selesai.
- QA-02: uji mandiri dengan mahasiswa pemula; dokumentasikan langkah dan istilah yang membingungkan.
- QA-03: pembaca layar manual, ponsel fisik, dan browser lain; cakupan tersebut belum dinyatakan selesai.
- PERF-01: evaluasi entry JS utama 301,45 KB gzip pada build 20 November terhadap target awal 200 KB; optimasi belum dikerjakan pada tugas dokumentasi.
- DATA-01: sebelum mengganti versi diagnostik aktif, rancang arsip/migrasi agar hasil lama tetap terbaca.
- Pilihan perluasan data bila dibutuhkan: keanggotaan kelas dari dashboard, pemilihan hasil tamu, serta penyimpanan per hasil pada server. Perluasan tersebut memerlukan keputusan kontrak baru; perilaku ChemLab saat ini tetap mengikuti DATABASE.
- Banyak kelas/guru dan penilaian terverifikasi server berada di luar cakupan contoh ini.

## Temuan uji

- Sebanyak 43 uji logika dan 14 skenario akun/Google emulator/Firestore/guru lulus pada salinan bersih 20 November; rincian lingkungan dan cakupan pada [TESTING.md](TESTING.md).
- Preview lokal: rute hash/refresh, draf/ID, skor 100 untuk jawaban acuan, pembahasan, batal reset, dan sampel layar 375 px berhasil.
- Build lulus dengan peringatan ukuran chunk dan `eval` upstream 3Dmol; PERF-01 tetap terbuka.
- Validasi isi, keberhasilan pengguna pemula, dan rilis publik tidak disimpulkan dari kelulusan uji otomatis.

## Riwayat keputusan

- 7 November 2026: fondasi lokal asam–basa/pH dan panel latihan dibuat.
- 10 November: Firebase dipilih; materi, asesmen, eksplorasi, akun/cloud, dan panel data tersinkron digabungkan. Panel aktif tidak memakai hasil fiktif.
- 11–17 November: onboarding, petunjuk eksplorasi, serta header desktop/ponsel diperbaiki.
- 20 November: pengajar meminta dokumen menjadi contoh konkret pengisian templat handout. Struktur backlog mengikuti Lampiran A; fitur dan kontrak ChemLab dipertahankan.
