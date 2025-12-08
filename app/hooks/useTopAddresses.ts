// app/hooks/useTopAddresses.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TopAddress {
  rank: number;
  address: string;
  amount: number; // in smallest units (like satoshis)
}

interface TopAddressesData {
  ranking: TopAddress[];
}

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://api.vecnoscan.org";

export const useTopAddresses = () => {
  return useQuery<TopAddressesData>({
    queryKey: ["topAddresses"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/static/top-1000.csv`, {
        responseType: "text",
      });

      const lines = res.data.trim().split("\n");
      const ranking = lines
        .slice(1) // skip header
        .map((line: string, index: number) => {
          const [address, balanceStr] = line.split(",");
          return {
            rank: index,
            address: address.trim(),
            amount: Number(balanceStr.trim()),
          };
        });

      return { ranking };
    },
    staleTime: 1000 * 60 * 2, // matches your server update interval
  });
};