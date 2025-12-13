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
  authority: Address
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

| **Field**            | **Type**             | **Description**                                                               |
| -------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `discriminator`      | `ReadonlyUint8Array` | Anchor account identifier (8 bytes).                                          |
| `affiliateMaster`    | `Address`            | Pointer to the global Affiliate Master account used verify the Affiliates.    |
| `authority`          | `Address`            | Main authority allowed to configure or manage the AirdropMaster.              |
| `merkleRoot`         | `ReadonlyUint8Array` | Merkle root used for Limited Access (WL) verification or authorization logic. |
| `airdropsCreated`    | `bigint`             | Number of airdrop created with this master.                                   |
| `maxAirdropsAllowed` | `bigint`             | Maximum allowed number of airdrops to use this master.                        |
| `bitmapCreated`      | `bigint`             | Number of bitmaps created (claim maps).                                       |
| `maxBitmapAllowed`   | `bigint`             | Maximum allowed number of bitmaps to use this master.                         |
| `airdropCreationFee` | `bigint`             | Fee required to create an airdrop.                                            |
| `airdropUpdateFee`   | `bigint`             | Fee required to update an existing airdrop.                                   |
| `airdropCloseFee`    | `bigint`             | Fee required to close an airdrop.                                             |
| `airdropClaimFee`    | `bigint`             | Fee charged during a claim.                                                   |
| `airdropDelegateFee` | `bigint`             | Fee for delegating claim authority.                                           |
| `airdropDepositFee`  | `bigint`             | Fee for depositing additional tokens into an airdrop.                         |
| `bitmapCreationFee`  | `bigint`             | Fee required to create a Bitmap (claim map).                                  |
| `bitmapCloseFee`     | `bigint`             | Fee required to close a Bitmap.                                               |
| `bump`               | `number`             | PDA bump for AirdropMaster.                                                   |
| `padding`            | `ReadonlyUint8Array` | Space reserved for padding.                                                   |

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
