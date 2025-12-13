---
title: "Claim Map"
sidebar_position: 3
---

# 🗺️ Claim Map

This page documents the **`Claim Map`** PDA Account.

---

## 📘 Overview

A **Claim Map** is a bitmap-based structure used to track **which addresses have already claimed** tokens from a specific airdrop.

It allows Dropsy to:

- Efficiently store claim status
- Avoid double-claims
- Support extremely large airdrop lists (100k+ entries)
- Use a compact bitmap instead of storing a list

Each ClaimMap belongs to a specific **Airdrop**, and each map represents **a segment** of the claiming list.

This design allows scalable, gas-efficient claiming with minimal storage use.

---

## 🔐 PDA Derivation

ClaimMap PDAs are derived using:

Where:

- `claim_map` → static namespace seed
- `airdrop` → the parent Airdrop PDA
- `id` → the bitmap segment index (0, 1, 2, …)

Each bitmap typically covers **8,192 claim slots** (or the size defined in program constants).

### Derive Claim Map Pda Example

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

export async function getClaimMapDerivedAddress(
  airdrop: Address,
  id: number
): Promise<DropsyPda> {
  const seeds = [
    Buffer.from("bitmap"),
    getAddressEncoder().encode(airdrop),
    Buffer.from([id]),
  ];
  return await getProgramDerivedAddress({
    seeds,
    programAddress: DROPSY_PROGRAM_ADDRESS,
  });
}
```

## 🧱 Account Structure

| **Field**       | **Type**             | **Description**                                                      |
| --------------- | -------------------- | -------------------------------------------------------------------- |
| `discriminator` | `ReadonlyUint8Array` | Anchor 8-byte account discriminator.                                 |
| `authority`     | `Address`            | Authority allowed to update or close the ClaimMap.                   |
| `airdrop`       | `Address`            | The parent Airdrop this map belongs to.                              |
| `claimedBitmap` | `ReadonlyUint8Array` | Bitmap where each bit represents whether an index has claimed.       |
| `total`         | `number`             | Number of total claimable addresses stored in this ClaimMap segment. |
| `id`            | `number`             | Sequential identifier of this bitmap (0,1,2…).                       |
| `version`       | `number`             | ClaimMap version.                                                    |
| `bump`          | `number`             | PDA bump.                                                            |

## 📥 Fetch Claim-Map Account

```ts
import { address } from "@solana/kit";
import { fetchClaimMap } from "@dropsy/sdk";

// The AirdropMaster PDA you want to fetch
const claim_map_address = address("12354.....abndks");

(async () => {
  try {
    const claim_map = await fetchClaimMap(rpc, claim_map_address);

    console.log("claim_map Loaded:");
    console.log("Authority:", claim_map.authority.toString());
  } catch (err) {
    console.error("Failed to fetch ClaimMap:", err);
  }
})();
```
