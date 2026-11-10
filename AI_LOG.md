# Log bantuan AI

## 10 November 2026 WIB — perbaikan model 3D dan perluasan katalog CID

**Arahan pengajar:** perbaiki model molekul yang kosong, periksa dokumentasi 3dmol.org terbaru, kemudian perluas daftar CID dan tambahkan pencarian.

**Penyebab yang direproduksi:** HTML viewer publik mendapat HTTP 200, tetapi parser query menolak `backgroundcolor`, menghentikan JavaScript sebelum permintaan struktur dikirim. Dokumentasi API, URL viewer, dan GLViewer diperiksa ulang. Tautan tab baru diperbaiki; penampil utama memakai API lokal dari paket npm `3dmol` versi 2.5.5, dimuat dinamis dalam dokumen viewer tersendiri agar sumber daya grafis/event listener mengikuti umur dokumen.

**Perubahan:** memuat SDF dengan `addModel`, mempertahankan hidrogen eksplisit, memeriksa CID/komposisi/koordinat, memberi gaya bola/batang Jmol, memusatkan kamera, dan melaporkan hasil render. Ditambahkan pesan berkas/WebGL gagal, deteksi kehilangan context, retry, serta kontrol rotasi/zoom/reset yang dapat dipakai dengan keyboard. Kamera menyesuaikan aspek layar agar molekul besar tetap masuk pada ponsel.

**Katalog:** 36 senyawa dari empat kelompok, dengan pencarian nama Indonesia/Inggris, alias, rumus Unicode/ASCII, dan CID tepat. Hasil kosong/filter tidak mengganti pilihan atau menghapus catatan. Identitas dan komposisi dibandingkan dengan properti serta SDF 3D PubChem; URL, tanggal, jumlah atom/ikatan, dan SHA-256 disertakan. Kandidat hidrogen diatomik mendapat 404 untuk rekaman 3D sehingga tidak dimasukkan; tidak ada koordinat pengganti yang dibuat. Lisensi 3Dmol.js disertakan. Tidak ada perubahan versi/skor asesmen atau kebijakan Firebase.

**Verifikasi:** 40 uji logika lulus, termasuk pencarian, pemulihan CID baru, dan integritas 36 berkas. Seluruh 25 skenario browser proyek `learning` lulus terhadap build produksi. Setelah perbaikan kamera ponsel, tujuh skenario molekul lulus; uji katalog sempat mencapai batas waktu, lalu pengujian khusus yang sama dijalankan terpisah dan lulus dalam 24 detik. Seluruh 36 model diperiksa dari piksel hasil render dengan host luar diblokir. Penyebab jeda pada run yang timeout belum dipastikan; tidak diklaim sebagai kegagalan render karena semua model juga tercatat siap pada trace. Build, pemeriksaan format/diff, dan smoke test hosting subfolder `/chem/` lulus. Pratinjau desktop/ponsel diperiksa. Auth/Firestore Emulator serta login produksi tidak dijalankan ulang untuk perubahan ini.

**Batas:** katalog merupakan pilihan senyawa dengan rekaman 3D yang tersedia, bukan pencarian seluruh PubChem. Build masih memberi peringatan chunk besar dan `eval` dari kode upstream 3Dmol.js. Hasil rinci serta sumber ada pada `TESTING.md`, `docs/INTERACTIVE_ACTIVITIES.md`, dan `docs/MOLECULE_CATALOGUE.md`.

## 10 November 2026 WIB — panel guru untuk email yang ditetapkan

**Arahan pengajar:** selesaikan panel guru dan tetapkan hanya akun ber-email `wildannashihin@gmail.com` sebagai guru.

**Keputusan implementasi:** akses memerlukan email yang ditetapkan dan status verifikasi Firebase Auth, diperiksa di UI dan Firestore Rules dari token server. Profil atau localStorage tidak dapat memberikan hak guru. Akun produksi tersebut sudah aktif, terverifikasi, dan terhubung Google; tidak diperlukan perubahan identitas atau custom claim.

**Perubahan:** mengganti panel data fiktif dengan profil/progres Firestore; menambah metadata profil pemilik saat login/perubahan identitas; menyertakan penghapusan profil pada hapus akun; membatasi menu dan tautan langsung; menambah rekap diagnostik pertama/asesmen terbaru, filter/pencarian, ambang pendampingan, rincian jawaban/riwayat/catatan, serta JSON/CSV. Sesi baca kelas diisolasi di memori dan dibuang saat panel ditutup/logout. Hasil belum dikumpulkan tidak dianggap bernilai nol dan catatan rusak ditandai. CSV melindungi field profil yang dapat dianggap formula spreadsheet.

