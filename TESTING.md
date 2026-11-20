# Pengujian Produk — ChemLab

Contoh isian TESTING dari Lampiran A. Nomor TC dipertahankan; langkah/harapan diisi untuk kontrak ChemLab pada PRD dan DATABASE. Cakupan pengujian selalu disebut agar kelulusan satu skenario tidak dianggap kelulusan seluruh aplikasi.

## Identitas pemeriksaan

- Tanggal/penguji dan kelompok penguji: 20 November 2026, Codex; pemeriksaan teknis contoh pengajar, bukan uji kelompok mahasiswa.
- Branch/commit source: `main`, `c26d58c3cdf823df353150313605dccc9c97876c`.
- Apakah masih ada perubahan source belum di-commit: perubahan working tree pada dokumen; source aplikasi, dependency/lockfile dan Rules tidak diubah oleh penataan dokumen.
- Lingkungan: development emulator dan build/preview lokal pada salinan bersih tanpa `.env.local`; bukan URL hosting produksi.
- URL, perangkat, browser, ukuran layar: emulator `http://127.0.0.1:5174`, suite akun `5175`, preview `4173`; Windows, Node 24.20.0, Java 21.0.13, Microsoft Edge headless. Walkthrough preview memakai sampel 375 × 812; suite akun/guru mencakup viewport ponsel.
- Provider dan identitas aturan/policy yang diuji: Auth/Firestore Emulator `demo-chemlab` dengan source `firestore.rules`; metadata akses produksi hanya merujuk bukti historis 10 November.
- Sumber bukti: 43 uji logika, 14 skenario akun/cloud/guru, build dan walkthrough preview pada 20 November; rincian perintah/hasil pada riwayat pemeriksaan di bawah. Penyusunan ulang dokumen tidak mengulang atau mengubah hasil run tersebut.
- Pemeriksaan dokumen setelah koreksi pengajar: 10 dokumen pengarah cocok dengan urutan bagian Lampiran A; AGENTS memuat aturan 1–15 dan catatan AI memuat 16 field templat. Sebanyak 45 judul bagian juga cocok pada Word mahasiswa Revisi 03. Pemeriksaan 19 dokumen mencakup 237 tautan, 28 tabel, 41 rujukan path source dan tujuh tautan bab terhadap sumber handout; tidak ditemukan kesalahan. Sebanyak 154 berkas tracked non-Markdown tetap sama dengan source acuan. Contoh jawaban menghasilkan 100; rasio [H₃O⁺] pH 3/5 adalah 100 dan kunci q2 adalah indeks 2, sesuai source. Laporan lokal berada pada `.firebase/document-template-qa-20261120.json` (artefak pemeriksaan, tidak ikut repo).

## Arti status

- BELUM DIUJI: skenario/cakupan yang dimaksud belum dijalankan lengkap pada lingkungan yang dicatat.
- PASS: hasil aktual sesuai harapan untuk langkah, cakupan, tanggal dan lingkungan yang disebut.
- FAIL: ada perbedaan terhadap harapan; catat perbaikan dan uji ulang.
- TERBLOKIR: kondisi awal pengujian belum tersedia; jelaskan penyebabnya.
- N/A: hanya untuk fitur pilihan yang tidak diimplementasikan, dengan alasan; bukan pengganti hasil pemeriksaan.

## Matriks

Nomor TC mengikuti Lampiran A. Isian spesifik yang mengikuti kontrak contoh: TC-07 menguji pemilik/tamu karena belum ada daftar anggota; TC-08 menguji izin panel dan larangan menulis hasil akun lain; TC-18 menguji pembatalan serta pemisahan tamu/akun karena belum ada transfer hasil. Perlindungan hasil lama di server, keanggotaan dan pemilihan hasil tamu pada contoh umum handout dijelaskan sebagai batas pada DATABASE, tidak diklaim telah diuji/tersedia.

| ID | Skenario/langkah | Hasil harapan | Hasil aktual/bukti | Status | Issue/penguji/uji ulang |
| --- | --- | --- | --- | --- | --- |
| TC-01 | Buka beranda, bacaan langsung, refresh | Halaman benar dan penanda bacaan pulih | Walkthrough preview berhasil pada rute hash bacaan | PASS | Codex, 20 November; host publik diuji tersendiri |
| TC-02 | Validasi kelengkapan/skor; kumpulkan lima jawaban acuan | Tolak belum lengkap; skor 100 dan pembahasan setelah pengumpulan | Uji logika kelengkapan/skor lulus; walkthrough memberi 100 dan lima pembahasan | PASS | Codex, 20 November; variasi UI lengkap ada pada riwayat suite belajar |
| TC-03 | Refresh draf, batal reset, reset identitas aktif | ID/pilihan pulih; batal mempertahankan; reset sesuai cakupan | Walkthrough dan suite akun/Firestore lulus; reset akun juga cloud | PASS | Codex, 20 November; kontrak reset pada DATABASE |
| TC-04 | Periksa fitur khas yang ditugaskan pada backlog | Kriteria fitur yang diperiksa terpenuhi | Riwayat 17 November mencatat tujuh skenario header/navigasi/tur lulus | PASS | Codex, 17 November; bukan run ulang seluruh MVP-03 |
| TC-05 | Periksa seluruh isi kimia/notasi dengan sumber oleh manusia | Rumus, satuan, kunci dan alasan sesuai sumber | Uji hitungan acuan lulus; validasi manusia seluruh isi belum dicatat selesai | BELUM DIUJI | QA-01, pengajar |
| TC-06 | Akun A simpan lalu pulihkan progres sendiri | Jawaban, riwayat dan catatan cocok | Suite Firestore memulihkan pada konteks browser baru | PASS | Codex, 20 November; skema progres UID |
| TC-07 | A meminta progres B; tamu meminta cloud | Database menolak akses | Suite Rules menolak UID lain, tamu dan list siswa tanpa hak | PASS | Codex, 20 November; tidak menguji keanggotaan yang belum dibuat |
| TC-08 | Guru membaca; siswa mencoba panel/peran buatan; guru menulis hasil siswa | Baca guru berhasil; akses/penulisan di luar izin ditolak | Tiga skenario guru menguji token terverifikasi, manipulasi client, dan larangan menulis akun lain | PASS | Codex, 20 November; keutuhan payload pemilik bukan kontrak Rules per hasil |
| TC-09 | Offline, refresh, pulih, kirim ulang | Antrean milik UID; hasil ber-ID sama tidak terduplikasi oleh merge | Uji logika/Firestore offline, transaksi dan reset lintas perangkat lulus | PASS | Codex, 20 November |
| TC-10 | Sampel 375 px: bacaan, laboratorium, kuis | Tidak ada overflow horizontal pada halaman diperiksa | Walkthrough preview 375 × 812 berhasil | PASS | Codex, 20 November; belum ponsel fisik/seluruh variasi tabel |
| TC-11 | Keyboard manual seluruh navigasi/kuis | Semua kontrol terjangkau dan fokus terlihat | Suite guru memeriksa keyboard; pemeriksaan manual menyeluruh belum dicatat | BELUM DIUJI | QA-03; hasil otomatis terpisah |
| TC-12 | Heading/label/kontras/feedback manual seluruh halaman | Struktur dan feedback terbaca | Axe pada akun/panel/detail lulus; pemeriksaan manual seluruh tampilan belum dicatat | BELUM DIUJI | QA-03 |
| TC-13 | Regresi logika dan akun pada source acuan | Kontrak data/akun/guru tidak gagal | 43 uji logika dan 14 skenario akun/cloud/guru lulus | PASS | Codex, 20 November; suite learning penuh tidak diulang pada revisi dokumen |
| TC-14 | Build dan jalankan preview | Build berhasil, alur sampel berfungsi | Build/preview, draf, pembahasan dan batal reset berhasil | PASS | Codex, 20 November; peringatan bundle dicatat di riwayat |
| TC-15 | Periksa tracked source, env lokal dan batas diff | Tanpa env lokal pada salinan; perubahan dokumen tidak mengubah aplikasi | Salinan 173 berkas dibuat tanpa env lokal; diff non-Markdown kosong | PASS | Codex, 20 November; staging rilis diperiksa lagi oleh pelaksana |
| TC-16 | Buka hash bacaan langsung dan refresh | Rute/penanda bertahan pada preview | Walkthrough preview berhasil | PASS | Codex, 20 November; REL-01 untuk host publik |
| TC-17 | Jalankan PhET/3D/PubChem dan seluruh kegagalannya | Fungsi, alternatif dan catatan benar | Uji katalog/logika serta riwayat browser tersedia; semua layanan/fallback belum diulang pada sesi ini | BELUM DIUJI | MVP-03; lihat riwayat aktivitas/viewer |
| TC-18 | Batalkan login; bandingkan data tamu dan akun | Tamu tetap lokal; UID memuat ruangnya sendiri | Suite Google/akun menguji batal/pop-up diblokir serta ruang tamu/akun terpisah | PASS | Codex, 20 November; tidak mengklaim transfer/pemilihan hasil |
| TC-19 | Logout/ganti akun dengan antrean | Tidak mengirim/menampilkan data sebagai UID lain | Suite akun/Firestore dan uji logika disposal/sesi lulus | PASS | Codex, 20 November |
| TC-20 | Login pada konteks browser baru | Progres akun pulih termasuk draf sesuai keputusan ChemLab | Suite Firestore memulihkan materi, diagnostik, asesmen dan catatan | PASS | Codex, 20 November |
| TC-21 | Percobaan ulang dan perubahan versi diagnostik | Riwayat tepat dan tetap terbaca sesuai versi | Ulang/asesmen snapshot lulus; arsip/migrasi diagnostik lintas versi belum tersedia | BELUM DIUJI | DATA-01 sebelum menerbitkan diagnostik baru |
| TC-22 | Guru menafsirkan jawaban dan memilih tindak lanjut | Rekap cocok dan tindak lanjut beralasan | Rekap/ekspor cocok fixture pada suite guru; penafsiran pedagogik manusia belum divalidasi | BELUM DIUJI | QA-01; jangan menyamakan cek agregat dengan validasi pedagogik |
| TC-23 | JSON rusak atau storage ditolak pada logika penyimpanan | Tidak crash/mengaku berhasil; pemulihan memberi penjelasan | Uji logika data rusak, validasi dan gagal storage lulus | PASS | Codex, 20 November; UI kegagalan lengkap merujuk riwayat suite belajar |

