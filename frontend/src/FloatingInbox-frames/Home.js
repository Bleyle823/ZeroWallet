import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Client, useClient } from "@xmtp/react-sdk";
import { ConversationContainer } from "./ConversationContainer";

export default function Home({
  wallet,
  env,
  isPWA = false,
  onLogout,
  isContained = false,
  isConsent = false,
}) {
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initialIsOnNetwork =
      localStorage.getItem("isOnNetwork") === "true" || false;
    const initialIsConnected =
      (localStorage.getItem("isConnected") && wallet === "true") || false;

    setIsOnNetwork(initialIsOnNetwork);
    setIsConnected(initialIsConnected);
  }, []);

  const { client, error, isLoading, initialize, disconnect } = useClient();
  const [loading, setLoading] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [signer, setSigner] = useState();

  const styles = {
    FloatingLogo: {
      // Optional: Keep or adjust as needed
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      justifyContent: "center",
      cursor: "pointer",
      padding: "5px",
      zIndex: "1000", // Ensure it's on top
    },
    uContainer: {
      position: "fixed", // Ensure it's always fixed at the top-left corner
      top: "0", // Align to the top of the screen
      left: "0", // Align to the left of the screen
      width: "350px", // Set the desired width
      height: "550px", // Set the desired height
      justifyContent: "flex-start", // Align items from the top
      alignItems: "center", // Center items horizontally within the container
      display: "flex", // Use flexbox layout
      flexDirection: "column", // Arrange items in a vertical column
      overflow: "hidden", // Hide overflowing content
      backgroundColor: "#f9f9f9", // Background color
      border: "1px solid #ccc", // Border style
      borderRadius: "10px", // Rounded corners
      zIndex: "1000", // Ensure it's on top of other elements
    },
    logoutBtn: {
      position: "absolute",
      top: "10px",
      textDecoration: "none",
      color: "#000",
      left: "5px",
      background: "transparent",
      border: "none",
      fontSize: isPWA == true ? "12px" : "10px",
      cursor: "pointer",
    },
    widgetHeader: {
      padding: "2px",
    },
    label: {
      fontSize: "10px",
      textAlign: "center",
      marginTop: "5px",
      cursor: "pointer",
      display: "block",
    },
    conversationHeader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "none",
      border: "none",
      width: "auto",
      margin: "0px",
    },
    conversationHeaderH4: {
      margin: "0px",
      padding: "4px",
      fontSize: isPWA == true ? "20px" : "14px", // Increased font size
    },
    backButton: {
      border: "0px",
      background: "transparent",
      cursor: "pointer",
      fontSize: isPWA == true ? "20px" : "14px", // Increased font size
    },
    widgetContent: {
      flexGrow: 1,
      overflowY: "auto",
    },
    xmtpContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
    },
    btnXmtp: {
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "#000",
      justifyContent: "center",
      border: "1px solid grey",
      padding: isPWA == true ? "20px" : "10px",
      borderRadius: "5px",
      fontSize: isPWA == true ? "20px" : "14px",
    },
  };
  
  

  useEffect(() => {
    localStorage.setItem("isOnNetwork", isOnNetwork.toString());
    localStorage.setItem("isConnected", isConnected.toString());
  }, [isConnected, isOnNetwork]);

  useEffect(() => {
    if (wallet) {
      setSigner(wallet);
      setIsConnected(true);
    }
    if (client && !isOnNetwork) {
      setIsOnNetwork(true);
    }
    if (signer && isOnNetwork) {
      initXmtpWithKeys();
    }
  }, [wallet, signer, client]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  const getAddress = async (signer) => {
    try {
      if (signer && typeof signer.getAddress === "function") {
        return await signer.getAddress();
      } else if (signer && typeof signer.getAddresses === "function") {
        const [address] = await signer.getAddresses();
        return address;
      }
      return null;
    } catch (e) {
      console.log(e);
    }
  };
  const [isWalletCreated, setIsWalletCreated] = useState(false);

  const createNewWallet = async () => {
    const newWallet = ethers.Wallet.createRandom();
    console.log("Your address", newWallet.address);
    setSigner(newWallet);
    setIsConnected(true);
    setIsWalletCreated(true); // Set isWalletCreated to true when a new wallet is created
  };

  const initXmtpWithKeys = async () => {
    const options = { env: env ? env : getEnv() };
    const address = await getAddress(signer);
    if (!address) return;
    let keys = loadKeys(address);
    if (!keys) {
      keys = await Client.getKeys(signer, {
        ...options,
        skipContactPublishing: true,
        persistConversations: false,
      });
      storeKeys(address, keys);
    }
    setLoading(true);
    await initialize({ keys, options, signer });
  };

  const handleLogout = async () => {
    setIsConnected(false);
    const address = await getAddress(signer);
    wipeKeys(address);
    console.log("wipe", address);
    setSigner(null);
    setIsOnNetwork(false);
    await disconnect();
    setSelectedConversation(null);
    localStorage.removeItem("isOnNetwork");
    localStorage.removeItem("isConnected");
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  return (
    <div style={styles.uContainer} className={isOnNetwork ? "expanded" : ""}>
      {isConnected && (
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      )}
      {isConnected && isOnNetwork && (
        <div style={styles.widgetHeader}>
          <div style={styles.conversationHeader}>
            {isOnNetwork && selectedConversation && (
              <button
                style={styles.backButton}
                onClick={() => {
                  setSelectedConversation(null);
                }}
              >
                ←
              </button>
            )}
            <h4 style={styles.conversationHeaderH4}>Conversations</h4>
          </div>
        </div>
      )}
      <div style={styles.widgetContent}>
        {!isConnected && (
          <div style={styles.xmtpContainer}>
            <button style={styles.btnXmtp} onClick={connectWallet}>
              Connect Wallet
            </button>
            <div style={styles.label} onClick={createNewWallet}>
              or create new one
            </div>
          </div>
        )}
        {isConnected && !isOnNetwork && (
          <div style={styles.xmtpContainer}>
            <button style={styles.btnXmtp} onClick={initXmtpWithKeys}>
              Connect to XMTP
            </button>
            {isWalletCreated && (
              <button style={styles.label}>Your address: {signer.address}</button>
            )}
          </div>
        )}
        {isConnected && isOnNetwork && client && (
          <ConversationContainer
            isPWA={isPWA}
            isConsent={isConsent}
            isContained={isContained}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        )}
      </div>
    </div>
  );
}

const ENCODING = "binary";

export const getEnv = () => {
  return typeof process !== "undefined" && process.env.REACT_APP_XMTP_ENV
    ? process.env.REACT_APP_XMTP_ENV
    : "production";
};
export const buildLocalStorageKey = (walletAddress) => {
  return walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";
};

export const loadKeys = (walletAddress) => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress, keys) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

export const wipeKeys = (walletAddress) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};
