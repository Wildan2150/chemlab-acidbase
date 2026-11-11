# Alur pengguna

## Kunjungan pertama dan tur fitur

Halaman belajar siap → sambutan → balon menunjuk Materi belajar → Laboratorium pH → Eksplorasi kimia → Kuis diagnostik → Asesmen akhir bab → Progres saya → selesai. Target menu disorot dan bagian lain diredupkan. Menu ponsel ditampilkan selama diperlukan. Tur mempertahankan halaman asal dan tidak mengubah progres.

Di langkah mana pun: Kembali / Lanjut / Lewati tur / tutup / Escape. Selesai dan dilewati diingat per browser. Tur fitur pada bar atas → mulai kembali. Panduan belajar → Ulangi semua petunjuk → reset status tur/bantuan saja → sambutan → petunjuk tiap aktivitas saat pertama dibuka lagi. Halaman akun, pemulihan, konfirmasi email, dan guru menunda tur sampai halaman belajar dibuka. Hard refresh/clear cache HTTP tidak mengganti status kunjungan.

## Bantuan dalam konteks

Kunjungan pertama ke setiap tab PhET/model molekul/PubChem → balon menunjuk tab yang aktif → petunjuk mulai memakai fitur → tombol menuju catatan atau pencarian. Tidak perlu menekan Buka aktivitas terlebih dahulu; iframe belum dimuat. Tur/panduan yang sedang terbuka menunda petunjuk aktivitas. Pergantian ke tab yang belum dikenal memunculkan petunjuknya tanpa menunggu jeda kendala berulang. Dua kali muat ulang simulasi → saran tab baru/bacaan pendamping. Dua kegagalan pencarian senyawa → saran nama Inggris dan koneksi.

Dua pencarian materi berbeda tanpa hasil → saran kata kunci → coba pH. Dua pengumpulan diagnostik/asesmen yang belum lengkap → petunjuk peta/ringkasan → menuju soal yang perlu dilengkapi. Saran tidak mengunci halaman atau memindahkan fokus secara otomatis.

Tutup saran → lanjut bekerja. Nonaktifkan bantuan otomatis → preferensi tersimpan. Panduan belajar → checkbox → aktifkan kembali. Petunjuk fitur ini pada tiap aktivitas Eksplorasi tetap bisa diminta manual. Aturan jeda dan batas saran ada di [ONBOARDING.md](docs/ONBOARDING.md).

## Siswa tamu

Beranda → kuis diagnostik awal (boleh sebelum materi) → pilih jawaban per butir → tinjau pilihan → kumpulkan lima jawaban → pembahasan dan tindak lanjut → materi/laboratorium → latihan ulang dengan ID baru → riwayat terpisah.

Jalur belajar lain: beranda → materi 01/02/03 → refleksi → tandai selesai → laboratorium pH → kuis → progres. Materi tidak dikunci; siswa bebas berpindah.

## Keberlanjutan lokal

Pilihan jawaban/perubahan aktivitas → state React → tulis penyimpanan browser → muat ulang → validasi skema dan versi → pulihkan draf, ID percobaan, progres, serta riwayat.

Storage ditolak → aktivitas berjalan dalam sesi → status menjelaskan batas penyimpanan → siswa dapat mengekspor JSON. Data rusak → sesi baru dengan pemberitahuan.

Progres → ekspor → unduh JSON. Progres → reset → dialog penjelasan → batal mempertahankan data / konfirmasi mengganti hanya data ChemLab dengan sesi baru.

## Guru dengan akun terverifikasi

Masuk dengan akun terverifikasi `wildannashihin@gmail.com` → menu **Panel guru** → muat profil dan progres siswa dari Firestore → pilih diagnostik awal atau asesmen terbaru → tinjau rekap per konsep → cari/filter siswa → buka riwayat jawaban dan catatan eksplorasi → ekspor JSON/CSV sesuai filter.

Tamu yang membuka tautan langsung diminta masuk. Akun biasa mendapat penjelasan akses khusus guru; akun guru yang belum terverifikasi diarahkan ke halaman akun untuk memeriksa email. Firestore Rules tetap memeriksa token Auth saat UI diubah atau API dipanggil langsung. Logout menutup panel, listener, dan cache memori pembacaan kelas.
