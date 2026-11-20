# Alur Pengguna

Isian USER_FLOW pada Lampiran A diterapkan pada menu dan perilaku ChemLab. Urutan di bawah memberi satu jalur yang dapat didemonstrasikan; siswa tetap bebas membuka materi atau diagnostik lebih dahulu.

## Alur inti

1. Pengguna membaca sasaran dan tujuan asam–basa/pH pada beranda.
2. Pengguna membuka Modul 1 melalui Materi belajar, lalu memilih **Kenali asam & basa**, **Membaca skala pH**, atau **Kimia di sekitar kita**.
3. Pengguna membaca materi, contoh hitung, dan representasi; menulis/menjawab refleksi serta menandai bacaan selesai. Untuk skala pH, pengguna membandingkan pH 3 dan 5 di Laboratorium pH.
4. Pengguna membuka Kuis diagnostik, memilih jawaban q1–q5, meninjau pilihan, dan mengumpulkan lima jawaban lengkap. Pilihan/ID draf disimpan selama pengerjaan.
5. Pengguna membaca skor, jawaban per soal, pembahasan, dan tindak lanjut ke bacaan/laboratorium. Diagnostik awal tetap terpisah dari latihan ulang dengan ID baru.
6. Pengguna membuka Progres saya untuk melihat materi, aktivitas lab, serta riwayat hasil; dapat mengekspor JSON atau meminta reset berkonfirmasi.
7. Pengguna dapat masuk dengan Google atau email/password. Pada ChemLab, hasil tamu tetap di ruang tamu; aktivitas yang dikerjakan sesudah masuk menggunakan progres UID akun tersebut. Belum ada pemilihan hasil tamu untuk dipindah.
8. Perubahan akun disimpan lokal dan diantrekan sebagai pemilik. Aplikasi membaca server sebelum menulis dan baru menampilkan **Progres tersimpan di akun** setelah konfirmasi server.
9. Siswa memulihkan riwayat/progres sendiri pada perangkat lain. Guru terverifikasi membuka Panel guru untuk membaca hasil akun tersinkron; akun siswa tidak dapat membaca data siswa lain.
10. Guru memilih diagnostik awal atau asesmen terbaru, melihat rekap/rincian jawaban dan catatan, menafsirkan kesulitan, lalu memilih tindak lanjut belajar. Contoh q2: pilihan rasio 2 ditindaklanjuti dengan perbandingan 10⁻³/10⁻⁵, bukan langsung menyimpulkan miskonsepsi tanpa alasan siswa.

## Keadaan lain

- Login batal/akun di luar daftar kelas: pembatalan mengembalikan alur masuk tanpa memindahkan progres. ChemLab belum mempunyai daftar anggota kelas; akun Auth boleh menyimpan progres sendiri. Hak guru tetap diperiksa terpisah.
- Hasil belum ada atau menunggu kirim: tampilkan kosong/belum mengumpulkan atau status menunggu; hasil yang belum diterima tidak dianggap skor nol pada rekap.
- Jaringan gagal/antrean bertahan setelah refresh: belajar dapat dilanjutkan setelah halaman dimuat; antrean tetap di ruang UID dan dicoba kembali. Izin/jaringan gagal tidak dianggap tersimpan.
- Pergantian akun dan hasil lokal belum terkirim: hentikan sesi/listener lama; muat key identitas baru. Logout kembali ke progres tamu. Antrean akun A tidak dikirim sebagai akun B.
- Akses panel ditolak: tamu diarahkan masuk; siswa biasa mendapat penjelasan akses khusus guru; email guru yang belum terverifikasi diarahkan memeriksa verifikasi. Rules tetap menolak pembacaan tanpa token yang sesuai.
- Progres lokal tidak tersedia/rusak: latihan dapat berjalan sementara dengan penjelasan batas simpan dan ekspor. Pemulihan skema inti yang gagal memulai progres baru dengan pemberitahuan; field asesmen memiliki pemulihan tersendiri.
- Reset dibatalkan: dialog ditutup dan data tetap ada. Reset dikonfirmasi: hanya identitas aktif diganti; reset tamu lokal, reset akun juga mengosongkan progres cloud/perangkat lain. Identitas lain tetap terpisah.
- Sumber eksternal gagal: pesan kegagalan, muat ulang/tab baru atau bacaan pendamping tersedia; siswa tetap dapat menyimpan catatan pengamatan sendiri.

## Jalur fitur kelompok

### Laboratorium pH

Menu Laboratorium pH → ubah slider/sampel → amati angka pH, klasifikasi, [H₃O⁺], [OH⁻], dan pOH → bandingkan dua kondisi → jelaskan. Model HCl hanya menawarkan tiga konsentrasi dalam rentang yang ditetapkan; kondisi 25 °C dan asumsi ideal menyertai interpretasi.

### Eksplorasi kimia

Menu Eksplorasi → pilih PhET/model molekul/PubChem → petunjuk pertama tab → Buka aktivitas atau pencarian → tulis prediksi, pengamatan, dan penjelasan → simpan catatan. Katalog lokal menyediakan 36 model; pencarian/filter tidak membuang pilihan atau catatan. Klik pada iframe PhET tidak dianggap jawaban yang otomatis terekam.

### Asesmen akhir bab

Menu/akhir bacaan ketiga → pengantar → mulai → jawab 15 soal → tinjau/lengkapi → konfirmasi → hasil per cakupan/pembahasan → riwayat atau ekspor → percobaan baru. Hasil membawa snapshot instrumen dan terpisah dari diagnostik; bacaan tidak dikunci oleh status selesai.

### Tur dan bantuan

Kunjungan pertama → sambutan → Materi → Laboratorium → Eksplorasi → Diagnostik → Asesmen → Progres. Di setiap langkah tersedia Kembali/Lanjut/Lewati/tutup/Escape. Tur menunda tampilan pada alur akun/guru dan mempertahankan halaman asal.

Kunjungan pertama tiap tab Eksplorasi → petunjuk tab setelah tur menutup, sebelum Buka aktivitas. Kendala berulang → saran kontekstual dengan jeda/kuota. Pengguna dapat menonaktifkan bantuan otomatis dan meminta petunjuk manual. **Panduan belajar → Ulangi semua petunjuk** mengulang tur/pengenalan tanpa reset progres; hard refresh/cache HTTP tetap menyimpan status localStorage. Ambang dan aturan lengkap ada pada [ONBOARDING.md](docs/ONBOARDING.md).

### Akun dan guru

Masuk/daftar → kelola profil/verifikasi/pemulihan → belajar sebagai UID → sinkronisasi. Menghapus akun meminta konfirmasi dan autentikasi ulang dengan provider yang sesuai; penghapusan tidak menghapus akun Google.

Guru terverifikasi → Panel guru → muat profil/progres dari server → rekap diagnostik pertama/asesmen terbaru → cari/filter → buka jawaban/catatan → ekspor JSON/CSV. Menutup panel, mengganti akun, atau logout membuang listener dan cache memori pembacaan kelas. Kontrak akses/rekap: [TEACHER_PANEL.md](docs/TEACHER_PANEL.md).
