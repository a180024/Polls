import { task } from "hardhat/config";
import { Contract, ContractFactory } from "ethers";
import { getWallet } from "../lib/wallet";

task("deploy-contract", "Deploy Polls contract").setAction(async (_, hre) => {
  return hre.ethers
    .getContractFactory("Polls", getWallet())
    .then((contractFactory: ContractFactory) => contractFactory.deploy())
    .then((result: Contract) => {
      process.stdout.write(`Contract address: ${result.address}`);
    });
});
