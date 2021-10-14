//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

struct Poll {
  string name;
  uint expiryTime;
  address proposer;
  Option[] options;
}

struct Option {
  string name;
  uint voteCount;
}

contract Polls {

    Poll[] public polls;

    mapping(address => mapping(uint=>bool)) public hasVotedOnPoll;

    constructor() {}

    // Allows anyone to propose a poll with an expiry time in seconds for voting.
    function createPoll(uint secondsToExpiry, string memory name, string[] memory options) public {
      // Set Polls lifetime from 1 to 90 days
      require(86400 <= secondsToExpiry && secondsToExpiry <= 7776000, "Polls should last from 1 to 90 days.");
  
      // Create an Option struct for each option and store them in an array.
      Option[] memory _options = new Option[](options.length);
      for (uint i = 0; i < options.length; i++) {
        _options[i] = Option({
          name: options[i],
          voteCount:0
        });
      }

      // Keep track of all the polls details
      polls.push(Poll({
        name: name,
        expiryTime: block.timestamp + secondsToExpiry,
        proposer: msg.sender,
        options: _options
      }));
    }

    // Allows anyone to vote on active polls 
    function voteOnActivePoll(uint pollId, uint optionId) public {
      Poll storage poll = polls[pollId];
      // Ensure that poll is active
      require(block.timestamp < poll.expiryTime, "Poll has expired.");
      // Ensure that voter has not voted on the same poll
      require(!hasVotedOnPoll[msg.sender][pollId], "User has already voted on the current poll.");

      hasVotedOnPoll[msg.sender][pollId] = true;
      Option storage option = poll.options[optionId]; 
      option.voteCount++;
    }

    // Allows anyone to query poll results
    function getPollVoteCount(uint pollId) public view returns (uint[] memory){
      Poll memory poll = polls[pollId];
      Option[] memory options = poll.options;
      uint[] memory results = new uint[](options.length);
      for (uint i = 0; i <options.length; i++) {
        results[i] = options[i].voteCount;
      } 
      return results;
    }

}
