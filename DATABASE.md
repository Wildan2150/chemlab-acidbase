# Kontrak data — mode tamu lokal

## Integrasi pada main

Materi, diagnostik, asesmen akhir bab, dan catatan eksplorasi memakai satu objek progres per identitas. Field `activityNotes` menyimpan prediksi, pengamatan, penjelasan, pilihan molekul, serta waktu pencatatan per aktivitas; data lama tanpa field ini dipulihkan sebagai catatan kosong. Ekspor menyertakan kedua fitur tambahan. Reset berkonfirmasi menimpa progres identitas aktif saja, sehingga catatan tamu dan akun lain tetap tersimpan.

## Tambahan asesmen akhir bab

Progres memiliki field opsional `assessment: { draft, attempts }`. Draf mencatat UUID, versi asesmen, waktu, posisi, serta jawaban pilihan/angka. Hasil mencatat salinan instrumen dan domain, jawaban terkunci, skor, serta waktu selesai. Data lama tanpa field asesmen tetap valid. Pemulihan format asesmen dilakukan terpisah dari progres inti; riwayat yang valid dipertahankan jika ada entri rusak. Skor hasil lama diturunkan dari instrumen tersimpan, bukan bank aktif. Ekspor progres menyertakan asesmen; reset berkonfirmasi mengosongkannya. Kontrak lengkap: [CHAPTER_ASSESSMENT.md](docs/CHAPTER_ASSESSMENT.md).

## Tambahan branch akun

Firebase Auth mengelola identitas dan sesi, sedangkan kontrak progres di bawah tetap dipakai per browser. Tamu menggunakan `chemlab:guest:v1`; akun menggunakan `chemlab:user:<UID>:v1`. Memuat/menulis progres menerima key identitas aktif. State belajar di-remount saat UID berubah agar draf tidak tersalin ke akun lain. Logout kembali ke data tamu; penghapusan akun menghapus key milik UID yang dihapus pada browser itu saja. Profil/email/password dikelola SDK, bukan dimasukkan ke objek progres. Tidak ada database hasil cloud pada branch ini. Detail konfigurasi: [FIREBASE_AUTH_SETUP.md](docs/FIREBASE_AUTH_SETUP.md).

Belum ada database cloud. Key `chemlab:guest:v1` menyimpan satu objek JSON untuk origin aplikasi. Reset menimpa key ini saja, tanpa `localStorage.clear()`.

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

Ekspor progres membawa isi state, versi soal, dan waktu ekspor. Ekspor panel guru diberi `type: data-contoh-fiktif`. Tidak ada impor, transfer data tamu ke akun, atau sinkronisasi antar-tab/perangkat. Jangan memasukkan data sensitif ke contoh ini.

## Panel guru

`demoStudents` berasal dari `src/data/chemData.js`, bukan penyimpanan tamu. Semua kode dan identitas fiktif. Agregasi menggunakan satu hasil diagnostik per siswa; rerata 70 dan dua dari enam siswa memiliki skor <80. Ambang 80 hanya ilustrasi untuk tindak lanjut, bukan kriteria ketuntasan yang ditetapkan sekolah.
