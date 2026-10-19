// Frani Registry — unit tests (plain node).
import assert from 'node:assert/strict';
import { registerEntry, verifyEntry, search } from '../src/registry.js';

const entry = registerEntry({
  nametag: '@alice',
  businessName: 'Alice Design',
  category: 'design',
  claim: 'Delivers on time',
  signedBy: '0xAlice',
});

assert.equal(entry.nametag, 'alice');
assert.equal(entry.verified, false);

// verify
verifyEntry(entry, '0xChamber');
assert.equal(entry.verified, true);
assert.equal(entry.verifiedBy, '0xChamber');

// search across fields
assert.equal(search([entry], 'alice').length, 1);
assert.equal(search([entry], 'design').length, 1);
assert.equal(search([entry], 'on time').length, 1);
assert.equal(search([entry], 'nope').length, 0);

// validation
assert.throws(() => registerEntry({ nametag: '', businessName: 'X', signedBy: '0x' }), /nametag/);
assert.throws(() => registerEntry({ nametag: '@a', businessName: '', signedBy: '0x' }), /business name/);

console.log('registry.test.js — all passed');
