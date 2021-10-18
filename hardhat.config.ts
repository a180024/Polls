/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import("@nomiclabs/hardhat-waffle");
import("@nomiclabs/hardhat-ethers");
import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
dotenv.config();
import "./tasks/deploy";
const { STAGING_ALCHEMY_KEY, PRIVATE_KEY } = process.env;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
let config: HardhatUserConfig;

export default config = {
  solidity: "0.8.0",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: STAGING_ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
