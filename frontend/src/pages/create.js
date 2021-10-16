import React, { useState, useCallback } from "react";
import { ethers } from "ethers";

import PollsForm from "../components/polls_form";
import { CONTRACT_ADDRESS } from "../constants";
import Polls from "../abi/Polls.json";

const CreatePage = () => {
  const createPoll = async ({ title, _secondsToExpiry, _options }) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Polls.abi,
          signer
        );

        console.log("Creating new poll...");
        let tx = await connectedContract.createPoll(
          _secondsToExpiry,
          title,
          _options
        );

        console.log("Mining...please wait.");
        alert("Creating poll... please wait.");
        await tx.wait();
        alert("Poll created!");
        console.log(tx);
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${tx.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <PollsForm createPoll={createPoll} />;
};

export default CreatePage;
