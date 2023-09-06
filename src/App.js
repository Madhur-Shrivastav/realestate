import SellComponent from "./COMPONENTS/Sell";
import BuyComponent from "./COMPONENTS/Buy";
import Web3 from "web3";
import RealEstateArtifact from "./contractdetails/RealEstate.json";
//import { RealEstateAddress } from "./CONTRACT/RealEstateAddress";
//import RealEstateABI from "./CONTRACT/RealEstateABI.json";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  const [web3api, setweb3api] = useState({
    web3: null,
    contract: null,
    provider: null,
  });

  useEffect(() => {
    const initiate = () => {
      if (window.ethereum) {
        const provider = window.ethereum;
        const web3 = new Web3(provider);
        //  if()
        //  const contract = new web3.eth.Contract(
        //  RealEstateABI,
        //  RealEstateAddress
        //  );
        //setweb3api({ web3, contract, provider });
        if (web3) {
          const networkID = 5777;
          const networkData = RealEstateArtifact.networks[networkID];
          const ContractAddress = networkData.address;
          const ContractABI = RealEstateArtifact.abi;
          const contract = new web3.eth.Contract(ContractABI, ContractAddress);
          setweb3api({ web3, contract, provider });
        }
      } else if (window.web3) {
        const provider = window.web3;
        const web3 = new Web3(provider);
        provider.request({ method: "eth_requestAccounts" });
        if (web3) {
          const networkID = 5777;
          const networkData = RealEstateArtifact.networks[networkID];
          const ContractAddress = networkData.address;
          const ContractABI = RealEstateArtifact.abi;
          const contract = new web3.eth.Contract(ContractABI, ContractAddress);
          setweb3api({ web3, contract, provider });
        }
      } else {
        console.log("please install metamask!");
      }
    };
    initiate();
  }, []);

  console.log("web3api is =>", web3api);

  const [walletaccounts, setwalletaccounts] = useState([]);
  const [manageraccount, setmanageraccount] = useState(null);
  const [accountbalance, setaccountbalance] = useState(null);

  useEffect(() => {
    const { provider, web3, contract } = web3api;
    async function getManagerAccount() {
      try {
        const manageraccount = await contract.methods.getManager().call();
        setmanageraccount(manageraccount);
        const accountbalance = await web3.eth.getBalance(manageraccount);
        setaccountbalance(web3.utils.fromWei(accountbalance, "ether"));
      } catch (error) {
        alert(error.message);
      }
    }
    provider && getManagerAccount();
  }, [web3api, manageraccount]);

  const [paused, setpaused] = useState(() => {
    const storedPaused = localStorage.getItem("paused");
    return storedPaused ? JSON.parse(storedPaused) : false;
  });

  useEffect(() => {
    localStorage.setItem("paused", JSON.stringify(paused));
  }, [paused]);

  const [pausing, setpausing] = useState(false);
  async function Pause() {
    const { contract } = web3api;
    setpausing(true);
    try {
      await contract.methods
        .pause()
        .send({ from: manageraccount, gas: 500000 });
      setpausing(false);
      setpaused(true);
      alert("The NFT market has been paused successfully!");
      window.location.reload();
    } catch (error) {
      if (error.message.includes("Only the manager can call this function!")) {
        alert("Only the manager can pause the NFT Market!");
      } else if (
        error.message.includes(
          "The requested account and/or method has not been authorized by the user."
        )
      ) {
        alert("Only the manager can pause the NFT market!");
      } else if (
        error.message.includes(
          "MetaMask Tx Signature: User denied transaction signature."
        )
      ) {
        alert("The transaction has been rejected by the manager!");
      } else if (
        error.message.includes(
          "VM Exception while processing transaction: revert Pausable: paused"
        )
      ) {
        alert("The NFT market is already paused!");
      } else {
        alert(error.message);
      }
      setpausing(false);
    }
  }

  const [resuming, setresuming] = useState(false);
  async function Resume() {
    const { contract } = web3api;
    setresuming(true);
    try {
      await contract.methods
        .unpause()
        .send({ from: manageraccount, gas: 500000 });
      setresuming(false);
      setpaused(false);
      alert("The NFT market has been resumed successfully!");
      window.location.reload();
    } catch (error) {
      if (error.message.includes("Only the manager can call this function!")) {
        alert("Only the manager can resume the NFT Market!");
      } else if (
        error.message.includes(
          "The requested account and/or method has not been authorized by the user."
        )
      ) {
        alert("Only the manager can resume the NFT market!");
      } else if (
        error.message.includes(
          "MetaMask Tx Signature: User denied transaction signature."
        )
      ) {
        alert("The transaction has been rejected by the manager!");
      } else if (
        error.message.includes(
          "VM Exception while processing transaction: revert Pausable: paused"
        )
      ) {
        alert("The NFT market is already going on!");
      } else {
        alert(error.message);
      }
    }
    setresuming(false);
  }

  const [resetting, setresetting] = useState(false);
  async function Reset() {
    const { contract } = web3api;
    setresetting(true);
    try {
      await contract.methods
        .reset()
        .send({ from: manageraccount, gas: 500000 });
      setresetting(false);
      alert("The NFT market has been reset successfully!");
      window.location.reload();
    } catch (error) {
      if (error.message.includes("Only the manager can call this function!")) {
        alert("Only the manager can reset the NFT Market!");
      } else if (
        error.message.includes(
          "MetaMask Tx Signature: User denied transaction signature."
        )
      ) {
        alert("The transaction has been rejected by the manager!");
      } else if (
        error.message.includes(
          "The requested account and/or method has not been authorized by the user."
        )
      ) {
        alert("Only the manager can reset the NFT market!");
      } else if (
        error.message.includes(
          "There are no properties in the Real Estate market!"
        )
      ) {
        alert("There are no properties in the Real Estate market!");
      } else if (
        error.message.includes("Not all properties have been sold yet!")
      ) {
        alert("Not all properties have been sold yet!");
      } else {
        alert(error.message);
      }
      setresetting(false);
    }
  }

  return (
    <>
      <div id="parent">
        <div id="navbar-box">
          <div id="navbar">
            <button>
              <Link id="link" to="/">
                Buy
              </Link>
            </button>
            <button>
              <Link id="link" to="/sell">
                Sell
              </Link>
            </button>
          </div>
        </div>
        <div id="manager-box">
          <div id="manager-form">
            <h2>PURCHASE SECTION</h2>
            <div id="address-div">
              <h4>
                Manager Account:{" "}
                {manageraccount ? manageraccount : "not available"}
              </h4>
              <h4>
                Manager Account Balance:{" "}
                {accountbalance ? accountbalance + " ETH" : "not available"}
              </h4>
            </div>
            <div id="button-div">
              {paused ? (
                resuming ? (
                  <button onClick={Resume}>RESUMING....</button>
                ) : (
                  <button onClick={Resume}>RESUME</button>
                )
              ) : pausing ? (
                <button onClick={Pause}>PAUSING....</button>
              ) : (
                <button onClick={Pause}>PAUSE</button>
              )}

              {resetting ? (
                <button onClick={Reset}>RESETTING....</button>
              ) : (
                <button onClick={Reset}>RESET</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Routes>
        <Route
          path="/"
          element={<BuyComponent web3api={web3api}></BuyComponent>}
        ></Route>
        <Route
          path="/sell"
          element={<SellComponent web3api={web3api}></SellComponent>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
