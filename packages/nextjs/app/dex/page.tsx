"use client";

import { useEffect, useState } from "react";
import { Curve } from "./_components";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { AddressInput, Balance, EtherInput, IntegerInput } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";

// REGEX for number inputs (only allow numbers and a single decimal point)
const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

const Dex: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ethToTokenAmount, setEthToTokenAmount] = useState("");
  const [tokenToETHAmount, setTokenToETHAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [accountBalanceOf, setAccountBalanceOf] = useState("");

  const { data: DEXInfo } = useDeployedContractInfo("DEX");
  const { data: BalloonsInfo } = useDeployedContractInfo("Balloons");
  const { address: connectedAccount } = useAccount();

  const { data: DEXBalloonBalance } = useScaffoldReadContract({
    contractName: "Balloons",
    functionName: "balanceOf",
    args: [DEXInfo?.address?.toString()],
  });

  useEffect(() => {
    if (DEXBalloonBalance !== undefined) {
      setIsLoading(false);
    }
  }, [DEXBalloonBalance]);

  const { data: DEXtotalLiquidity } = useScaffoldReadContract({
    contractName: "DEX",
    functionName: "totalLiquidity",
  });

  const { writeContractAsync: writeDexContractAsync } = useScaffoldWriteContract("DEX");
  const { writeContractAsync: writeBalloonsContractAsync } = useScaffoldWriteContract("Balloons");

  const { data: balanceOfWrite } = useScaffoldReadContract({
    contractName: "Balloons",
    functionName: "balanceOf",
    args: [accountBalanceOf],
  });

  const { data: contractBalance } = useScaffoldReadContract({
    contractName: "Balloons",
    functionName: "balanceOf",
    args: [DEXInfo?.address],
  });

  const { data: userBalloons } = useScaffoldReadContract({
    contractName: "Balloons",
    functionName: "balanceOf",
    args: [connectedAccount],
  });

  const { data: userLiquidity } = useScaffoldReadContract({
    contractName: "DEX",
    functionName: "getLiquidity",
    args: [connectedAccount],
  });

  const { data: contractETHBalance } = useWatchBalance({ address: DEXInfo?.address });

  return (
    <>
      <h1 className="text-center mb-4 mt-5">
        <span className="block text-xl text-right mr-7">
          🎈: {parseFloat(formatEther(userBalloons || 0n)).toFixed(4)}
        </span>
        <span className="block text-xl text-right mr-7">
          💦💦: {parseFloat(formatEther(userLiquidity || 0n)).toFixed(4)}
        </span>
        <span className="block text-4xl font-bold mt-2">DEX</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-12 pb-20">
        {/* Left side content */}
        <div className="space-y-10">
          {/* DEX Contract Card */}
          <div className="bg-base-100 shadow-lg shadow-secondary border border-secondary rounded-xl p-8">
            <div className="text-center mb-6">
              <span className="text-3xl font-semibold">DEX Contract</span>
              <div className="mt-4 text-xl">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <span>🎈 {parseFloat(formatEther(DEXBalloonBalance || 0n)).toFixed(4)}</span>
                )}
              </div>
            </div>

            {/* Swap ETH to Token */}
            <div className="flex flex-col sm:flex-row mb-4 justify-center items-center gap-3">
              <span className="w-full sm:w-1/2">
                ethToToken{" "}
                <EtherInput
                  value={ethToTokenAmount}
                  onChange={value => {
                    setTokenToETHAmount("");
                    setEthToTokenAmount(value);
                  }}
                  name="ethToToken"
                />
              </span>
              <button
                className="btn btn-primary mt-2 sm:mt-6"
                onClick={async () => {
                  try {
                    await writeDexContractAsync({
                      functionName: "ethToToken",
                      value: NUMBER_REGEX.test(ethToTokenAmount) ? parseEther(ethToTokenAmount) : 0n,
                    });
                  } catch (err) {
                    console.error("Error calling ethToToken function");
                  }
                }}
              >
                Send
              </button>
            </div>

            {/* Swap Token to ETH */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <span className="w-full sm:w-1/2">
                tokenToETH{" "}
                <IntegerInput
                  value={tokenToETHAmount}
                  onChange={value => {
                    setEthToTokenAmount("");
                    setTokenToETHAmount(value.toString());
                  }}
                  name="tokenToETH"
                  disableMultiplyBy1e18
                />
              </span>
              <button
                className="btn btn-primary mt-2 sm:mt-6"
                onClick={async () => {
                  try {
                    await writeDexContractAsync({
                      functionName: "tokenToEth",
                      args: [
                        NUMBER_REGEX.test(tokenToETHAmount)
                          ? parseEther(tokenToETHAmount)
                          : tokenToETHAmount,
                      ],
                    });
                  } catch (err) {
                    console.error("Error calling tokenToEth function");
                  }
                }}
              >
                Send
              </button>
            </div>

            <p className="text-center text-primary-content text-xl mt-8">
              Liquidity ({DEXtotalLiquidity ? parseFloat(formatEther(DEXtotalLiquidity || 0n)).toFixed(4) : "None"})
            </p>

            {/* Deposit */}
            <div className="flex flex-col sm:flex-row mt-6 justify-center items-center gap-3">
              <span className="w-full sm:w-1/2">
                Deposit <EtherInput value={depositAmount} onChange={setDepositAmount} />
              </span>
              <button
                className="btn btn-primary mt-2 sm:mt-6"
                onClick={async () => {
                  try {
                    await writeDexContractAsync({
                      functionName: "deposit",
                      value: NUMBER_REGEX.test(depositAmount) ? parseEther(depositAmount) : 0n,
                    });
                  } catch (err) {
                    console.error("Error calling deposit function");
                  }
                }}
              >
                Send
              </button>
            </div>

            {/* Withdraw */}
            <div className="flex flex-col sm:flex-row mt-4 justify-center items-center gap-3">
              <span className="w-full sm:w-1/2">
                Withdraw <EtherInput value={withdrawAmount} onChange={setWithdrawAmount} />
              </span>
              <button
                className="btn btn-primary mt-2 sm:mt-6"
                onClick={async () => {
                  try {
                    await writeDexContractAsync({
                      functionName: "withdraw",
                      args: [
                        NUMBER_REGEX.test(withdrawAmount)
                          ? parseEther(withdrawAmount)
                          : withdrawAmount,
                      ],
                    });
                  } catch (err) {
                    console.error("Error calling withdraw function");
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Balloons Contract */}
          <div className="bg-base-100 shadow-lg shadow-secondary border border-secondary rounded-xl p-8">
            <div className="text-center mb-6">
              <span className="text-3xl font-semibold">Balloons</span>
            </div>

            <div className="flex flex-col gap-4 items-center">
              <AddressInput
                value={approveSpender}
                onChange={setApproveSpender}
                placeholder="Address Spender"
              />
              <IntegerInput
                value={approveAmount}
                onChange={value => setApproveAmount(value.toString())}
                placeholder="Amount"
                disableMultiplyBy1e18
              />
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={async () => {
                  try {
                    await writeBalloonsContractAsync({
                      functionName: "approve",
                      args: [
                        approveSpender,
                        NUMBER_REGEX.test(approveAmount) ? parseEther(approveAmount) : approveAmount,
                      ],
                    });
                  } catch (err) {
                    console.error("Error calling approve function");
                  }
                }}
              >
                Send
              </button>

              <AddressInput
                value={accountBalanceOf}
                onChange={setAccountBalanceOf}
                placeholder="Address to check balance"
              />

              {balanceOfWrite !== undefined && (
                <span className="font-bold bg-primary px-3 rounded-2xl">
                  BAL Balance: {parseFloat(formatEther(balanceOfWrite || 0n)).toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side Curve graph */}
        <div className="mx-auto p-8">
        <div className="bg-base-100 shadow-lg shadow-secondary border border-secondary rounded-xl p-8">
            <h2 className="text-center text-2xl font-semibold mb-4">Liquidity Curve</h2>
            <Curve
              addingEth={ethToTokenAmount !== "" ? parseFloat(ethToTokenAmount.toString()) : 0}
              addingToken={tokenToETHAmount !== "" ? parseFloat(tokenToETHAmount.toString()) : 0}
              ethReserve={parseFloat(formatEther(contractETHBalance?.value || 0n))}
              tokenReserve={parseFloat(formatEther(contractBalance || 0n))}
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dex;