## Rilis/produksi

- URL produksi dan commit sumber deployment: belum ada identitas rilis hosting yang dicatat.
- Hasil akses tanpa login hosting: belum diverifikasi pada URL publik.
- Hasil uji cloud dan aturan akses di produksi: bukti 10 November memeriksa konfigurasi/Rules project pengajar; bukan run penuh alur publik 20 November.
- Hasil kuis/progres/reset di origin publik: belum diuji pada identitas rilis hosting yang dicatat.
- Hasil ponsel nyata dan keyboard: viewport Edge/otomatis tersedia; ponsel fisik dan pemeriksaan manual menyeluruh belum dicatat selesai.
- Hasil smoke test setelah deployment final: belum ada deployment final yang dicatat.
- Keterbatasan yang masih terbuka: REL-01, QA-01–03, PERF-01 dan DATA-01 pada [BACKLOG.md](BACKLOG.md); batas kontrak data pada [DATABASE.md](DATABASE.md).

## Riwayat pemeriksaan dan hasil terperinci

Catatan di bawah dipertahankan sebagai bukti bertanggal. Bagian awal 20 November merekam audit sebelum pengajar memperjelas bentuk contoh yang diinginkan; istilah GAP pada catatan lama bukan instruksi perubahan fitur otomatis. Dokumen aktif di atas dan PRD/DATABASE menjelaskan keputusan ChemLab yang dipertahankan.


## 20 November 2026 WIB — dokumen dan replikasi pada salinan bersih

**Pelaksana:** Codex. **Source aplikasi:** `c26d58c3cdf823df353150313605dccc9c97876c`; perubahan belum di-commit hanya berupa dokumentasi Markdown. Source, dependency/lockfile, Rules, dan konfigurasi aplikasi dipertahankan. Pemeriksaan memakai Windows, Node.js 24.20.0, Microsoft Edge headless, serta Temurin Java 21.0.13. PATH awal terminal menunjuk Java 8; Java 21 portabel yang sudah tersedia dipakai hanya pada sesi uji. Panduan meminta mahasiswa memeriksa versi Java pada terminal yang sama.

Salinan uji dibuat dari 173 berkas source/dokumen (berkas terlacak dan panduan baru), tanpa `.git`, `.env.local`, cache, atau data produksi. Lokasi kerja sementara: `.firebase/docs-replica-20261120/`, diabaikan Git. Ini memeriksa isi salinan repo, bukan mencoba ulang autentikasi/unduhan GitHub pada komputer mahasiswa. Panduan yang diperiksa: [PANDUAN_REPLIKASI.md](docs/PANDUAN_REPLIKASI.md).

| Pemeriksaan yang dijalankan | Hasil aktual |
| --- | --- |
| `npm.cmd ci --ignore-scripts` pada salinan bersih | Berhasil memasang 736 paket dari lockfile; npm melaporkan 14 advisory moderate pada keseluruhan dependency. Audit produksi tersendiri tidak dijalankan pada revisi dokumen ini |
| `npm.cmd test` | 43 lulus, 0 gagal; hitungan, draf/versi, penyimpanan, penggabungan progres, laporan guru, katalog, dan bantuan |
| `npm.cmd run build` | Berhasil; entry utama JS 301,45 KB gzip, CSS 22,02 KB gzip, chunk 3Dmol terpisah 164,02 KB gzip. Ada peringatan chunk besar dan `eval` upstream 3Dmol; anggaran awal JS 200 KB gzip belum terpenuhi |
| `npm.cmd run dev:emulator` | Stack lokal berjalan pada project `demo-chemlab`, aplikasi 5174, Auth 9099, Firestore 8080. Browser memeriksa project ID, kunjungan pertama/tur, pilihan tamu dan ID tetap setelah refresh |
| `npm.cmd run test:e2e -- --project=firebase-auth` | 14 lulus, 0 gagal dalam 3,0 menit. Mencakup 5 skenario akun, 3 Google emulator, 3 Firestore, dan 3 guru; fixture hanya pada emulator |
| `npm.cmd run preview` dan walkthrough browser | Alamat 4173 terbuka tanpa konfigurasi cloud; tautan hash bacaan/refresh mempertahankan selesai; draf/ID pulih; lima jawaban acuan memberi skor 100 serta lima pembahasan; batal reset mempertahankan hasil |
| Sampel layar 375 × 812 pada preview | Bacaan, laboratorium, dan kuis tidak overflow horizontal; tidak ada `pageerror` pada walkthrough tersebut |
| Pemeriksaan dokumen | 19 dokumen, 224 tautan, dan 27 tabel diperiksa; tidak ada target lokal hilang, pagar kode tidak berpasangan, atau lebar kolom tabel tidak konsisten. Tujuh tautan bab handout cocok dengan nama sumber lokal; tujuh pertemuan, GAP-01–04, dan TC-01–TC-23 terpetakan. Ketersediaan URL eksternal tidak diperiksa ulang |
| `git diff --check` dan batas perubahan | Tidak ada kesalahan whitespace; 154 berkas terlacak selain Markdown sama dengan HEAD. Perubahan untuk diserahkan hanya 18 Markdown yang diperbarui dan satu panduan baru dalam ProyekContoh |

