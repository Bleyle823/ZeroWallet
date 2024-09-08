# ZeroWallet
This Web3 wallet,  provides a seamless multi-chain experience with built-in cross-chain bridging, allowing users to manage assets, view balances, and interact with NFTs across various blockchains.
---

## **Features**

- **On-chain & Off-chain Attestations**: Users can toggle between creating on-chain and off-chain attestations.
- **Arweave Integration**: Off-chain data is stored on Arweave, ensuring high data availability and low storage costs.
- **Avail for Data Availability**: Leverages Avail's robust data availability interface to ensure secure verification.
- **Wallet Support**: Users can upload their Arweave wallet for off-chain transactions.
- **Schema-Based Attestations**: Uses a custom schema to validate website credibility, storing metadata such as `ProjectName`, `ContractAddress`, and `CredibilityScore`.

---

## **Tech Stack**

- **React**: Frontend framework for building the DApp UI.
- **Sign Protocol SDK**: Handles attestations, both on-chain and off-chain.
- **Avail**: Provides data availability and sampling mechanisms.
- **Arweave**: Off-chain storage solution for decentralized data persistence.
- **Ethers.js**: Interact with the Ethereum blockchain and handle on-chain attestations.
- **Web3Auth**: Optional wallet integration for handling Ethereum-based operations.
- **Chainlink**: Decentralized oracle network to provide reliable, tamper-proof inputs and outputs for smart contracts.
- **Chiliz**: Blockchain protocol for sports and entertainment applications, adding social interaction and engagement capabilities to the DApp.
- **Rootstock**: Smart contract platform secured by the Bitcoin network, adding another layer of decentralized security to the DApp.
- **Morph**: Adds modularity and flexibility to the architecture, allowing seamless integration with other blockchain networks or protocols.

---

## **Installation**

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v14+ (for running the DApp)
- **Arweave Wallet**: A `.json` JWK wallet file for off-chain attestation.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/credibility-attestation-dapp.git
   cd credibility-attestation-dapp
