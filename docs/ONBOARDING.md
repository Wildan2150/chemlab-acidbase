# Onboarding dan bantuan kontekstual ChemLab

## Tujuan dan pola interaksi

Pengguna baru perlu menemukan fitur, memahami kapan memakai diagnostik dan asesmen, serta mengetahui cara menyimpan pekerjaan. Referensi visual dari pengajar adalah tur dengan **coachmark**: balon petunjuk menunjuk elemen antarmuka yang diterangkan. Implementasi mengikuti pola tersebut dengan tema ChemLab.

Ada dua lapisan yang saling melengkapi:

1. **Tur pengenalan / guided product tour**: sambutan pada kunjungan pertama, diikuti sorotan pada menu yang sebenarnya. Urutannya materi, laboratorium pH, eksplorasi, diagnostik, asesmen, dan progres; total tujuh langkah termasuk sambutan.
2. **Contextual / behavior-triggered onboarding**: petunjuk pada kunjungan pertama ke masing-masing aktivitas Eksplorasi, serta saran setelah kendala berulang. Petunjuk pertama menunjuk tab aktivitas yang sedang dibuka; petunjuk manual PhET/molekul menunjuk kontrolnya. Pencarian dan pengumpulan jawaban memakai saran di area pekerjaan. Bantuan ini tidak mengunci halaman.

## Perilaku tur pertama

- Muncul setelah sesi akun siap dan halaman belajar tersedia. Halaman masuk, daftar, pemulihan, konfirmasi akun, akun, panel guru, dan rute tidak dikenal menunda tur otomatis.
- Sorotan menunjuk elemen menu yang sedang dijelaskan. Navigasi ponsel ditampilkan selama langkah yang menyorot menu; posisi balon dihitung ulang saat viewport, ukuran isi, atau posisi gulir berubah. Target yang tidak tersedia memakai kartu tengah sebagai fallback.
- Tur tidak mengunjungi halaman lain, membuka iframe, menandai materi selesai, menjawab soal, atau mengubah progres. Tautan tujuan awal pengguna dipertahankan.
- **Lanjut**, **Kembali**, nomor langkah, **Lewati tur**, tombol tutup, klik area redup, dan Escape tersedia. Tidak ada perpindahan otomatis berbasis waktu.
- Selesai maupun melewati tur mencegah kemunculan otomatis berikutnya pada origin browser yang sama. **Tur fitur** dan **Kenali ruang belajarmu** memulai kembali dari sambutan. **Ulangi semua petunjuk** pada Panduan belajar juga mereset status petunjuk aktivitas dan mengaktifkan kembali bantuan otomatis, sambil mempertahankan progres belajar.
- Teks penyimpanan membedakan tamu, akun, dan storage tidak tersedia. Catatan tamu tidak diklaim berpindah ke akun.

## Aturan bantuan otomatis

| Konteks           | Sinyal yang diamati                                                                                            | Bantuan dan tindakan                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Pencarian materi  | Dua kata kunci berbeda tanpa hasil, masing-masing minimal tiga karakter dan stabil 1,5 detik saat tab terlihat | Saran kata singkat; tombol mencoba pH pada pencarian yang sama                                                    |
| Diagnostik        | Dua kali mencoba menyelesaikan kuis dengan jawaban kosong                                                      | Cara memakai peta pertanyaan; menuju soal yang belum dijawab                                                      |
| Asesmen akhir bab | Dua kali mencoba mengumpulkan jawaban belum lengkap/valid                                                      | Cara memakai ringkasan dan format angka; kembali ke soal yang perlu dilengkapi                                    |
| Simulasi PhET     | Pertama kali membuka Eksplorasi atau tab asam kuat/lemah, sebelum Buka aktivitas ditekan                       | Cara memuat simulasi, Introduction → perbandingan asam → My Solution → catatan pengamatan; tombol menuju Prediksi |
| Simulasi PhET     | Dua kali menekan Muat ulang aktivitas                                                                          | Pilihan tab baru dan bacaan pendamping; tombol membuka bacaan                                                     |
| Model molekul     | Pertama kali membuka tab model molekul, sebelum Buka aktivitas ditekan                                         | Pemilihan molekul, rotasi, zoom, kontrol keyboard, dan batas penafsiran struktur; tombol menuju Prediksi          |
| PubChem           | Pertama kali membuka tab data senyawa                                                                          | Cara mencari, memakai contoh, memeriksa CID/rumus/massa molar, dan mencatat hasil; tombol menuju pencarian        |
| PubChem           | Dua permintaan pencarian gagal                                                                                 | Nama senyawa Inggris, contoh tersedia, koneksi, dan bacaan pendamping                                             |

