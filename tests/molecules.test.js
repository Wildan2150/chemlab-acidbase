import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { molecules } from '../src/data/molecules.js';
import { searchMolecules } from '../src/lib/moleculeSearch.js';
import { normalizeActivityNotes } from '../src/lib/activityNotes.js';

test('catalogue search accepts Indonesian and English names, CID, and Unicode formulas', () => {
  for (const [query, expected] of [
    ['asam asetat', 176],
    ['acetic acid', 176],
    ['CID: 311', 311],
    ['176', 176],
    ['H₂O₂', 784],
    ['h2o2', 784],
    ['aspirin', 2244],
    ['asam 338', 338],
  ]) {
    assert.deepEqual(
      searchMolecules(molecules, query).map((m) => m.cid),
      [expected],
      query,
    );
  }
});

test('category and empty-result searches preserve catalogue data and support literal special characters', () => {
  const before = JSON.stringify(molecules);
  const nitrogen = searchMolecules(molecules, '', 'Senyawa nitrogen');
  assert.ok(nitrogen.length > 3);
  assert.ok(nitrogen.every((m) => m.category === 'Senyawa nitrogen'));
  assert.deepEqual(searchMolecules(molecules, 'ethanol', 'Asam'), []);
  assert.deepEqual(searchMolecules(molecules, 'senyawa tidak ditemukan'), []);
  assert.doesNotThrow(() => searchMolecules(molecules, '[.*('));
  assert.equal(JSON.stringify(molecules), before);
});

test('new CID selections survive note normalization alongside the original three molecules', () => {
  for (const cid of [962, 222, 176, 2244, 1146, 311]) {
    const notes = normalizeActivityNotes({
      molecules: { cid, prediction: 'Amati struktur', observation: '', explanation: '' },
    });
    assert.equal(notes.molecules.cid, cid);
    assert.equal(notes.molecules.prediction, 'Amati struktur');
  }
});

test('every catalogue CID has an authentic complete 3D SDF with matching atoms, formula and provenance', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../public/molecules/sources.json', import.meta.url), 'utf8'),
  );
  assert.ok(molecules.length >= 30);
  assert.equal(new Set(molecules.map((m) => m.cid)).size, molecules.length);
  assert.equal(manifest.records.length, molecules.length);
  for (const molecule of molecules) {
    const record = manifest.records.find((r) => r.cid === molecule.cid);
    assert.ok(record, `Missing provenance for ${molecule.cid}`);
    const sdf = await readFile(
      new URL(`../public/molecules/${molecule.cid}.sdf`, import.meta.url),
      'utf8',
    );
    assert.equal(createHash('sha256').update(sdf).digest('hex'), record.sha256);
    const lines = sdf.split(/\r?\n/);
    assert.equal(Number(lines[0]), molecule.cid);
    assert.match(lines[1], /3D$/);
    assert.match(lines[3], /V2000$/);
    const atomCount = Number(lines[3].slice(0, 3));
    assert.equal(atomCount, molecule.atomCount);
    assert.equal(atomCount, record.atoms);
    const elements = {};
    for (const line of lines.slice(4, 4 + atomCount)) {
      const element = line.slice(31, 34).trim();
      elements[element] = (elements[element] || 0) + 1;
      assert.ok(
        [line.slice(0, 10), line.slice(10, 20), line.slice(20, 30)].every((x) =>
          Number.isFinite(Number(x)),
        ),
      );
    }
    assert.deepEqual(elements, molecule.elements);
    const formulaElements = Object.fromEntries(
      [...molecule.formulaText.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(([, el, n]) => [
        el,
        Number(n || 1),
      ]),
    );
    assert.deepEqual(elements, formulaElements);
    const bonds = Number(lines[3].slice(3, 6));
    assert.equal(bonds, record.bonds);
    for (const bond of lines.slice(4 + atomCount, 4 + atomCount + bonds)) {
      for (const start of [0, 3])
        assert.ok(
          Number(bond.slice(start, start + 3)) >= 1 &&
            Number(bond.slice(start, start + 3)) <= atomCount,
        );
    }
    assert.ok(sdf.includes('M  END'));
  }
});
