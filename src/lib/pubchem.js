const root = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound';
export const compoundUrl = (cid) => `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
export async function searchCompounds(query, signal) {
  const cleaned = query.trim();
  if (!cleaned || cleaned.length > 100)
    throw new Error('Masukkan nama senyawa sepanjang 1–100 karakter.');
  const response = await fetch(
    `${root}/name/${encodeURIComponent(cleaned)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`,
    { signal, credentials: 'omit', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404)
    throw new Error('Senyawa tidak ditemukan. Coba nama lain atau nama berbahasa Inggris.');
  if ([429, 503].includes(response.status))
    throw new Error('PubChem sedang sibuk. Tunggu sejenak sebelum mencoba lagi.');
  if (!response.ok)
    throw new Error('Data belum dapat dimuat dari PubChem. Coba lagi saat jaringan tersedia.');
  const data = await response.json();
  const properties = data?.PropertyTable?.Properties;
  if (
    !Array.isArray(properties) ||
    properties.length === 0 ||
    !properties.every(
      (p) =>
        Number.isInteger(p.CID) &&
        p.CID > 0 &&
        typeof p.MolecularFormula === 'string' &&
        p.MolecularFormula.length < 100 &&
        Number.isFinite(Number(p.MolecularWeight)) &&
        Number(p.MolecularWeight) > 0,
    )
  )
    throw new Error('Respons sumber belum dapat dibaca. Coba lagi atau buka PubChem langsung.');
  return properties
    .slice(0, 5)
    .map((p) => ({
      cid: p.CID,
      formula: p.MolecularFormula,
      molarMass: Number(p.MolecularWeight),
      name: typeof p.IUPACName === 'string' ? p.IUPACName.slice(0, 250) : cleaned,
    }));
}
