import { useHashrate } from "../hooks/useHashRate";
import { Hash } from "lucide-react";

const formatHashrate = (hashrateMh: number): string => {
  const n = hashrateMh;

  if (n < 1_000) return `${n.toFixed(2)} MH/s`;
  if (n < 1_000_000) return `${(n / 1_000).toFixed(2)} GH/s`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(2)} TH/s`;
  if (n < 1_000_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} PH/s`;
  return `${n.toFixed(2)} MH/s`;
};

export const Hashrate = () => {
  const { data, isLoading, error } = useHashrate();

  return (
    <div
      className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg
                 bg-cyan-900/15 backdrop-blur-md border border-cyan-800/30
                 hover:bg-cyan-900/25 hover:border-cyan-700/50
                 transition-all duration-300 group"
      title="Current network hashrate"
    >
      <Hash className="w-3.5 h-3.5 text-cyan-500 group-hover:text-cyan-400 transition-colors" />

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Network Hashrate</span>

        {isLoading && (
          <span className="text-xs font-semibold text-cyan-400 animate-pulse">⋯</span>
        )}

        {error && (
          <span className="text-xs font-semibold text-red-500">—</span>
        )}

        {data && !isLoading && !error && (
          <span className="text-sm font-bold text-white tracking-tight">
            {formatHashrate(data.hashrate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Hashrate;