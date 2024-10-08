import "./App.css";
import { useState } from 'react';
//import logo from './logo.png';
import { Select } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import WalletView from './components/WalletView';
import Xmtp from './components/Xmtp'; // Import the new Profile component

function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <div className="App">
      <header>
        {/* <img src={logo} className="headerLogo" alt="logo"/>  */}
        <Select
          value={selectedChain}
          onChange={(val) => setSelectedChain(val)}
          options={[
            {
              label: "Ethereum",
              value: "0x1" // The value here is the hex value of every testnet
            },
            {
              label: "Mumbai Testnet",
              value: "0x13881"
            },
            {
              label: "Polygon",
              value: "0x89"
            },
            {
              label: "Avalanche",
              value: "0xa86a"
            },
          ]}
          className="dropdown"
        />
      </header>
      {wallet && seedPhrase ? 
        <Routes>
          <Route path="/yourwallet" element={<WalletView
            wallet={wallet}
            setWallet={setWallet}
            seedPhrase={seedPhrase}
            setSeedPhrase={setSeedPhrase}
            selectedChain={selectedChain}
          />} />
          <Route path="/chat" element={<Xmtp />} /> {/* New Profile route */}
        </Routes>
      :
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recover" element={<RecoverAccount setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
          <Route path="/yourwallet" element={<CreateAccount setSeedPhrase={setSeedPhrase} setWallet={setWallet} />} />
          <Route path="/chat" element={<Xmtp />} /> {/* New Profile route */}
        </Routes>
      }
    </div>
  );
}

export default App;