Sinyal adalah petunjuk kebutuhan bantuan, bukan kesimpulan tentang kondisi psikologis pengguna. Waktu membaca, gerakan mouse, isi catatan, dan lamanya membuka halaman tidak dipakai untuk menebak kebingungan. ChemLab tidak membaca interaksi atau DOM simulasi PhET lintas origin dan tidak mengklaim mengetahui apakah pengguna sudah menjalankan eksperimen. Pengulangan muat ulang diamati melalui tombol ChemLab sendiri; itu tidak membuktikan iframe gagal.

## Kendali pengguna dan pembatasan gangguan

- Saran setelah kendala berulang dibatasi satu kali per topik per sesi, jeda global minimal **60 detik**, dan paling banyak **tiga** saran per sesi. Ambang tercapai selama jeda tidak menjadwalkan popup tertunda; diperlukan sinyal baru setelah jeda.
- Petunjuk pertama **PhET, molekul, dan PubChem** dipicu oleh kunjungan ke tab dan diingat per browser. Petunjuk ini tidak memakai kuota/jeda kendala berulang, sehingga berpindah ke aktivitas baru tidak kehilangan pengenalan fitur. Pilihan menonaktifkan bantuan tetap dihormati.
- Jika tur sambutan, panduan, atau menu ponsel sedang terbuka, pengenalan aktivitas menunggu hingga antarmuka siap. Status sudah dilihat tidak ditulis sebelum petunjuk dapat ditampilkan. Petunjuk pertama menunjuk tab yang terlihat di bagian atas, agar tidak tersembunyi pada kontrol yang berada di bawah layar ponsel. Iframe tidak dimuat otomatis oleh petunjuk.
- Jika pemulihan posisi gulir menempatkan tab di luar viewport, pengenalan pertama membawa tab itu ke layar tanpa mengambil fokus. Berpindah halaman menutup saran aktif; kembali ke aktivitas yang sudah dikenalkan tidak memunculkan saran lama lagi.
- Saran tidak memindahkan fokus. Pengguna memilih sendiri tindakan yang memindahkan fokus ke input, soal, atau bacaan. Tutup mengembalikan fokus ke kontrol terkait; Escape juga menutup saran.
- Balon simulasi mengikuti kontrol tanpa meredupkan atau mengunci layar. Ketika kontrol berada di luar viewport, balon disembunyikan sampai kontrol kembali terlihat. Permintaan manual boleh menggulir ke kontrolnya.
- **Nonaktifkan bantuan otomatis** tersedia di saran. Preferensi juga dapat diubah melalui checkbox pada **Panduan belajar**. Menonaktifkan tidak menutup akses **Petunjuk fitur ini** pada ketiga aktivitas Eksplorasi.
- Berhasil menemukan materi, memilih jawaban diagnostik, mengubah jawaban asesmen, atau berhasil mencari PubChem membersihkan sinyal kendala terkait. Menutup bantuan tidak menampilkan topik otomatis yang sama lagi dalam sesi itu.

## Penyimpanan dan arsitektur

