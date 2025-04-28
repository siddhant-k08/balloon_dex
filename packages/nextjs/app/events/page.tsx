"use client";

import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Events: NextPage = () => {
  const { data: EthToTokenEvents, isLoading: isEthToTokenEventsLoading } = useScaffoldEventHistory({
    contractName: "DEX",
    eventName: "EthToTokenSwap",
    fromBlock: 0n,
  });

  const { data: tokenToEthEvents, isLoading: isTokenToEthEventsLoading } = useScaffoldEventHistory({
    contractName: "DEX",
    eventName: "TokenToEthSwap",
    fromBlock: 0n,
  });

  const { data: liquidityProvidedEvents, isLoading: isLiquidityProvidedEventsLoading } = useScaffoldEventHistory({
    contractName: "DEX",
    eventName: "LiquidityProvided",
    fromBlock: 0n,
  });

  const { data: liquidityRemovedEvents, isLoading: isLiquidityRemovedEventsLoading } = useScaffoldEventHistory({
    contractName: "DEX",
    eventName: "LiquidityRemoved",
    fromBlock: 0n,
  });

  const renderTable = (
    title: string,
    headers: string[],
    rows: any[] | undefined,
    rowRenderer: (event: any, index: number) => JSX.Element,
    isLoading: boolean
  ) => (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <h2 className="text-3xl font-semibold text-center mb-6">{title}</h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl border rounded-xl">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th key={i} className="bg-primary text-primary-content text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!rows || rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    No events found
                  </td>
                </tr>
              ) : (
                rows.map((event, index) => rowRenderer(event, index))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-12 px-4">
      {renderTable(
        "ETH To Balloons Events",
        ["Address", "Amount of ETH In", "Amount of Balloons Out"],
        EthToTokenEvents,
        (event, index) => (
          <tr key={index} className="text-center">
            <td>
              <Address address={event.args.swapper} />
            </td>
            <td>{parseFloat(formatEther(event.args.ethInput || 0n)).toFixed(4)}</td>
            <td>{parseFloat(formatEther(event.args.tokenOutput || 0n)).toFixed(4)}</td>
          </tr>
        ),
        isEthToTokenEventsLoading
      )}

      {renderTable(
        "Balloons To ETH Events",
        ["Address", "Amount of Balloons In", "Amount of ETH Out"],
        tokenToEthEvents,
        (event, index) => (
          <tr key={index} className="text-center">
            <td>
              <Address address={event.args.swapper} />
            </td>
            <td>{parseFloat(formatEther(event.args.tokensInput || 0n)).toFixed(4)}</td>
            <td>{parseFloat(formatEther(event.args.ethOutput || 0n)).toFixed(4)}</td>
          </tr>
        ),
        isTokenToEthEventsLoading
      )}

      {renderTable(
        "Liquidity Provided Events",
        ["Address", "Amount of ETH In", "Amount of Balloons In", "Liquidity Minted"],
        liquidityProvidedEvents,
        (event, index) => (
          <tr key={index} className="text-center">
            <td>
              <Address address={event.args.liquidityProvider} />
            </td>
            <td>{parseFloat(formatEther(event.args.ethInput || 0n)).toFixed(4)}</td>
            <td>{parseFloat(formatEther(event.args.tokensInput || 0n)).toFixed(4)}</td>
            <td>{parseFloat(formatEther(event.args.liquidityMinted || 0n)).toFixed(4)}</td>
          </tr>
        ),
        isLiquidityProvidedEventsLoading
      )}

      {renderTable(
        "Liquidity Removed Events",
        ["Address", "Amount of ETH Out", "Amount of Balloons Out", "Liquidity Withdrawn"],
        liquidityRemovedEvents,
        (event, index) => (
          <tr key={index} className="text-center">
            <td>
              <Address address={event.args.liquidityRemover} />
            </td>
            <td>{parseFloat(formatEther(event.args.ethOutput || 0n)).toFixed(4)}</td>
            <td>{parseFloat(formatEther(event.args.tokensOutput || 0n)).toFixed(4)}</td>
            <td>{parseFloat(formatEther(event.args.liquidityWithdrawn || 0n)).toFixed(4)}</td>
          </tr>
        ),
        isLiquidityRemovedEventsLoading
      )}
    </div>
  );
};

export default Events;
