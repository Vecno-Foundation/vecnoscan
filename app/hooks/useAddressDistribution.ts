// app/hooks/useAddressDistribution.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://api.vecnoscan.org";
const VE = 100_000_000; // 1 VE = 100,000,000 smallest units

export interface Tier {
  tier: number;
  count: number;
  amount: number;
}

export interface DistributionEntry {
  tiers: Tier[];
  timestamp: number;
}

export const useAddressDistribution = () =>
  useQuery<DistributionEntry[]>({
    queryKey: ["addressDistribution"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/static/top-1000.csv`, {
        responseType: "text",
      });

      const lines = res.data.trim().split("\n");
      const balances = lines
        .slice(1)
        .map((line: string) => {
          const [, balanceStr] = line.split(",");
          return Number(balanceStr.trim());
        })
        .filter((b: number): b is number => b > 0); // ← fixes first error

      const countAbove1VE = balances.filter((b: number) => b >= VE).length; // ← fixes second error

      return [
        {
          tiers: [
            { tier: 0, count: balances.length - countAbove1VE, amount: 0 },
            { tier: 1, count: countAbove1VE, amount: 0 },
          ],
          timestamp: Date.now(),
        },
      ];
    },
    staleTime: 1000 * 60 * 2,
  });