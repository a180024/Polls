import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { Signer, Contract, ContractFactory } from "ethers";

chai.use(solidity);

export async function deployTestContract(name: string) {
  return ethers
    .getContractFactory(name)
    .then((contractFactory: ContractFactory) => contractFactory.deploy());
}

describe("Polls", function () {
  const contractName: string = "Polls";
  let deployedContract: Contract;
  let owner: Signer;
  let addr1: Signer;

  // Test Data
  const pollTitle = "Test";
  const options = ["A", "B", "C", "D", "E"];
  const voteCounts = [0, 0, 0, 0, 0];

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    deployedContract = await deployTestContract(contractName);
  });

  async function createPoll(
    secondsToExpiry: number,
    title: string,
    options: string[]
  ) {
    return deployedContract.createPoll(secondsToExpiry, title, options);
  }

  async function getPollVoteCounts(pollId: number): Promise<any[]> {
    const [voteCounts, _] = deployedContract.getOptionsDetails(pollId);
    return voteCounts;
  }

  describe("Creating Poll", () => {
    this.timeout(50000);
    it("1 hour Lifetime", async () => {
      expect(await createPoll(3600, pollTitle, options))
        .to.emit(deployedContract, "NewPollCreated")
        .withArgs(await owner.getAddress(), pollTitle, 0);
      const polls = await deployedContract.polls(0);
      expect(polls[0]).to.equal("Test");
    });
    it("1 week Lifetime", async () => {
      expect(await createPoll(604800, pollTitle, options))
        .to.emit(deployedContract, "NewPollCreated")
        .withArgs(await owner.getAddress(), "Test", 0);
      const polls = await deployedContract.polls(0);
      expect(polls[0]).to.equal("Test");
    });
    it("Lifetime less than 1 hour", async () => {
      try {
        expect(await createPoll(3500, pollTitle, options));
      } catch (err) {
        expect(
          err ===
            "VM Exception while processing transaction: reverted with reason string 'Polls should last from 1 hour to 1 week'"
        );
      }
    });
  });
  describe("Voting on polls", () => {
    it("Poll is active", async () => {
      await createPoll(3600, pollTitle, options);
      const pollVoteCounts = await getPollVoteCounts(0);
      expect(
        pollVoteCounts.map((v, i) => {
          return pollVoteCounts[i].toNumber();
        })
      ).to.deep.equal(voteCounts);

      // Vote on Option A
      await deployedContract.voteOnActivePoll(0, 0);

      const newPollVoteCounts = await getPollVoteCounts(0);
      expect(newPollVoteCounts[0].toNumber()).to.equal(1);
    });
    it("Poll has expired", async () => {
      await createPoll(3600, pollTitle, options);
      await ethers.provider.send("evm_increaseTime", [605800]);

      try {
        await deployedContract.voteOnActivePoll(0, 0);
      } catch (err) {
        expect(
          err ===
            "VM Exception while processing transaction: reverted with reason string 'Poll has expired.'"
        );
      }
    });
    it("Multiple people voting on an active poll", async () => {
      await createPoll(3600, pollTitle, options);
      await deployedContract.voteOnActivePoll(0, 0);
      await deployedContract.connect(addr1).voteOnActivePoll(0, 1);

      const pollVoteCounts = await getPollVoteCounts(0);
      expect(
        pollVoteCounts.map((v, i) => {
          return pollVoteCounts[i].toNumber();
        })
      ).to.deep.equal([1, 1, 0, 0, 0]);
    });
    it("Trying to vote on the same poll twice should revert", async () => {
      await createPoll(3600, pollTitle, options);
      await deployedContract.voteOnActivePoll(0, 0);

      await deployedContract.hasVotedOnPoll(await owner.getAddress(), 0);

      try {
        await deployedContract.voteOnActivePoll(0, 0);
      } catch (err) {
        expect(
          err ===
            "VM Exception while processing transaction: reverted with reason string 'User has already voted on the current poll."
        );
      }

      const pollVoteCounts = await getPollVoteCounts(0);
      expect(pollVoteCounts[0].toNumber()).to.equal(1);
    });
  });
  describe("Helper Functions ", () => {
    it("getPollsDetails should return an array of details", async () => {});
    it("getOptionsDetails should return an array of details", async () => {});
  });
});
