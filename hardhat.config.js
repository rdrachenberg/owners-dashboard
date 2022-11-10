// const { ethers } = require("hardhat");

require("@nomicfoundation/hardhat-toolbox");
// task("balance", "Prints account balance").addParam("account", "The account's address").setAction(async (taskArgs) => {
//   const balance = await ethers.providers.getBalance(taskArgs.account);

//   console.log(ethers.utils.formatEther(balance), "ETH");
// });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  
  solidity: "0.8.17",
};
