# Backlog dan keputusan lanjutan

## Model molekul dan katalog CID

- [x] Memperbaiki struktur kosong akibat parameter URL viewer publik yang tidak didukung.
- [x] 3Dmol.js lokal dengan model SDF 3D PubChem, status render, pesan WebGL/berkas gagal, serta kontrol keyboard.
- [x] 36 molekul dalam empat kelompok; pencarian nama Indonesia/Inggris, rumus, alias, dan CID.
- [x] Sumber dan integritas berkas terdokumentasi; pilihan CID tetap kompatibel dengan catatan/progres.

## Penyimpanan Firestore

- [x] Progres akun pada `learningProgress/{UID}` dengan pemulihan lintas perangkat dan antrean lokal.
- [x] Transaksi, penggabungan hasil stabil, reset lintas perangkat, dan penghapusan data akun.
- [x] Rules per pemilik dan pengujian nyata terhadap Auth/Firestore Emulator.
- [x] Rules/indeks produksi terpasang; sumber Rules, pengecualian indeks payload, konfigurasi Auth, domain lokal, dan koneksi baca diverifikasi. Empat belas simulasi Rules produksi termasuk akses guru lulus. Bukti: [firestore-production-check.json](docs/firestore-production-check.json).
- [x] Panel guru dengan hasil siswa nyata dan akses email terverifikasi yang disahkan Firestore Rules; rekap, rincian, filter, JSON/CSV, serta tampilan ponsel teruji.
- [ ] Pembagian kelas, guru tambahan, dan penilaian yang diverifikasi server untuk penggunaan formal.

## Selesai pada feat/chapter-assessment

- [x] Branch turunan `feat/material-updates` dengan bacaan lengkap tetap tersedia.
- [x] 15 soal akhir bab, skor per cakupan, dan pembahasan setelah konfirmasi pengumpulan.
- [x] Draf lokal, riwayat terpisah dari diagnostik, snapshot instrumen per hasil, serta ekspor/reset.
- [x] Uji hitungan, toleransi angka, migrasi data, alur browser, aksesibilitas, dan ponsel.
- [ ] Peninjauan pengajar terhadap kisi-kisi, bobot, tingkat kesulitan, dan penggunaan untuk penilaian formal.

## Selesai pada branch akun

- [x] Firebase Auth email/password, registrasi, verifikasi email, dan pemulihan password.
- [x] Login/registrasi Google, pilihan persistensi sesi, dan autentikasi ulang Google untuk hapus akun.
- [x] Profil, perubahan email terverifikasi, perubahan password dengan autentikasi ulang.
- [x] Logout, hapus akun berkonfirmasi, serta pemisahan progres browser per UID/tamu.
- [x] Pengujian terhadap Auth Emulator, bukan penyimpanan password lokal.
- [x] Konfigurasi Firebase produksi, provider Email/Password/Google, serta authorized domains lokal diverifikasi melalui API.
- [ ] Pengiriman email nyata dan interaksi OAuth pada domain hosting sebenarnya.

Daftar baseline di bawah dipertahankan sebagai konteks. Progres akun kini terhubung Firestore dan panel guru memakai data siswa tersinkron dengan hak baca terbatas.

## Selesai pada demo lokal

- [x] Beranda, tiga bagian materi, tujuan, refleksi, dan sumber.
- [x] Laboratorium pH, konsentrasi ion, pOH, contoh bahan, model HCl terbatas.
- [x] Lima soal diagnostik, validasi kelengkapan, pembahasan setelah pengumpulan.
- [x] Draf lokal stabil, percobaan ulang terpisah, riwayat dan progres.
- [x] Ekspor JSON dan reset berkonfirmasi.
- [x] Panel guru dengan data fiktif, agregat, interpretasi, filter, dan rincian.
- [x] Pencarian materi, responsivitas, akses keyboard, serta pengujian otomatis.

## Keputusan yang sudah diberikan pengajar

| Pilihan        | Keputusan                                      |
| -------------- | ---------------------------------------------- |
| Bentuk demo    | Contoh aplikasi pembelajaran kimia untuk siswa |
| Topik          | Asam–basa dan pH                               |
| Akun dan cloud | Lokal tanpa akun; panel guru data contoh       |

## Dapat diputuskan setelah mencoba demo

1. **Identitas dan jenjang:** pertahankan ChemLab/kelas XI atau pakai nama, logo, dan jenjang spesifik? Default sekarang: ChemLab, kelas XI.
2. **Strategi belajar:** apakah diagnostik awal harus wajib sebelum materi? Default sekarang: siswa bebas memilih urutan.
3. **Isi kuis:** pertahankan lima butir ini atau sesuaikan tujuan, konteks, serta istilah kurikulum sekolah? Perlu validasi isi oleh pengajar.
4. **Tahap cloud:** apakah versi berikutnya memakai Firebase sesuai jalur utama kuliah, atau Supabase? Belum dibuat karena versi lokal sudah dipilih.
5. **Publikasi:** repository dan hosting Vercel/Netlify mana yang akan dipakai? Belum ada publikasi atau pengiriman ke layanan luar.

## Pengembangan berikutnya, belum diimplementasikan

- [ ] Uji pengguna bersama mahasiswa; validasi ketepatan kimia dan keselarasan instrumen.
- [x] Integrasi database untuk progres akun serta aturan aksesnya; Rules/indeks produksi sudah terpasang dan diverifikasi.
- [ ] Riwayat milik akun, aturan satu guru, antrean terikat akun, logout/pergantian akun, uji akses negatif.
- [ ] Deployment dari repo dan pengujian URL produksi.
- [ ] Migrasi versi data dan impor ekspor tervalidasi jika dibutuhkan.
- [ ] Dukungan PWA untuk membuka ulang tanpa jaringan, bila dipilih sebagai fitur.

Demo lokal memenuhi ruang lingkup versi pertama. Capaian cloud dan deployment pada kurikulum tetap menjadi tahap pengembangan tersendiri.
