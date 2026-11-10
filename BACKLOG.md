# Backlog dan keputusan lanjutan

## Selesai pada feat/chapter-assessment

- [x] Branch turunan `feat/material-updates` dengan bacaan lengkap tetap tersedia.
- [x] 15 soal akhir bab, skor per cakupan, dan pembahasan setelah konfirmasi pengumpulan.
- [x] Draf lokal, riwayat terpisah dari diagnostik, snapshot instrumen per hasil, serta ekspor/reset.
- [x] Uji hitungan, toleransi angka, migrasi data, alur browser, aksesibilitas, dan ponsel.
- [ ] Peninjauan pengajar terhadap kisi-kisi, bobot, tingkat kesulitan, dan penggunaan untuk penilaian formal.

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
- [ ] Integrasi Google login + satu provider database, hanya jika masuk tahap berikutnya.
- [ ] Riwayat milik akun, aturan satu guru, antrean terikat akun, logout/pergantian akun, uji akses negatif.
- [ ] Deployment dari repo dan pengujian URL produksi.
- [ ] Migrasi versi data dan impor ekspor tervalidasi jika dibutuhkan.
- [ ] Dukungan PWA untuk membuka ulang tanpa jaringan, bila dipilih sebagai fitur.

Demo lokal memenuhi ruang lingkup versi pertama. Capaian cloud dan deployment pada kurikulum tetap menjadi tahap pengembangan tersendiri.
