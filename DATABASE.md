# Database Hasil Belajar — ChemLab

Isian DATABASE mengikuti Lampiran A dan menjelaskan kontrak data yang benar-benar dipakai ChemLab. Kontrak ini menghubungkan draf/jawaban pada [USER_FLOW](USER_FLOW.md), penyimpanan pada [DESAIN_TEKNIS](DESAIN_TEKNIS.md), dan laporan guru pada [PRD](PRD.md). Rincian layanan: [Firestore](docs/FIRESTORE_SETUP.md), [Auth](docs/FIREBASE_AUTH_SETUP.md), dan [panel guru](docs/TEACHER_PANEL.md).

## Lingkup dan pengelola

- Satu materi / label kelas / ID produk: Asam–Basa dan pH / satu ruang siswa ChemLab / namespace produk `chemlab`. Bagian bacaan ber-ID `kenali`, `skala`, `kehidupan`.
- Provider: **Firebase Auth + Cloud Firestore**, jalur Firebase pada handout; tidak memasang Supabase pada contoh ini.
- Nama/ID project dan pengelola: bukti lingkungan pengajar merujuk `chemlab-web`, database `(default)`; pengelolaan repo contoh berada pada akun GitHub Wildan2150. Hak admin dashboard tidak disimpulkan dari akun guru aplikasi. Latihan memakai project emulator `demo-chemlab`; kelompok membuat project sendiri.
- Akun guru tunggal dan cara penetapan: email `wildannashihin@gmail.com` harus terverifikasi, ditetapkan pada `src/lib/teacherAccess.js` serta fungsi `teacher()` di `firestore.rules`. Nama tampilan, profil client, dan localStorage tidak memberikan hak.
- Daftar ID siswa melalui dashboard: pada kontrak ChemLab saat ini tidak ada koleksi anggota kelas; ruang siswa mencakup seluruh akun aplikasi yang menyinkronkan profil/progres. Keputusan ini dicatat agar pembaca tidak mencari koleksi kelas yang belum dibuat.
- Penanggung jawab serah-terima/penghapusan: pengelola layanan masing-masing project; serah-terima kepada kelompok mahasiswa belum dicatat pada [TEAM.md](TEAM.md).

## Sumber data

- Materi, soal, tag konsep, kunci, dan pembahasan: `src/data/chemData.js`, `readingContent.js`, `chapterAssessment.js`; aktivitas/katalog pada `activities.js` dan `molecules.js`.
- Versi bank soal untuk riwayat: diagnostik aktif `asam-basa-v1`; asesmen `asam-basa-akhir-bab-v1` dengan snapshot instrumen per hasil. Arsip diagnostik lintas versi belum tersedia.
- Draf/jawaban/progres/antrean lokal: `chemlab:guest:v1`, `chemlab:user:<UID>:v1`, dan `chemlab:sync:<UID>:v1`; data tamu dan UID lain dipisahkan.
- Profil: `learnerProfiles/{UID}` memuat `displayName`, `email`, serta `updatedAt` timestamp server. Email sesuai token Auth; tidak ada password/token admin dalam profil atau progres.
- Riwayat: diagnostik di `attempts`; asesmen di `assessment.attempts`. Tiap percobaan mempunyai ID, jenis, versi, waktu, jawaban dan skor; diagnostik memuat rincian hasil per butir, asesmen memuat snapshot instrumen/domain.
- Progres cloud: seluruh objek progres disimpan pada `learningProgress/{UID}`. Riwayat berbentuk array hasil yang dibedakan ID, bukan satu skor terakhir yang menimpa semua percobaan.
- Perbedaan nama field dari contoh umum handout: UID pemilik ada pada path dokumen, pilihan diagnostik berupa indeks 0–3, jenis aktivitas terlihat dari lokasi array/`kind`, dan tidak ada `receivedAt` per hasil. `updatedAt` adalah waktu server memperbarui seluruh dokumen.

### Dokumen cloud dan payload progres

| Field `learningProgress/{UID}` | Isi |
| --- | --- |
| `version` | Versi dokumen cloud, saat ini 1 |
| `revision` | Bilangan naik setiap penulisan yang diterima |
| `resetId` | Identitas generasi progres; berubah saat reset dikonfirmasi |
| `deleted` | Penanda penghapusan akun yang mencegah penulisan ulang |
| `payload` | String JSON seluruh progres, atau null setelah penghapusan akun |
| `updatedAt` | Timestamp server untuk pembaruan dokumen |

