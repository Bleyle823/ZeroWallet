// src/services/signProtocolClient.js
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
// import { privateKeyToAccount } from "viem/accounts";

// const privateKey = "0x..."; // Replace with your private key (if required)
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
//   account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

export default client;