Suite akun mengeluarkan peringatan SDK ketika mensimulasikan jaringan putus dan ketika sesi baca guru dibuang (`app/app-deleted`); seluruh 14 skenario tetap lulus. Hasil tersebut tidak menyatakan konsol seluruh alur bebas peringatan. Server preview/emulator yang dijalankan untuk pemeriksaan sudah dihentikan.

Laporan mesin walkthrough dan pemeriksaan tautan disimpan pada folder uji sementara di atas; ringkasan hasil yang ikut repo berada pada dokumen ini. Suite guru menghasilkan ulang dua PNG pratinjau hanya pada salinan uji, tanpa mengubah gambar repo kerja. Semua bukti pengembangan terdahulu di bawah tetap merupakan riwayat bertanggal, bukan hasil uji ulang penuh pada 20 November.

**Batas pemeriksaan:** suite `learning` lengkap, OAuth/email sungguhan, project/Rules produksi, deployment publik, ponsel fisik, pembaca layar manual, Lighthouse, validasi kimia/pedagogik manusia, serta keberhasilan mahasiswa pemula belum diuji ulang/dinyatakan selesai. Tidak ada akun atau hasil belajar produksi yang dibuat, diubah, atau dihapus. GAP-01–04 dan REL-01 pada [backlog](BACKLOG.md) tetap terbuka meskipun suite kontrak ChemLab lulus.

## Pemetaan TC-01–TC-23 dari Lampiran A — 20 November 2026

Tabel ini memetakan bukti dan batas cakupan, bukan menyatakan seluruh TC handout lulus. Untuk proyek sendiri, isi matriks eksekusi Lampiran A dengan langkah, harapan, aktual, lingkungan/commit, penguji, status PASS/FAIL/BELUM DIUJI/TERBLOKIR, dan hasil uji ulang. N/A hanya untuk fitur pilihan yang tidak dibuat. Kekurangan fondasi yang sudah diketahui tetap dicatat sebagai ketidaksesuaian.

| ID | Bukti yang tersedia pada ChemLab | Batas atau tindak lanjut terhadap handout |
| --- | --- | --- |
| TC-01 | Walkthrough preview membuka beranda dan bacaan langsung; refresh bacaan berhasil | Pemeriksaan seluruh jalur navigasi mengacu riwayat suite belajar; ulangi pada proyek/URL sendiri |
| TC-02 | Walkthrough lima jawaban benar memberi 100 dan pembahasan; uji logika memeriksa kelengkapan/skor | Seluruh variasi jawaban lewat UI belum diulang pada sesi ini |
| TC-03 | Draf/ID pulih; batal reset menjaga hasil; suite akun menguji reset identitas aktif | Reset akun ikut menghapus cloud, berbeda dari reset draf/perangkat handout: GAP-03 |
| TC-04 | Riwayat issue/perbaikan lama tersedia di log | Belum ada penerimaan issue sprint kelompok mahasiswa; isi berdasarkan tugas nyata |
| TC-05 | Uji logika acuan pH/toleransi lulus; sumber materi dan instrumen tersedia | Validasi manusia seluruh isi, notasi, dan pedagogik belum dicatat selesai |
| TC-06 | Suite Firestore memulihkan materi, jawaban, asesmen, dan catatan pada browser baru | Teruji pada skema progres UID ChemLab; bukan koleksi hasil per percobaan Lampiran B |
| TC-07 | Suite emulator menolak tamu dan akses UID lain | Nonanggota kelas belum ditolak: GAP-01; tidak boleh dianggap PASS penuh |
| TC-08 | Suite guru memeriksa akses terverifikasi dan larangan menulis hasil akun lain | Rules belum menolak pemilik mengubah payload hasil sendiri: GAP-03 |
| TC-09 | Uji logika/Firestore: perubahan offline, antrean, gabung, ID, reset lintas perangkat | Keutuhan/idempotensi pada kontrak hasil per record handout perlu diuji pada implementasinya |
| TC-10 | Preview 375 px: bacaan/lab/kuis; suite akun/guru memakai viewport ponsel | Belum semua tabel/opsi panjang pada 375 px atau perangkat fisik diperiksa ulang |
| TC-11 | Suite guru memeriksa keyboard; riwayat suite belajar mencakup kontrol inti | Uji keyboard manual seluruh aplikasi oleh pembaca belum dicatat selesai |
| TC-12 | Pemeriksaan axe pada form akun/panel/rincian guru lulus | Tidak menggantikan pemeriksaan manual heading, kontras, dan seluruh feedback |
| TC-13 | Source aplikasi tetap; 43 uji logika, 14 akun/cloud/guru, dan smoke preview lulus | Suite belajar lengkap dan merge baru tidak dilakukan pada revisi dokumen |
| TC-14 | Build dan walkthrough preview lokal lulus | Ukuran/peringatan build dicatat; uji hosting tetap terpisah |
| TC-15 | Salinan bersih tanpa env lokal; audit diff hanya Markdown | Kelompok tetap memeriksa staging/source, data contoh, dan variabel build rilisnya |
| TC-16 | Rute hash bacaan dibuka langsung dan di-refresh pada preview | Perlu diulang pada URL hosting produksi: REL-01 |
| TC-17 | Uji logika memverifikasi katalog/struktur; bukti uji jaringan/3D lama tersedia | PhET/PubChem/viewer dan kegagalan jaringan tidak diulang seluruhnya; fitur dipilih pada backlog |
| TC-18 | Suite Google menguji pembatalan dan pemisahan tamu/akun | Pemilihan hasil tamu belum tersedia: GAP-02; bukan N/A |
| TC-19 | Suite akun/Firestore: dua akun/tamu, perubahan sesi, antrean, dan logout | Teruji pada skema ChemLab; ulangi jika memakai kontrak/layanan handout |
| TC-20 | Suite Firestore memulihkan progres pada konteks browser baru | ChemLab menyinkronkan draf juga; jelaskan bedanya dari draf lokal handout |
| TC-21 | Uji asesmen membuktikan hasil memakai snapshot; percobaan baru terpisah | Diagnostik versi lama belum diarsipkan/dimigrasikan: GAP-04 |
| TC-22 | Suite guru mencocokkan rekap/ekspor dengan jawaban fixture, penyebut tanpa siswa belum mengumpulkan | Penafsiran/tindak lanjut manusia belum divalidasi; rekap asesmen per cakupan, diagnostik per butir |
| TC-23 | Uji logika memeriksa JSON rusak, storage ditolak, dan hasil asesmen rusak; riwayat browser tersedia | Pemulihan inti/versi diagnostik dapat memulai progres baru; jelaskan risiko GAP-04 |


## 17 November 2026 WIB — header desktop dan ponsel

