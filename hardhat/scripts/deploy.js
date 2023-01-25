const hre = require("hardhat");

async function main() {
  //RewardToken Deployment

  //Deployed with "DP_1 account"
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();

  await rewardToken.deployed();

  console.log("Reward Token deployed at " + rewardToken.address);

  //StakingToken Deployment

  //Deployed with "DP_1 account
  const StakingToken = await hre.ethers.getContractFactory("staking");
  const stakingToken = await StakingToken.deploy(
    rewardToken.address,
    rewardToken.address
  );

  await stakingToken.deployed();

  console.log("Staking Token deployed at " + stakingToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
