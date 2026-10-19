// Frani Registry — verified directory domain logic.
// Businesses/nametags register a signed claim; a verifier can attest it.
// Search matches nametag, business name, category, or claim text.

export function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function registerEntry({ nametag, businessName, category, claim, signedBy }) {
  if (!nametag || !String(nametag).trim()) throw new Error('an entry needs a nametag');
  if (!businessName || !String(businessName).trim()) throw new Error('an entry needs a business name');
  if (!signedBy) throw new Error('an entry needs a signer');
  return {
    id: newId('reg'),
    nametag: String(nametag).trim().replace(/^@/, ''),
    businessName: String(businessName).trim(),
    category: String(category || '').trim(),
    claim: String(claim || '').trim(),
    signedBy,
    verified: false,
    verifiedBy: null,
    createdAt: new Date().toISOString(),
  };
}

export function verifyEntry(entry, verifier) {
  if (!entry) throw new Error('entry not found');
  if (!verifier) throw new Error('a verifier is required');
  entry.verified = true;
  entry.verifiedBy = verifier;
  entry.verifiedAt = new Date().toISOString();
  return entry;
}

export function search(entries, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) =>
    [e.nametag, e.businessName, e.category, e.claim]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
}

export function renderEntry(entry) {
  const mark = entry.verified ? `✓ verified by ${entry.verifiedBy}` : 'unverified';
  return `${entry.nametag} · ${entry.businessName} · ${entry.category || '—'} · ${mark}`;
}
