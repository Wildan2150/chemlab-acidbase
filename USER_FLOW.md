# Alur pengguna

## Siswa tamu

Beranda → kuis diagnostik awal (boleh sebelum materi) → pilih jawaban per butir → tinjau pilihan → kumpulkan lima jawaban → pembahasan dan tindak lanjut → materi/laboratorium → latihan ulang dengan ID baru → riwayat terpisah.

Jalur belajar lain: beranda → materi 01/02/03 → refleksi → tandai selesai → laboratorium pH → kuis → progres. Materi tidak dikunci; siswa bebas berpindah.

## Keberlanjutan lokal

Pilihan jawaban/perubahan aktivitas → state React → tulis penyimpanan browser → muat ulang → validasi skema dan versi → pulihkan draf, ID percobaan, progres, serta riwayat.

Storage ditolak → aktivitas berjalan dalam sesi → status menjelaskan batas penyimpanan → siswa dapat mengekspor JSON. Data rusak → sesi baru dengan pemberitahuan.

Progres → ekspor → unduh JSON. Progres → reset → dialog penjelasan → batal mempertahankan data / konfirmasi mengganti hanya data ChemLab dengan sesi baru.

## Guru, mode demonstrasi

Panel guru → baca label data fiktif → rekap enam siswa → konsep per butir → interpretasi dan tindak lanjut → cari/filter siswa → rincian lima jawaban → ekspor data contoh.

Tidak ada peralihan akun/role atau akses ke hasil nyata. Panel guru bukan batas keamanan dan hanya memuat data demonstrasi yang boleh dilihat publik.
