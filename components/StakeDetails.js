import React, { useEffect, useState } from "react";
import StakingAbi from "../constants/Staking.json";
import TokenAbi from "../constants/RewardToken.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Form } from "web3uikit";
import { ethers } from "ethers";

function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis();
  const [rtBalance, setRtBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [earnedBalance, setEarnedBalance] = useState("0");

  const stakingAddress = "0x361dc65Cb282534c946b5399ba8e08DC6c009e08";
  const rewardTokenAddress = "0xa3F7e7D54c7613C762De27E1898B5B459B03B6f3";

  const { runContractFunction: getRTBalance } = useWeb3Contract({
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: "balanceOf",
    params: {
      account,
    },
  });

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "getStaked",
    params: {
      account,
    },
  });

  const { runContractFunction: getEarnedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "earned",
    params: {
      account,
    },
  });

  const { runContractFunction: claimReward } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "claimReward",
  });

  useEffect(() => {
    const fetchUi = setInterval(() => {
      if (isWeb3Enabled) upDateUiValues();
    }, 10000);
    return () => clearInterval(fetchUi);
  }, [
    account,
    getEarnedBalance,
    getRTBalance,
    getStakedBalance,
    isWeb3Enabled,
    stakedBalance,
    earnedBalance,
    rtBalance,
  ]);

  async function upDateUiValues() {
    //for rt balance
    const rtBalance = (
      await getRTBalance({
        onError: (error) => console.log(error),
      })
    ).toString();
    const formattedRtBalance = parseFloat(rtBalance) / 1e18;
    const rtBalanceRounded = formattedRtBalance.toFixed(2);
    setRtBalance(rtBalanceRounded);

    //for staked balance
    const stakedBalance = (
      await getStakedBalance({
        onError: (error) => console.log(error),
      })
    ).toString();
    const formattedStakedBalance = parseFloat(stakedBalance) / 1e18;
    const stakedBalanceRounded = formattedStakedBalance.toFixed(2);
    setStakedBalance(stakedBalanceRounded);

    //for earned balance
    const earnedBalance = (
      await getEarnedBalance({
        onError: (error) => console.log(error),
      })
    ).toString();
    const earnedBalanceRounded = await ethers.utils.formatUnits(
      earnedBalance,
      "gwei"
    );
    setEarnedBalance(earnedBalanceRounded);
  }

  //claim the reward for staked token
  async function claimRewardFunction() {
    console.log("claim Invoked");
    const tx = await claimReward({
      onerror: () => console.log(error),
      onSuccess: () => {},
    });
    await tx.wait(1).then(() => {
      console.log("claimed");
      if (isWeb3Enabled) upDateUiValues();
    });
  }

  //Withdraw the staked token

  const { runContractFunction } = useWeb3Contract();

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: "approve",
  };

  let withdrawOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: "withdraw",
  };

  async function withdraw(data) {
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

  async function handleApproveSuccess(amountToWithdrawFormatted) {
    withdrawOptions.params = {
      amount: amountToWithdrawFormatted,
    };

    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error),
    });

    // await tx.wait(0);
    console.log("withdraw transaction complete");
  }

  return (
    <div className="p-3">
      <div className="font-bold m-2">RT Balance is: {rtBalance}</div>
      <div className="font-bold m-2">
        Earned Balance is: {earnedBalance} Gwei
      </div>
      <div className="font-bold m-2">Staked Balance is: {stakedBalance}</div>
      <button
        className=" hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full"
        onClick={claimRewardFunction}
      >
        Cliam Reward
      </button>
      <div className="text-black">
        <Form
          onSubmit={withdraw}
          data={[
            {
              inputWidth: "50%",
              name: "Amount to withdraw ",
              type: "number",
              value: "",
              key: "amountToWithdraw",
            },
          ]}
          title="Withdraw the Token"
        ></Form>
      </div>
    </div>
  );
}

export default StakeDetails;
