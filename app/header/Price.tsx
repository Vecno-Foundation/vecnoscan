import VecnoIcon from "../assets/vecnos.svg";
import { MarketDataContext } from "../context/MarketDataProvider";
import numeral from "numeral";
import { useContext } from "react";

interface PriceProps {
  className?: string;
}

const Price = ({ className = "" }: PriceProps) => {
  const marketData = useContext(MarketDataContext);

  const isLoading = marketData.isLoading || marketData.price === null;
  const hasError = marketData.error;

  const formattedPrice = marketData.price
    ? numeral(marketData.price).format("0,0.[00000]")
    : "0.00";

  // Safely parse 24h change
  const change24hRaw = marketData.change24h;
  const changeValue = typeof change24hRaw === "string"
    ? parseFloat(change24hRaw.replace(/[^0-9.-]/g, ""))
    : 0;

  const isPositive = changeValue > 0;
  const isNeutral = changeValue === 0;

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
          {isLoading || hasError ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `$${formattedPrice}`
          )}
        </span>
      </div>

      <div
        className={`
          px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
          transition-all duration-300 shadow-sm
          ${isLoading || hasError || isNeutral
            ? "bg-gray-800/60 text-gray-400 border border-gray-700/50"
            : isPositive
              ? "bg-cyan-800/70 text-cyan-300 border border-cyan-600/80 shadow-cyan-500/20"
              : "bg-red-900/50 text-red-400 border border-red-800/60 shadow-red-900/20"
          }
        `}
      >
        {isLoading || hasError
          ? "0.00%"
          : marketData.change24h}
      </div>
    </div>
  );
};

export default Price;