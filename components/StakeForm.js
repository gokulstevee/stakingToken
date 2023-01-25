import React from "react";
import { useWeb3Contract } from "react-moralis";
import StakingAbi from "../constants/Staking.json";
import TokenAbi from "../constants/RewardToken.json";
import { Form } from "web3uikit";
import { ethers } from "ethers";

function StakeForm() {
  const stakingAddress = "0x361dc65Cb282534c946b5399ba8e08DC6c009e08";
  const rewardTokenAddress = "0xa3F7e7D54c7613C762De27E1898B5B459B03B6f3";

  const { runContractFunction } = useWeb3Contract();

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: "approve",
  };

  let stakeOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "stake",
  };

  async function handleStakeSubmit(data) {
    const amountToApprove = data.data[0].inputResult;
    approveOptions.params = {
      amount: ethers.utils.parseEther(amountToApprove, "ether"),
      spender: stakingAddress,
    };

    const tx = await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleApproveSuccess(approveOptions.params.amount);
      },
    });
  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    stakeOptions.params = {
      amount: amountToStakeFormatted,
    };

    const tx = await runContractFunction({
      params: stakeOptions,
      onError: (error) => console.log(error),
    });

    // await tx.wait(0);
    console.log("Stake transaction complete");
  }

  return (
    <div className="text-black">
      <Form
        onSubmit={handleStakeSubmit}
        data={[
          {
            inputWidth: "50%",
            name: "Amount to stake ",
            type: "number",
            value: "",
            key: "amountToStake",
          },
        ]}
        title="Stake Now!"
      ></Form>
    </div>
  );
}

export default StakeForm;
