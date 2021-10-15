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
      url: "https://eth-rinkeby.alchemyapi.io/v2/HlOva26nUmdqHLazOq_uDZTQrihf2hEy",
      accounts: [
        "0f4ce7d90f4e880fb70a9a0caf6e2baaea19ccdf6f60de6dc2032067516a35c4",
      ],
    },
  },
};
