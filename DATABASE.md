# Kontrak data — progres lokal dan Firestore

## Penyimpanan akun di Firestore

Progres akun disimpan pada `learningProgress/{UID}` di proyek yang sama dengan Firebase Auth, dengan database `(default)` kecuali `VITE_FIRESTORE_DATABASE_ID` diisi. Dokumen memuat `version`, `revision`, `resetId`, `deleted`, `payload` JSON, dan `updatedAt` timestamp server. Payload memakai kontrak progres di bawah, termasuk snapshot hasil asesmen. Skema, batas 850.000 byte, aturan akses, antrean, kebijakan perubahan bersamaan, serta pemasangan Rules dijelaskan di [FIRESTORE_SETUP.md](docs/FIRESTORE_SETUP.md).

Cloud dibaca sebelum penulisan pertama. Snapshot akun dipulihkan pada perangkat baru; perubahan lokal yang belum dikirim digabung lewat transaksi. Reset berkonfirmasi membuat generasi baru agar antrean dari sebelum reset tidak menghidupkan kembali hasil lama. Penghapusan akun mengosongkan payload dan menutup penulisan selanjutnya melalui penanda `deleted`, sebelum identitas Auth dihapus.

## Integrasi pada main

Materi, diagnostik, asesmen akhir bab, dan catatan eksplorasi memakai satu objek progres per identitas. Field `activityNotes` menyimpan prediksi, pengamatan, penjelasan, pilihan molekul, serta waktu pencatatan per aktivitas; data lama tanpa field ini dipulihkan sebagai catatan kosong. Ekspor menyertakan kedua fitur tambahan. Reset berkonfirmasi menimpa progres identitas aktif saja, sehingga catatan tamu dan akun lain tetap tersimpan.

## Tambahan asesmen akhir bab

Progres memiliki field opsional `assessment: { draft, attempts }`. Draf mencatat UUID, versi asesmen, waktu, posisi, serta jawaban pilihan/angka. Hasil mencatat salinan instrumen dan domain, jawaban terkunci, skor, serta waktu selesai. Data lama tanpa field asesmen tetap valid. Pemulihan format asesmen dilakukan terpisah dari progres inti; riwayat yang valid dipertahankan jika ada entri rusak. Skor hasil lama diturunkan dari instrumen tersimpan, bukan bank aktif. Ekspor progres menyertakan asesmen; reset berkonfirmasi mengosongkannya. Kontrak lengkap: [CHAPTER_ASSESSMENT.md](docs/CHAPTER_ASSESSMENT.md).

## Tambahan branch akun

Firebase Auth mengelola identitas dan sesi. Tamu menggunakan `chemlab:guest:v1`; salinan akun menggunakan `chemlab:user:<UID>:v1` dan antrean memakai `chemlab:sync:<UID>:v1`. State belajar di-remount saat UID berubah agar draf tidak tersalin ke akun lain. Logout kembali ke data tamu. Profil/email/password dikelola SDK, bukan dimasukkan ke objek progres. Detail akun: [FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md).

Key `chemlab:guest:v1` menyimpan satu objek JSON untuk tamu pada origin aplikasi. Reset tamu menimpa key ini saja, tanpa `localStorage.clear()`. Reset akun juga disinkronkan ke Firestore, tanpa memengaruhi tamu atau UID lain.

```text
schemaVersion: 1
completedLessons: array ID materi unik
labVisited: boolean; true setelah input pH/model HCl diubah
ph: angka 0–14
draft:
  id: UUID stabil sepanjang satu percobaan
  questionVersion: asam-basa-v1
  kind: diagnostic | practice
  startedAt: ISO timestamp
  answers: { q1: selectedIndex, ... }  # 0–3; boleh belum lengkap
attempts: array hasil lengkap
  id, questionVersion, kind, startedAt, completedAt
  answers: salinan lima jawaban
  items: { questionId, concept, selectedIndex, correctIndex, isCorrect }[]
  score: jumlah tepat × 20
```

Percobaan disimpan hanya setelah lima butir lengkap. Pengumpulan ID yang sama tidak menambah hasil duplikat. Latihan baru memakai UUID dan `kind: practice`, tanpa mengubah diagnostik awal. Timestamp disimpan ISO dan ditampilkan sebagai WIB.

Pemulihan memeriksa skema, ID materi, ID/versi draf, waktu, tipe data, rentang opsi, hasil lengkap, dan duplikasi ID. Skor/item diturunkan kembali dari bank soal versi aktif. JSON rusak atau skema/versi tidak cocok memulai sesi baru dengan pemberitahuan. Versi ini belum mempunyai migrasi data; jangan gunakan kebijakan ini untuk hasil siswa nyata tanpa rancangan migrasi.

Ekspor progres membawa isi state, versi soal, dan waktu ekspor. Ekspor JSON panel guru memakai `type: hasil-belajar-siswa` dan mengikuti pencarian/filter, dengan pilihan CSV untuk rekap. Tidak ada impor atau transfer otomatis data tamu ke akun. Sinkronisasi antar-tab/perangkat hanya tersedia untuk akun yang sama melalui Firestore.

## Panel guru

Panel membaca `learningProgress/{UID}` dan `learnerProfiles/{UID}` dari Firestore. Profil memuat `displayName`, `email`, serta `updatedAt` timestamp server; pengguna hanya dapat menyimpan profil miliknya dengan email yang sama seperti token Auth. Penghapusan akun juga menghapus profil tersebut dan penanda penghapusan progres mencegah profil dihidupkan kembali.

Hanya token Auth dengan email terverifikasi `wildannashihin@gmail.com` yang boleh membaca daftar profil/progres. Siswa tetap hanya dapat membaca/menulis data sendiri. Guru membaca hasil siswa tanpa hak mengubahnya. Sesi pembacaan kelas memakai cache memori terpisah yang dibuang saat keluar dari panel.

Rekap memakai diagnostik awal pertama atau asesmen terbaru per siswa. Belum mengumpulkan dan catatan tidak terbaca tidak dihitung sebagai skor nol. Ambang pendampingan dapat diubah guru. Akun guru dan progres terhapus dikeluarkan dari daftar. Kontrak akses, rincian, dan migrasi profil ada di [TEACHER_PANEL.md](docs/TEACHER_PANEL.md). `demoStudents` hanya tersisa sebagai fixture uji logika lama, bukan sumber data panel.
