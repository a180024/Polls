import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS } from "../constants";
import Polls from "../abi/Polls.json";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
  },
}));

const VotingPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const [options, setOptions] = useState([]);
  const [pollId, setPollId] = useState(null);
  const [pollTitle, setPollTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedOption, setSelectedOption] = useState(0);
  const [hasVotedOnPoll, setHasVotedOnPoll] = useState(false);

  const vote = async (e) => {
    e.preventDefault();
    if (hasVotedOnPoll) {
      alert("You have already voted!");
    } else {
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
          console.log(pollId);
          console.log(selectedOption);
          let tx = await connectedContract.voteOnActivePoll(
            pollId,
            selectedOption
          );

          console.log("Mining...please wait.");
          alert("Voting... please wait.");
          await tx.wait();
          alert("Vote completed!");
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
    }
  };

  const fetchOptions = async () => {
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

        const pollId = parseInt(location.pathname.split("/")[2], 10);
        setPollId(pollId);

        console.log("Fetch poll details");
        const poll = await connectedContract.polls(pollId);
        console.log(poll);
        setPollTitle(poll[0]);

        console.log("Check if user has voted on the poll");
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const hasVotedOnPoll = await connectedContract.hasVotedOnPoll(
          accounts[0],
          pollId
        );
        setHasVotedOnPoll(hasVotedOnPoll);

        console.log(poll);
        setPollTitle(poll[0]);

        console.log("Fetch options details");
        const options = await connectedContract.getOptionsDetails(pollId);
        const _options =
          options &&
          options[1].map((v, i) => {
            return {
              title: v,
              count: options[0][i].toNumber(),
            };
          });
        console.log(_options);

        setOptions(_options);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h4" style={{ marginBottom: "15px" }}>
        Title: {pollTitle}
      </Typography>
      <Typography component="h4" variant="h4" style={{ marginBottom: "15px" }}>
        Status: {isActive ? "Active" : "Inactive"}
        <br />
      </Typography>
      <form onSubmit={vote}>
        <FormControl component="fieldset">
          <RadioGroup aria-label="options" name="radio-buttons-group">
            {options &&
              options.length > 0 &&
              options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  style={{ marginBottom: "15px" }}
                  value={i}
                  control={<Radio />}
                  label={option.title + " : " + option.count}
                  checked={selectedOption == i}
                  onChange={handleChange}
                  name="radio-buttons"
                />
              ))}
            <button
              type="submit"
              disabled={isActive == false}
              className="cta-button connect-wallet-button"
            >
              Vote
            </button>
          </RadioGroup>
        </FormControl>
      </form>
    </div>
  );
};

export default VotingPage;
