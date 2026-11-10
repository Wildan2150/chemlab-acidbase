export const readingSources = [
  {
    id: 'arrhenius',
    title: 'OpenStax Chemistry 2e · 4.2 Classifying Chemical Reactions',
    url: 'https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions',
  },
  {
    id: 'proton',
    title: 'OpenStax Chemistry 2e · 14.1 Brønsted–Lowry Acids and Bases',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-1-bronsted-lowry-acids-and-bases',
  },
  {
    id: 'lewis',
    title: 'OpenStax Chemistry 2e · 15.2 Lewis Acids and Bases',
    url: 'https://openstax.org/books/chemistry-2e/pages/15-2-lewis-acids-and-bases',
  },
  {
    id: 'ph',
    title: 'OpenStax Chemistry 2e · 14.2 pH and pOH',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh',
  },
  {
    id: 'strength',
    title: 'OpenStax Chemistry 2e · 14.3 Relative Strengths of Acids and Bases',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases',
  },
  {
    id: 'salts',
    title: 'OpenStax Chemistry 2e · 14.4 Hydrolysis of Salts',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-4-hydrolysis-of-salts',
  },
  {
    id: 'polyprotic',
    title: 'OpenStax Chemistry 2e · 14.5 Polyprotic Acids',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-5-polyprotic-acids',
  },
  {
    id: 'buffer',
    title: 'OpenStax Chemistry 2e · 14.6 Buffers',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-6-buffers',
  },
  {
    id: 'titration',
    title: 'OpenStax Chemistry 2e · 14.7 Acid-Base Titrations',
    url: 'https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations',
  },
  {
    id: 'molarity',
    title: 'OpenStax Chemistry 2e · 3.3 Molarity',
    url: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity',
  },
  {
    id: 'equilibrium',
    title: 'OpenStax Chemistry 2e · 13.3 Le Châtelier’s Principle',
    url: 'https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle',
  },
];

