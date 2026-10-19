# Frani Registry

A verified directory of businesses and nametags on Unicity testnet2. Anyone
registers a signed claim; a verifier can attest it. Search across nametag,
business name, category, and claim.

Made by **CRYPTFRANI**. Owner / creator: **Itachi**.

---

## Track

Identity / Open.

## Is it Agentic?

No. Frani Registry records and verifies signed claims. No autonomous behaviour,
no model in the loop.

## Runs on AstridOS?

No.

## Live on-network

- Network: **testnet2**
- Each deployment holds its own wallet and prints its address at startup.

## SDK features used

| Feature | Where |
|---|---|
| Wallet identity | `src/wallet.js` (Sphere SDK) |
| Nametags | entries are keyed by nametag |

## Commands

```bash
npm run register -- --nametag @alice --business "Alice Design" --category design
npm run verify -- <entryId> --by 0xChamber
npm run search -- design
npm run list
```
