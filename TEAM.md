# TEAM — ChemLab (Contoh Pengajar)

Dokumen mengikuti isian TEAM pada Lampiran A. Pelaksana yang dicatat adalah pelaksana contoh pengajar; nama anggota/kontribusi mahasiswa tidak direka.

## Proyek bersama

- Nama media: ChemLab — pembelajaran asam–basa dan pH untuk siswa kelas XI.
- Repo: [Wildan2150/chemlab-acidbase](https://github.com/Wildan2150/chemlab-acidbase).
- Baseline Pertemuan 1 yang dipilih: aplikasi lokal awal ChemLab pada 7 November 2026. Ini riwayat contoh pengajar, bukan klaim seleksi beranda dari kelompok mahasiswa.
- Alasan pemilihan: hubungan materi–representasi–diagnostik dapat dijelaskan pada satu topik dan dikembangkan bertahap ke progres akun serta panel guru.
- Dokumen kebutuhan: [PRD.md](PRD.md); perjalanan pengguna: [USER_FLOW.md](USER_FLOW.md).

## Anggota dan peran

| Anggota/username | Peran sesi ini | Issue/branch | Reviewer | Bukti kontribusi |
| --- | --- | --- | --- | --- |
| Pengajar/pemilik repo Wildan2150 | Menetapkan masalah, cakupan, perilaku dan arah contoh | Arahan pengembangan ChemLab; revisi dokumen pada working tree | Validasi isi akhir belum dicatat selesai | Keputusan di PRD dan arahan yang dicatat pada AI_LOG |
| Codex | Mengimplementasikan, mendokumentasikan dan memeriksa perubahan sesuai tugas | Riwayat branch materi/asesmen/aktivitas/akun; source acuan `c26d58c` | Pemeriksaan teknis tercatat; tidak diklaim sebagai review mahasiswa | [AI_LOG.md](AI_LOG.md), [TESTING.md](TESTING.md), riwayat Git |
| Mahasiswa | Belum menjadi anggota pelaksana contoh ini | Belum ada issue/branch mahasiswa yang dicatat | Belum ditetapkan | Tidak ada kontribusi mahasiswa yang diklaim |

## Kesepakatan

- Setiap pelaksana menggunakan akun sendiri; password layanan tidak dibagikan.
- Pada proyek kelompok mahasiswa, fitur dikerjakan pada branch dan direview sebelum merge; `main` diuji sesudah integrasi. Pekerjaan Git dapat memakai Source Control IDE sebagaimana Lampiran E.
- Peran pengarah, kurator kimia, pengembang, dan penguji dapat dirotasi pada tiap pertemuan. Tabel peran diisi ulang berdasarkan pekerjaan nyata.
- Kontribusi kode, konten, dokumentasi, review, dan QA mempunyai bukti; jumlah commit saja tidak menggambarkan kontribusi.
- Skill/referensi desain harus dicatat bila dipakai. ChemLab mempertahankan tema hijau, JavaScript/CSS biasa, serta ketentuan aksesibilitas pada PRD.
- Pengembangan contoh pengajar tidak dicatat seolah-olah telah mengikuti pembagian tujuh pertemuan mahasiswa. Repo ini memperlihatkan bentuk dokumen yang diisi, sementara riwayat tetap berdasarkan kejadian sebenarnya.

## Akses layanan dan pemeliharaan

- Pengelola repo: pemilik repo GitHub `Wildan2150`; akses anggota melalui undangan layanan.
- Pengelola dashboard database/hosting: project historis Firebase `chemlab-web` adalah lingkungan pengajar. Identitas pengelola/serah-terima dashboard hosting belum dicatat pada repo.
- Akun guru aplikasi: email terverifikasi `wildannashihin@gmail.com`, diperiksa oleh UI dan Firestore Rules. Hak guru aplikasi adalah membaca hasil; bukan hak admin dashboard.
- Cara memberi akses/serah-terima tanpa berbagi password: gunakan undangan GitHub/Firebase/hosting sesuai peran, dokumentasikan pemilik serta ruang akses, dan sediakan konfigurasi client melalui pengelola project; bukan menyalin kredensial ke repo.
- Penanggung jawab setelah kelas: belum ada serah-terima kepada kelompok mahasiswa yang dicatat; tetap berada pada pengelolaan contoh pengajar.
- Untuk replikasi kelompok, gunakan project sendiri atau emulator `demo-chemlab`, tetapkan pengelola, dan isi tanggung jawab pemeliharaan dengan keputusan kelompok yang nyata.
