export const activities = [
  {
    id: 'phet',
    catalog: 'F08 / I-03',
    title: 'Asam kuat, asam lemah',
    icon: 'flask',
    description: 'Bandingkan partikel dan pH pada konsentrasi yang sama melalui PhET.',
    goal: 'Membedakan pengaruh kekuatan dan konsentrasi terhadap partikel serta pH.',
    prediction:
      'Pada konsentrasi yang sama, bagaimana perbedaan pH dan jumlah ion asam kuat dibandingkan asam lemah?',
    instructions: [
      'Buka layar pengenalan. Bandingkan asam kuat dan asam lemah dengan konsentrasi awal yang sama.',
      'Amati partikel, ukur pH, lalu catat dua kondisi yang dibandingkan.',
      'Pada layar larutan buatan, ubah konsentrasi sambil mempertahankan jenis/kekuatan asam. Bandingkan pola yang terlihat.',
    ],
    fallback:
      'HCl 0,010 mol/L pada model ideal menghasilkan [H₃O⁺] mendekati 10⁻² mol/L dan pH sekitar 2. Asam monoprotik HA dengan C = 0,010 mol/L dan Kₐ = 1,8 × 10⁻⁵ memiliki [H₃O⁺] sekitar 4,15 × 10⁻⁴ mol/L dari persamaan kuadrat, sehingga pH sekitar 3,38. Ionisasi tidak lengkap menjelaskan perbedaannya.',
    explanation:
      'Jelaskan hasil dengan membedakan konsentrasi awal, derajat ionisasi, dan konsentrasi H₃O⁺. Apa yang tetap dan apa yang berubah?',
    embed:
      'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html',
    source: 'https://phet.colorado.edu/en/simulations/acid-base-solutions',
    attribution:
      'Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed under CC BY-NC 4.0 (https://phet.colorado.edu).',
    license: 'https://phet.colorado.edu/en/licensing',
  },
  {
    id: 'molecules',
    catalog: 'F07 / I-05',
    title: 'Kenali struktur molekul',
    icon: 'atom',
    description:
      'Putar model air, amonia, dan asam asetat; hubungkan struktur dengan perilaku proton.',
    goal: 'Menghubungkan rumus, gugus fungsi, dan model ruang tanpa menyimpulkan pH dari bentuk saja.',
    prediction:
      'Bagian mana dari struktur yang dapat menerima atau mendonorkan proton? Pilih satu molekul dan jelaskan dugaanmu.',
    instructions: [
      'Pilih air, amonia, atau asam asetat. Cocokkan nama dan CID dengan sumber PubChem.',
      'Seret untuk memutar model; gunakan roda mouse atau cubit dua jari untuk memperbesar.',
      'Bandingkan rumus molekul dengan struktur ringkas dan legenda warna. Rotasi hanya mengubah sudut pandang.',
    ],
    fallback:
      'Air: H–O–H, bentuk bengkok, dua H dan satu O. Amonia: NH₃, bentuk piramida trigonal, pasangan elektron bebas N dapat menerima proton. Asam asetat: CH₃–C(=O)–OH, proton gugus karboksil dapat dilepas dalam reaksi asam–basa. Struktur tidak memberikan satu pH tanpa konsentrasi dan kondisi larutan.',
    explanation:
      'Hubungkan struktur yang diamati dengan peran donor/akseptor proton. Mengapa pH tidak dapat ditentukan dari gambar molekul saja?',
    source: 'https://3dmol.org/doc/tutorial-url.html',
    attribution: 'Viewer 3Dmol.js; identitas dan model molekul dari PubChem, NCBI.',
  },
  {
    id: 'pubchem',
    catalog: 'F10 / I-07',
    title: 'Telusuri data senyawa',
    icon: 'search',
    description: 'Temukan CID, rumus, dan massa molar langsung dari PubChem.',
    goal: 'Memeriksa identitas senyawa dan membedakan properti molekul dari sifat larutan.',
    prediction:
      'Apakah adanya gugus OH selalu berarti senyawa bersifat basa dalam air? Bandingkan ethanol dan acetic acid.',
    instructions: [
      'Mulai dari asam asetat, amonia, atau etanol, lalu cocokkan nama, CID, dan rumus pada rekaman sumber.',
      'Bandingkan massa molar dalam g/mol. Jangan menyamakan massa molar dengan Mᵣ tanpa satuan.',
      'Tuliskan kesimpulan yang dapat didukung data. pH dan kekuatan asam memerlukan informasi tambahan.',
    ],
    fallback:
      'Asam asetat memiliki rumus C₂H₄O₂ (CH₃COOH), amonia NH₃, dan etanol C₂H₆O. Gugus OH pada etanol dan gugus karboksil pada asam asetat tidak memiliki perilaku asam–basa yang sama. Bila pencarian tidak tersedia, gunakan perbandingan struktur ini lalu periksa rekaman sumber saat jaringan pulih.',
    explanation:
      'Catat nama, CID, rumus, dan massa molar senyawa yang kamu pilih. Apa yang belum dapat disimpulkan tentang larutannya?',
    source: 'https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest',
    attribution: 'Data senyawa: PubChem, National Center for Biotechnology Information (NCBI).',
  },
];
export const molecules = [
  {
    cid: 962,
    name: 'Air',
    formula: 'H₂O',
    structure: 'H–O–H',
    meaning: 'Dua H dan satu O; molekul dapat berperan sebagai donor maupun akseptor proton.',
  },
  {
    cid: 222,
    name: 'Amonia',
    formula: 'NH₃',
    structure: 'NH₃',
    meaning: 'Tiga H dan satu N; pasangan elektron bebas N berkaitan dengan penerimaan proton.',
  },
  {
    cid: 176,
    name: 'Asam asetat',
    formula: 'C₂H₄O₂',
    structure: 'CH₃–C(=O)–OH',
    meaning: 'Dua C, empat H, dan dua O; amati gugus karboksil, bukan hanya keberadaan OH.',
  },
];
