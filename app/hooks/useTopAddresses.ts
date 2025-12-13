// app/hooks/useTopAddresses.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TopAddress {
  rank: number;
  address: string;
  amount: number;
}

interface TopAddressesData {
  ranking: TopAddress[];
}

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://api.vecnoscan.org";

export const useTopAddresses = () => {
  return useQuery<TopAddressesData>({
    queryKey: ["topAddresses"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/addresses/balances/csv/paged`, {
        params: { page: 1, items_per_page: 100 },
        responseType: "text",
      });

      const lines = res.data.trim().split("\n");
      const ranking = lines
        .slice(1) // skip header
        .filter((line: string) => line.trim() !== "")
        .map((line: string, index: number): TopAddress => {
          const [address, balanceStr] = line.split(",");
          return {
            rank: index,
            address: address.trim(),
            amount: Number(balanceStr.trim()),
          };
        });

      // Explicitly type the sort parameters
      ranking.sort((a: TopAddress, b: TopAddress) => b.amount - a.amount);

      return { ranking };
    },
    staleTime: 1000 * 60 * 2,      // 2 minutes
    refetchInterval: 1000 * 60 * 2, // Poll every 2 minutes
    gcTime: Infinity,              // Keep alive across navigation
  });
};