- **Arahan lanjutan:** terapkan header yang tetap menempel juga pada desktop. Aturan sticky kini berlaku pada semua ukuran layar, dengan tinggi/ruang scroll atas 79 piksel pada desktop dan 66 piksel pada ponsel. Panel Isi modul diberi jarak 25 piksel di bawah header.
- Pemeriksaan langsung build produksi melalui Playwright/Microsoft Edge lulus pada **320 × 568, 390 × 844, 780 × 900, 781 × 900, 1024 × 768, 1366 × 768, dan 1440 × 1050**. Pada beranda dan bacaan, posisi header tetap y=0 saat scroll ke tengah, paling bawah, dan kembali ke atas; isi awal tidak tertutup serta tidak ada overflow horizontal pada halaman yang diperiksa.
- Daftar isi memindahkan fokus ke judul bacaan sekitar y=104 pada desktop dan y=91 pada ponsel. Pada 1366 dan 1440 piksel, panel Isi modul tetap di bawah header pada y=104. Header tidak bertumpuk dengan sidebar utama; scroll sidebar desktop diperiksa pada 1366 × 768. Menu ponsel serta dialog pencarian sesudah scroll tetap berfungsi. Tidak ada `pageerror` selama pemeriksaan ini. Pratinjau desktop setelah scroll diperiksa secara visual.
- **7 skenario browser terkait lulus**, 0 gagal dalam **29,7 detik**, memakai perintah dan preview build produksi yang sama dengan pemeriksaan awal ponsel di bawah. Cakupan: navigasi ponsel, responsivitas/pencarian aksesibel, empat skenario tur fitur, serta bacaan mendalam.
- `npm.cmd run build`, Prettier kedua berkas CSS, dan `git diff --check` lulus. Peringatan upstream 3Dmol/ukuran chunk tetap sama. Suite logika, akun/emulator, Safari/Firefox, dan ponsel fisik tidak dijalankan ulang untuk perubahan CSS ini.

## 17 November 2026 WIB — perbaikan awal pada ponsel

- di tampilan ponsel header tidak menempel di atas halaman, tapi ikut tergulir (scroll)

- **Reproduksi:** pada 390 × 844, posisi header berubah dari y=0 menjadi y=-650 setelah scroll 650 piksel; computed style menunjukkan `position: static`.
- **Perbaikan:** header menjadi sticky pada lebar hingga 780 piksel. Ruang scroll atas 66 piksel menjaga judul tujuan daftar isi tetap terlihat; lapisan header berada di bawah menu dan backdrop.
- Pemeriksaan langsung terhadap build produksi melalui Playwright/Microsoft Edge lulus pada **320 × 568, 390 × 844, 740 × 360, 768 × 1024, dan 780 × 900**. Header tetap y=0 saat scroll ke tengah, paling bawah, dan kembali ke atas pada beranda serta bacaan. Tingginya tetap 66 piksel, isi awal tidak tertutup, dan tidak ada overflow horizontal pada halaman yang diperiksa.
- Menu dan backdrop tampil di atas header; menu serta dialog pencarian bisa dibuka setelah scroll dan ditutup dengan Escape. Daftar isi memindahkan fokus ke judul bacaan sekitar y=91, di bawah header. Tidak ada `pageerror` pada pemeriksaan ini. Pratinjau 390 piksel setelah scroll diperiksa secara visual.
- Pada lebar **781 dan 1440 piksel**, aturan desktop tetap memakai header setinggi 79 piksel dan posisi `static`.
- **7 skenario browser terkait lulus**, 0 gagal dalam **22,2 detik**: navigasi ponsel, responsivitas/pencarian aksesibel, empat skenario tur fitur, serta bacaan mendalam. Perintah: `npx.cmd playwright test --config .firebase/molecule-playwright.config.mjs --project=learning onboarding.spec.js reading.spec.js app.spec.js --grep 'first visit|account flows|tour contains|denied storage keeps|deep reading|mobile navigation|narrow phones'`, dengan `MOLECULE_TEST_BASE_URL=http://127.0.0.1:4173` menuju preview build produksi.
- `npm.cmd run build` lulus; peringatan ukuran chunk dan `eval` dari upstream 3Dmol tetap ada. Prettier CSS lulus. Suite logika, akun/emulator, Safari/Firefox, dan ponsel fisik tidak dijalankan ulang untuk perubahan CSS ini.

## 12 November 2026 WIB — koreksi pemicu kunjungan pertama Eksplorasi

- **Reproduksi:** pemicu lama berada pada tombol Buka aktivitas. Membuka tab saja tidak memunculkan petunjuk. Jeda/kuota bantuan kendala juga bisa menahan pengenalan fitur berikutnya.
- `npm.cmd test`: **43 lulus**, 0 gagal. Aturan kini menguji bahwa pengenalan aktivitas baru tetap muncul saat jeda/kuota kendala sudah terpakai, sementara saran kendala berulang tetap dibatasi.
- Uji browser terkait pada kode akhir: **19 lulus**, 0 gagal dalam **55,7 detik** (12 bantuan kontekstual dan 7 tur). Perintah: `npx.cmd playwright test --config .firebase/molecule-playwright.config.mjs --project=learning contextual-help.spec.js onboarding.spec.js`. Konfigurasi lokal ini memakai server belajar tanpa startup emulator yang tidak dibutuhkan.
- Petunjuk otomatis terlihat sebelum Buka aktivitas ditekan dan sebelum iframe dimuat. PhET, molekul, dan PubChem masing-masing diperkenalkan pada kunjungan pertama tanpa menunggu 60 detik. Menonaktifkan bantuan tetap dihormati; petunjuk manual tersedia.
- Kunjungan baru ke `/#eksplorasi` menampilkan sambutan terlebih dahulu. Preferensi pengenalan aktivitas belum ditulis saat sambutan terbuka. Setelah sambutan dilewati, petunjuk aktivitas muncul; pengujian juga memulihkan posisi gulir di bawah halaman untuk memastikan target kembali terlihat tanpa memindahkan fokus.
- Uji Edge/CDP menjalankan `Network.clearBrowserCache` lalu `Page.reload` dengan `ignoreCache: true`: status petunjuk tetap tersimpan dan jawaban tidak berubah. Ini memverifikasi bahwa hard reload/clear cache HTTP saja bukan kunjungan baru.
- Ulangi semua petunjuk diuji setelah bantuan dinonaktifkan: membuka sambutan, mengaktifkan bantuan kembali, lalu menampilkan petunjuk aktivitas setelah sambutan ditutup. Snapshot progres dan kunci browser lain tidak berubah. Berpindah halaman menutup saran; kembali ke halaman yang sudah diperkenalkan tidak memunculkan balon lama.
- Lebar **320 piksel**: pengenalan otomatis terlihat dalam viewport, tidak mengambil fokus, tidak membuka modal, dan axe WCAG 2 A/AA serta 2.1 AA tidak mendeteksi pelanggaran. [Pratinjau pertama membuka Eksplorasi](docs/preview-exploration-first-visit-mobile.png) diperiksa secara visual.
- Run regresi belajar awal: **43 lulus dari 44**, termasuk materi, asesmen, aktivitas, delapan skenario molekul/render 36 CID, dan tur. Satu kegagalan berasal dari locator handler fixture yang otomatis melewati sambutan pada skenario Ulangi semua petunjuk; handler tersebut dilepas khusus skenario itu. Setelah koreksi ini serta penutupan saran saat berganti rute, seluruh 19 skenario terkait dijalankan ulang dan lulus seperti di atas.
- `npm.cmd run build`: **lulus**, main **301,54 KB gzip**, CSS **21,95 KB gzip**, chunk 3Dmol **164,02 KB gzip**. Peringatan upstream 3Dmol/chunk besar tetap sama. Tidak ada dependency tambahan. Format dan `git diff --check` lulus.

Tidak ada pengujian ulang akun/Rules produksi atau Auth/Firestore Emulator pada koreksi ini; autentikasi dan kontrak progres tidak diubah. Pengujian PhET tetap memeriksa alur ChemLab dengan fixture jaringan, tanpa mengklaim membaca interaksi dalam iframe. Handout dan panduan pembelajaran tidak diubah.

## 12 November 2026 WIB — tur fitur dan bantuan kontekstual

