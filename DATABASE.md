# Kontrak data — mode tamu lokal

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
