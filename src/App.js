import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import VotingApp from "./Voting/VotingApp.js";
import Homepage from './Homepage/Homepage.js';
import Chat from "./Chat/Chat.js";
import Marketplace from './Marketplace/Marketplace.js';

import WBCMascot from "./Homepage/WBC Mascot.jpg";


function App() {

  const [userAddress, setUserAddress] = useState(window.localStorage.getItem("userAddress"));
  const [userBalance, setUserBalance] = useState(null);

  const connectWallet = async () => {
    console.log("CW: Running connectWallet");
    if(window.ethereum && window.ethereum.isMetaMask){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);

        const accounts = await provider.send("eth_requestAccounts");
        console.log(accounts);
        const signer = provider.getSigner();
        console.log(signer);	
        const address = await signer.getAddress();
        console.log(address);

        const balance = await provider.getBalance(address);

        setUserAddress(address);
        setUserBalance(balance);
    }
  }


  const checkConnection = async () => {
    console.log("App CC: Running checkConnection");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    console.log("App CC: Accounts:");
    console.log(accounts);

    const signer = provider.getSigner();
    console.log("App CC: Signer:")
    console.log(signer);

    try{
      const address = await signer.getAddress();
      console.log("App CC: Address:");
      console.log(address);

      const balance = await provider.getBalance(address);
      setUserBalance(balance);
    } catch {
      console.log("App CC: No connection found");
      accounts[0] = null;
    }

    if(userAddress !== accounts[0]){
      console.log("App CC: Setting userAddress:");
      console.log(accounts[0]);
      window.localStorage.setItem("userAddress", accounts[0]);
      setUserAddress(accounts[0]);
    }

  }


  useEffect(() => {
    console.log("App Effect: userAddress:");
    console.log(userAddress);
    checkConnection();
  }, [userAddress])
  


  return (
    <div className="App">
      <header>
        <nav>
          {!userAddress ? 
            <ul>
              <br />
              <li className="nav-cta">
                <a onClick={connectWallet} href="#">Connect</a>
              </li>
            </ul>
          :
            <ul>
              <li className="dropdown">
                <a className="dropdown-menu" href="#">My dApps</a>
                <div className="dropdown-content">
                  <a href="/VotingApp">DAO Voting dApp</a><br />
                  <a href="/Chat">NFT Chat dApp</a><br />
                  <a href="/Marketplace">NFT Marketplace</a><br />
                  <a href="#">To-Do List</a><br />
                </div>
              </li>
            </ul>
          }
          <div className="logo">
            <h1><a href="/">Whiteboard Crypto <br /> Portfolio Builder Bootcamp</a></h1>
          </div>
        </nav>
      </header>
      <br />
      <br />
        <hr />
        <br />
      <Router>
          <Routes>
            <Route 
              path="/"
              element={
                <Homepage 
                  userAddress={userAddress}
                  connectWallet={async () => connectWallet}
                  image={WBCMascot}
                />
              }
            />
            <Route 
              path="/VotingApp" 
              element={
              <VotingApp 
                userAddress={userAddress} 
                connectWallet={async () => connectWallet} 
              />} 
            />
            <Route 
              path="/Chat" 
              element={
                <Chat 
                  userAddress={userAddress}
                />} 
            />
            <Route 
              path="/Marketplace" 
              element={
                <Marketplace 
                  userAddress={userAddress}
                  userBalance={userBalance}
                />} 
            />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
