import { activities, molecules } from '../data/activities.js';
export function normalizeActivityNotes(value) {
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Catatan tidak valid');
  const result = {};
  for (const activity of activities) {
    const note = value[activity.id];
    if (note === undefined) continue;
    if (!note || typeof note !== 'object' || Array.isArray(note))
      throw new Error('Catatan tidak valid');
    const fields = {};
    for (const field of ['prediction', 'observation', 'explanation']) {
      const text = note[field] ?? '';
      if (typeof text !== 'string' || text.length > 2000)
        throw new Error('Catatan terlalu panjang');
      fields[field] = text;
    }
    if (note.cid !== undefined && !molecules.some((m) => m.cid === note.cid))
      throw new Error('Identitas molekul tidak valid');
    if (
      note.completedAt &&
      (!Number.isFinite(Date.parse(note.completedAt)) ||
        !Object.values(fields).every((s) => s.trim().length))
    )
      throw new Error('Catatan belum lengkap');
    result[activity.id] = {
      ...fields,
      ...(note.cid !== undefined ? { cid: note.cid } : {}),
      ...(note.updatedAt ? { updatedAt: note.updatedAt } : {}),
      completedAt: note.completedAt || null,
    };
  }
  return result;
}