**Produksi:** sebelum deploy, Rules aktif dibandingkan dengan release yang sebelumnya diverifikasi. Rules baru dikompilasi dan dipasang ke `chemlab-web`. Dua profil akun yang sudah memiliki progres dilengkapi dari Firebase Auth dengan prasyarat belum ada; hasil dan akun Auth tidak diubah. Sumber release baru, indeks payload, akun guru terverifikasi, serta 14 simulasi Rules diperiksa. Roster produksi dibaca dengan IAM dan normalisasi panel: dua siswa, dua profil, tanpa catatan rusak.

**Verifikasi:** 36 uji logika, 31 skenario browser, tiga pengujian ulang khusus guru setelah isolasi cache, build produksi, serta pemeriksaan diff lulus. Screenshots emulator diperiksa; bukti produksi dan migrasi memuat metadata/counts saja, tanpa token atau identitas siswa. Percobaan awal simulasi izin list diperbaiki agar request Rules API mengacu pada dokumen yang cocok dengan query koleksi; seluruh 14 hasil akhir lulus. OAuth nyata dan perangkat fisik tidak diuji. Panduan dan batas fitur ada di `docs/TEACHER_PANEL.md`.

## 10 November 2026 WIB — verifikasi produksi setelah login CLI

**Arahan pengajar:** Firebase CLI sudah login dan Rules sudah dipasang; selesaikan sisa integrasi.

**Pemeriksaan aktual:** Firebase CLI berhasil membaca database `(default)` proyek `chemlab-web` di `asia-southeast2`. Sumber release Rules aktif cocok dengan berkas lokal. Pengecualian indeks payload terpasang. Enam simulasi melalui Firebase Rules API lulus; probe baca IAM mendapat 404 pada dokumen yang tidak ada, sedangkan permintaan tanpa login ditolak 403. Konfigurasi public Auth, project number API key, provider Email/Password/Google, dan domain lokal diperiksa tanpa menampilkan token/kredensial.

**Penyelesaian:** memperbarui status pemasangan, menghapus petunjuk yang masih menyatakan konfigurasi belum terpasang, menutup butir backlog Rules/indeks, serta menyimpan bukti pada `docs/firestore-production-check.json`. Tidak diperlukan perubahan kode aplikasi atau pemasangan ulang Rules karena konfigurasi produksi sudah cocok.

**Verifikasi dan batas:** 28 uji logika dan build dijalankan ulang serta lulus. Pemeriksaan produksi tidak membuat/menghapus pengguna, menulis data, atau memakai token CLI pada aplikasi browser. Pengujian tulis, sinkronisasi lintas perangkat, reset, serta penghapusan pengguna tetap menggunakan hasil 28 skenario Auth/Firestore Emulator pada tahap integrasi. Interaksi OAuth/email produksi belum diuji. Hambatan login CLI dari catatan sebelumnya sudah terselesaikan.

## 10 November 2026 WIB — penyimpanan Firestore

**Arahan pengajar:** Firestore sudah disiapkan; integrasikan penyimpanan aplikasi ke database tersebut.

**Konteks:** konfigurasi Firebase client sudah terisi untuk proyek `chemlab-web`. Berkas `.env.local` tetap privat. Perubahan scroll sidebar dari tugas sebelumnya dipertahankan.

**Perubahan:** menambahkan dokumen progres per UID pada Firestore, snapshot server sebelum menulis, transaksi dengan penggabungan field/hasil ber-ID stabil, antrean lokal dengan debounce dan percobaan ulang, status penyimpanan berdasarkan konfirmasi server, reset lintas perangkat, serta penghapusan payload sebelum identitas Auth dihapus. Tamu tetap lokal; panel guru tetap memakai data fiktif. Rules membatasi akses pemilik dan metadata penulisan; field payload tidak diindeks. Panduan konfigurasi, batas ukuran, kebijakan konflik, dan deploy diperbarui.

**Verifikasi:** 28 uji logika, 28 skenario browser, dan build produksi lulus. Pengujian memakai SDK serta Auth/Firestore Emulator proyek `demo-chemlab`, dengan akun fixture unik. Java 21 portabel dipasang di folder scratch untuk menjalankan emulator tanpa mengubah Java global. Pustaka Firebase yang sudah terpasang dipakai tanpa dependency tambahan.

**Batas nyata:** Firebase CLI belum login dan mengembalikan kegagalan autentikasi pada pemeriksaan database. Rules/indeks produksi belum dipasang dan pengujian akun/database produksi tidak dilakukan. Instruksi penyelesaian konfigurasi tersedia di `docs/FIRESTORE_SETUP.md`; tidak ada klaim produksi berhasil. Integrasi mengacu pada dokumentasi resmi transaksi, listener, Rules, dan batas dokumen Firebase.

