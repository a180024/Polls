import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS } from "../constants";
import Polls from "../abi/Polls.json";
import PollsTable from "../components/polls_table";

const PollsPage = () => {
  const [polls, setPolls] = useState([]);

  const fetchPolls = async () => {
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
        console.log("Connected to contract");

        const [pollIds, pollTitles, pollProposers, expiryTime, isActive] =
          await connectedContract.getPollsDetails.call();

        const pollDetails = pollIds.map((v, i) => {
          return {
            id: v.toNumber(),
            title: pollTitles[i],
            proposer: pollProposers[i],
            expiryTime: expiryTime[i].toNumber(),
            isActive: isActive[i],
          };
        });

        setPolls(pollDetails);

        console.log("Fetch poll details...");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return <PollsTable polls={polls} />;
};

export default PollsPage;
