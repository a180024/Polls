//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Polls {

    struct Poll {
      string name;
      uint expiryTime;
      address proposer;
      uint[] optionIds;
    }

    struct Option {
      string name;
      uint voteCount;
    }

    Poll[] public polls;
    uint private _optionId;
    mapping(uint => Option) public optionMapping;

    mapping(address => mapping(uint=>bool)) public hasVotedOnPoll;

    event NewPollCreated(address indexed creator, string name, uint pollId);

    constructor() {}

    // Allows anyone to propose a poll with an expiry time in seconds for voting
    function createPoll(uint secondsToExpiry, string memory name, string[] memory options) public {
      // Set Polls lifetime from 1 to 90 days
      require(86400 <= secondsToExpiry && secondsToExpiry <= 7776000, "Polls should last from 1 to 90 days.");

      uint[] memory _optionsIds = new uint[](options.length); 
      for (uint i = 0; i < options.length; i++) {
        // Create an Option struct for each option and store them in a mapping
        optionMapping[_optionId] = Option({
          name: options[i],
          voteCount: 0
        });
        // Save an array of optionIds associated with the poll
        _optionsIds[i] = _optionId; 
        _optionId++;
      }

      // Keep track of all the polls details
      polls.push(Poll({
        name: name,
        expiryTime: block.timestamp + secondsToExpiry,
        proposer: msg.sender,
        optionIds: _optionsIds
      }));

      emit NewPollCreated(msg.sender, name, polls.length - 1);
    }

    // Allows anyone to vote on active polls 
    function voteOnActivePoll(uint pollId, uint optionId) public {
      Poll storage poll = polls[pollId];
      // Ensure that poll is active
      require(block.timestamp < poll.expiryTime, "Poll has expired.");
      // Ensure that voter has not voted on the same poll
      require(!hasVotedOnPoll[msg.sender][pollId], "User has already voted on the current poll.");

      hasVotedOnPoll[msg.sender][pollId] = true;

      // Map the option number in the poll with the actual optionId
      Option storage option = optionMapping[poll.optionIds[optionId]];
      option.voteCount++;
    }

    // Allows anyone to query poll results
    function getPollVoteCount(uint pollId) public view returns (uint[] memory){
      Poll memory poll = polls[pollId];
      uint[] memory optionIds = poll.optionIds;
      uint[] memory results = new uint[](optionIds.length);
      for (uint i = 0; i <optionIds.length; i++) {
        results[i] = optionMapping[optionIds[i]].voteCount;
      } 
      return results;
    }

}