// Naskah dan soal refleksi disusun dalam bahasa Indonesia; bukan salinan bab sumber.
export const readingContent = {
  kenali: {
    duration: '20 menit',
    objective:
      'Membandingkan tiga teori asam–basa, menentukan pasangan konjugasi, dan menjelaskan kekuatan asam/basa melalui kesetimbangan ionisasi.',
    prerequisites: ['Rumus dan muatan ion', 'Persamaan reaksi setara', 'Konsentrasi dalam mol/L'],
    keyPoints: [
      'Pilih teori sesuai reaksi yang sedang dibahas.',
      'Pasangan konjugasi berbeda tepat satu proton.',
      'Kekuatan, konsentrasi, dan jumlah proton terionisasi adalah tiga hal berbeda.',
    ],
    sections: [
      {
        title: 'Mengamati larutan, menjelaskan partikel',
        sourceIds: ['arrhenius'],
        paragraphs: [
          'Sari lemon dan larutan sabun memperlihatkan sifat berbeda ketika diuji dengan indikator. Pengamatan seperti perubahan warna menjadi bukti makroskopis. Untuk menjelaskannya, kita memakai model partikel dan persamaan reaksi, bukan menyimpulkan sifat zat hanya dari nama atau keberadaan huruf H dan OH dalam rumus.',
          'Larutan elektrolit mengandung ion bergerak yang dapat menghantarkan arus. Asam kuat dan basa kuat merupakan elektrolit kuat pada kondisi yang sesuai, tetapi garam juga dapat menghantarkan arus. Jadi, daya hantar saja tidak mengidentifikasi larutan sebagai asam atau basa. Hubungkan hasil uji dengan spesies yang ada di dalam air.',
        ],
        callout:
          'Indikator, konsentrasi, suhu, dan jenis zat memengaruhi pengamatan. Jangan menguji sifat larutan dengan mengecap atau menyentuhnya.',
      },
      {
        title: 'Arrhenius: berfokus pada larutan air',
        sourceIds: ['arrhenius'],
        paragraphs: [
          'Menurut Arrhenius, asam meningkatkan konsentrasi H₃O⁺ dalam air, sedangkan basa meningkatkan konsentrasi OH⁻. Dalam penulisan ringkas, H⁺(aq) mewakili proton yang terhidrasi; proton bebas tidak dianggap berdiri sendiri di dalam larutan air.',
          'HCl memindahkan proton ke air, sedangkan NaOH terdisosiasi menghasilkan Na⁺ dan OH⁻. Teori ini mudah dipakai untuk banyak larutan, tetapi konteksnya adalah air. Teori berikutnya memperluas cara menjelaskan reaksi yang tidak selalu melibatkan zat dengan OH dalam rumusnya.',
        ],
        formula: 'HCl + H₂O → H₃O⁺ + Cl⁻\nNaOH → Na⁺ + OH⁻',
      },
      {
        title: 'Brønsted–Lowry: ikuti perpindahan proton',
        sourceIds: ['proton'],
        paragraphs: [
          'Dalam teori Brønsted–Lowry, asam adalah donor proton dan basa adalah akseptor proton. Peran tersebut ditentukan oleh reaksi, sehingga spesies yang sama dapat bertindak berbeda ketika pasangan reaksinya berubah.',
          'Pada reaksi NH₃ dengan air, NH₃ menerima proton sehingga menjadi NH₄⁺; air melepaskan proton sehingga menjadi OH⁻. Dengan demikian NH₃ bertindak sebagai basa walaupun tidak memiliki gugus OH dalam rumusnya.',
        ],
        formula: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻',
        example: {
          question: 'Tentukan asam dan basa pada HCl + NH₃ → NH₄⁺ + Cl⁻.',
          steps: [
            'HCl kehilangan satu H⁺, sehingga merupakan donor proton.',
            'NH₃ menerima H⁺ pada atom N dan berubah menjadi NH₄⁺.',
            'Atom dan muatan kekal: jumlah muatan kiri 0 dan kanan (+1) + (−1) = 0.',
          ],
          answer:
            'HCl adalah asam; NH₃ adalah basa. Penentuan ini tidak mensyaratkan adanya OH dalam rumus basa.',
        },
      },
      {
        title: 'Pasangan konjugasi dan sifat amfiprotik',
        sourceIds: ['proton'],
        paragraphs: [
          'Setelah menyumbangkan satu proton, asam berubah menjadi basa konjugasinya. Setelah menerima satu proton, basa berubah menjadi asam konjugasinya. Satu pasangan konjugasi berbeda tepat satu H⁺, termasuk perubahan muatannya.',
          'Spesies amfiprotik dapat menerima atau mendonorkan proton. Air dan HCO₃⁻ adalah contoh penting. Sifat ini merupakan perilaku terhadap pasangan reaksi, bukan berarti larutan spesies tersebut pasti netral.',
        ],
        table: {
          caption: 'Mengenali pasangan yang berbeda satu proton',
          headers: ['Asam', 'Basa konjugasi', 'Perubahan muatan'],
          rows: [
            ['H₃O⁺', 'H₂O', '+1 → 0'],
            ['NH₄⁺', 'NH₃', '+1 → 0'],
            ['H₂CO₃', 'HCO₃⁻', '0 → −1'],
            ['HCO₃⁻', 'CO₃²⁻', '−1 → −2'],
          ],
        },
        callout:
          'HCl dan OH⁻ bukan pasangan konjugasi. Keduanya tidak berubah satu sama lain hanya dengan kehilangan atau menerima satu proton.',
      },
      {
        title: 'Lewis: ikuti pasangan elektron',
        sourceIds: ['lewis'],
        paragraphs: [
          'Teori Lewis mengenali asam sebagai penerima pasangan elektron dan basa sebagai pemberi pasangan elektron untuk membentuk ikatan. Teori ini mencakup pembentukan aduk yang tidak memerlukan perpindahan proton.',
          'Pada NH₃ + BF₃, pasangan elektron bebas nitrogen dapat diberikan kepada boron. NH₃ bertindak sebagai basa Lewis, sedangkan BF₃ sebagai asam Lewis. Pada pembentukan NH₄⁺ dari NH₃ dan H⁺, proton menerima pasangan elektron nitrogen; satu reaksi dapat dijelaskan dengan lebih dari satu teori.',
        ],
        formula: 'H₃N: + BF₃ → H₃N→BF₃',
        table: {
          caption: 'Perbandingan tiga teori',
          headers: ['Teori', 'Asam', 'Basa', 'Fokus'],
          rows: [
            ['Arrhenius', 'Meningkatkan H₃O⁺', 'Meningkatkan OH⁻', 'Larutan air'],
            ['Brønsted–Lowry', 'Donor H⁺', 'Akseptor H⁺', 'Transfer proton'],
            [
              'Lewis',
              'Akseptor pasangan elektron',
              'Donor pasangan elektron',
              'Pembentukan ikatan',
            ],
          ],
        },
      },
      {
        title: 'Kuat tidak sama dengan pekat',
        sourceIds: ['strength'],
        paragraphs: [
          'Kekuatan asam berkaitan dengan kecenderungan ionisasinya dalam pelarut pada suhu tertentu. HCl dalam air terionisasi praktis lengkap pada rentang pembelajaran biasa, sedangkan CH₃COOH membentuk kesetimbangan. Konsentrasi menyatakan banyaknya zat terlarut per volume larutan; keduanya adalah konsep berbeda.',
          'Menaikkan konsentrasi tidak mengubah asam lemah menjadi asam kuat. Nilai pH juga tidak sendirian menentukan jenis kekuatan asam: dua larutan dengan pH sama dapat mempunyai zat dan konsentrasi analitis berbeda.',
        ],
        formula: 'CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻',
        example: {
          question:
            'Apakah HCl 0,001 mol/L lebih lemah daripada CH₃COOH 0,10 mol/L karena lebih encer?',
          steps: [
            'Identifikasi zat: HCl tergolong asam kuat, CH₃COOH asam lemah dalam air.',
            'Bandingkan konsentrasi: 0,001 mol/L lebih encer daripada 0,10 mol/L.',
            'Pisahkan pertanyaan kekuatan dari perhitungan pH, yang memerlukan konsentrasi dan kesetimbangan.',
          ],
          answer:
            'HCl itu lebih encer, tetapi tetap asam kuat. Pekat/encer tidak menggantikan kuat/lemah.',
        },
      },
      {
        title: 'Tetapan Kₐ, Kᵦ, dan pasangan konjugasi',
        sourceIds: ['strength', 'equilibrium'],
        paragraphs: [
          'Untuk HA dalam air, Kₐ menyatakan posisi kesetimbangan ionisasi. Pada perbandingan suhu dan pelarut yang sama, Kₐ lebih besar berarti kecenderungan mendonorkan proton lebih besar; pKₐ = −log₁₀Kₐ bergerak berlawanan. Bentuk konsentrasi di bawah merupakan pendekatan larutan ideal encer; air sebagai pelarut tidak dimasukkan dalam penyebut.',
          'Untuk basa B, definisikan Kᵦ melalui B + H₂O ⇌ BH⁺ + OH⁻. Pasangan konjugasi memenuhi Kₐ × Kᵦ = K_w. Pergeseran kesetimbangan saat pengenceran tidak mengubah nilai tetapan jika suhu tetap, meskipun fraksi zat terionisasi dapat berubah.',
        ],
        formula: 'Kₐ ≈ [H₃O⁺][A⁻] / [HA]\nKᵦ ≈ [BH⁺][OH⁻] / [B]\nKₐ × Kᵦ = K_w',
        callout:
          'Gunakan Kₐ dan Kᵦ milik pasangan konjugasi yang benar. Jangan mengalikan Kₐ asam dengan Kᵦ basa yang tidak berpasangan.',
      },
      {
        title: 'Asam poliprotik: proton dilepas bertahap',
        sourceIds: ['polyprotic'],
        paragraphs: [
          'Asam monoprotik memiliki satu proton yang dapat dilepas dalam proses asam–basa terkait. CH₃COOH bersifat monoprotik walaupun mengandung empat H: pada ionisasi asam biasa, proton dari gugus karboksil yang dilepas. Asam poliprotik memiliki lebih dari satu tahap pelepasan proton, masing-masing dengan tetapan tersendiri.',
          'H₂CO₃ dapat menghasilkan HCO₃⁻ lalu CO₃²⁻. Pelepasan kedua umumnya kurang menguntungkan daripada pelepasan pertama. Karena itu, jangan otomatis mengalikan konsentrasi semua asam diprotik dengan dua untuk memperoleh [H₃O⁺]; tahap ionisasinya perlu diperiksa.',
        ],
        formula: 'H₂CO₃ + H₂O ⇌ H₃O⁺ + HCO₃⁻\nHCO₃⁻ + H₂O ⇌ H₃O⁺ + CO₃²⁻',
      },
    ],
    checks: [
      {
        question: 'Pada H₂O + HCl → H₃O⁺ + Cl⁻, apa peran air dan apa asam konjugasinya?',
        answer:
          'Air menerima proton sehingga bertindak sebagai basa. Asam konjugasinya adalah H₃O⁺.',
      },
      {
        question: 'Mengapa BF₃ dapat menjadi asam walaupun tidak memiliki H?',
        answer:
          'Dalam teori Lewis, BF₃ menerima pasangan elektron. Definisi ini tidak mensyaratkan donor proton.',
      },
      {
        question: 'Mengapa menambah air pada asam lemah tidak mengubahnya menjadi jenis asam kuat?',
        answer:
          'Pengenceran mengubah konsentrasi dan dapat menaikkan fraksi ionisasi, tetapi Kₐ pada suhu tetap tidak berubah. Kekuatan dan fraksi ionisasi pada satu kondisi harus dibedakan.',
      },
    ],
  },
  skala: {
    duration: '30 menit',
    objective:
      'Menghitung pH/pOH asam dan basa kuat maupun lemah, menilai pendekatan yang dipakai, serta menjelaskan pengaruh pengenceran dan suhu.',
    prerequisites: [
      'Pangkat dan logaritma basis 10',
      'Mol, molaritas, dan konversi mL ke L',
      'Reaksi ionisasi dan kesetimbangan',
    ],
    keyPoints: [
      'pH ditentukan oleh aktivitas; konsentrasi adalah pendekatan.',
      'Netral berarti [H₃O⁺] = [OH⁻], bukan selalu pH 7.',
      'Tentukan spesies dan model sebelum memasukkan angka ke rumus.',
    ],
    sections: [
      {
        title: 'Air juga membentuk ion',
        sourceIds: ['ph'],
        paragraphs: [
          'Dua molekul air dapat saling memindahkan proton membentuk H₃O⁺ dan OH⁻. Pada 25 °C, hasil kali aktivitas ionnya, K_w, sekitar 1,0 × 10⁻¹⁴. Dalam pendekatan ideal, larutan netral memiliki konsentrasi masing-masing sekitar 10⁻⁷ mol/L.',
          'Suhu mengubah K_w. Air netral pada suhu lain tetap memiliki jumlah hidronium dan hidroksida setimbang, tetapi nilai pH netralnya dapat berbeda dari 7. Karena itu, klasifikasi dengan batas 7 dalam latihan ini selalu menyertakan suhu 25 °C.',
        ],
        formula: '2H₂O ⇌ H₃O⁺ + OH⁻\nK_w ≈ [H₃O⁺][OH⁻] = 1,0 × 10⁻¹⁴  (25 °C)',
      },
      {
        title: 'Makna pH, pOH, dan skala logaritmik',
        sourceIds: ['ph'],
        paragraphs: [
          'Secara termodinamika pH = −log₁₀a(H⁺), dengan aktivitas relatif yang tidak bersatuan. Untuk perhitungan larutan ideal encer, nilai numerik konsentrasi dalam mol/L dapat digunakan sebagai pendekatan. pOH didefinisikan serupa untuk OH⁻; pH + pOH = pK_w.',
          'Perubahan satu satuan pH berarti perubahan sepuluh kali pada aktivitas hidrogen. Arah perubahannya berlawanan: pH lebih kecil berarti aktivitas hidrogen lebih besar. Rentang 0–14 adalah rentang belajar yang lazim, bukan batas mutlak.',
        ],
        formula: 'pH ≈ −log₁₀[H₃O⁺]\npOH ≈ −log₁₀[OH⁻]\npH + pOH ≈ 14,00  (25 °C)',
        example: {
          question: 'Bandingkan konsentrasi H₃O⁺ pada pH 2,5 dan pH 4,0 dengan pendekatan ideal.',
          steps: [
            'Tulis [H₃O⁺]₁/[H₃O⁺]₂ = 10⁻²⋅⁵ / 10⁻⁴⋅⁰.',
            'Gabungkan pangkat: 10^(4,0 − 2,5) = 10¹⋅⁵.',
            'Nilai 10¹⋅⁵ sekitar 31,6; periksa bahwa larutan pH 2,5 memiliki nilai lebih besar.',
          ],
          answer: 'Konsentrasi H₃O⁺ larutan pH 2,5 sekitar 31,6 kali larutan pH 4,0.',
        },
      },
      {
        title: 'Siapkan molaritas dan satuan dahulu',
        sourceIds: ['molarity'],
        paragraphs: [
          'Molaritas adalah jumlah mol zat terlarut dibagi volume akhir larutan dalam liter. Volume pelarut yang ditambahkan tidak selalu sama dengan volume akhir. Tuliskan zat yang dihitung dan konversi satuan sebelum memasukkan angka ke hubungan pH.',
          'Pada pengenceran tanpa reaksi atau kehilangan zat terlarut, jumlah mol tetap sehingga C₁V₁ = C₂V₂. Kedua volume boleh sama-sama mL pada perbandingan ini, tetapi perhitungan n = CV menggunakan volume dalam liter jika C dinyatakan mol/L.',
        ],
        formula: 'C = n/V\nC₁V₁ = C₂V₂',
        example: {
          question:
            'Sebanyak 10,0 mL HCl 0,010 mol/L diencerkan sampai volume akhir 100,0 mL. Tentukan konsentrasi dan pH pendekatannya.',
          steps: [
            'C₂ = 0,010 × 10,0 / 100,0 = 0,0010 mol/L.',
            'HCl dianggap terionisasi sempurna dan kontribusi air diabaikan pada rentang ini.',
            '[H₃O⁺] ≈ 10⁻³ mol/L, sehingga pH ≈ 3,00.',
          ],
          answer:
            'Konsentrasi turun sepuluh kali dan pH naik dari sekitar 2 menjadi 3. Volume 100 mL adalah volume total, bukan air tambahan.',
        },
      },
      {
        title: 'Asam kuat: hitung ion hidronium',
        sourceIds: ['strength'],
        paragraphs: [
          'Untuk asam kuat monoprotik seperti HCl pada rentang yang layak, konsentrasi H₃O⁺ mendekati konsentrasi analitis asam. Pastikan ionisasi lengkap, suhu, dan kontribusi air sesuai sebelum menggunakan penyederhanaan ini.',
          'Jumlah H dalam rumus bukan faktor pengali universal. Asam poliprotik memerlukan perhatian pada tahap ionisasinya. Dalam soal HCl berikut, satu mol HCl menyumbang satu mol proton kepada air.',
        ],
        example: {
          question: 'Tentukan pH HCl 2,0 × 10⁻³ mol/L pada 25 °C dalam model ideal.',
          steps: [
            'Tetapkan [H₃O⁺] ≈ 2,0 × 10⁻³ mol/L.',
            'pH ≈ −(log₁₀2,0 + log₁₀10⁻³) = 3 − 0,3010.',
            'Hasil sekitar 2,70; konsentrasi sedikit lebih besar daripada 10⁻³, sehingga pH sedikit di bawah 3.',
          ],
          answer:
            'pH ≈ 2,70. Pemeriksaan arah perubahan membantu menemukan kesalahan tanda logaritma.',
        },
      },
      {
        title: 'Basa kuat: pOH dahulu, lalu pH',
        sourceIds: ['strength'],
        paragraphs: [
          'NaOH memberi satu OH⁻ per satuan formula yang larut. Untuk basa kuat yang mengandung lebih dari satu OH, tentukan jumlah ion berdasarkan stoikiometri serta kelarutannya; jangan menganggap semua padatan basa larut sempurna.',
          'Setelah [OH⁻] diperoleh, hitung pOH. Pada 25 °C, kurangkan pOH dari sekitar 14 untuk memperoleh pH. Memasukkan [OH⁻] langsung ke rumus pH adalah kekeliruan yang sering terjadi.',
        ],
        example: {
          question: 'Hitung pH NaOH 2,5 × 10⁻³ mol/L pada 25 °C.',
          steps: [
            '[OH⁻] ≈ 2,5 × 10⁻³ mol/L.',
            'pOH ≈ −log₁₀(2,5 × 10⁻³) = 2,60.',
            'pH ≈ 14,00 − 2,60 = 11,40.',
          ],
          answer: 'pH ≈ 11,40; hasil di atas 7 konsisten dengan larutan basa.',
        },
      },
      {
        title: 'Asam dan basa lemah: gunakan kesetimbangan',
        sourceIds: ['strength'],
        paragraphs: [
          'Untuk asam monoprotik HA dengan konsentrasi awal C dan tanpa ion senama, misalkan x adalah konsentrasi yang terionisasi. Dengan mengabaikan kontribusi awal air, [H₃O⁺] = [A⁻] = x dan [HA] = C − x. Rumus akar berikut hanya pendekatan ketika x jauh lebih kecil daripada C.',
          'Setelah memperoleh x ≈ √(KₐC), periksa x/C. Aturan praktis 5% membantu menilai apakah mengganti C − x dengan C layak. Jika tidak layak, gunakan persamaan kuadrat atau metode kesetimbangan yang lebih lengkap. Untuk basa lemah, langkah serupa memakai Kᵦ dan menghasilkan [OH⁻].',
        ],
        formula: 'Kₐ ≈ x²/(C − x)\nx = (−Kₐ + √(Kₐ² + 4KₐC))/2\nx ≈ √(KₐC)  jika x ≪ C',
        example: {
          question: 'Untuk HA 0,10 mol/L dengan Kₐ = 1,8 × 10⁻⁵ pada 25 °C, perkirakan pH.',
          steps: [
            'x ≈ √(1,8 × 10⁻⁵ × 0,10) = 1,34 × 10⁻³ mol/L.',
            'x/C ≈ 1,34%; pendekatan kurang dari 5% terpenuhi.',
            'pH dari pendekatan akar sekitar 2,87. Penyelesaian kuadrat memberi x ≈ 1,333 × 10⁻³ dan pH ≈ 2,88.',
          ],
          answer:
            'Kedua cara memberikan nilai dekat 2,9. Laporkan cara dan pembulatan yang dipakai; jangan menganggap asam lemah terionisasi lengkap.',
        },
      },
      {
        title: 'Larutan sangat encer dan batas pendekatan',
        sourceIds: ['ph', 'equilibrium'],
        paragraphs: [
          'Ketika konsentrasi asam mendekati konsentrasi H₃O⁺ dari air, kontribusi air tidak boleh diabaikan. Prediksi pH 8 untuk HCl 10⁻⁸ mol/L dari rumus −log C tidak masuk akal: menambahkan asam kepada air pada kondisi ini tidak membuatnya basa.',
          'Pada model ideal HCl monoprotik, neraca muatan dan K_w menghasilkan persamaan di bawah. Larutan nyata juga dapat dipengaruhi CO₂ udara dan aktivitas ion, sehingga model ideal tidak menggantikan pengukuran.',
        ],
        formula: '[H₃O⁺] ≈ (C + √(C² + 4K_w))/2',
        example: {
          question: 'Gunakan C = 1,0 × 10⁻⁸ mol/L dan K_w = 1,0 × 10⁻¹⁴.',
          steps: [
            'Masukkan C² = 10⁻¹⁶ dan 4K_w = 4 × 10⁻¹⁴.',
            'Diperoleh [H₃O⁺] sekitar 1,051 × 10⁻⁷ mol/L.',
            'pH ≈ 6,98; nilainya sedikit di bawah 7.',
          ],
          answer:
            'Larutan tetap sedikit asam. Kesalahan berasal dari mengabaikan air, bukan dari sifat logaritma.',
        },
      },
      {
        title: 'Menyusun strategi penyelesaian',
        sourceIds: ['molarity'],
        paragraphs: [
          'Mulai dengan pertanyaan: zat apa yang dilarutkan, adakah reaksi pencampuran, dan spesies mana yang berlebih? Hitung mol dan stoikiometri lebih dahulu jika larutan bereaksi. Sesudah itu pilih model asam kuat, basa kuat, kesetimbangan lemah, atau pasangan penyangga.',
          'Tuliskan asumsi dan satuan. Periksa kisaran hasil, tanda, jumlah angka penting, serta apakah pendekatan yang digunakan masih layak. Bila informasi Kₐ, Kᵦ, suhu, atau volume akhir belum tersedia, nyatakan informasi yang diperlukan daripada memberi satu angka yang tampak pasti.',
        ],
        table: {
          caption: 'Peta strategi',
          headers: ['Situasi', 'Langkah awal', 'Pemeriksaan'],
          rows: [
            ['Asam kuat monoprotik', 'Tentukan [H₃O⁺]', 'Ionisasi lengkap dan kontribusi air'],
            ['Basa kuat terlarut', 'Tentukan [OH⁻], lalu pOH', 'Stoikiometri OH⁻ dan suhu'],
            ['Asam/basa lemah', 'Susun kesetimbangan', 'Uji pendekatan x ≪ C'],
            [
              'Pencampuran asam–basa',
              'Hitung mol dan sisa pereaksi',
              'Volume akhir dan spesies sesudah reaksi',
            ],
          ],
        },
      },
    ],
    checks: [
      {
        question: 'Larutan ideal mempunyai [OH⁻] = 10⁻⁴ mol/L pada 25 °C. Berapa pH-nya?',
        answer: 'pOH = 4 dan pH ≈ 10. Nilai 4 adalah pOH, bukan pH.',
      },
      {
        question:
          'HCl diencerkan sepuluh kali dari 0,010 ke 0,0010 mol/L. Apakah pH juga turun sepuluh kali?',
        answer:
          'Tidak. pH naik satu satuan, sekitar 2 menjadi 3, karena pH adalah skala logaritmik.',
      },
      {
        question: 'Mengapa pH netral dapat berbeda dari 7?',
        answer:
          'Netralitas adalah kesamaan aktivitas/konsentrasi H₃O⁺ dan OH⁻. K_w berubah dengan suhu, sehingga pH netral = ½pK_w juga berubah.',
      },
    ],
  },
  kehidupan: {
    duration: '25 menit',
    objective:
      'Menafsirkan netralisasi, hidrolisis, penyangga, indikator, dan titrasi serta menghubungkan hasil hitung dengan bukti pengamatan.',
    prerequisites: ['Perhitungan mol dan pH', 'Pasangan konjugasi', 'Tetapan kesetimbangan'],
    keyPoints: [
      'Netralisasi tidak selalu berakhir pada pH 7.',
      'Sifat garam bergantung pada ionnya.',
      'Titik akhir indikator dan titik ekuivalen adalah dua konsep berbeda.',
    ],
    sections: [
      {
        title: 'Dari konteks sehari-hari ke pertanyaan ilmiah',
        sourceIds: ['arrhenius'],
        paragraphs: [
          'pH dapat membantu menggambarkan keadaan larutan pada pengolahan air, bahan pangan, dan proses industri. Akan tetapi, nama bahan tidak memberikan satu pH universal. Komposisi, konsentrasi, suhu, dan cara pengukuran perlu diketahui.',
          'Susun pertanyaan yang dapat diperiksa: indikator apa yang digunakan, apakah alat dikalibrasi, dan variabel apa yang diubah? Membandingkan dua bahan berarti membandingkan kondisi tertentu, bukan menyimpulkan bahwa semua produk dengan nama serupa mempunyai sifat identik.',
        ],
        callout:
          'pH bukan skala tunggal untuk menyatakan keamanan suatu bahan. Gunakan prosedur keselamatan dan informasi bahan yang sesuai; kegiatan di aplikasi ini bersifat virtual.',
      },
      {
        title: 'Netralisasi: reaksi dahulu, pH kemudian',
        sourceIds: ['titration'],
        paragraphs: [
          'Dalam pencampuran asam kuat dan basa kuat, ion hidronium dan hidroksida bereaksi membentuk air. Hitung jumlah mol masing-masing sebelum menafsirkan pH akhir. Jika keduanya setara, larutan HCl–NaOH mendekati netral pada 25 °C dalam model ideal.',
          'Jika salah satunya berlebih, konsentrasi ion yang tersisa diperoleh dengan membagi mol sisa dengan volume campuran. Menyamakan volume saja tidak menjamin ekuivalensi; konsentrasi dan koefisien reaksi ikut menentukan.',
        ],
        formula: 'H₃O⁺ + OH⁻ → 2H₂O',
        example: {
          question:
            'Campurkan 25,0 mL HCl 0,100 mol/L dengan 20,0 mL NaOH 0,100 mol/L. Anggap volume aditif dan suhu 25 °C.',
          steps: [
            'n(H₃O⁺) = 0,100 × 0,0250 = 0,00250 mol.',
            'n(OH⁻) = 0,100 × 0,0200 = 0,00200 mol. Sisa H₃O⁺ = 0,00050 mol.',
            'V akhir = 0,0450 L. [H₃O⁺] ≈ 0,00050/0,0450 = 0,0111 mol/L.',
            'pH ≈ −log₁₀(0,0111) = 1,95.',
          ],
          answer:
            'Larutan akhir asam. Reaksi netralisasi telah terjadi, tetapi asam masih berlebih.',
        },
      },
      {
        title: 'Hidrolisis garam: ion dapat bereaksi dengan air',
        sourceIds: ['salts'],
        paragraphs: [
          'Sebagian ion dari garam dapat menerima atau memberikan proton kepada air. Na⁺ dan Cl⁻ umumnya tidak memengaruhi pH secara berarti pada pendekatan ini. Sebaliknya, CH₃COO⁻ sebagai basa konjugasi asam lemah dapat meningkatkan OH⁻, sedangkan NH₄⁺ sebagai asam konjugasi basa lemah dapat meningkatkan H₃O⁺.',
          'Untuk garam dari asam lemah dan basa lemah, bandingkan perilaku kedua ion melalui tetapan yang sesuai; nama garam saja tidak cukup. Ion logam tertentu juga dapat mengasamkan air melalui ion kompleksnya, sehingga pola sederhana bukan aturan tanpa pengecualian.',
        ],
        formula: 'CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻\nNH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺',
        table: {
          caption: 'Prediksi pada larutan ideal encer, 25 °C',
          headers: ['Garam', 'Ion yang ditinjau', 'Kecenderungan'],
          rows: [
            ['NaCl', 'Na⁺, Cl⁻', 'Mendekati netral'],
            ['CH₃COONa', 'CH₃COO⁻', 'Basa'],
            ['NH₄Cl', 'NH₄⁺', 'Asam'],
          ],
        },
      },
      {
        title: 'Menghitung pH garam sederhana',
        sourceIds: ['salts'],
        paragraphs: [
          'Larutan natrium asetat dapat diperlakukan sebagai basa lemah CH₃COO⁻. Tetapan hidrolisis basanya dihitung dengan Kᵦ = K_w/Kₐ dari CH₃COOH, bukan Kₐ milik asam lain. Sesudah itu gunakan neraca kesetimbangan yang sama seperti pada basa lemah.',
          'Untuk NH₄Cl, gunakan Kₐ(NH₄⁺) = K_w/Kᵦ(NH₃), kemudian hitung [H₃O⁺]. Periksa kontribusi air serta apakah pendekatan akar layak pada konsentrasi yang diberikan.',
        ],
        example: {
          question: 'Perkirakan pH CH₃COONa 0,10 mol/L dengan Kₐ(CH₃COOH) = 1,8 × 10⁻⁵ pada 25 °C.',
          steps: [
            'Kᵦ(CH₃COO⁻) = 10⁻¹⁴/(1,8 × 10⁻⁵) ≈ 5,56 × 10⁻¹⁰.',
            '[OH⁻] ≈ √(5,56 × 10⁻¹⁰ × 0,10) ≈ 7,45 × 10⁻⁶ mol/L.',
            'pOH ≈ 5,13 dan pH ≈ 8,87. Fraksi hidrolisis kecil sehingga pendekatan layak.',
          ],
          answer:
            'Garam ini menghasilkan larutan basa, walaupun nama garam sering dikaitkan secara keliru dengan netralitas.',
        },
      },
      {
        title: 'Penyangga: pasangan yang merespons gangguan',
        sourceIds: ['buffer'],
        paragraphs: [
          'Penyangga tersusun dari asam lemah dan basa konjugasinya, atau basa lemah dan asam konjugasinya, dalam jumlah bermakna. Basa konjugasi mengonsumsi sedikit asam yang masuk; komponen asam mengonsumsi sedikit basa. pH tetap dapat berubah, tetapi lebih kecil daripada pada sistem tanpa pasangan penyangga yang sebanding.',
          'Persamaan Henderson–Hasselbalch adalah pendekatan yang berguna setelah komposisi pasangan diketahui. Kapasitas bergantung pada jumlah komponen dan rasionya. Pengenceran bersama dapat mempertahankan rasio secara mendekati, tetapi menurunkan kapasitas.',
        ],
        formula: 'pH ≈ pKₐ + log₁₀([A⁻]/[HA])',
        example: {
          question:
            'Suatu penyangga mengandung 0,010 mol HA dan 0,010 mol A⁻. Gunakan pKₐ = 4,74. Apa akibat penambahan 0,0010 mol OH⁻?',
          steps: [
            'Sebelum penambahan, rasio A⁻/HA = 1 sehingga pH ≈ 4,74.',
            'OH⁻ bereaksi dengan HA: HA + OH⁻ → A⁻ + H₂O.',
            'Mol akhir HA = 0,0090 dan A⁻ = 0,0110; keduanya berada pada volume akhir yang sama.',
            'pH ≈ 4,74 + log₁₀(0,0110/0,0090) ≈ 4,83.',
          ],
          answer:
            'pH naik sekitar 0,09. Kerjakan stoikiometri gangguan terlebih dahulu; jangan memasukkan mol awal ke persamaan setelah reaksi.',
        },
      },
      {
        title: 'Indikator: warna mempunyai rentang transisi',
        sourceIds: ['titration'],
        paragraphs: [
          'Indikator asam–basa adalah sistem kesetimbangan dengan bentuk terprotonasi dan terdeprotonasi yang dapat memiliki warna berbeda. Warna berubah pada suatu rentang pH; indikator bukan alat yang selalu menghasilkan angka pH tepat.',
          'Pilih indikator yang rentang transisinya berada pada bagian perubahan pH tajam di sekitar titik ekuivalen titrasi yang dipakai. Fenolftalein dan metil jingga memiliki rentang berbeda, sehingga pemilihannya perlu disesuaikan dengan kurva titrasi. Meter pH memerlukan kalibrasi, sedangkan warna dapat dipengaruhi konsentrasi indikator dan warna sampel.',
        ],
        formula: 'HIn + H₂O ⇌ H₃O⁺ + In⁻',
        callout:
          'Warna pada laboratorium virtual bersifat skematis. Jangan menafsirkan setiap warna yang sama sebagai nilai pH tepat yang identik pada semua indikator.',
      },
      {
        title: 'Titrasi dan titik ekuivalen',
        sourceIds: ['titration'],
        paragraphs: [
          'Titrasi menggunakan larutan berkonsentrasi diketahui untuk menentukan jumlah zat dalam sampel melalui reaksi stoikiometrik. Titik ekuivalen menyatakan jumlah titran yang setara secara reaksi. Titik akhir adalah pengamatan yang dipilih untuk menghentikan titrasi, misalnya perubahan warna indikator.',
          'Pada titrasi asam lemah dengan basa kuat, titik ekuivalen cenderung basa karena anion garam mengalami hidrolisis. Pada setengah ekuivalen, jumlah HA dan A⁻ setara sehingga pH mendekati pKₐ dalam pendekatan yang sesuai. Kedua hal ini berbeda dari titrasi asam kuat–basa kuat.',
        ],
        example: {
          question:
            'Sebanyak 20,00 mL sampel HCl memerlukan 16,00 mL NaOH 0,1000 mol/L hingga ekuivalen. Hitung konsentrasi HCl.',
          steps: [
            'Reaksi HCl : NaOH adalah 1 : 1.',
            'n(NaOH) = 0,1000 × 0,01600 = 0,001600 mol.',
            'n(HCl) = 0,001600 mol, sehingga C(HCl) = 0,001600/0,02000.',
          ],
          answer:
            'C(HCl) = 0,08000 mol/L. Untuk reaksi dengan rasio lain, gunakan koefisien sebelum menyamakan mol.',
        },
      },
      {
        title: 'Membaca bukti dan menghindari kesimpulan berlebihan',
        sourceIds: ['polyprotic'],
        paragraphs: [
          'Satu hasil kuis membantu menentukan bagian yang perlu dipelajari, tetapi alasan jawaban memperjelas cara berpikir. Jika kamu menjawab “asam kuat selalu pH 1”, periksa kembali peran konsentrasi. Jika semua pencampuran dianggap netral, tuliskan mol dan periksa pereaksi berlebih.',
          'Untuk zat dengan beberapa proton yang dapat dilepas, tentukan tahap atau titik ekuivalen yang dibahas. Jumlah proton dalam rumus, kemiripan warna indikator, dan nama bahan bukan pengganti model reaksi yang jelas. Tulis apa yang diketahui, asumsi yang dipakai, dan bukti yang masih diperlukan.',
        ],
        table: {
          caption: 'Pertanyaan untuk mengecek penjelasanmu',
          headers: ['Pernyataan awal', 'Yang perlu diperiksa'],
          rows: [
            ['“Asam ini lebih kuat karena lebih pekat.”', 'Pisahkan Kₐ dari konsentrasi analitis.'],
            ['“Garam selalu netral.”', 'Tinjau sifat asam/basa setiap ion.'],
            [
              '“Warna akhir berarti tepat ekuivalen.”',
              'Bedakan titik akhir pengamatan dan titik ekuivalen stoikiometri.',
            ],
            [
              '“Ada dua H, berarti [H₃O⁺] = 2C.”',
              'Tinjau proton yang terionisasi dan kesetimbangan bertahap.',
            ],
          ],
        },
      },
    ],
    checks: [
      {
        question: 'Mengapa titrasi CH₃COOH dengan NaOH tidak harus memiliki pH ekuivalen 7?',
        answer:
          'Pada ekuivalen terdapat CH₃COO⁻ yang dapat menerima proton dari air dan menghasilkan OH⁻. Larutan cenderung basa pada 25 °C.',
      },
      {
        question: 'Apakah campuran HCl dan NaCl merupakan penyangga?',
        answer:
          'Tidak. Campuran itu tidak menyediakan pasangan asam lemah dan basa konjugasinya dalam jumlah bermakna.',
      },
      {
        question: 'Bolehkah menghitung konsentrasi dari volume titran tanpa menuliskan reaksi?',
        answer:
          'Rasio stoikiometri harus diketahui terlebih dahulu. Persamaan CₐVₐ = CᵦVᵦ hanya langsung berlaku jika rasio mol reaksi 1 : 1.',
      },
    ],
  },
};