## 10 November 2026 WIB — sidebar terpotong

**Laporan pengguna:** bagian bawah sidebar terpotong dan tidak dapat di-scroll.

**Temuan:** pada viewport desktop 1366 × 768, isi sidebar setinggi 987 piksel memakai `overflow-y: visible`; roda mouse tidak mengubah posisi scroll sehingga profil berada di bawah layar. Scroll sebelumnya hanya diaktifkan pada breakpoint ponsel.

**Perubahan:** mengaktifkan scroll vertikal sidebar pada semua ukuran, menahan perpindahan scroll ke halaman utama, mencegah scroll horizontal, serta menjaga tinggi elemen menu melalui `flex-shrink: 0`.

**Verifikasi:** pemeriksaan browser langsung menggunakan Microsoft Edge pada enam ukuran desktop/ponsel memastikan roda mouse, akses profil melalui Tab/Enter, serta navigasi ponsel bekerja. Sidebar pada layar tinggi tidak memerlukan scroll. Build produksi dan pemeriksaan diff lulus; rincian ada di `TESTING.md`.

## 10 November 2026 WIB — merge seluruh branch

**Arahan pengajar:** gabungkan semua branch repo dan selesaikan konflik.

**Perubahan:** memperbarui referensi remote, menyimpan posisi awal `main` pada `backup/main-before-merge-20261110`, lalu menggabungkan asesmen (yang sudah mencakup materi), aktivitas interaktif, dan akun melalui merge commit. Konflik diselesaikan dengan mempertahankan seluruh rute, tombol beranda, riwayat asesmen, catatan eksplorasi, stylesheet, serta penyimpanan per UID/tamu. Panduan branch dan dokumentasi disesuaikan dengan cakupan `main`; riwayat pengembangan dipertahankan. Gambar pratinjau yang berkonflik diperbarui melalui pengujian aplikasi gabungan.

**Verifikasi:** 16 uji logika, 25 skenario browser, serta build produksi lulus. Skenario integrasi tambahan memeriksa pemulihan bacaan/draf asesmen/catatan eksplorasi saat berganti akun, reload, dan reset akun aktif tanpa menghapus data tamu. Akun diuji dengan Auth Emulator `demo-chemlab`; pengujian OAuth/domain/email produksi tidak dilakukan. Rincian ada di `TESTING.md`. Branch fitur dipertahankan dan perubahan belum didorong ke remote.

## 9 November 2026 WIB — feat/chapter-assessment

Arahan pengajar: menambahkan branch asesmen akhir bab dengan baseline `feat/material-updates`. Branch dibuat dari `834ee59`, tanpa mengambil fitur akun/interaktif atau mengubah induk.

Agent menyusun 15 soal baru yang dipetakan ke bacaan lengkap, penilaian pilihan/angka dengan toleransi, penguncian sebelum pembahasan, UUID/versi serta snapshot instrumen, riwayat/ekspor, dan pemulihan kompatibel data lama. Enam acuan numerik diperiksa secara independen. Build, 15 uji logika, dan 13 skenario browser lulus. Validasi formal isi dan penggunaan untuk nilai tetap memerlukan peninjauan pengajar. Rincian ada di `docs/CHAPTER_ASSESSMENT.md`.

## 7 November 2026 WIB — pembuatan demo

**Permintaan:** membuat web demo kuliah di `ProyekContoh` dan meminta beberapa keputusan pengajar.

**Konteks yang dibaca:** kerangka kuliah, indeks kurikulum, catatan local first, katalog interaktif, dan panduan pemisahan data serta jawaban diagnostik. Skill teknis yang digunakan: `senior-frontend`.

**Keputusan manusia:** aplikasi pembelajaran untuk siswa; topik asam–basa dan pH; versi lokal tanpa akun dengan data contoh di panel guru.

**Bantuan agent:** membuat struktur React + Vite, konten awal, lima butir, model pH, state/draf lokal, panel contoh, visual SVG, styling, dokumentasi, dan uji otomatis.

**Koreksi dari verifikasi:** perbaikan kontras dan ukuran teks; penahanan overflow tabel pada ponsel; label pencarian ketika teks disembunyikan; pemisahan selector dialog pada tes; pengujian storage ditolak harus memuat ulang dokumen, bukan sekadar berpindah hash.

**Verifikasi:** lihat `TESTING.md` untuk hasil aktual. Uji teknis tidak menggantikan validasi isi/asesmen oleh pengajar. Login, cloud, dan deployment tidak dilakukan pada versi ini.

## 9 November 2026 WIB — bahasa antarmuka

