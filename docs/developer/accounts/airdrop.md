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
- `id` → a unique identifier that enables multiple airdrops to be created by the same authority for the same token mint, improving flexibility and scalability

## Account data

```ts
type Airdrop = {
  discriminator: bytes;
  master: Address;
  authority: Address;
  mint: Address;
  delegateAuthority: Address;
  merkleRoot: bytes;
  id: number /* u64 */;
  supply: number /* u64 */;
  boost: number /* u64 */;
  startsAt: number /* i64 */;
  endsAt: number /* i64 */;
  bitmapCount: number /* u16 */;
  state: number /* u8 */;
  version: number /* u8 */;
  delegatePermissions: number /* u8 */;
  bump: number /* u8 */;
  padding: bytes;
};
```

This account has a fixed size of 216 bytes.

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
  mint: Address,
  id?: number,
): Promise<DropsyPda> {
  const seeds = [
    AIRDROP_SEED,
    getAddressEncoder().encode(authority),
    getAddressEncoder().encode(mint),
    getU64Encoder().encode(id ?? 0),
  ];
  return await getDropsyDerivedAddress(seeds);
}
```

## 🧱 Account Structure

| **Field**           | **Type**             | **Description**                                                                                        |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| `discriminator`     | `ReadonlyUint8Array` | Anchor account identifier (8 bytes).                                                                   |
| `master`            | `Address`            | Reference to the AirdropMaster account that manages protocol-level settings and fees.                  |
| `authority`         | `Address`            | Wallet authorized to manage and update the airdrop.                                                    |
| `mint`              | `Address`            | Token mint being distributed through the airdrop.                                                      |
| `delegateAuthority` | `Address`            | Optional delegated authority allowed to perform claim-related actions on behalf of the authority.      |
| `merkleRoot`        | `ReadonlyUint8Array` | Merkle root used to verify eligible claimants and claim allocations.                                   |
| `id`                | `bigint`             | Unique identifier used in PDA derivation to support multiple airdrops for the same authority and mint. |
| `supply`            | `bigint`             | Total amount of tokens allocated to the airdrop.                                                       |
| `boost`             | `bigint`             | Boost value applied to the airdrop for rewards, points, or protocol-specific incentive calculations.   |
| `startsAt`          | `bigint`             | Unix timestamp indicating when claiming becomes available.                                             |
| `endsAt`            | `bigint`             | Unix timestamp indicating when the airdrop expires and claiming ends.                                  |
| `bitmapCount`       | `number`             | Number of Bitmap accounts associated with this airdrop for claim tracking.                             |
| `state`             | `number`             | Current lifecycle state of the airdrop (e.g. Active, Paused, Closed).                                  |
| `version`           | `number`             | Account version used for upgrades and backward compatibility.                                          |
| `bump`              | `number`             | PDA bump used to derive the Airdrop account.                                                           |
| `padding`           | `ReadonlyUint8Array` | Reserved bytes used for account alignment and future upgrades.                                         |

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
