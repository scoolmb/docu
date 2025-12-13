---
title: "Airdrop"
sidebar_position: 2
---

# 📦 Airdrop

This page documents the **`Airdrop`** PDA Account.

## 📘 Overview

The **Airdrop** Account defines a token distribution event within the Dropsy protocol.  
It stores configuration, timing rules, supply, Merkle-based whitelisting, delegation permissions, and links to related accounts such as the Affiliate, Bitmap, and Vesting Accounts.

This account is a **zero-copy PDA**, enabling highly efficient on-chain reads.

---

## 🔐 PDA Derivation

The **AirdropMaster PDA** is derived using the following seeds:

- `airdrop` → constant seed identifying the airdrop namespace
- `authority` → the wallet (or program) that owns & manages the airdrop
- `mint` → the mint address (airdropped token)

### Derive Airdrop Pda Example

```ts
import {
  Address,
  getAddressEncoder,
  getProgramDerivedAddress,
  ProgramDerivedAddressBump,
  ReadonlyUint8Array,
} from "@solana/kit";

export type DropsyPda = readonly [Address<string>, ProgramDerivedAddressBump];
type Seed = ReadonlyUint8Array | string;

export async function getAirdropDerivedAddress(
  authority: Address,
  mint: Address
): Promise<DropsyPda> {
  const seeds = [
    Buffer.from("airdrop"),
    getAddressEncoder().encode(mint),
    getAddressEncoder().encode(authority),
  ];
  return await getProgramDerivedAddress({
    seeds,
    programAddress: DROPSY_PROGRAM_ADDRESS,
  });
}
```

## 🧱 Account Structure

| **Field**             | **Type**             | **Description**                                                   |
| --------------------- | -------------------- | ----------------------------------------------------------------- |
| `discriminator`       | `ReadonlyUint8Array` | Anchor 8-byte account discriminator.                              |
| `master`              | `Address`            | Parent AirdropMaster PDA.                                         |
| `authority`           | `Address`            | Wallet allowed to update/close this airdrop.                      |
| `mint`                | `Address`            | Token mint being distributed.                                     |
| `delegateAuthority`   | `Address`            | Optional delegated authority for claim map operations.            |
| `presale`             | `Address`            | Address used for presale or restricted access logic.              |
| `merkleRoot`          | `ReadonlyUint8Array` | Merkle root for WL / eligibility validation.                      |
| `supply`              | `bigint`             | Total token supply allocated to this airdrop.                     |
| `boost`               | `bigint`             | Boost multiplier applied for boosted claim mechanics.             |
| `startsAt`            | `bigint`             | Unix timestamp for when the airdrop becomes claimable.            |
| `endsAt`              | `bigint`             | Unix timestamp when the airdrop ends (claims disabled).           |
| `bitmapCount`         | `number`             | Number of Bitmap (claim maps) created under this airdrop.         |
| `delegatePermissions` | `number`             | Bitmask defining what permissions delegates have.                 |
| `mutable`             | `number`             | Whether this airdrop can be updated (0 = immutable, 1 = mutable). |
| `state`               | `number`             | Current airdrop state (Active, Closed, Drained, etc.).            |
| `version`             | `number`             | Version of the Airdrop layout.                                    |
| `bump`                | `number`             | PDA bump seed.                                                    |
| `padding`             | `ReadonlyUint8Array` | Reserved space for future upgrades.                               |

## 📥 Fetch Airdrop Account

```ts
import { address } from "@solana/kit";
import { fetchAirdrop } from "@dropsy/sdk";

// The AirdropMaster PDA you want to fetch
const airdrop_address = address("12354.....abndks");

(async () => {
  try {
    const airdrop = await fetchAirdrop(rpc, airdrop_address);

    console.log("Airdrop Loaded:");
    console.log("Authority:", airdrop.authority.toString());
  } catch (err) {
    console.error("Failed to fetch Airdrop:", err);
  }
})();
```
