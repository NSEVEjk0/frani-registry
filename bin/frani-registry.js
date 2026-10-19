#!/usr/bin/env node
// Frani Registry — CLI + daemon entrypoint.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';
import { config } from '../src/config.js';
import { Store } from '../src/store.js';
import { registerEntry, verifyEntry, search, renderEntry } from '../src/registry.js';

export const HELP = `Frani Registry — verified directory on Unicity testnet2

Usage:
  frani-registry register --nametag @alice --business "Alice Design" [--category design] [--claim "…"] [--by <address>]
  frani-registry verify <entryId> --by <verifier>
  frani-registry search <query>
  frani-registry list
  frani-registry about
  frani-registry help
`;

export const aboutText = `Frani Registry — a verified directory of businesses and nametags on Unicity testnet2.
Made by CRYPTFRANI. Owner / creator: Itachi.
`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) out[a.slice(2, eq)] = a.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
      else out[a.slice(2)] = true;
    } else out._.push(a);
  }
  return out;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const store = new Store(config.dataDir);

  switch (cmd) {
    case 'register': {
      const entry = registerEntry({
        nametag: args.nametag,
        businessName: args.business,
        category: args.category,
        claim: args.claim,
        signedBy: args.by || 'anon',
      });
      await store.save(entry);
      console.log(`Registered ${renderEntry(entry)}`);
      console.log(`Entry id: ${entry.id}`);
      break;
    }
    case 'verify': {
      const entry = await store.get(rest[0]);
      verifyEntry(entry, args.by);
      await store.save(entry);
      console.log(`Verified — ${renderEntry(entry)}`);
      break;
    }
    case 'search': {
      const entries = search(await store.list(), rest[0] || '');
      if (entries.length === 0) console.log('No matches.');
      for (const e of entries) console.log(renderEntry(e));
      break;
    }
    case 'list': {
      const entries = await store.list();
      if (entries.length === 0) console.log('Registry is empty.');
      for (const e of entries) console.log(renderEntry(e));
      break;
    }
    case 'about':
      console.log(aboutText);
      break;
    case 'help':
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
