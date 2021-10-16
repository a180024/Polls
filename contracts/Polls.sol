//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract Polls {

    struct Poll {
      string title;
      uint expiryTime;
      address proposer;
    }

    struct Option {
      string title;
      uint voteCount;
    }

    // pollId will follow the index of this array
    Poll[] public polls;

    // Mapping of pollId to an array of options
    mapping(uint => Option[]) public optionMapping;

    mapping(address => mapping(uint=>bool)) public hasVotedOnPoll;

    event NewPollCreated(address indexed creator, string title, uint pollId);

    constructor() {}

    /** 
     * @notice allows anyone to propose a poll with an expiry time in seconds for voting
     * @param secondsToExpiry refers to how long the poll should be active for
     * @param title refers to the title of the poll
     * @param options refer to an array of options for voters to select
     */
    function createPoll(uint secondsToExpiry, string memory title, string[] memory options) public {
      // Set Polls lifetime from 1 hour to 1 week
      require(3600 <= secondsToExpiry && secondsToExpiry <= 604800, "Polls should last from 1 hour to 1 week.");

      // Get the current pollId
      uint currentPollId = getTotalPolls();

      for (uint i = 0; i < options.length; i++) {
        // Create an Option struct for each option and store them in a mapping with pollId as Key
        optionMapping[currentPollId].push(Option({
          title: options[i],
          voteCount: 0
        }));
      }

      // Keep track of all the polls details
      polls.push(Poll({
        title: title,
        expiryTime: block.timestamp + secondsToExpiry,
        proposer: msg.sender
      }));

      emit NewPollCreated(msg.sender, title, currentPollId);
    }

    /**
     * @notice Allows anyone to vote on active polls
     * @param pollId refers to the index of the poll in the poll array
     * @param optionNo refers to the option position in a poll. i.e. the 3rd option would be 3
     */
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

    /** 
     * @notice allows anyone to query poll results
     * @param pollId refers to the index of the poll in the poll array
     * @return array of votes count for each option
     * @return array of option title 
     */
    function getOptionsDetails(uint pollId) public view returns (uint[] memory, string[] memory){
      Option[] memory options = optionMapping[pollId];
      uint noOfOptions = options.length;
      uint[] memory votesCount = new uint[](uint32(noOfOptions));
      string[] memory optionTitles = new string[](uint32(noOfOptions));
      for (uint i = 0; i <noOfOptions; i++) {
        votesCount[i] = options[i].voteCount;
        optionTitles[i] = options[i].title;
      }
      return (votesCount, optionTitles);
    }

    /** 
     * @notice allows anyone to query the total number of polls
     * @return total number of polls
     */
    function getTotalPolls() public view returns (uint) {
      return polls.length;
    }

    /** 
     * @notice allows anyone to query the total number of polls
     * @return uint array of pollIds
     * @return string array of pollTitles
     * @return address array of proposer
     * @return int array of expiryTimes
     * @return bool array of hasExpired 
     */
    function getPollsDetails() public view returns (uint[] memory, string[] memory, address[] memory, uint[] memory, bool[] memory) {
      uint totalPolls = getTotalPolls();
      uint[] memory pollIds = new uint[](uint32(totalPolls));
      string[] memory pollTitles = new string[](uint32(totalPolls));
      address[] memory pollProposers = new address[](uint32(totalPolls));
      uint[] memory expiryTimes = new uint[](uint32(totalPolls));
      bool[] memory isActive = new bool[](uint32(totalPolls));
      
      for (uint i = 0; i < polls.length; i++) {
          pollIds[i] = i;
          pollTitles[i] = polls[i].title;
          pollProposers[i] = polls[i].proposer;
          expiryTimes[i] = polls[i].expiryTime;
          isActive[i] = block.timestamp < polls[i].expiryTime ? true : false;
      }
      return (pollIds, pollTitles, pollProposers, expiryTimes, isActive);
    }

}
