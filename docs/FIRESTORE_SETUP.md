# Penyimpanan progres dengan Cloud Firestore

Aplikasi memakai proyek yang sama dengan Firebase Auth pada `.env.local`. Konfigurasi proyek yang ditemukan saat integrasi adalah `chemlab-web`. Tidak diperlukan service account atau kredensial admin pada frontend.

## Status konfigurasi produksi

Pada 10 November 2026 WIB, database `(default)` proyek `chemlab-web` di region `asia-southeast2` telah diperiksa melalui API produksi. Rules aktif cocok dengan `firestore.rules`; pengecualian indeks `learningProgress.payload` juga sudah terpasang. Empat belas skenario terhadap Rules aktif, termasuk hak guru terverifikasi, lulus melalui Rules API. Koneksi baca dengan izin CLI berhasil mencapai database dan akses tanpa login ditolak.

Firebase Auth mengaktifkan Email/Password serta Google. Konfigurasi Web App menunjuk proyek yang sama; `localhost` dan `127.0.0.1` termasuk domain yang diizinkan. `.env.local` menggunakan layanan produksi dengan emulator nonaktif. Bukti pemeriksaan yang tidak memuat kredensial tersedia di [firestore-production-check.json](firestore-production-check.json).

Alur browser menulis, memulihkan lintas perangkat, reset, hapus akun, dan panel guru sudah diuji terhadap Auth/Firestore Emulator. Penyelesaian panel guru memasang Rules terbaru serta melengkapi dua profil akun lama dari Firebase Auth. Tidak ada akun produksi yang dibuat/dihapus atau hasil belajar yang diubah. Detail: [TEACHER_PANEL.md](TEACHER_PANEL.md).

## Menghubungkan database

1. Pastikan Cloud Firestore sudah tersedia pada proyek Firebase yang dipakai Auth. Aplikasi memakai database `(default)`. Jika menggunakan database bernama khusus, isi `VITE_FIRESTORE_DATABASE_ID` di `.env.local` dan jalankan ulang Vite.
2. Rules dari `firestore.rules` serta pengecualian indeks dari `firestore.indexes.json` sudah terpasang dan terverifikasi untuk proyek ini. Untuk pemasangan pada lingkungan baru atau setelah perubahan Rules, gunakan:

```powershell
cd ProyekContoh
npx.cmd firebase login
npx.cmd firebase deploy --only "firestore:rules,firestore:indexes" --project chemlab-web
```

Perintah di atas memakai database `(default)`. Untuk database bernama khusus, sesuaikan konfigurasi multi-database Firebase CLI sebelum deploy. Jika database sudah melayani fitur lain, gabungkan blok `learningProgress` dengan Rules yang sudah ada agar izin koleksi lain tetap sesuai kebutuhan.

3. Jalankan `npm.cmd run dev`, masuk memakai akun sendiri, lalu buka materi atau isi catatan. Tunggu indikator **Progres tersimpan di akun**.
4. Di Firebase Console, periksa koleksi `learningProgress` dan dokumen UID akun tersebut. Buka aplikasi pada browser/perangkat lain dengan akun yang sama untuk melanjutkan. Jika izin ditolak, aplikasi menampilkan kegagalan sinkronisasi dan tetap menyediakan progres lokal/ekspor; kegagalan tidak dianggap sebagai penyimpanan berhasil.

Konfigurasi `VITE_*` adalah konfigurasi client. `.env.local` tetap diabaikan Git. Jangan memasukkan service account, kata sandi, atau token Auth ke dokumen progres.

## Kontrak dokumen

Lokasi: `learningProgress/{firebaseAuthUid}`.

| Field | Isi |
| --- | --- |
| `version` | Versi dokumen cloud, saat ini `1` |
| `revision` | Bilangan naik satu setiap perubahan yang diterima server |
| `resetId` | Identitas generasi progres; berubah saat reset dikonfirmasi |
| `deleted` | `true` hanya untuk penanda akun yang datanya sudah dihapus |
| `payload` | JSON progres lengkap; `null` setelah penghapusan akun |
| `updatedAt` | Timestamp server Firestore |

Payload memuat materi selesai, pengaturan pH, draf/riwayat diagnostik, draf/hasil asesmen termasuk salinan instrumen, serta catatan eksplorasi. Penyimpanan JSON mempertahankan format data lokal dan salinan hasil tanpa mengindeks seluruh isi asesmen. Pengecualian indeks diterapkan pada `payload`.

