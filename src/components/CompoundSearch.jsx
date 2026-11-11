import { useEffect, useRef, useState } from 'react';
import { searchCompounds, compoundUrl } from '../lib/pubchem.js';
import { Icon } from './Visuals.jsx';
import { useContextualHelp } from '../contexts/ContextualHelpContext.jsx';

export default function CompoundSearch() {
  const help = useContextualHelp();
  const [query, setQuery] = useState('');
  const [state, setState] = useState({ status: 'idle', result: [], term: '', message: '' });
  const controller = useRef(null);
  const sequence = useRef(0);
  const nextAllowed = useRef(0);
  useEffect(
    () => () => {
      sequence.current++;
      controller.current?.abort();
    },
    [],
  );
  async function search(term = query) {
    const delay = Math.max(0, nextAllowed.current - Date.now());
    nextAllowed.current = Date.now() + delay + 700;
    const request = ++sequence.current;
    controller.current?.abort();
    const aborter = new AbortController();
    controller.current = aborter;
    const timer = setTimeout(() => aborter.abort('timeout'), 12000);
    const clean = term.trim();
    setState({ status: 'loading', result: [], term: clean, message: '' });
    try {
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      if (aborter.signal.aborted) throw new Error('Pencarian dibatalkan.');
      const result = await searchCompounds(clean, aborter.signal);
      if (sequence.current === request) {
        setState({ status: 'success', result, term: clean, message: '' });
        help.resolve('pubchem-search');
      }
    } catch (error) {
      if (sequence.current === request) {
        help.signal('pubchem-search');
        setState({
          status: 'error',
          result: [],
          term: clean,
          message: aborter.signal.aborted
            ? 'Waktu tunggu habis. Periksa jaringan dan coba kembali.'
            : error instanceof TypeError
              ? 'PubChem belum dapat dihubungi. Periksa jaringan dan coba kembali.'
              : error.message,
        });
      }
    } finally {
      clearTimeout(timer);
    }
  }
  function change(value) {
    sequence.current++;
    controller.current?.abort();
    setQuery(value);
    setState({ status: 'idle', result: [], term: '', message: '' });
  }
  return (
    <section className="compound-search" aria-labelledby="compound-search-title">
      <h2 id="compound-search-title">Cari identitas senyawa</h2>
      <p>Gunakan nama berbahasa Inggris untuk memperluas penelusuran.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <label htmlFor="compound-query">Nama senyawa</label>
        <div className="compound-search-row">
          <input
            id="compound-query"
            maxLength="100"
            placeholder="Misalnya: acetic acid"
            value={query}
            onChange={(e) => change(e.target.value)}
            required
          />
          <button className="button primary" disabled={state.status === 'loading'}>
            {state.status === 'loading' ? 'Mencari…' : 'Cari senyawa'}
            <Icon name="search" size={16} />
          </button>
        </div>
      </form>
      <div className="compound-presets">
        {[
          ['Asam asetat', 'acetic acid'],
          ['Amonia', 'ammonia'],
          ['Etanol', 'ethanol'],
        ].map(([label, value]) => (
          <button
            key={value}
            className="button outline small"
            onClick={() => {
              change(value);
              search(value);
            }}
            disabled={state.status === 'loading'}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="compound-status" role="status" aria-live="polite">
        {state.status === 'loading' && `Menelusuri “${state.term}” di PubChem…`}
        {state.status === 'error' && state.message}
        {state.status === 'success' &&
          `${state.result.length} rekaman ditemukan untuk “${state.term}”. Cocokkan identitas melalui CID.`}
      </div>
      {state.status === 'error' && (
        <button className="text-button" onClick={() => search(state.term)}>
          Coba lagi
          <Icon name="reset" size={15} />
        </button>
      )}
      <div className="compound-results">
        {state.result.map((item) => (
          <article className="compound-card" key={item.cid}>
            <span className="eyebrow">PUBCHEM · CID {item.cid}</span>
            <h3>{item.name}</h3>
            <dl>
              <div>
                <dt>Rumus molekul</dt>
                <dd>{item.formula}</dd>
              </div>
              <div>
                <dt>Massa molar</dt>
                <dd>
                  {item.molarMass.toLocaleString('id-ID', { maximumFractionDigits: 4 })} g/mol
                </dd>
              </div>
            </dl>
            <a href={compoundUrl(item.cid)} className="small-link" target="_blank" rel="noreferrer">
              Periksa rekaman sumber
              <Icon name="external" size={14} />
            </a>
          </article>
        ))}
      </div>
      <p className="caption">
        Data: PubChem, NCBI. Nama dapat merujuk beberapa struktur. Rumus dan massa molar tidak
        menentukan pH larutan tanpa konsentrasi serta kondisi.
      </p>
    </section>
  );
}