| Data                                                         | Lokasi                       | Masa berlaku                                               |
| ------------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------- |
| Tur `completed` / `skipped`                                  | `chemlab:onboarding:v1`      | Origin browser; terpisah dari UID dan progres              |
| Preferensi `enabled` dan daftar topik pertama `seen`         | `chemlab:contextual-help:v1` | Origin browser; tidak disinkronkan ke Firestore            |
| Penghitung sinyal, deduplikasi pencarian, waktu/jumlah saran | Memori provider React        | Sampai dokumen dimuat ulang; tetap berlaku saat ganti akun |

Tidak ada analitik, rekaman sesi, pengiriman sinyal, atau dependency baru. Kata pencarian hanya dipakai sementara untuk mencegah satu pencarian dihitung berulang; tidak ditulis ke preferensi. Kunci UI tidak masuk ekspor progres dan tidak dihapus oleh reset progres. Jangan memakai `localStorage.clear()` untuk mencoba tur.

**Hard refresh dan penghapusan cache HTTP tidak menghapus `localStorage`.** Status sudah dilihat tetap ada setelah reload, sebagaimana penyimpanan lintas sesi pada [dokumentasi localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Untuk menguji dari awal secara aman, buka **Panduan belajar → Ulangi semua petunjuk**. Tombol itu mereset hanya status tur/bantuan, mengaktifkan kembali bantuan, lalu membuka sambutan. Setelah selesai/melewati sambutan, petunjuk aktivitas yang sedang dibuka langsung muncul; aktivitas lain diperkenalkan saat pertama dikunjungi lagi. Jawaban, catatan, akun, dan preferensi browser lain tetap ada. Alternatifnya gunakan profil browser baru atau jendela privat baru.

Jika storage ditolak/rusak, aplikasi tetap bisa dipakai. Melewati tur dan pilihan bantuan tetap berlaku dalam memori sampai reload; setelah reload preferensi yang tidak berhasil disimpan tidak dapat dipulihkan. Pengguna dapat menutup saran atau meminta bantuan manual kapan pun.

Implementasi:

- `src/components/OnboardingTour.jsx`, `Dialog.jsx`: tur, native modal, sorotan SVG, dan fokus.
- `src/hooks/useCoachmark.js`: posisi target, balon, resize, dan scroll.
- `src/components/ContextualHint.jsx`: bantuan dalam konteks dan native Popover API nonmodal untuk simulasi.
- `src/data/contextualHelp.js`: salinan petunjuk, target, serta ambang per topik.
- `src/lib/contextualHelp.js`: aturan murni, pembatasan gangguan, dan pemulihan preferensi.
- `src/contexts/ContextualHelpContext.jsx`: sesi bantuan yang bertahan saat akun berganti.
- `src/lib/onboarding.js`: status tur dengan fallback memori.

## Contoh keputusan UI/UX untuk mahasiswa

Tur memperlihatkan lokasi fitur di antarmuka nyata dan membagi informasi menjadi langkah pendek. Saran lanjutan muncul ketika ada tindakan yang relevan dan menyebutkan langkah konkret yang dapat dicoba. Pengguna dapat melewati tur, memanggil petunjuk, dan menonaktifkan bantuan tanpa kehilangan pekerjaan. Desain ini menjadi contoh penerapan progressive disclosure, kendali pengguna, pencegahan gangguan, serta pemulihan dari kesalahan.

Target aksesibilitas tetap mengikuti DESAIN_TEKNIS: nama dialog, urutan fokus, Tab/Shift+Tab, Escape, nama tombol, kontras, teks yang mendampingi sorotan, kontrol sentuh minimal 44 piksel, dan isi yang dapat digulir pada layar kecil. Pengujian otomatis tidak menggantikan uji pengguna, pembaca layar, dan perangkat fisik. Hasil aktual serta pratinjau dicatat di [TESTING.md](../TESTING.md).

Pratinjau: [tur desktop](preview-tour-desktop.png), [tur ponsel](preview-tour-mobile.png), [bantuan PhET desktop](preview-contextual-help-desktop.png), dan [bantuan PhET ponsel](preview-contextual-help-mobile.png).
