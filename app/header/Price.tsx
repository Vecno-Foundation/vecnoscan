import VecnoIcon from "../assets/vecnos.svg";
import { MarketDataContext } from "../context/MarketDataProvider";
import numeral from "numeral";
import { useContext } from "react";

interface PriceProps {
  className?: string;
}

const Price = ({ className = "" }: PriceProps) => {
  const marketData = useContext(MarketDataContext);

  const isLoading = !marketData || marketData.price === undefined || marketData.price === null;

  const price = isLoading
    ? "0.00"
    : marketData?.price
    ? numeral(marketData.price).format("0,0.00")
    : "0.00";

  const change24hRaw = isLoading ? 0 : marketData?.change24h ?? 0;
  const change24h = typeof change24hRaw === "string"
    ? parseFloat(change24hRaw.replace("%", ""))
    : change24hRaw;

  const isPositive = change24h > 0;

  return (
    <div
      className={`
        hidden md:flex items-center gap-4 px-4 py-2 rounded-2xl
        bg-gray-900/90 border border-gray-800
        hover:bg-gray-800/90 hover:border-cyan-700
        transition-all duration-400 group backdrop-blur-xl
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center">
          <VecnoIcon className="w-6 h-6 fill-cyan-400 drop-shadow-glow" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-white tracking-tight">
            ${isLoading ? <span className="animate-pulse">0.00</span> : price}
          </span>
        </div>
      </div>
      <div
        className={`
          flex items-center px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md
          transition-all duration-500
          ${isLoading || change24h === 0
            ? "bg-gray-800/80 text-gray-400 border-gray-700"
            : isPositive
            ? "bg-cyan-900/70 text-cyan-300 border-cyan-600 shadow-lg shadow-cyan-500/30"
            : "bg-gray-800/80 text-gray-500 border-gray-700"
          }
        `}
      >
        <span>
          {isLoading || change24h === 0
            ? "0.00%"
            : `${isPositive ? "+" : ""}${change24h.toFixed(2)}%`}
        </span>
      </div>
    </div>
  );
};

export default Price;