import { useState } from 'react';
import { moleculeCategories, molecules } from '../data/molecules.js';
import { searchMolecules } from '../lib/moleculeSearch.js';
import { Icon } from './Visuals.jsx';

export default function MoleculeChooser({ cid, onChange }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const matches = searchMolecules(molecules, query, category);
  const selected = molecules.find((molecule) => molecule.cid === cid);
  const selectedMatches = matches.some((molecule) => molecule.cid === cid);
  const option = (molecule) => (
    <option key={molecule.cid} value={molecule.cid}>
      {molecule.name} · {molecule.formula} · CID {molecule.cid}
    </option>
  );

  return (
    <>
      <div className="molecule-search-fields">
        <div>
          <label htmlFor="molecule-search">Cari molekul atau CID</label>
          <input
            id="molecule-search"
            type="search"
            value={query}
            placeholder="Nama, rumus, atau CID: etanol, H₂O, 176…"
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby="molecule-results"
          />
        </div>
        <div>
          <label htmlFor="molecule-category">Kelompok senyawa</label>
          <select
            id="molecule-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Semua kelompok</option>
            {moleculeCategories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="molecule-search-summary">
        <p id="molecule-results" role="status">
          {matches.length
            ? `${matches.length} dari ${molecules.length} molekul tersedia.`
            : 'Tidak ada molekul yang cocok. Coba nama, rumus, atau CID lain.'}
          {!selectedMatches && ` Model yang diamati: ${selected.name}.`}
        </p>
        {(query || category) && (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setQuery('');
              setCategory('');
            }}
          >
            <Icon name="reset" size={14} /> Hapus pencarian
          </button>
        )}
      </div>
      <label htmlFor="molecule-cid">Molekul yang diamati</label>
      <select
        id="molecule-cid"
        value={cid}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {!selectedMatches && <optgroup label="Sedang diamati">{option(selected)}</optgroup>}
        {moleculeCategories.map((name) => {
          const group = matches.filter((molecule) => molecule.category === name);
          return group.length ? (
            <optgroup key={name} label={name}>
              {group.map(option)}
            </optgroup>
          ) : null;
        })}
      </select>
    </>
  );
}