Satu dokumen memuat seluruh progres akun. Ukuran payload dibatasi **850.000 byte** oleh aplikasi, di bawah batas dokumen Firestore. Jika riwayat sangat panjang dan melebihi batas, aplikasi menampilkan kegagalan, mempertahankan progres lokal, dan menyediakan ekspor; riwayat tidak dipangkas diam-diam. Panel guru saat ini membaca progres lengkap akun untuk rekap kelas. Skema ini belum menyediakan arsip riwayat tanpa batas atau ringkasan server untuk kelas sangat besar.

## Pemulihan dan perubahan bersamaan

- Tamu tetap memakai `chemlab:guest:v1`. Akun memakai `chemlab:user:<UID>:v1`; antrean/base sinkronisasi memakai `chemlab:sync:<UID>:v1`. Data tamu tidak otomatis dipindahkan ke akun.
- Snapshot server dibaca sebelum penulisan pertama. Perangkat baru memulihkan data cloud; progres lokal akun lama diunggah jika dokumen cloud belum ada. Perubahan yang belum terkirim disimpan bersama base/revisi untuk dipulihkan setelah reload.
- Penulisan ditunda 700 ms setelah perubahan terakhir agar setiap gerakan slider/ketikan tidak langsung menjadi satu transaksi. Status tersimpan baru ditampilkan setelah konfirmasi server.
- Transaksi membaca ulang dokumen terbaru. Materi selesai digabung, hasil dengan ID berbeda dipertahankan, hasil yang sudah di server tidak ditimpa, serta perubahan jawaban/catatan yang berbeda digabung. Untuk field yang sama, perubahan yang dikomit terakhir menang. Draf baru dapat menggantikan draf aktif sebelumnya; hasil yang sudah dikumpulkan tetap tersimpan.
- Saat offline, aplikasi dapat dipakai setelah halaman termuat. Antrean menunggu koneksi dan dicoba kembali. Ini tidak membuat aplikasi menjadi PWA atau menjamin pembukaan pertama tanpa jaringan. Jika penyimpanan browser ditolak/penuh, gunakan ekspor sebelum menutup sesi.
- Reset berkonfirmasi membuat generasi baru pada akun aktif. Perangkat lain menerima reset; antrean lama tidak menghidupkan kembali hasil sebelum reset. Tamu dan akun lain tidak ikut direset.
- Menghapus akun meminta autentikasi ulang, menghentikan sinkronisasi, menghapus payload cloud, lalu menghapus identitas Auth. Dokumen kosong dengan `deleted: true` dipertahankan untuk menolak penulisan ulang dari perangkat yang masih terbuka. Penanda hanya menyimpan metadata revisi/waktu, tanpa catatan belajar. Salinan lokal pada perangkat lain tidak dapat dihapus dari jarak jauh ketika perangkat tersebut offline.

## Aturan akses

Siswa hanya boleh membaca dokumen milik UID yang sedang masuk. Email terverifikasi `wildannashihin@gmail.com` boleh membaca daftar profil/progres untuk panel guru, tanpa hak menulis hasil akun lain. Penulisan progres pemilik tetap harus memakai revisi berikutnya, metadata yang diizinkan, serta timestamp server. Tamu, siswa yang mengakses akun lain, field role/admin buatan, dan penghidupan kembali progres yang dihapus ditolak.

Nilai dihitung pada client dan tetap merupakan sarana belajar. Rules melindungi akses data; keaslian nilai untuk ujian formal tetap memerlukan validasi tambahan. Kontrak profil, hak baca guru, dan batas pengelolaan siswa dijelaskan pada [TEACHER_PANEL.md](TEACHER_PANEL.md).

## Menjalankan emulator dan pengujian

Prasyarat: Node.js sesuai `package.json`, Microsoft Edge pada Windows, dan **Java 21+** pada `PATH` untuk Firestore Emulator.

```powershell
npm.cmd run dev:emulator
```

Perintah tersebut memakai proyek `demo-chemlab`, Auth pada `127.0.0.1:9099`, Firestore pada `127.0.0.1:8080`, dan Vite pada port 5174. Aplikasi menghubungkan kedua emulator hanya pada mode development di host loopback. Jangan menjalankan pengujian fixture terhadap proyek produksi.

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build
```

`tests/browser/firestore.spec.js` memeriksa pemulihan pada browser baru, penggabungan perubahan offline, reset lintas perangkat, akses pemilik/tamu/akun lain, format penulisan, serta penghapusan dan penolakan pemulihan ulang data. Uji memanggil SDK dan emulator sesungguhnya. Hasil aktual ada di [TESTING.md](../TESTING.md).

Rujukan resmi: [transaksi](https://firebase.google.com/docs/firestore/manage-data/transactions), [listener realtime](https://firebase.google.com/docs/firestore/query-data/listen), [aturan akses](https://firebase.google.com/docs/firestore/security/rules-conditions), serta [batas Firestore](https://firebase.google.com/docs/firestore/quotas).