Payload memuat `schemaVersion: 1`, `completedLessons`, `labVisited`, `ph`, `draft`, `attempts`, `assessment`, serta `activityNotes`. Draf diagnostik mempunyai `id`, `questionVersion`, `kind`, `startedAt`, dan `answers`. Catatan aktivitas menyimpan prediksi, pengamatan, penjelasan, pilihan molekul, dan waktu.

Contoh **ilustrasi jawaban**, bukan rekaman siswa atau bukti pengujian produksi: `answers: { q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 }` memperoleh 100 pada bank aktif. Pada q2, indeks 2 adalah “100 kali lebih besar”. Data itu dapat ditelusuri dari PRD → kuis → `chemistry.js` → riwayat → rekap guru.

Ukuran payload dibatasi aplikasi/Rules pada 850.000 byte. Payload dikecualikan dari indeks. Jika terlalu besar, tampilkan kegagalan, pertahankan lokal/antrean, dan tawarkan ekspor; jangan memangkas riwayat diam-diam.

## Akses dan aturan

- Tamu: belajar lokal dan tidak membaca/menulis cloud. Akun Auth: membuat/memperbarui progres sendiri dan membaca riwayat sendiri; belum ada pembatasan nonanggota kelas.
- Siswa yang meminta data UID lain atau daftar siswa ditolak oleh database. Guru terverifikasi boleh membaca profil/progres seluruh siswa aplikasi, tanpa menulis hasil akun lain.
- Profil pemilik harus memakai email yang sesuai token. Penulisan progres memeriksa field/tipe metadata, revisi berikutnya, ukuran payload, dan timestamp server.
- ID percobaan tetap mencegah duplikasi pada pengumpulan/merge aplikasi; hasil dengan ID yang sudah diterima dipertahankan oleh kebijakan transaksi.
- Batas keutuhan: Rules memeriksa kepemilikan dan metadata string payload, bukan jawaban di dalam JSON. Larangan siswa mengubah hasil lama belum ditegakkan sebagai aturan per record server. Skor client bukan nilai ujian terverifikasi server.
- Akun guru dan progres bertanda terhapus dikeluarkan dari rekap; hasil yang tidak terbaca ditandai untuk diperiksa, bukan diganti data fiktif atau nol.
- Password, service account, token admin, dan hasil siswa nyata tidak dimasukkan ke repo/log/screenshot.

## Sinkronisasi

- Kapan hasil tamu ditawarkan untuk dimasukkan ke akun: pada ChemLab belum ada penawaran/transfer. Login memuat ruang UID; logout mengembalikan ruang tamu. Ekspor JSON adalah salinan untuk dibaca, belum ada impor.
- Kapan antrean dicoba dan cara menjaga pemilik: perubahan akun disimpan bersama base/revisi dan dikirim sesudah baca server; debounce 700 ms; retry ketika koneksi pulih atau diminta. Pergantian identitas membuang sesi lama dan tidak mengirim antrean sebagai akun lain.
- Arti lokal / menunggu kirim / terkirim / gagal: tamu lokal; akun memuat/menunggu/menyimpan sampai transaksi dikonfirmasi; setelah itu **Progres tersimpan di akun**. Offline/izin gagal tetap mempertahankan perubahan dengan status yang sesuai.
- Penanganan refresh: draf/ID dan antrean UID dipulihkan. Server dibaca sebelum penulisan awal; perangkat baru memuat progres termasuk draf, riwayat, dan catatan.
- Perubahan bersamaan: transaksi membaca dokumen terbaru; materi/hasil ber-ID berbeda digabung. Field yang sama memakai perubahan yang dikomit terakhir. Draf aktif dapat diganti, hasil terkumpul dipertahankan oleh merge.
- Logout/perangkat bersama: hentikan sesi akun, kembali ke tamu; penyimpanan browser bukan enkripsi dan dapat diperiksa pada origin tersebut. Sesi akun mengikuti pilihan Ingat saya; ekspor/hapus data dilakukan secara sadar.
- Reset: konfirmasi tamu menimpa key tamu saja; konfirmasi akun membuat generasi baru dan mengosongkan progres cloud juga. Antrean sebelum reset tidak menghidupkan hasil lama; UID lain tidak ikut direset.
- Penghapusan akun: autentikasi ulang sesuai provider → hentikan sinkronisasi → kosongkan payload dengan tombstone `deleted: true` dan hapus profil → hapus identitas Auth/cache lokal yang bersangkutan. Salinan perangkat lain yang offline tidak dapat dihapus dari jauh.
- Storage/versi rusak: skema inti/versi diagnostik tidak cocok memulai progres baru dengan pemberitahuan. Field asesmen dipulihkan tersendiri dan hasil valid dipertahankan bila kerusakannya terbatas pada field itu. Jangan mengganti bank diagnostik tanpa rancangan arsip/migrasi.

