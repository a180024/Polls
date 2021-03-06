import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactLoading from "react-loading";

import "./styles/App.css";
import NavBar from "./components/nav_bar";
import CreatePage from "./pages/create";
import PollsPage from "./pages/polls";
import VotingPage from "./pages/voting";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const NETWORK_PARAMS = {
    chainId: "0x4", // A 0x-prefixed hexadecimal chainId
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
  };

  const checkIfWalletIsConnected = async () => {
    /*
     * First make sure we have access to window.ethereum
     */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // Ensure network is correct
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK_PARAMS.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NETWORK_PARAMS],
          });
        } catch (addError) {}
      }
    }

    /*
     * Check if we're authorized to access the user's wallet
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    /*
     * User can have multiple authorized accounts, we grab the first one if its there
     */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = useCallback(
    () => (
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect to Wallet
      </button>
    ),
    [connectWallet]
  );

  const renderSpinnerUI = () => {
    return (
      <div className="spinner">
        <ReactLoading
          type={"spin"}
          color={"white"}
          height={"15%"}
          width={"15%"}
        />
      </div>
    );
  };

  const HomePageUI = () => {
    return (
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Polling App</p>
          <p className="sub-text">Start voting or create new polls!</p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderCreatePoll()}
          <br />
          {loading && renderSpinnerUI()}
        </div>
      </div>
    );
  };

  const renderCreatePoll = () => {
    return (
      <button className="cta-button connect-wallet-button">
        <Link className="navbar-link" to="/create" style={{ marginRight: 0 }}>
          CREATE POLL
        </Link>
      </button>
    );
  };

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <HomePageUI />
          </Route>
          <Route exact path="/create">
            <div className="container" style={{ backgroundColor: "white" }}>
              <CreatePage />
            </div>
          </Route>
          <Route exact path="/polls">
            <div className="container" style={{ backgroundColor: "white" }}>
              <PollsPage />
            </div>
          </Route>
          <Route to="/polls/:pollId">
            <div className="container" style={{ backgroundColor: "white" }}>
              <VotingPage />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
