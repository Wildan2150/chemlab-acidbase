# AGENTS.md — Aturan Kerja Proyek ChemLab

Aturan 1–15 mengikuti urutan templat Lampiran A dan diisi untuk ChemLab. Ketentuan khusus di bawah menjaga perilaku fitur contoh yang sudah ada.

1. Gunakan React/Vite pada proyek ChemLab yang sudah ada; jangan membuat ulang aplikasi. Bahasa utama JavaScript dan CSS biasa.
2. Baca PRD, backlog, USER_FLOW, desain, dan kontrak data yang terkait sebelum mengedit. Dokumen pengarah memakai susunan Lampiran A dan berisi keputusan ChemLab yang nyata.
3. Kerjakan satu tugas/issue dengan perubahan terarah. Jelaskan berkas yang berubah, alasan, dan hasil yang perlu diperiksa.
4. Materi/soal berada di `src/data/`. Urutan belajar handout ialah simpan lokal pada Pertemuan 3, lalu satu provider akun/database pada Pertemuan 4. Provider ChemLab yang sudah dipilih adalah Firebase Auth/Firestore.
5. Pertahankan ID materi, versi instrumen, navigasi, diagnostik, asesmen, progres, fitur pilihan, dan reset sesuai kontrak di PRD/DATABASE.
6. Antrean terikat pemilik UID; ID percobaan tetap; simpan jawaban awal sebelum pembahasan. Percobaan ulang tidak menimpa diagnostik awal atau hasil asesmen yang dikumpulkan.
7. Database menolak tamu dan pembacaan/penulisan hasil akun lain oleh siswa; hanya satu guru terverifikasi boleh membaca data siswa. Profil/ruang siswa mengikuti DATABASE; jangan masukkan password atau hasil siswa ke repo/log.
8. Jangan membaca/menyalin `.env.local`, token sesi, atau kredensial ke jawaban, log, repo, maupun screenshot. Gunakan nama variabel dari `.env.example` saat menjelaskan konfigurasi.
9. Jangan memakai token admin, service-role key, service account, atau password database pada frontend.
10. Materi, notasi, satuan, kunci, pembahasan dan batas model harus ditelusuri ke sumber serta diperiksa manusia. Jangan mengklaim validasi pengajar telah selesai tanpa catatan aktual.
11. Gunakan HTML semantik, label, heading runtut, fokus terlihat, serta feedback yang tidak hanya memakai warna. Pertahankan akses keyboard dan tampilan ponsel.
12. Konten eksternal mempunyai sumber/atribusi dan alternatif ketika gagal. Interaksi di dalam iframe PhET tidak boleh diklaim otomatis terbaca.
13. Jangan commit, push, merge, menghapus riwayat, atau deploy otomatis tanpa instruksi eksplisit pelaksana yang berwenang.
14. Setelah mengedit, jelaskan diff, langkah uji, hasil aktual dan keterbatasan; catat pada AI_LOG/TESTING. Jangan mengarang PASS, checkpoint, kontribusi mahasiswa, atau verifikasi produksi.
15. Baca skill desain yang benar-benar dipilih dari path yang tersedia. Arah desain mengikuti PRD/kebutuhan belajar; jangan mengganti stack atau menambah layanan/dependency hanya untuk mengikuti contoh skill.

## Ketentuan khusus ChemLab

### Lingkup dan isi

- Ini aplikasi berbahasa Indonesia untuk asam–basa/pH. Jangan mengubah dokumen mata kuliah di luar `ProyekContoh` untuk perubahan contoh.
- `main` menggabungkan materi, diagnostik, asesmen, aktivitas, akun/cloud, serta panel guru. Jangan menjelaskan keadaan aktif sebagai versi lokal/data fiktif awal.
- Data dipisahkan: metadata/diagnostik `chemData.js`, bacaan `readingContent.js`, asesmen `chapterAssessment.js`, aktivitas `activities.js`, katalog `molecules.js`. Perhitungan/penyimpanan terpisah dari tampilan.
- Teks aplikasi berbicara langsung kepada siswa/guru. Konteks kuliah, contoh, dan implementasi berada pada dokumentasi, bukan banner/label di alur produk.