- `npm.cmd test`: **43 lulus**, 0 gagal. Tiga uji aturan baru memeriksa ambang, deduplikasi kata pencarian, first use, jeda global 60 detik, batas tiga saran, serta preferensi rusak/ditolak dan pilihan nonaktifkan.
- Proyek browser `learning`: **39 lulus**, 0 gagal pada kode akhir. Ada tujuh skenario tur baru (termasuk tiga cara penutupan) dan tujuh skenario bantuan kontekstual. Skenario pembelajaran yang sudah ada tetap memeriksa materi, diagnostik, asesmen, eksplorasi, ekspor/reset, dan delapan skenario model molekul dengan render struktur sesungguhnya.
- Setelah persiapan konteks browser tambahan diperbaiki, proyek `firebase-auth` dijalankan ulang: **14 lulus**, 0 gagal dalam **2,7 menit**. Ini mencakup siklus email/password, Google Emulator, pemulihan dan perubahan akun, pemisahan UID, pemulihan lintas perangkat, merge/reset saat offline, penolakan Rules, serta panel guru dan aksesibilitasnya. Total **53 skenario browser lulus** melalui dua run akhir tersebut. Tidak ada akun, progres, atau Rules produksi yang diubah oleh pengujian ini.
- Tur diuji pada konteks browser baru: muncul otomatis, maju/mundur, selesai, lewati, Escape, area redup, reload, buka ulang dari awal, penundaan pada enam rute akun/guru, dan pemeliharaan rute/progres. Storage ditolak tetap membolehkan menjawab soal serta replay manual.
- Setiap langkah tur pada lebar **320 piksel** diperiksa dengan axe WCAG 2 A/AA dan 2.1 AA: **tidak ada pelanggaran terdeteksi**. Pengujian juga memastikan target menu terlihat, kartu berada dalam tinggi viewport **568 piksel**, target tidak tertutup kartu, Tab tetap di modal, shortcut pencarian tidak membuka dialog kedua, dan fokus kembali ke Tur fitur.
- Bantuan diuji untuk dua pencarian berbeda tanpa hasil, pengumpulan diagnostik/asesmen yang belum lengkap, penggunaan pertama PhET/molekul, dua kali muat ulang simulasi, dan kegagalan PubChem. Tindakan bantuan mengarah ke pencarian/soal/catatan/bacaan; saran otomatis tidak mengambil fokus. Preferensi nonaktif bertahan setelah reload, petunjuk first use tidak berulang, dan petunjuk manual tetap bisa dibuka.
- Bantuan PhET pada ponsel **320 piksel** tidak membuka dialog modal, tidak menyebabkan overflow halaman, dan lolos pemeriksaan axe yang sama. Pratinjau tur/bantuan desktop dan ponsel diperiksa secara visual. Posisi balon mengikuti kontrol, termasuk navigasi ponsel yang ditampilkan selama tur.
- `npm.cmd run build`: **lulus**. Main **301,01 KB gzip**, CSS **21,95 KB gzip**; chunk 3Dmol tetap terpisah **164,02 KB gzip**. Anggaran awal 200 KB pada DESAIN_TEKNIS masih belum tercapai sebagaimana baseline sebelum onboarding. Peringatan ukuran chunk dan `eval` pada distribusi upstream 3Dmol.js tetap ada. Tidak ada dependency tambahan.
- Prettier untuk kode dan uji yang diubah serta `git diff --check`: **lulus**.
- Smoke tambahan pada ponsel 390 piksel: Buka navigasi → Panduan belajar → Ulangi tur fitur → Lanjut → Escape. Dialog dan menu menutup, fokus kembali ke Tur fitur, dan gulir halaman pulih (`body.style.overflow` kosong).

Pengujian regresi fitur memakai fixture pengguna lama yang sudah melewati tur dan menonaktifkan saran; pengujian bantuan mengaktifkan saran yang sebenarnya. Ini mencegah balon petunjuk menutupi piksel atom pada uji render. Pada pengujian awal, target saran muat ulang berada di header yang sudah keluar viewport sehingga tombol bantuannya tidak terjangkau; target dipindahkan ke kontrol muat ulang. Visibilitas navigasi ponsel dan pembatasan fokus dialog juga dikoreksi sebelum run akhir yang lulus.

Run gabungan awal menghasilkan 50 lulus, dua timeout, dan satu skenario guru belum berjalan. Trace menunjukkan konteks browser kedua yang dibuat langsung oleh uji Firestore/panel guru belum mendapat status pengguna lama, sehingga tur pertama memblokir klik otomatis. Helper fixture diterapkan juga pada konteks tambahan; kode aplikasi, aturan sinkronisasi, dan timeout pengujian tidak diubah untuk mengatasi ini.

Permintaan PhET pada skenario bantuan diganti dengan fixture HTML atau dibatalkan untuk menguji alur ChemLab secara deterministik; pemeriksaan ini **tidak memverifikasi penggunaan kontrol di dalam PhET**. Simulasi lintas origin tidak dibaca aplikasi. Pemeriksaan otomatis tidak membuktikan pengguna merasa terbantu; uji pengguna, pembaca layar manual, Safari/Firefox, ponsel fisik, dan Lighthouse belum dilakukan pada tahap ini. Handout dan panduan pembelajaran di luar ProyekContoh tidak diubah.

Pratinjau: [sambutan desktop](docs/preview-onboarding-desktop.png), [tur desktop](docs/preview-tour-desktop.png), [sambutan ponsel](docs/preview-onboarding-mobile.png), [tur ponsel](docs/preview-tour-mobile.png), [bantuan PhET desktop](docs/preview-contextual-help-desktop.png), dan [bantuan PhET ponsel](docs/preview-contextual-help-mobile.png). Kontrak: [ONBOARDING.md](docs/ONBOARDING.md).

## 10 November 2026 WIB — model 3D dan pencarian 36 CID

- Kegagalan awal direproduksi di Edge: iframe mendapat HTTP 200, tetapi query `backgroundcolor` memicu error dan tidak ada permintaan struktur. Dokumentasi resmi 3Dmol.js diperiksa; viewer aplikasi kini memakai API lokal 2.5.5 dan SDF 3D PubChem.
- `npm.cmd test`: **40 lulus**, 0 gagal. Empat uji katalog memeriksa nama/alias/rumus/CID, filter dan hasil kosong, pemulihan pilihan baru, serta manifest/checksum, CID, komposisi, koordinat, dan indeks ikatan seluruh berkas.
- Proyek browser `learning` dijalankan pada **build produksi melalui Vite preview**: **25 lulus**, 0 gagal dalam 1,9 menit. Konfigurasi sementara di `.firebase/molecule-playwright.config.mjs` hanya memakai proyek learning dan melewati startup Auth/Firestore Emulator yang tidak diperlukan pada perubahan ini. Perintah: `$env:MOLECULE_TEST_BASE_URL='http://127.0.0.1:5176'; npx.cmd playwright test --config .firebase/molecule-playwright.config.mjs --project learning`.
- Setelah kamera disesuaikan untuk layar sempit, **tujuh skenario molekul lulus**. Uji perpindahan seluruh katalog sempat mencapai timeout; trace menunjukkan seluruh pilihan telah dilaporkan siap, tetapi jeda panjang pada run tersebut belum dipastikan penyebabnya. Uji katalog yang sama dijalankan ulang dengan satu worker, tanpa perubahan timeout, dan **lulus dalam 24 detik**. Delapan skenario molekul pada kode akhir dengan demikian semuanya telah lulus, dalam dua run tersebut.
- Seluruh **36 struktur benar-benar menggambar piksel atom**, termasuk warna oksigen/nitrogen pada tiga molekul awal, saat host 3dmol.org, PubChem, jQuery, dan CDN diblokir. Pengujian tidak mengganti pustaka WebGL atau struktur dengan mock. Rotasi keyboard/drag, zoom, reset, pergantian CID saat permintaan tertunda, reload, berkas 404/rusak, WebGL tidak tersedia, kehilangan context grafis, serta pemulihan tanpa menghapus catatan diperiksa.
- Pencarian `ethanol`, `H₂O₂`, `CID: 311`, dan `aspirin`, filter kelompok, hasil kosong, dan pemulihan CID baru setelah reload lulus. CID `176` dicocokkan tepat, bukan sebagai substring dari `1176`.
- Lebar **320, 390, 768, dan 1440 piksel** tidak melampaui lebar halaman. Piksel struktur asam sitrat tidak menyentuh tepi canvas pada semua lebar tersebut. axe WCAG 2 A/AA dan 2.1 AA tidak menemukan pelanggaran pada penampil yang dibuka. Pratinjau diperiksa secara visual.
- `npm.cmd run build`: **lulus**. Chunk 3Dmol.js terpisah **164,02 KB gzip**, dimuat ketika viewer dibuka; main **295,68 KB gzip**, CSS **20,76 KB gzip**. Peringatan chunk >500 KB dan pemakaian `eval` pada distribusi upstream 3Dmol.js tetap ada. Format dan `git diff --check` lulus.
- Smoke test build di subfolder `/chem/` berhasil memuat aplikasi, dokumen viewer, pustaka, dan struktur asam asetat tanpa error JavaScript. Server pengembangan utama tetap tersedia pada port 5173.

