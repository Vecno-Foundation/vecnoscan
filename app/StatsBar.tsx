import Spinner from "./Spinner";
import AccountBalanceWallet from "./assets/account_balance_wallet.svg";
import Box from "./assets/box.svg";
import Coins from "./assets/coins.svg";
import Landslide from "./assets/landslide.svg";
import Swap from "./assets/swap.svg";
import Time from "./assets/time.svg";
import Trophy from "./assets/trophy.svg";

import { useAddressDistribution } from "./hooks/useAddressDistribution";
import { useBlockdagInfo } from "./hooks/useBlockDagInfo";
import { useBlockReward } from "./hooks/useBlockReward";
import { useCoinSupply } from "./hooks/useCoinSupply";
import { useHalving } from "./hooks/useHalving";
import { useTransactionsCount } from "./hooks/useTransactionsCount";

import numeral from "numeral";
import { useEffect, useRef, useState } from "react";

const TOTAL_SUPPLY = 200_000_000;

const Icon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-4 h-4 flex items-center justify-center fill-cyan-400">
    {children}
  </div>
);

const StatItem = ({
  icon,
  label,
  value,
  unit,
  loading = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  loading?: boolean;
}) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-lg hover:bg-white/5 transition-all group whitespace-nowrap">
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-xs text-cyan-300 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="ml-auto flex items-center gap-1.5">
      {loading ? (
        <Spinner className="h-4 w-4 fill-cyan-400" />
      ) : (
        <>
          <span className="text-sm font-bold text-white">{value}</span>
          {unit && <span className="text-xs font-medium text-cyan-400">{unit}</span>}
        </>
      )}
    </div>
  </div>
);

export const StatsBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { data: blockDagInfo, isLoading: l1 } = useBlockdagInfo();
  const { data: coinSupply, isLoading: l2 } = useCoinSupply();
  const { data: blockReward, isLoading: l3 } = useBlockReward();
  const { data: halving, isLoading: l4 } = useHalving();
  const { data: transactionsCount, isLoading: l5 } = useTransactionsCount();
  const { data: addressDistribution, isLoading: l6 } = useAddressDistribution();

  const totalTxCount = l5
    ? ""
    : transactionsCount
    ? numeral(transactionsCount.total).format("0.[0]a").toUpperCase()
    : "0";

  const activeAddresses = (() => {
    if (!addressDistribution?.[0]?.tiers) return 0;
    return addressDistribution[0].tiers
      .filter((t: any) => t.tier > 0)
      .reduce((acc: number, t: any) => acc + t.count, 0);
  })();

  const checkOverflow = () => {
    if (!containerRef.current || !contentRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = contentRef.current.scrollWidth;
    setShouldMarquee(contentWidth > containerWidth + 20);
  };

  useEffect(() => {
    checkOverflow();
    const handler = () => checkOverflow();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [
    blockDagInfo,
    coinSupply,
    blockReward,
    halving,
    transactionsCount,
    addressDistribution,
    l1, l2, l3, l4, l5, l6,
  ]);

  const statsContent = (
    <div ref={contentRef} className="flex gap-1 whitespace-nowrap">
      <StatItem icon={<Icon><Swap /></Icon>} label="Transactions" value={totalTxCount} loading={l5} />
      <StatItem icon={<Icon><Box /></Icon>} label="Blocks" value={numeral(blockDagInfo?.virtualDaaScore || 0).format("0,0")} loading={l1} />
      <StatItem icon={<Icon><Coins /></Icon>} label="Supply" value={numeral((coinSupply?.circulatingSupply || 0) / 100_000_000).format("0,0.[0]")} unit="VE" loading={l2} />
      <StatItem icon={<Icon><Landslide /></Icon>} label="Mined" value={((coinSupply?.circulatingSupply || 0) / TOTAL_SUPPLY / 1_000_000).toFixed(2)} unit="%" loading={l2} />
      <StatItem icon={<Icon><Time /></Icon>} label="Block Time" value="1" unit="s" />
      <StatItem icon={<Icon><AccountBalanceWallet /></Icon>} label="Addresses" value={numeral(activeAddresses).format("0.[0]a")} loading={l6} />
      <StatItem icon={<Icon><Trophy /></Icon>} label="Block Reward" value={(blockReward?.blockreward || 0).toFixed(2)} unit="VE" loading={l3} />
      <StatItem icon={<Icon><Swap /></Icon>} label="Next Halving" value={halving?.nextHalvingDate || "—"} loading={l4} />
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0%   { transform: translateX(0%) }
            100% { transform: translateX(-50%) }
          }
          .marquee-container {
            animation: marquee 40s linear infinite;
          }
          .marquee-paused {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-b border-cyan-900/40">
        <div
          ref={containerRef}
          className="overflow-hidden relative px-4 py-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {shouldMarquee && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/80 to-transparent z-10" />
            </>
          )}
          <div className="flex justify-center items-center min-h-[48px]">
            <div
              className={`
                flex items-center
                ${shouldMarquee ? "marquee-container" : ""}
                ${isHovered ? "marquee-paused" : ""}
              `}
              style={{
                transform: shouldMarquee && !isHovered ? undefined : "translateX(0%)",
              }}
            >
              {shouldMarquee ? (
                <div className="flex">
                  {statsContent}
                  {statsContent}
                </div>
              ) : (
                statsContent
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsBar;