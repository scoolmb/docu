---
title: "Airdrop Master"
sidebar_position: 1
---

# 📦 Airdrop Master

This page documents the **`Airdrop Master`** PDA Account.

## 📘 Overview

The **Airdrop Master** account defines the global configuration for all airdrops created through that specific master.
Each partner or creator can initialize their own AirdropMaster, allowing them to:

- Set their own fee structure
- Manage their own authority
- Monetize their operations by receiving protocol fees generated through this master

This design allows Dropsy to support multiple independent ecosystems (projects, partners, NFT communities, DAOs, DeFi apps) while keeping the framework fully decentralized and modular.

---

## 🔐 PDA Derivation

The **AirdropMaster PDA** is derived using the following seeds:

- `airdrop_master` → constant seed identifying the master namespace
- `authority` → the wallet (or program) that owns & manages this specific master

## Account data

```ts
type AirdropMaster = {
  discriminator: bytes;
  creator: Address;
  authority: Address;
  treasury: Address;
  createdAirdrops: number /* u64 */;
  points: number /* u64 */;
  totalClaimCount: number /* u64 */;
  airdropUpdateFee: number /* u64 */;
  airdropCreationFee: number /* u64 */;
  airdropClaimFee: number /* u64 */;
  bitmapCreationFee: number /* u64 */;
  bump: number /* u8 */;
  padding: bytes;
  reserved: bytes;
};
```

This account has a fixed size of 296 bytes.

### Derive Airdrop Master Pda Example

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

export async function getAirdropMasterDerivedAddress(
  authority: Address,
): Promise<DropsyPda> {
  const seeds = [
    Buffer.from("airdrop_master"),
    getAddressEncoder().encode(authority),
  ];
  return await getProgramDerivedAddress({
    seeds,
    programAddress: DROPSY_PROGRAM_ADDRESS,
  });
}
```

## 🧱 Account Structure

| **Field**            | **Type**             | **Description**                                                             |
| -------------------- | -------------------- | --------------------------------------------------------------------------- |
| `discriminator`      | `ReadonlyUint8Array` | Anchor account identifier (8 bytes).                                        |
| `creator`            | `Address`            | Wallet that originally created the AirdropMaster account.                   |
| `authority`          | `Address`            | Main authority allowed to configure and manage the AirdropMaster.           |
| `treasury`           | `Address`            | Treasury wallet that receives protocol fees collected by the AirdropMaster. |
| `createdAirdrops`    | `bigint`             | Total number of airdrops created through this AirdropMaster.                |
| `points`             | `bigint`             | Accumulated points associated with the AirdropMaster activity.              |
| `totalClaimCount`    | `bigint`             | Total number of successful claims processed across all managed airdrops.    |
| `airdropUpdateFee`   | `bigint`             | Fee required to update an existing airdrop.                                 |
| `airdropCreationFee` | `bigint`             | Fee required to create a new airdrop.                                       |
| `airdropClaimFee`    | `bigint`             | Fee charged when a user claims tokens from an airdrop.                      |
| `airdropDelegateFee` | `bigint`             | Fee required to delegate airdrop authority.                                 |
| `bitmapCreationFee`  | `bigint`             | Fee required to create a Bitmap account for claim tracking.                 |
| `bump`               | `number`             | PDA bump used to derive the AirdropMaster account.                          |
| `padding`            | `ReadonlyUint8Array` | Reserved bytes used for account alignment and future upgrades.              |
|                      |

## 📥 Fetch Airdrop Master Account

```ts
import { address } from "@solana/kit";
import { fetchAirdropMaster } from "@dropsy/sdk";

// The AirdropMaster PDA you want to fetch
const airdrop_master_address = address("12354.....abndks");

(async () => {
  try {
    const master = await fetchAirdropMaster(rpc, airdrop_master_address);

    console.log("Airdrop Master Loaded:");
    console.log("Authority:", master.authority.toString());
  } catch (err) {
    console.error("Failed to fetch AirdropMaster:", err);
  }
})();
```
