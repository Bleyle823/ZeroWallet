// src/services/signProtocolClient.js
import { SignProtocolClient, SpMode, OffChainSignType, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

//const privateKey = "7f4822c1a25df1ac2e66c6eea5b19549ff323dfbb3cb4eadcc6420a21a732f0a"; // Replace with valid private key

// Off-chain (Arweave + Base Sepolia)
const offChainClient = new SignProtocolClient(SpMode.OffChain, {
  signType: OffChainSignType.EvmEip712,
  chain: EvmChains.baseSepolia,
  // account: privateKeyToAccount(privateKey),
});

// On-chain (Base Sepolia)
const onChainClient = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  // account: privateKeyToAccount(privateKey),
});

export { onChainClient, offChainClient };
