// src/components/AttestationForm.js
import React, { useState } from "react";
import { createOnChainAttestation, createOffChainAttestation, queryAttestations, findAttestation } from "../services/signProtocolHelpers";

export default function AttestationForm() {
  const [contractDetails, setContractDetails] = useState("");
  const [signer, setSigner] = useState("");
  const [useOnChain, setUseOnChain] = useState(false);
  const [attestations, setAttestations] = useState([]);
  const [message, setMessage] = useState("");

  const handleCreateAttestation = async () => {
    try {
      let res;
      if (useOnChain) {
        res = await createOnChainAttestation(contractDetails, signer);
      } else {
        res = await createOffChainAttestation(contractDetails, signer);
      }
      console.log("Attestation created:", res);
    } catch (error) {
      console.error("Error creating attestation:", error);
    }
  };

  const handleQueryAttestations = async () => {
    try {
      const res = await queryAttestations("0xAliceAddress", "onchain_evm_84532_0x34", signer.toLowerCase());
      const foundAttestation = findAttestation(message, res.data.rows);
      setAttestations(foundAttestation ? [foundAttestation] : []);
      console.log("Found attestation:", foundAttestation);
    } catch (error) {
      console.error("Error querying attestations:", error);
    }
  };

  return (
    <div>
      <h2>Create Attestation</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={contractDetails}
        onChange={(e) => setContractDetails(e.target.value)}
      />
      <input
        type="text"
        placeholder="Signer Address"
        value={signer}
        onChange={(e) => setSigner(e.target.value)}
      />
      <div>
        <label>On-chain Attestation</label>
        <input type="checkbox" checked={useOnChain} onChange={() => setUseOnChain(!useOnChain)} />
      </div>
      <button onClick={handleCreateAttestation}>Create Attestation</button>

      <h2>Query Attestations</h2>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleQueryAttestations}>Query Attestations</button>

      {attestations.length > 0 && (
        <div>
          <h3>Attestation Found:</h3>
          <pre>{JSON.stringify(attestations[0], null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
