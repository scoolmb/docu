---
title: "Create-Airdrop"
sidebar_position: 2
---

# 📦 Create Airdrop

This page explains how to create your **first Dropsy Airdrop** using the SDK.  
We’ll cover **preparing accounts, generating the Merkle root**, and **creating the airdrop on-chain**.

---

## Purpose

An **Airdrop** allows you to distribute tokens to eligible wallets efficiently and securely.  
:::note
in this tutorial we will be using the same **merkleRoot** we got in [prepare claim list tutorial](/developer/Tutorials/prepare-claim-list)
:::

in This Example we will see an example of how to create an airdrop :

---

## Prepare the Claim List

Follow the instructions in [Prepare Claim List](https://docs.dropsy.xyz/developer/Tutorials/Prepare-Claim-List) to:

- Collect eligible wallets and token amounts
- Generate the Merkle tree
- Get the **Merkle root**

Once You have The **MerkleRoot** for The Claim List, You are Ready To Create your first **Airdrop**

## Instructions

1- [**create airdrop instruction**](#create-airdrop)
This Will Create an On-chain Airdrop Pda where we will store airdrop configurations (startsTime,endTime, merkleRoot...)

2- [**create Claim-map instruction**](#create-claim-map)
This Will Create an On-chain Bitmap Pda to help us Track Who has claimed, and prevent duplicate Claims

3- [**deposit tokens instruction**](#deposit-tokens)
We will Use This instruction to transfer tokens from the wallet authority to **Airdrop** Vault (ATA)

### Create Airdrop

```ts
const mint = address("J6ZenG1ZJ1uQ7em3UxjkvjB8AVE178aetBsHBtmc2Yjh");

const createAirdropIx = await getCreateAirdropV0Instruction({
  mint,
  authority: wallet,
  merkleRoot,
});
```

### Create Claim-map

```ts
const [claimMapPda, claimMapBump] = await getClaimMapDerivedAddress(
  airdropPda,
  id
);

const createClaimMapIx = await getCreateClaimMapV0Instruction({
  airdrop: airdropPda, // optional it will be derived if not provided
  claimMap: claimMapPda, // optional it will be derived if not provided
  mint: address("4bHGhpbSfvpAnAx6dxHyUyRZE1dRhiRTXcBPfxvYZKrq"),
  authority: wallet,
  id: 0, // optional default 0 if not provided
});
```

### Deposit Tokens

```ts
// get associated token account for the wallet authority
const [sourceTokenAccount, sourceATABump] = await findAssociatedTokenPda({
  owner: wallet.address,
  mint: mint,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});
// get the instruction
const depositIx = await getDepositTokensInstructionAsync({
  sourceTokenAccount,
  mint,
  airdrop: airdropPda,
  authority: wallet,
  amount: 500000n,
});
```

## Build and Sign Transaction

- Now we have all instructions needed to deploy fully functional airdrop
  let's build and sign the transaction

```ts
// let's push all instructions in an Array instructions

const instructions = [createAirdropIx, createClaimMapIx, depositIx];
// create transaction Message
const transactionMessage = await createTransactionMessageFromInstructions(
  client.rpc,
  wallet,
  instructions
);
// sign the transaction
const signedTransaction = await signTransactionMessageWithSigners(
  transactionMessage
);
const sendTransaction = sendTransactionWithoutConfirmingFactory({
  rpc: client.rpc,
});
try {
  // send the transaction
  await sendTransaction(signedTransaction, { commitment: "confirmed" });
} catch (error) {
  console.log("error", error);
}
```

## Airdrop Ready

in the Next tutorial will see how to the Claim Instruction work
