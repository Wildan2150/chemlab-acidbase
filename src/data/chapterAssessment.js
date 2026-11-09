export const ASSESSMENT_VERSION = 'asam-basa-akhir-bab-v1';
export const assessmentDomains = [
  {
    id: 'theory',
    title: 'Teori & kesetimbangan',
    lessonId: 'kenali',
    description: 'Teori asam–basa, pasangan konjugasi, dan kekuatan.',
  },
  {
    id: 'calculation',
    title: 'Menalar & menghitung pH',
    lessonId: 'skala',
    description: 'Skala logaritmik, asam/basa kuat, asam lemah, dan kontribusi air.',
  },
  {
    id: 'application',
    title: 'Menerapkan konsep',
    lessonId: 'kehidupan',
    description: 'Netralisasi, hidrolisis, penyangga, indikator, dan titrasi.',
  },
];

// Soal disusun khusus untuk asesmen bab; tidak mengganti kuis diagnostik lima butir.
export const assessmentQuestions = [
  {
    id: 'a1',
    domain: 'theory',
    kind: 'choice',
    topic: 'Brønsted–Lowry',
    objective: 'Mengidentifikasi donor proton dari persamaan reaksi.',
    text: 'Pada NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺, spesies yang bertindak sebagai asam Brønsted–Lowry pada arah maju adalah…',
    options: [
      'NH₃, karena menerima proton',
      'H₂O, karena menerima proton',
      'NH₄⁺, karena mendonorkan proton',
      'OH⁻, karena selalu ada dalam air',
    ],
    correct: 2,
    explanation:
      'Pada arah maju NH₄⁺ kehilangan satu proton dan menjadi NH₃. H₂O menerima proton dan menjadi H₃O⁺. Peran asam/basa ditentukan dari perpindahan proton dalam reaksi.',
    followUp:
      'Ikuti perubahan satu proton pada setiap spesies, lalu tentukan donor dan akseptornya.',
  },
  {
    id: 'a2',
    domain: 'theory',
    kind: 'choice',
    topic: 'Pasangan konjugasi',
    objective: 'Menentukan basa konjugasi spesies amfiprotik.',
    text: 'HCO₃⁻ sedang berperan sebagai donor satu proton. Basa konjugasi yang terbentuk adalah…',
    options: ['H₂CO₃', 'CO₃²⁻', 'CO₂', 'OH⁻'],
    correct: 1,
    explanation:
      'Melepas H⁺ dari HCO₃⁻ menghasilkan CO₃²⁻. Muatan turun satu satuan, dari −1 menjadi −2. H₂CO₃ terbentuk jika HCO₃⁻ menerima proton, bukan mendonorkannya.',
    followUp: 'Pasangan konjugasi harus berbeda tepat satu H⁺. Periksa atom dan muatan sekaligus.',
  },
  {
    id: 'a3',
    domain: 'theory',
    kind: 'choice',
    topic: 'Teori Lewis',
    objective: 'Mengenali akseptor pasangan elektron.',
    text: 'Pada pembentukan aduk NH₃→BF₃, pasangan elektron bebas N diberikan kepada B. Asam Lewis dalam reaksi ini adalah…',
    options: [
      'BF₃, sebagai penerima pasangan elektron',
      'NH₃, sebagai pemberi pasangan elektron',
      'Keduanya, karena sama-sama tidak bermuatan',
      'H₂O, karena semua reaksi asam–basa harus melibatkan air',
    ],
    correct: 0,
    explanation:
      'Asam Lewis menerima pasangan elektron. BF₃ menerima pasangan dari NH₃; NH₃ bertindak sebagai basa Lewis. Perpindahan proton tidak disyaratkan dalam definisi ini.',
    followUp: 'Bedakan donor proton pada Brønsted–Lowry dari donor pasangan elektron pada Lewis.',
  },
  {
    id: 'a4',
    domain: 'theory',
    kind: 'choice',
    topic: 'Kekuatan vs konsentrasi',
    objective: 'Memisahkan kekuatan asam dari kepekatan larutan.',
    text: 'HCl 0,0010 mol/L dibandingkan dengan CH₃COOH 0,10 mol/L dalam air. Pernyataan yang paling tepat adalah…',
    options: [
      'CH₃COOH pasti asam kuat karena lebih pekat',
      'HCl berubah menjadi asam lemah setelah diencerkan',
      'Kedua larutan pasti memiliki pH sama karena sama-sama asam',
      'HCl lebih encer tetapi tetap tergolong asam kuat; kekuatan dan konsentrasi berbeda',
    ],
    correct: 3,
    explanation:
      'Pekat/encer menyatakan konsentrasi, sedangkan kuat/lemah berkaitan dengan kesetimbangan ionisasi. Pengenceran tidak mengganti identitas HCl sebagai asam kuat dalam model air pada rentang ini.',
    followUp:
      'Bandingkan makna Kₐ, konsentrasi analitis, dan fraksi ionisasi; jangan memakai ketiganya sebagai istilah yang saling menggantikan.',
  },
  {
    id: 'a5',
    domain: 'theory',
    kind: 'choice',
    topic: 'Asam poliprotik',
    objective: 'Membedakan jumlah atom H dari proton yang dapat terionisasi.',
    text: 'Mengapa CH₃COOH disebut asam monoprotik walaupun rumusnya memuat empat atom H?',
    options: [
      'Karena setiap atom H dilepas bersamaan',
      'Karena asam lemah tidak dapat melepas proton',
      'Karena pada ionisasi asam biasa satu proton gugus karboksil yang dilepas',
      'Karena jumlah atom H tidak pernah berkaitan dengan reaksi kimia',
    ],
    correct: 2,
    explanation:
      'Proton gugus –COOH yang dilepas dalam ionisasi asam biasa. Empat atom H pada rumus tidak berarti empat tahap pelepasan proton dengan perilaku yang sama.',
    followUp: 'Tinjau gugus fungsi dan tahap ionisasi, bukan hanya jumlah H dalam rumus.',
  },
  {
    id: 'b1',
    domain: 'calculation',
    kind: 'choice',
    topic: 'Skala logaritmik',
    objective: 'Membandingkan konsentrasi hidronium dari selisih pH.',
    text: 'Pada pendekatan ideal, konsentrasi H₃O⁺ larutan pH 3 dibandingkan larutan pH 6 adalah…',
    options: [
      '3 kali lebih besar',
      '3 kali lebih kecil',
      '1.000 kali lebih besar',
      '1.000 kali lebih kecil',
    ],
    correct: 2,
    explanation:
      'Perbandingan [H₃O⁺] = 10⁻³/10⁻⁶ = 10³ = 1.000. pH yang lebih rendah berkaitan dengan konsentrasi hidronium yang lebih tinggi pada pendekatan ini.',
    followUp: 'Ubah kedua pH menjadi pangkat sepuluh, lalu hitung perbandingannya.',
  },
  {
    id: 'b2',
    domain: 'calculation',
    kind: 'numeric',
    topic: 'Asam kuat',
    objective: 'Menghitung pH asam kuat monoprotik.',
    text: 'HCl 4,0 × 10⁻³ mol/L terionisasi sempurna pada 25 °C. Dengan aktivitas didekati konsentrasi dan kontribusi air diabaikan, berapa pH-nya?',
    expected: 2.3979400087,
    tolerance: 0.03,
    answerLabel: 'pH',
    explanation:
      'HCl menyumbang satu proton per satuan formula. [H₃O⁺] ≈ 4,0 × 10⁻³ mol/L, sehingga pH ≈ 2,40.',
    steps: [
      'pH ≈ −log₁₀(4,0 × 10⁻³).',
      'pH ≈ 3 − log₁₀4,0 = 2,39794…',
      'Dibulatkan menjadi sekitar 2,40.',
    ],
    followUp:
      'Periksa tanda logaritma dan kewajaran hasil: konsentrasi lebih besar dari 10⁻³ membuat pH lebih kecil dari 3.',
  },
  {
    id: 'b3',
    domain: 'calculation',
    kind: 'numeric',
    topic: 'Basa kuat',
    objective: 'Menghubungkan pOH dan pH pada suhu tertentu.',
    text: 'NaOH 2,0 × 10⁻⁴ mol/L terdisosiasi sempurna pada 25 °C. Pada pendekatan ideal dan dengan kontribusi air diabaikan, hitung pH larutannya.',
    expected: 10.3010299957,
    tolerance: 0.03,
    answerLabel: 'pH',
    explanation:
      '[OH⁻] ≈ 2,0 × 10⁻⁴ mol/L menghasilkan pOH ≈ 3,70. Pada 25 °C, pH ≈ 14,00 − 3,70 = 10,30.',
    steps: [
      'pOH ≈ −log₁₀(2,0 × 10⁻⁴) = 3,69897…',
      'Gunakan pH + pOH ≈ 14,00 pada 25 °C.',
      'pH ≈ 10,30103…',
    ],
    followUp: 'Nilai −log[OH⁻] adalah pOH. Selesaikan konversi ke pH sebelum mengisi jawaban.',
  },
  {
    id: 'b4',
    domain: 'calculation',
    kind: 'numeric',
    topic: 'Asam lemah',
    objective: 'Menggunakan dan memeriksa pendekatan kesetimbangan asam lemah.',
    text: 'Asam monoprotik HA mempunyai C = 0,050 mol/L dan Kₐ = 2,0 × 10⁻⁵ pada 25 °C. Anggap larutan ideal dan abaikan kontribusi air. Hitung pH menggunakan persamaan kuadrat atau pendekatan akar yang sudah diperiksa.',
    expected: 3.0043428723,
    tolerance: 0.03,
    answerLabel: 'pH',
    explanation:
      'Pendekatan x ≈ √(KₐC) memberi x ≈ 1,0 × 10⁻³ mol/L dan pH ≈ 3,00. Rasio x/C sekitar 2%, sehingga pendekatan layak; persamaan kuadrat memberi pH sekitar 3,004.',
    steps: [
      'Kₐ = x²/(C − x); dengan x ≪ C, x ≈ √(2,0 × 10⁻⁵ × 0,050).',
      'x ≈ 0,0010 mol/L; x/C ≈ 2% < 5%.',
      'pH ≈ −log₁₀x ≈ 3,00; hasil kuadrat juga sekitar 3,00.',
    ],
    followUp:
      'Jangan menyamakan [H₃O⁺] dengan C untuk asam lemah. Susun kesetimbangan dan uji pendekatannya.',
  },
  {
    id: 'b5',
    domain: 'calculation',
    kind: 'numeric',
    topic: 'Kontribusi air',
    objective: 'Menghindari pengabaian autoprotolisis pada larutan sangat encer.',
    text: 'Untuk model ideal HCl sangat encer dengan C = 2,0 × 10⁻⁸ mol/L pada 25 °C, gunakan K_w = 1,0 × 10⁻¹⁴ dan [H₃O⁺] = (C + √(C² + 4K_w))/2. Berapa pH-nya?',
    expected: 6.9566426107,
    tolerance: 0.03,
    answerLabel: 'pH',
    explanation:
      'Kontribusi air penting pada konsentrasi ini. [H₃O⁺] ≈ 1,105 × 10⁻⁷ mol/L, sehingga pH ≈ 6,96, sedikit asam.',
    steps: [
      'C² + 4K_w = 4,0 × 10⁻¹⁶ + 4,0 × 10⁻¹⁴.',
      '[H₃O⁺] ≈ 1,10499 × 10⁻⁷ mol/L.',
      'pH ≈ 6,95664…',
    ],
    followUp:
      'Jika −log C memprediksi larutan asam menjadi basa, periksa apakah kontribusi air sudah dimasukkan.',
  },
  {
    id: 'c1',
    domain: 'application',
    kind: 'numeric',
    topic: 'Netralisasi',
    objective: 'Menghitung pH dari mol pereaksi yang berlebih.',
    text: 'Campurkan 30,0 mL HCl 0,100 mol/L dengan 20,0 mL NaOH 0,100 mol/L pada 25 °C. Anggap volume aditif, ionisasi sempurna, dan larutan ideal. Hitung pH akhir.',
    expected: 1.6989700043,
    tolerance: 0.03,
    answerLabel: 'pH',
    explanation:
      'Mol HCl 0,00300 dan NaOH 0,00200; asam tersisa 0,00100 mol dalam volume akhir 0,0500 L. pH ≈ 1,70.',
    steps: [
      'n(H₃O⁺) awal = 0,100 × 0,0300 = 0,00300 mol.',
      'n(OH⁻) = 0,100 × 0,0200 = 0,00200 mol; sisa H₃O⁺ = 0,00100 mol.',
      '[H₃O⁺] sisa = 0,00100/0,0500 = 0,0200 mol/L.',
      'pH ≈ −log₁₀(0,0200) = 1,69897…',
    ],
    followUp:
      'Kerjakan stoikiometri terlebih dahulu; bagi mol sisa dengan volume total, bukan volume salah satu larutan.',
  },
  {
    id: 'c2',
    domain: 'application',
    kind: 'choice',
    topic: 'Hidrolisis garam',
    objective: 'Menafsirkan sifat basa garam dari asam lemah.',
    text: 'Pada 25 °C dan pendekatan larutan ideal encer, larutan CH₃COONa cenderung bersifat basa karena…',
    options: [
      'Na⁺ selalu menghasilkan H₃O⁺',
      'CH₃COO⁻ menerima proton dari air dan menghasilkan OH⁻',
      'Semua garam pasti memiliki pH di atas 7',
      'CH₃COONa langsung melepaskan NaOH sebagai molekul',
    ],
    correct: 1,
    explanation:
      'CH₃COO⁻ merupakan basa konjugasi CH₃COOH dan bereaksi dengan air: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻. Na⁺ tidak menyebabkan hidrolisis bermakna pada model ini.',
    followUp: 'Tinjau kedua ion penyusun garam dan pasangan konjugasinya, bukan hanya nama garam.',
  },
  {
    id: 'c3',
    domain: 'application',
    kind: 'numeric',
    topic: 'Larutan penyangga',
    objective: 'Menggabungkan stoikiometri gangguan dan hubungan Henderson–Hasselbalch.',
    text: 'Penyangga mengandung 0,020 mol HA dan 0,010 mol A⁻ dengan pKₐ = 4,76. Tambahkan 0,0020 mol OH⁻. Anggap reaksi dengan HA selesai dan pendekatan Henderson–Hasselbalch layak. Hitung pH akhir.',
    expected: 4.5839087409,
    tolerance: 0.03,
    answerLabel: 'pH',
    explanation:
      'OH⁻ mengonsumsi HA dan membentuk A⁻. Mol akhir HA = 0,018 dan A⁻ = 0,012. Karena berada pada volume akhir yang sama, rasio konsentrasi sama dengan rasio mol; pH ≈ 4,58.',
    steps: [
      'HA + OH⁻ → A⁻ + H₂O.',
      'Mol HA akhir = 0,020 − 0,0020 = 0,018; A⁻ akhir = 0,010 + 0,0020 = 0,012.',
      'pH ≈ 4,76 + log₁₀(0,012/0,018) = 4,58391…',
    ],
    followUp: 'Hitung perubahan mol akibat OH⁻ sebelum memakai rasio pasangan penyangga.',
  },
  {
    id: 'c4',
    domain: 'application',
    kind: 'choice',
    topic: 'Titrasi asam lemah',
    objective: 'Menjelaskan pH titik ekuivalen berdasarkan hidrolisis.',
    text: 'Mengapa titik ekuivalen titrasi CH₃COOH dengan NaOH pada 25 °C cenderung mempunyai pH di atas 7?',
    options: [
      'Karena titik ekuivalen selalu berarti NaOH masih berlebih',
      'Karena semua reaksi asam–basa menghasilkan pH 14',
      'Karena CH₃COOH berubah menjadi asam kuat',
      'Karena CH₃COO⁻ yang terbentuk bereaksi dengan air menghasilkan OH⁻',
    ],
    correct: 3,
    explanation:
      'Pada titik ekuivalen tidak diperlukan kelebihan stoikiometrik NaOH. Anion CH₃COO⁻ mengalami hidrolisis sehingga larutan cenderung basa.',
    followUp:
      'Setelah menentukan titik ekuivalen, identifikasi spesies yang benar-benar ada dan kesetimbangan ion garamnya.',
  },
  {
    id: 'c5',
    domain: 'application',
    kind: 'choice',
    topic: 'Indikator & titik akhir',
    objective: 'Membedakan bukti pengamatan dari keadaan stoikiometrik.',
    text: 'Pernyataan yang tepat tentang titik akhir indikator dan titik ekuivalen titrasi adalah…',
    options: [
      'Titik akhir ditentukan oleh pengamatan; titik ekuivalen oleh kesetaraan stoikiometri reaksi',
      'Keduanya selalu identik untuk setiap indikator',
      'Titik ekuivalen ditentukan oleh warna larutan sebelum titrasi',
      'Indikator apa pun memberi titik akhir yang sama pada setiap titrasi',
    ],
    correct: 0,
    explanation:
      'Titik ekuivalen adalah konsep stoikiometrik. Titik akhir adalah tanda pengamatan yang digunakan untuk menghentikan titrasi. Indikator dipilih agar rentang transisinya sesuai bagian tajam kurva di sekitar ekuivalen.',
    followUp:
      'Hubungkan pemilihan indikator dengan kurva titrasi; perubahan warna bukan definisi kesetaraan mol.',
  },
];

export const assessmentForm = {
  version: ASSESSMENT_VERSION,
  title: 'Asesmen akhir bab · Asam & basa',
  domains: assessmentDomains,
  questions: assessmentQuestions,
};