Bukti: [katalog CID](docs/MOLECULE_CATALOGUE.md), [manifest sumber](public/molecules/sources.json), [pratinjau desktop](docs/preview-molecule.png), dan [pratinjau ponsel](docs/preview-molecule-mobile.png). Pemeriksaan memakai Edge desktop/headless dengan viewport ponsel; Safari/Firefox dan ponsel fisik tidak diuji. Tidak ada perubahan Rules atau pengujian ulang akun/penyimpanan produksi pada tahap ini.

## 10 November 2026 WIB — panel guru dengan akses terbatas

- `npm.cmd test`: **36 lulus**, 0 gagal. Delapan uji baru memeriksa email guru terverifikasi, pengecualian guru/akun terhapus, data rusak, diagnostik pertama/asesmen terbaru, denominator dan skor nol, pencarian/filter, snapshot ekspor, serta formula CSV.
- `npm.cmd run test:e2e`: **31 lulus**, 0 gagal dalam 2,6 menit. Pengujian tamu yang dulu melihat panel contoh diperbarui menjadi pengujian penolakan akses. Tiga skenario panel guru memanggil Auth/Firestore Emulator sesungguhnya.
- Setelah sesi pembacaan kelas dipisahkan dari cache progres siswa, tiga skenario guru dijalankan ulang dan **seluruhnya lulus**. Pengujian mencakup tamu, siswa, email guru belum terverifikasi, guru terverifikasi, manipulasi localStorage/nama/field role, serta larangan guru mengubah hasil akun lain.
- Panel menerima pembaruan progres siswa tanpa reload. Filter, ekspor JSON/CSV, diagnostik pertama versus latihan ulang, asesmen dengan snapshot 15 soal, serta rincian catatan eksplorasi diperiksa.
- Lebar 320, 390, 768, dan 1440 piksel tidak melampaui viewport halaman. axe tidak menemukan pelanggaran pada pemeriksaan WCAG 2 A/AA dan 2.1 AA di panel/dialog yang diperiksa. Pratinjau desktop/ponsel dari emulator diperiksa secara visual.
- `npm.cmd run build`: **lulus**, JavaScript 294,60 KB gzip dan CSS 20,64 KB gzip. Peringatan Vite untuk chunk besar tetap ada. `git diff --check` lulus.
- Rules guru sudah di-deploy ke `chemlab-web` dan sumber release aktif cocok dengan berkas lokal. **14 simulasi Rules produksi lulus**, termasuk hak baca guru pada progres/profil serta penolakan guru untuk menulis hasil atau menghapus profil siswa lain.
- Akun produksi `wildannashihin@gmail.com` ditemukan aktif, email terverifikasi, dan terhubung Google. Dua profil akun lama dibuat dari metadata Firebase Auth menggunakan prasyarat dokumen belum ada. Tidak ada akun Auth atau hasil belajar yang diubah. Dua baris siswa produksi berhasil dinormalisasi tanpa catatan rusak; akun guru dikeluarkan dari roster.

Bukti: [pemeriksaan produksi](docs/firestore-production-check.json), [pelengkapan profil](docs/teacher-profile-backfill.json), [pratinjau desktop](docs/preview-teacher.png), dan [pratinjau ponsel](docs/preview-teacher-mobile.png). Akun fixture hanya dibuat di emulator. Interaksi Google OAuth nyata, Safari/Firefox, dan ponsel fisik tetap di luar pengujian ini. Hak akses dan batas penilaian dijelaskan di [TEACHER_PANEL.md](docs/TEACHER_PANEL.md).

## 10 November 2026 WIB — penyelesaian konfigurasi Firestore produksi

Setelah pengguna login Firebase CLI dan memasang Rules, pemeriksaan berikut dilakukan terhadap proyek produksi `chemlab-web`:

- Database `(default)` tersedia, bertipe `FIRESTORE_NATIVE`, di region `asia-southeast2`.
- Sumber Rules pada release aktif sama persis dengan `firestore.rules` setelah normalisasi akhir baris. Pengecualian indeks `learningProgress.payload` terpasang dengan `indexes: []`.
- **6 simulasi Rules produksi lulus**: pemilik dapat membaca dokumennya; akun lain/tamu, pembacaan daftar, penghapusan langsung, dan koleksi di luar ruang lingkup ditolak.
- Probe baca pada ID dokumen baru yang tidak ditulis mendapat HTTP 404 melalui IAM CLI, sementara permintaan tanpa autentikasi mendapat HTTP 403. Ini memverifikasi konektivitas dan penolakan tamu, bukan penulisan client dengan akun nyata.
- Konfigurasi API key Web App menunjuk nomor proyek yang sama. Provider Email/Password dan Google aktif, dan domain `localhost` serta `127.0.0.1` diizinkan. Emulator nonaktif pada konfigurasi produksi lokal.
- `npm.cmd test` dijalankan ulang: **28 lulus**, 0 gagal. `npm.cmd run build` lulus; peringatan ukuran chunk yang dicatat pada tahap integrasi tetap berlaku. Tidak ada perubahan kode aplikasi pada tahap verifikasi ini; 28 skenario browser dari tahap integrasi tidak dijalankan ulang.

Bukti terstruktur tanpa token atau data akun: [firestore-production-check.json](docs/firestore-production-check.json). Pemeriksaan ini tidak membuat/menghapus akun produksi dan tidak menulis data pengguna. Alur client menyimpan/memulihkan/reset/menghapus data tetap mengacu pada pemeriksaan Auth/Firestore Emulator. Batas login CLI pada catatan tahap integrasi di bawah sudah terselesaikan.

## 10 November 2026 WIB — integrasi Cloud Firestore

Lingkungan: Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright, serta Auth/Firestore Emulator proyek `demo-chemlab`. Firestore Emulator dijalankan dengan Java 21 portabel untuk pengujian; konfigurasi Java global komputer tidak diubah.

