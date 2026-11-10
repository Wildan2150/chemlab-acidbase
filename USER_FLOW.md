# Alur pengguna

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
