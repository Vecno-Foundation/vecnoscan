import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://api.vecnoscan.org";
const VE = 100_000_000;

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
      const res = await axios.get(`${API_URL}/addresses/balances/csv/paged`, {
        params: { page: 1, items_per_page: 1000 },
        responseType: "text",
      });

      const lines = res.data.trim().split("\n");

      const balances: number[] = lines
        .slice(1)
        .filter((line: string) => line.trim() !== "")
        .map((line: string) => {
          const parts = line.split(",");
          const balanceStr = parts[1];
          return Number(balanceStr?.trim() || "0");
        })
        .filter((b: number): b is number => b > 0);

      const countWithAtLeast1VE = balances.filter((b: number) => b >= VE).length;
      const countWithZeroOrDust = balances.length - countWithAtLeast1VE;

      return [
        {
          tiers: [
            { tier: 0, count: countWithZeroOrDust, amount: 0 },
            { tier: 1, count: countWithAtLeast1VE, amount: 0 },
          ],
          timestamp: Date.now(),
        },
      ];
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    gcTime: Infinity,
  });