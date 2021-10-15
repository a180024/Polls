import hre from "hardhat";
import { Contract, ContractFactory } from "ethers";

const main = async () => {
  const pollsContractFactory: ContractFactory =
    await hre.ethers.getContractFactory("Polls");
  const pollsContract: Contract = await pollsContractFactory.deploy();
  await pollsContract.deployed();
  console.log("Contract deployed to:", pollsContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
