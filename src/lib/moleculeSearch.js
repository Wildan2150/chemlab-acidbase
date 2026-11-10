function normalize(value) {
  return String(value)
    .normalize('NFKC')
    .toLocaleLowerCase('id')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function searchMolecules(molecules, query = '', category = '') {
  const cidQuery = String(query)
    .trim()
    .match(/^(?:cid[\s:#-]*)?(\d+)$/i);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return molecules.filter((molecule) => {
    if (category && molecule.category !== category) return false;
    if (cidQuery) return molecule.cid === Number(cidQuery[1]);
    const text = normalize(
      [
        molecule.name,
        molecule.formula,
        molecule.formulaText,
        molecule.structure,
        `CID ${molecule.cid}`,
        ...(molecule.aliases || []),
      ].join(' '),
    );
    const words = text.split(/\s+/);
    return terms.every((term) => words.some((word) => word.startsWith(term)));
  });
}