**Arahan pengajar:** hilangkan bias meta; tujuan pembuatan sebagai demo tidak perlu menjadi label pada aplikasi.

**Perubahan:** menghapus badge demo, banner demonstrasi, dan narasi perkuliahan/implementasi dari antarmuka. Panduan menjelaskan cara belajar; footer, deskripsi halaman, referensi, serta tombol memakai bahasa produk. Panel guru memakai nama/kode siswa netral dan menyebut asal data latihan fiktif satu kali pada keterangan sumber. Konteks pengembangan tetap tersedia dalam dokumentasi proyek.

**Pemeriksaan:** selector uji yang mengikuti nama tombol diperbarui; pemeriksaan halaman dan panduan pada skenario browser memastikan label/narasi demo tidak tampil. Hasil akhir dicatat di `TESTING.md`.

## Pengembangan terpisah — feat/material-updates

Berangkat dari `main` commit `30505f7`. Materi diperluas menjadi 24 bagian pada tiga ID bacaan yang sama; sumber penerbit ditelusuri melalui web dan dirujuk per bagian. Ditambahkan prasyarat, daftar isi, tabel, contoh hitung, ringkasan, serta refleksi. Tidak ada penggabungan fitur eksternal atau akun. Bank soal dan versi diagnostik dipertahankan. Build, enam uji logika, delapan skenario browser baseline, dan satu skenario bacaan mendalam lulus.

## Pengembangan terpisah — feat/interactive-activities

Berangkat dari `main` commit `30505f7`. Memilih F08 (PhET), F07 (3Dmol), dan F10 (PubChem) dari Lampiran F, dengan pendampingan yang terkait asam–basa. Sumber resmi dan dokumentasi API diperiksa; ketiga endpoint diperiksa langsung dan mengembalikan HTTP 200. Catatan siswa disimpan lokal bersama progres, tanpa mengklaim pembacaan isi iframe. Pengujian meliputi jaringan gagal/404, respons API, aksesibilitas, ponsel, draf, dan reset. Tidak ada perubahan materi mendalam atau login pada branch ini.

## Pengembangan terpisah — feat/login-page

Berangkat dari `main` commit `30505f7`. Pengajar memilih Firebase Auth dan konfigurasi proyek menyusul. Ditambahkan alur email/password, registrasi, verifikasi, pemulihan sekali pakai, profil, perubahan email/password dengan autentikasi ulang, logout, dan hapus akun berkonfirmasi. State/progres dipisahkan per UID dan tamu. Tidak ada penggabungan branch materi atau interaktif.

Integrasi diuji melalui Firebase Auth Emulator yang sesungguhnya menggunakan fixture unik, tanpa kredensial/akun produksi. Dua instalasi npm sempat bentrok; dependency dipulihkan melalui pemasangan bersih dari lockfile sebelum uji. Override kompatibel grpc menghilangkan advisory produksi. Build, tujuh uji logika, delapan skenario belajar, dan empat skenario Auth Emulator lulus. Email nyata dan domain produksi belum diuji karena konfigurasi belum diberikan.

## 9 November 2026 WIB — Google di feat/login-page

**Arahan pengajar:** tambahkan tombol login Google dan tetap pada `feat/login-page`.

**Perubahan:** tombol “Lanjutkan dengan Google” pada masuk/daftar, memakai `GoogleAuthProvider` dan pop-up Firebase dengan pilihan akun serta persistensi sesuai “Ingat saya”. Akun khusus Google menampilkan pengaturan email/password di Google dan mengonfirmasi penghapusan akun ChemLab melalui autentikasi ulang Google. Konfirmasi hapus tetap wajib; SDK menolak identitas berbeda. Pesan pembatalan/pemblokiran pop-up serta kesalahan provider/domain ditangani. Dokumentasi aktivasi provider dan pratinjau diperbarui.

**Temuan dan perbaikan:** tab baru dapat memigrasikan persistensi default SDK ke penyimpanan berbeda sehingga tab sebelumnya keluar. `initializeAuth` kini memakai urutan local/session yang konsisten dengan layanan masuk. Uji menunggu halaman pemilih emulator siap dan toleransi penutupan pop-up Firebase; verifikasi penghapusan memakai endpoint admin lokal emulator yang sesuai.

**Hasil nyata:** build produksi, tujuh uji logika, dan seluruh 15 skenario browser lulus, termasuk tiga skenario Google. Pemeriksaan mencakup sesi antar-tab/per-tab, progres terpisah, pembatalan, penolakan identitas salah, hapus akun, aksesibilitas, ponsel, serta keadaan tanpa konfigurasi. Tidak ada dependency baru, akun produksi, atau penggabungan branch lain. Google OAuth produksi tetap menunggu konfigurasi proyek pengguna.
