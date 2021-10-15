//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Polls {

    struct Poll {
      string name;
      uint expiryTime;
      address proposer;
    }

    struct Option {
      string name;
      uint voteCount;
    }

    Poll[] public polls;

    // Mapping of pollId to an array of options
    mapping(uint => Option[]) public optionMapping;

    mapping(address => mapping(uint=>bool)) public hasVotedOnPoll;

    event NewPollCreated(address indexed creator, string name, uint pollId);

    constructor() {}

    // Allows anyone to propose a poll with an expiry time in seconds for voting
    function createPoll(uint secondsToExpiry, string memory name, string[] memory options) public {
      // Set Polls lifetime from 1 to 90 days
      require(86400 <= secondsToExpiry && secondsToExpiry <= 7776000, "Polls should last from 1 to 90 days.");

      // Get the current pollId
      uint currentPollId = getTotalPolls();

      for (uint i = 0; i < options.length; i++) {
        // Create an Option struct for each option and store them in a mapping with pollId as Key
        optionMapping[currentPollId].push(Option({
          name: options[i],
          voteCount: 0
        }));
      }

      // Keep track of all the polls details
      polls.push(Poll({
        name: name,
        expiryTime: block.timestamp + secondsToExpiry,
        proposer: msg.sender
      }));

      emit NewPollCreated(msg.sender, name, currentPollId);
    }

    // Allows anyone to vote on active polls 
    /// @param optionNo refers to the option position in a poll. i.e. the 3rd option would be 3
    function voteOnActivePoll(uint pollId, uint optionNo) public {
      Poll storage poll = polls[pollId];
      // Ensure that poll is active
      require(block.timestamp < poll.expiryTime, "Poll has expired.");
      // Ensure that voter has not voted on the same poll
      require(hasVotedOnPoll[msg.sender][pollId] == false, "User has already voted on the current poll.");

      hasVotedOnPoll[msg.sender][pollId] = true;

      // Map the option position in the poll with the actual optionId
      Option storage option = optionMapping[pollId][optionNo];
      option.voteCount++;
    }

    // Allows anyone to query poll results
    function getPollVoteCount(uint pollId) public view returns (uint[] memory){
      Option[] memory options = optionMapping[pollId];
      uint noOfOptions = options.length;
      uint[] memory results = new uint[](uint32(noOfOptions));
      for (uint i = 0; i <noOfOptions; i++) {
        results[i] = options[i].voteCount;
      }
      return results;
    }

    function getTotalPolls() public view returns (uint) {
      return polls.length;
    }
}