## Konfigurasi dan hasil uji

- Nama variabel tanpa nilai: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIRESTORE_DATABASE_ID`, `VITE_FIREBASE_USE_EMULATOR`. Nama/default nonrahasia ada di `.env.example`; nilai client diperoleh dari pengelola project sendiri.
- Domain login/redirect: domain lokal dan hosting harus diizinkan pada Firebase Auth. URL tindakan akun mengikuti origin/path aplikasi. Pada produksi, konfigurasi emulator aktif menonaktifkan layanan akun meskipun build dapat berhasil.
- Identitas aturan/policy: source `firestore.rules` dan `firestore.indexes.json`. Bukti 10 November mencatat pemasangan pada project pengajar; tidak berarti project kelompok atau domain hosting baru sudah diuji.
- Acuan pemeriksaan terbaru: source aplikasi `c26d58c`, Windows/Edge, Node 24.20.0, Java 21.0.13, Auth/Firestore Emulator `demo-chemlab`, Codex, 20 November 2026. Rincian lengkap pada [TESTING.md](TESTING.md).

| Lingkungan/commit/penguji | Skenario | Aktual/bukti | Status/issue |
| --- | --- | --- | --- |
| Emulator / `c26d58c` / Codex | Siswa A simpan/baca progres sendiri | Suite akun/Firestore memulihkan jawaban, bacaan, asesmen, dan catatan | PASS, 20 November |
| Emulator / `c26d58c` / Codex | Siswa A meminta progres B | Akses pemilik lain ditolak oleh Rules | PASS, 20 November |
| Emulator / `c26d58c` / Codex | Guru membaca jawaban dan ringkasan | Fixture tersinkron terbaca, rekap/filter/ekspor cocok | PASS, 20 November |
| Emulator / `c26d58c` / Codex | Tamu mengakses cloud | Permintaan tanpa Auth ditolak | PASS, 20 November; pembatasan anggota bukan bagian skema contoh |
| Emulator / `c26d58c` / Codex | Offline, refresh, pulih, kirim ulang | Antrean UID/merge/reset lintas perangkat bekerja | PASS, 20 November |
| Hosting produksi | Siswa/guru pada URL rilis | Identitas URL/deployment belum dicatat | BELUM DIUJI, REL-01 |

## Batas dan tindak lanjut

- Skor dan kunci client dapat diperiksa/diubah; guru mencocokkan bukti jawaban dan versi instrumen. Penilaian formal memerlukan validasi tambahan.
- ChemLab belum mempunyai daftar anggota kelas, pemilihan hasil tamu, penyimpanan per percobaan yang immutable di server, impor, atau arsip diagnostik lintas versi. Ini menjelaskan batas kontrak contoh; perluasan memerlukan keputusan desain tersendiri.
- Pembukaan pertama offline dan ujian khusus belum didukung; sinkron draf lintas perangkat sudah menjadi bagian progres akun ChemLab.
- Waktu retensi data layanan belum ditetapkan pada dokumen ini. Pada perangkat bersama, jelaskan sesi dan penyimpanan lokal; gunakan ekspor serta penghapusan akun/data latihan dengan persetujuan dan prosedur pengelola.
- Guru tidak mempunyai administrasi banyak kelas atau penghapusan hasil akun lain. Pemakaian pada siswa sekolah memerlukan validasi/izin dan prosedur penelitian yang sesuai.