### Akun, progres, dan guru

- Progres akun disinkronkan per UID; tamu tetap lokal dan terpisah dari akun. Reset akun turut mereset progres cloud sesuai DATABASE; jangan mengubah kontrak ini diam-diam.
- Baca progres server sebelum menulis. Pertahankan antrean, revisi, generasi reset lintas perangkat, dan hasil asesmen. Status tersimpan hanya setelah konfirmasi server; kegagalan izin/jaringan tidak menghapus antrean.
- Guru hanya email terverifikasi `wildannashihin@gmail.com`. UI harus didampingi Rules dari token Auth; nama tampilan, profil client atau localStorage tidak memberi hak guru. Guru tidak menulis hasil akun lain.
- Panel membaca profil/progres akun tersinkron; jangan memasukkan siswa/hasil fiktif sebagai pengganti data produksi. Hak baca guru tidak sama dengan administrasi dashboard.
- Uji akun dan penyimpanan pada Auth/Firestore Emulator `demo-chemlab`; jangan membuat/menghapus pengguna produksi untuk fixture. Jangan mengklaim Rules terpasang atau produksi terverifikasi tanpa bukti.
- Google memakai Firebase SDK; pertahankan urutan persistensi local/session antar-tab. Akun khusus Google tidak diminta password ChemLab ketika dihapus; autentikasi ulang dengan provider sama dan konfirmasi tetap diperlukan.
- Jangan memakai `localStorage.clear()`. Perubahan bank diagnostik memerlukan keputusan versi dan migrasi/arsip sebelum diterbitkan. Rules yang berubah memerlukan uji pemilik, tamu, akun lain, dan guru.
- Asesmen mempunyai versi/snapshot instrumen sendiri. Hasil terkumpul tidak berubah ketika draf/bank aktif berubah; pemulihan field asesmen tidak menghapus progres inti yang masih valid.

### Model molekul dan bantuan

- Katalog memakai rekaman SDF 3D PubChem lokal dengan manifest sumber/checksum di `public/molecules/sources.json`. Periksa identitas/komposisi sebelum menambah CID. Jangan mengarang koordinat atau menyebut rekaman 2D sebagai 3D.
- Uji viewer memeriksa struktur yang benar-benar tergambar, bukan hanya iframe/canvas/HTTP 200.
- Tur memakai coachmark pada elemen nyata; statusnya terpisah dari progres dan menunggu alur akun selesai. Bantuan mengikuti ambang, jeda, kuota, dan nonaktifkan pada `docs/ONBOARDING.md`; waktu membaca saja bukan bukti kendala.
- Pengenalan tiap tab Eksplorasi muncul saat kunjungan pertama sebelum Buka aktivitas, setelah sambutan menutup. Kuota/jeda kendala tidak menahan pengenalan fitur baru.
- Pertahankan Ulangi semua petunjuk tanpa reset progres. Hard refresh/clear cache HTTP tidak menghapus status localStorage.

### Pemeriksaan dan dokumentasi

- Perubahan logika data/kuis menjalankan uji relevan. Sebelum menyerahkan perubahan aplikasi, jalankan build dan cek alur yang terkena.
- Perubahan dokumen diperiksa terhadap judul/urutan/isian Lampiran A, source aktual, kontrak fitur, tautan dan Markdown. Gunakan PRD, alur, desain, data, backlog, serta bukti uji sebagai satu rangkaian yang dapat ditelusuri mahasiswa.
- Riwayat pengembangan pengajar/agent tidak boleh diklaim sebagai kontribusi individual mahasiswa atau checkpoint pertemuan yang tidak pernah dibuat.
