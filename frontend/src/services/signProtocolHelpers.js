// src/services/signProtocolHelpers.js
import axios from "axios";
import client from "./signProtocolClient";
import { decodeAbiParameters } from "viem";

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

export async function createAttestation(contractDetails, signer) {
  return await client.createAttestation({
    schemaId: "0x20a", // Replace with your schema ID
    data: {
      contractDetails,
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

    if (parsedData.contractDetails === message) {
      return { parsedData, attestation: att };
    }
  }
  return undefined;
}
