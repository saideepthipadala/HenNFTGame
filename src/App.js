import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import constants from "./constants/constants";
import { ethers } from "ethers";
import Home from "./components/Home";
import HenMarket from "./components/HenMarket";
import HenBreeding from "./components/HenBreeding";
import HenRacing from "./components/HenRacing";
import NavBar from "./components/NavBar";
import UserProfile from "./components/UserProfile";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const ownerAccount ="0x830E82711B196dc3f0d29c877619Ec913fEa10ad";

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            constants.contractAddress,
            constants.contractABI,
            signer
          );
          setContractInstance(contract);
          console.log(contract);

          // Function to update the current account
          const updateAccounts = async () => {
            const accounts = await provider.listAccounts();
            setCurrentAccount(accounts[0]);
          };

          // Initial account load
          updateAccounts();

          // Listen for account changes
          window.ethereum.on("accountsChanged", updateAccounts);
        } catch (error) {
          console.error("Error loading blockchain data:", error);
        }
      } else {
        console.error("Web3 provider (e.g., MetaMask) not found.");
      }
    };


    loadBlockchainData();
  }, []); // Runs only once on component mount


  return (
    <div className="w-full">
      <NavBar />

      <BrowserRouter>
        <div>
          <Routes>
            <Route
              path="/"
              element={<Home currentAccount={currentAccount} contractInstance={contractInstance} ownerAccount={ownerAccount} />}
            />
            <Route
              path="/henBreeding"
              element={<HenBreeding currentAccount={currentAccount} contractInstance={contractInstance} />}
            />
            <Route
              path="/market"
              element={<HenMarket currentAccount={currentAccount} contractInstance={contractInstance} />}
            />
            <Route
              path="/henRacing"
              element={<HenRacing className="w-full" currentAccount={currentAccount} contractInstance={contractInstance} ownerAccount={ownerAccount} />}
            />
           
            <Route
              path="/profile"
              element={<UserProfile currentAccount={currentAccount} contractInstance={contractInstance} />}
            />
          </Routes>
        </div>

      </BrowserRouter>

  </div>
  );
}

export default App;
