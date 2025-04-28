import Image from "next/image";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10 text-white min-h-screen">
      <div className="px-5 w-[90%] md:w-[75%]">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/hero.jpg"
            width={727}
            height={231}
            alt="futuristic ethereum DEX banner"
            className="rounded-2xl border-2 border-cyan-500 shadow-xl"
          />
          <div className="max-w-3xl mt-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/10">
            <h1 className="text-center text-3xl md:text-4xl font-bold text-cyan-400 mb-4">
              ⚖️ DEX
            </h1>
            <p className="text-center text-lg md:text-xl text-gray-300 leading-relaxed">
              🌌 Trade ERC20 BALLOONS ($BAL) with ETH in a decentralized galaxy of tokens. Connect your wallet, check your assets, and swap seamlessly in a UI built for the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