- `npm.cmd test`: **28 lulus**, 0 gagal. Termasuk 12 skenario baru untuk penggabungan perubahan, pemuatan server sebelum menulis, perubahan saat transaksi berjalan, antrean setelah reload, reset lintas perangkat, kegagalan izin, penghapusan, batas byte, riwayat besar, dan pencegahan callback sesi akun lama.
- `npm.cmd run test:e2e`: **28 lulus**, 0 gagal dalam 2,2 menit. Suite belajar dan akun sebelumnya dijalankan bersama tiga skenario Firestore baru.
- Browser baru tanpa cache berhasil memulihkan materi, pH, hasil diagnostik, snapshot asesmen bernilai 100, dan catatan eksplorasi dari emulator. SDK aplikasi dan database emulator sesungguhnya digunakan.
- Dua konteks browser memeriksa perubahan offline yang digabung dengan materi dari perangkat lain, serta reset yang tidak dibatalkan oleh antrean lama.
- Pengujian Rules memverifikasi pemilik bisa membaca dokumennya; tamu, UID lain, pembacaan daftar, penulisan field role tambahan, dan penghidupan kembali data terhapus ditolak. Penghapusan akun menghasilkan payload `null` dan penanda `deleted`.
- `npm.cmd run build`: **lulus**, JavaScript 287,72 KB gzip dan CSS 20,37 KB gzip. Vite memberi peringatan chunk di atas 500 KB setelah penambahan SDK Firestore; build tetap berhasil. Pemisahan bundle dapat menjadi pekerjaan kinerja berikutnya.
- `git diff --check` lulus. Konfigurasi `.env.local` yang sudah terisi tidak dimasukkan Git.

**Batas saat tahap integrasi awal:** Firebase CLI saat itu mengembalikan `Failed to authenticate`; pemasangan Rules/indeks baru diverifikasi pada tahap penyelesaian produksi di atas. Pengujian tulis dengan akun nyata serta OAuth/email produksi tidak dilakukan. Kontrak lengkap tersedia di [FIRESTORE_SETUP.md](docs/FIRESTORE_SETUP.md).

## 10 November 2026 WIB — perbaikan scroll sidebar

- Masalah direproduksi pada 1366 × 768: sidebar setinggi 768 piksel memuat isi 987 piksel, tetapi roda mouse tidak menggulir sidebar dan profil terpotong.
- Pemeriksaan browser langsung melalui Playwright/Microsoft Edge lulus pada 1366 × 768, 1440 × 900, 1024 × 600, 1440 × 1050, 390 × 500, dan 740 × 360. Scroll ke atas/bawah, profil utuh di dalam viewport, serta fokus keyboard ke tautan akun diperiksa. Pada 1440 × 1050 seluruh isi muat tanpa scroll.
- Pada dua ukuran ponsel, Enter pada tautan akun membuka halaman masuk dan menutup menu. Tidak ada overflow horizontal sidebar pada ukuran yang diperiksa.
- Pratinjau desktop sebelum/sesudah scroll diperiksa secara visual. `npm.cmd run build` serta `git diff --check` lulus. Suite logika dan seluruh suite akun tidak dijalankan ulang untuk perubahan CSS ini; hasil integrasi sebelumnya tercatat di bawah.

## 10 November 2026 WIB — integrasi seluruh branch ke main

Menggabungkan `feat/material-updates`, `feat/chapter-assessment`, `feat/interactive-activities`, dan `feat/login-page`. Lingkungan: Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright, dua worker, serta Firebase Auth Emulator dengan project ID `demo-chemlab`.

- `npm.cmd test`: **16 lulus**, 0 gagal, mencakup penilaian, versi/pemulihan asesmen, diagnostik, dan pemisahan key akun/tamu.
- `npm.cmd run test:e2e`: **25 lulus**, 0 gagal dalam 3,1 menit. Seluruh skenario branch belajar dan akun dijalankan bersama.
- Skenario integrasi baru memakai UI dan Auth Emulator untuk memeriksa bacaan, draf asesmen, serta catatan eksplorasi pada tamu dan dua akun. Data bertahan setelah reload/masuk ulang; reset akun aktif tidak menghapus data tamu.
- `npm.cmd run build`: **lulus**; JavaScript 146,81 KB gzip dan CSS 20,25 KB gzip.
- Pratinjau desktop, ponsel, serta pengantar asesmen diperbarui dari aplikasi gabungan; pratinjau beranda desktop/ponsel juga diperiksa secara visual.

Pengujian akun memakai emulator lokal. OAuth Google, pengiriman email nyata, dan domain produksi belum diuji. Bagian berikut mempertahankan hasil pemeriksaan masing-masing branch sebelum integrasi.

## Verifikasi branch asesmen akhir bab

Baseline `feat/material-updates` commit `834ee59`; tidak menggabungkan branch lain. Build produksi berhasil. **15 uji logika dan 13 skenario browser lulus**, termasuk sembilan uji logika penilaian/migrasi serta empat skenario browser asesmen. Acuan keenam hitungan diverifikasi dari rumus independen, selisih terhadap acuan tersimpan <10⁻⁸. Aksesibilitas otomatis diperiksa pada pengantar, soal pilihan, input angka, tinjauan, dan hasil; responsivitas hasil diperiksa pada 320, 390, 768, dan 1440 piksel. Rincian dan batas verifikasi ada di [CHAPTER_ASSESSMENT.md](docs/CHAPTER_ASSESSMENT.md). Bagian berikut mencatat riwayat branch induk dan baseline.

## Verifikasi branch materi

`feat/material-updates` berangkat langsung dari `main` commit `30505f7`. Build produksi dan enam uji logika lulus. Delapan skenario browser baseline serta satu skenario tambahan untuk daftar isi, fokus heading, refleksi, tabel ponsel, referensi, dan pemulihan progres lulus. Referensi dan pemeriksaan hitung dijabarkan di [MATERIAL_SOURCES.md](docs/MATERIAL_SOURCES.md). Bagian berikut merupakan riwayat pemeriksaan baseline.

## Verifikasi branch interaktif

`feat/interactive-activities` berangkat langsung dari `main` commit `30505f7`. Build dan enam uji logika baseline lulus. Delapan skenario browser baseline serta empat skenario aktivitas memeriksa pemulihan/reset catatan, pemuatan sematan atas permintaan, pendampingan saat sumber diblokir, pemilihan CID, respons PubChem, 404, kegagalan jaringan, aksesibilitas, serta ponsel. Endpoint PhET, 3Dmol, dan PubChem juga mengembalikan HTTP 200 pada pemeriksaan langsung. Detail: [INTERACTIVE_ACTIVITIES.md](docs/INTERACTIVE_ACTIVITIES.md). Bagian di bawah merupakan riwayat baseline.

## 9 November 2026 WIB — Google pada feat/login-page

- Build produksi lulus: JavaScript **125,29 KB gzip**, CSS **16,85 KB gzip**.
- **7 uji logika** dan **15 skenario browser** lulus dalam pemeriksaan terakhir: 8 skenario belajar, 4 email/password, dan 3 Google. Lingkungan Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright; dua worker, Auth Emulator proyek `demo-chemlab`.
- Google diuji melalui pemilih provider pada emulator menggunakan SDK aplikasi: daftar tanpa mengisi form password, masuk ulang dengan UID/progres yang sama, ubah nama, logout, pemisahan progres tamu, reload, sesi yang diingat antar-tab, serta sesi default per tab.
- Penghapusan akun Google diuji setelah penolakan identitas berbeda, pembatalan jendela, lalu autentikasi ulang yang benar. API emulator memastikan akun telah dihapus dan key progres akun hilang. Form tidak meminta password yang belum dibuat.
- Pembatalan masuk memulihkan tombol. Pemblokiran pop-up disimulasikan dengan `window.open` mengembalikan `null`; keberhasilan autentikasi tetap menggunakan Firebase SDK dan emulator, tanpa mock sukses.
- Pemeriksaan otomatis WCAG AA dan lebar 390 px mencakup layar masuk serta tiga tab akun Google. Pratinjau masuk/daftar diperbarui dan tampilan ponsel diperiksa secara visual. Tanpa konfigurasi, tombol Google pada masuk/daftar tetap terlihat dan nonaktif dengan pesan layanan belum tersedia.
- Pengujian awal menemukan sesi yang diingat dapat berakhir ketika tab lain memigrasikan penyimpanan default SDK. Inisialisasi local/session diseragamkan; pemeriksaan lengkap di atas lulus setelah perbaikan. Pengujian pembatalan menunggu toleransi penutupan pop-up SDK, bukan menganggap penutupan langsung menghasilkan callback.

