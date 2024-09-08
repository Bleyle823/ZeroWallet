const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/getTokens", async (req, res) => {
  const { userAddress, chain } = req.query;

  try {
    // Get token balances
    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      address: userAddress,
    });

    // Get NFTs
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chain,
      address: userAddress,
      mediaItems: true,
    });

    // Filter NFTs
    const myNfts = nfts.raw?.result?.length
      ? nfts.raw.result.map((e) => {
          if (
            e?.media?.media_collection?.high?.url &&
            !e.possible_spam &&
            e?.media?.category !== "video"
          ) {
            return e["media"]["media_collection"]["high"]["url"];
          }
        })
      : [];

    // Get native balance
    const balance = await Moralis.EvmApi.balance.getNativeBalance({
      chain: chain,
      address: userAddress,
    });

    // Fetch DeFi positions from EigenLayer
    const defiPositions = await Moralis.EvmApi.wallets.getDefiPositionsByProtocol({
      chain: "0x1",
      address: "0x2fFEbB594025600E36b5e2eE5497eb986e230681",
      protocol: "eigenlayer"    // Using "eigenlayer" protocol here (adjust if necessary)
    });

    const jsonResponse = {
      tokens: tokens.raw,
      nfts: myNfts,
      balance: balance.raw.balance / 10 ** 18,
      defiPositions: defiPositions.raw, // Adding the DeFi positions to the response
    };

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on port ${port}`);
  });
});
