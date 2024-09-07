// src/services/signProtocolHelpers.js
import axios from "axios";
import { onChainClient, offChainClient } from "./signProtocolClient";
import { decodeAbiParameters } from "viem";
import Arweave from "arweave";

// Arweave client setup
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

export async function makeAttestationRequest(endpoint, options) {
  const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
  const res = await axios.request({
    url,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });

  if (res.status !== 200) {
    throw new Error(JSON.stringify(res));
  }

  return res.data;
}

export async function queryAttestations(attester, schemaId, indexingValue) {
  return makeAttestationRequest("index/attestations", {
    method: "GET",
    params: {
      mode: "onchain",
      schemaId,
      attester,
      indexingValue,
    },
  });
}

// Off-chain attestation (Arweave + Base Sepolia)
export async function createOffChainAttestation(projectName, signer) {
  // Upload to Arweave
  const arweaveData = { projectName, signer };
  const transaction = await arweave.createTransaction({ data: JSON.stringify(arweaveData) });
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);

  const arweaveCID = transaction.id;

  return await offChainClient.createAttestation({
    schemaId: "0x22b", // Schema ID for off-chain
    data: {
      projectName,
      signer,
    },
    indexingValue: signer.toLowerCase(),
  });
}

// On-chain attestation (Base Sepolia)
export async function createOnChainAttestation(projectName, signer) {
  return await onChainClient.createAttestation({
    schemaId: "0x22b", // Schema ID for on-chain
    data: {
      projectName,
      signer,
    },
    indexingValue: signer.toLowerCase(),
  });
}

export function findAttestation(message, attestations) {
  for (const att of attestations) {
    if (!att.data) continue;

    let parsedData = {};
    if (att.mode === "onchain") {
      try {
        const data = decodeAbiParameters(
          [att.dataLocation === "onchain" ? { components: att.schema.data, type: "tuple" } : { type: "string" }],
          att.data
        );
        parsedData = data[0];
      } catch (error) {
        try {
          const data = decodeAbiParameters(att.schema.data, att.data);
          parsedData = data.reduce((acc, item, i) => {
            acc[att.schema.data[i].name] = item;
            return acc;
          }, {});
        } catch (error) {
          continue;
        }
      }
    } else {
      try {
        parsedData = JSON.parse(att.data);
      } catch (error) {
        continue;
      }
    }

    if (parsedData.projectName === message) {
      return { parsedData, attestation: att };
    }
  }
  return undefined;
}