OAuth Google pada proyek/domain produksi, consent screen, Safari/Firefox, dan ponsel fisik belum diuji. Provider Google serta konfigurasi proyek perlu diisi mengikuti [panduan Firebase](docs/FIREBASE_AUTH_SETUP.md). Catatan di bawah merupakan riwayat versi sebelumnya.

## Verifikasi branch Firebase Auth

`feat/login-page` berangkat langsung dari `main` commit `30505f7`. Build produksi lulus (JavaScript 127,00 KB gzip; CSS 16,75 KB gzip). Tujuh uji logika lulus, termasuk pemisahan key tamu/dua akun. Delapan skenario browser baseline serta empat skenario Firebase Auth Emulator lulus: registrasi/verifikasi, sesi, profil, password benar/salah, hapus/batal, reset sekali pakai, penggantian email setelah verifikasi, dan draf per identitas. Pemeriksaan aksesibilitas serta ponsel mencakup halaman masuk/daftar/pemulihan dan tiga tab akun.

Hasil browser diverifikasi melalui pemeriksaan lengkap (10 lulus) dan verifikasi ulang dua skenario setelah selector input password serta field `newEmail` pada pembacaan kode emulator diperbaiki. Tidak ada mock keberhasilan autentikasi. Audit dependency produksi: 0 temuan. Dependency Firebase CLI untuk development masih memiliki advisory moderate; CLI tidak dikirim ke browser. Konfigurasi proyek/domain produksi serta email sungguhan belum diuji. Panduan: [FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md). Bagian di bawah merupakan riwayat baseline.

Tanggal: **7 November 2026 WIB**. Lingkungan: Windows, Node.js 24.20.0, Microsoft Edge melalui Playwright. Seluruh pemeriksaan berikut dilakukan pada proyek lokal; tidak ada pengujian akun/cloud atau URL publik.

## Hasil aktual

| Pemeriksaan            | Hasil                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`             | **6 lulus**, 0 gagal                                                                                                             |
| `npm run test:e2e`     | **8 lulus**, 0 gagal; pelaksanaan akhir sekitar 41 detik                                                                         |
| `npm run build`        | **Lulus**; hasil tersedia di `dist/`                                                                                             |
| Preview produksi       | 7 rute dimuat; sampel pH dan pemulihan setelah reload berfungsi; tidak ada runtime error/request gagal                           |
| Aksesibilitas otomatis | Tidak ada pelanggaran terdeteksi pada tag WCAG 2 A/AA dan 2.1 AA yang diperiksa axe di 7 rute serta dialog pencarian pada ponsel |
| Ukuran viewport        | 320, 390, 768, 1024, dan 1440 piksel; tidak ada overflow halaman pada skenario yang diperiksa                                    |

Build akhir menghasilkan JavaScript awal **88,96 KB gzip** dan CSS **15,21 KB gzip**. Font Latin variable berukuran 27,34 KB sebelum kompresi transfer; subset font lain tersedia sebagai aset dengan unicode-range. Font dan ikon dipaketkan lokal. Smoke test produksi tidak menemukan request runtime ke origin eksternal.

## Cakupan uji logika

1. Titik acuan pH, klasifikasi, konsentrasi ion, netralitas pada 25 °C, dan rasio 100 kali antara pH 3 dan 5.
2. Model HCl menghasilkan pH 1, 2, dan 3; konsentrasi di luar model ditolak.
3. Pengumpulan memerlukan lima jawaban, menghasilkan skor, dan menyalin jawaban tanpa mengubah hasil sebelumnya.
4. ID draf, hasil, pH, progres, dan tanda materi bertahan melalui serialisasi/pemulihan.
5. Storage ditolak/penuh, JSON rusak, jawaban di luar rentang, dan versi tidak cocok ditangani.
6. Rekap guru dihitung dari enam contoh: rerata 70, dua skor <80, tiga jawaban tepat untuk soal logaritmik.

## Cakupan uji browser

1. Materi selesai dan pH bertahan setelah reload; draf kuis pulih; pembahasan tertahan sampai pengumpulan; hasil 100 dan 20 tersimpan sebagai percobaan berbeda; reset batal/konfirmasi berfungsi; tidak ada page error.
2. Kuis belum lengkap tidak dapat dikumpulkan dan diarahkan ke pertanyaan belum dijawab.
3. Pencarian konsep, filter/pencarian siswa contoh, dialog rincian, serta unduhan JSON progres/data contoh berfungsi.
4. JSON lokal rusak dan akses `localStorage` ditolak tidak memblokir penggunaan kuis.
5. Menu ponsel dan slider melalui keyboard bekerja; halaman utama tidak melampaui lebar viewport 390 piksel.
6. axe memeriksa beranda, daftar materi, materi skala pH, laboratorium, kuis awal, progres, dan guru.
7. Pratinjau desktop/ponsel diambil, dan judul hero ponsel tidak terpotong secara horizontal.
8. Lebar 320, 768, dan 1024 piksel diperiksa pada halaman utama; pencarian ponsel memiliki nama aksesibel dan lolos pemeriksaan axe pada dialog terbuka.

## Artefak

- [Pratinjau desktop](docs/preview-desktop.png)
- [Pratinjau ponsel](docs/preview-mobile.png)
- [Laporan smoke produksi](docs/production-smoke.json)
- Uji logika: `tests/domain.test.js`
- Uji browser: `tests/browser/app.spec.js`

## Batas dan tindak lanjut

Pemeriksaan otomatis tidak menggantikan uji pembaca layar, seluruh kombinasi zoom/ukuran teks, browser Safari/Firefox, atau pengujian pengguna pada ponsel fisik. Skor Lighthouse dan Core Web Vitals lapangan belum diukur; nilai pada desain teknis merupakan target. Konten/diagnostik masih memerlukan validasi pengajar, bukan klaim efektivitas pembelajaran.

Tidak diuji karena di luar cakupan versi lokal: login Google, database cloud, Rules/RLS, antrean sinkronisasi, pergantian akun, hosting publik, dan PWA. Data panel guru bersifat fiktif.

## Pembaruan 9 November 2026 WIB

Perubahan bahasa antarmuka menghapus label demo, banner demonstrasi, narasi perkuliahan, dan rincian implementasi dari alur belajar. Panduan, navigasi, footer, referensi, serta panel guru menggunakan bahasa aplikasi. Asal data latihan tetap disebut sekali pada keterangan sumber panel guru.

- Build produksi lulus: JavaScript **88,71 KB gzip**, CSS **15,03 KB gzip**.
- Pemeriksaan aksesibilitas dan responsivitas lulus pada halaman yang diperiksa; pratinjau desktop/ponsel diperbarui.
- Skenario pratinjau memeriksa bahwa narasi demo tidak tampil pada tujuh rute dan panduan belajar.
- Delapan skenario browser lulus: tujuh pada pemeriksaan lengkap dan satu melalui verifikasi ulang setelah selector label lama diperbaiki.
- Nama tombol/label pada pengujian diselaraskan dengan antarmuka baru. Riwayat pengujian 7 November di atas tetap berlaku sebagai catatan versi sebelumnya.
