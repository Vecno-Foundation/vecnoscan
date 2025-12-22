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
    ? numeral(marketData.price).format("0,0.[00]")
    : "0.00";

  const change24hRaw = isLoading ? 0 : marketData?.change24h ?? 0;
  const change24h = typeof change24hRaw === "string"
    ? parseFloat(change24hRaw.replace("%", ""))
    : change24hRaw;

  const isPositive = change24h > 0;
  const isNeutral = change24h === 0;

  return (
    <div
      className={`
        hidden md:flex items-center justify-between gap-5 px-5 py-2 rounded-xl
        min-w-20
        bg-cyan-900/15 backdrop-blur-md border border-cyan-800/30
        hover:bg-cyan-900/25 hover:border-cyan-700/50
        transition-all duration-300 group
        ${className}
      `}
      title="Vecno Price (24h change)"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <VecnoIcon className="w-6 h-6 fill-cyan-500 group-hover:fill-cyan-400 transition-colors" />
        </div>

        <span className="text-base font-bold text-white tracking-tight">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `$${price}`
          )}
        </span>
      </div>
      <div
        className={`
          px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
          transition-all duration-300 shadow-sm
          ${isLoading || isNeutral
            ? "bg-gray-800/60 text-gray-400 border border-gray-700/50"
            : isPositive
            ? "bg-cyan-800/70 text-cyan-300 border border-cyan-600/80 shadow-cyan-500/20"
            : "bg-red-900/50 text-red-400 border border-red-800/60 shadow-red-900/20"
          }
        `}
      >
        {isLoading || isNeutral
          ? "0.00%"
          : `${isPositive ? "+" : ""}${change24h.toFixed(2)}%`}
      </div>
    </div>
  );
};

export default Price;