---
title: "Prepare-Claim-List"
sidebar_position: 1
---

# 📦 Prepare Claim List

This page explains how to **prepare the eligible wallets list** for a Dropsy airdrop, also known as the **Claim List**, and generate the **Merkle tree root**, which is required to create an on-chain airdrop.

---

## Purpose

The **Claim List** is a structured list of wallets and their eligible token amounts for an airdrop.  
Using this list, we generate a **Merkle tree**, which allows:

- Efficient verification of claims on-chain.
- Preventing users from claiming more than their allocated amount.
- Minimal storage footprint on Solana.

> The **Merkle root** derived from this list is a required argument when creating a new airdrop.

---

## Step 1: Install dependencies

We use [`merkletreejs`](https://www.npmjs.com/package/merkletreejs) for generating the Merkle tree and Node’s `crypto` module for hashing.

```bash
npm install merkletreejs
```

crypto comes built-in with Node.js, no need to install separately.

## Step 2: Create a utility file

Create a new file **/utils/merkle.ts** to define helpers for building the Merkle tree.

```ts
import { createHash } from "crypto";
import MerkleTree from "merkletreejs";

/**
 * Hash a single claim entry (leaf) with SHA256.
 */
export function hashLeaf(
  index: number,
  address: string,
  amount: number
): Buffer {
  const data = `${index}:${address}:${amount.toString()}`;
  return createHash("sha256").update(data).digest();
}

/**
 * Generate a ReadonlyUint8Array from a Merkle tree root.
 * This is the format expected by the on-chain program.
 */
export const getMerkleRootArray = (
  merkleTree: MerkleTree
): ReadonlyUint8Array => {
  const root = merkleTree.getRoot();

  if (root.length !== 32) {
    throw new Error("Merkle root must be 32 bytes");
  }

  // Convert Buffer → Uint8Array
  return new Uint8Array(root) as ReadonlyUint8Array;
};

/**
 * Create a Merkle tree from a claim list.
 * Each entry must include: index, wallet address, and amount.
 */
export const createMerkleTree = (
  claimList: { index: number; address: string; amount: number }[]
) => {
  const leaves = claimList.map(({ index, address, amount }) =>
    hashLeaf(index, address, amount)
  );

  return new MerkleTree(
    leaves,
    (data: Buffer) => createHash("sha256").update(data).digest(),
    { sortPairs: true }
  );
};
```

## Step 3: Usage example

```ts
import { createMerkleTree, getMerkleRootArray } from "./utils/merkle"; // verify path
const claimList = [
  { index: 0, address: "WalletAddress1", amount: 100 },
  { index: 1, address: "WalletAddress2", amount: 200 },
  // Add more eligible wallets here
];

// 1️⃣ Create Merkle tree
const merkleTree = createMerkleTree(claimList);

// 2️⃣ Get Merkle root in the format expected by the program
const merkleRoot = getMerkleRootArray(merkleTree);

console.log("Merkle Root:", merkleRoot);
```

:::note
The **merkleRoot** can now be passed as an argument when creating a new airdrop on-chain.
:::

✅ Summary

- Prepare Claim List → Wallets & amounts

- Generate Merkle Tree → Derive **Merkle root**
