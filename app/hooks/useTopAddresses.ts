import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

interface TopAddress {
  rank: number;
  address: string;
  amount: number;
}

interface TopAddressesData {
  ranking: TopAddress[];
}

export const useTopAddresses = () => {
  return useQuery<TopAddressesData>({
    queryKey: ["topAddresses"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/addresses/balances/csv/paged`, {
        params: { page: 1, items_per_page: 10000 },
        responseType: "text",
      });

      const lines = res.data.trim().split("\n");

      let ranking: TopAddress[] = lines
        .slice(1)
        .filter((line: string) => line.trim() !== "")
        .map((line: string, index: number) => {
          const [address = "", balanceStr = "0"] = line.split(",");
          const amount = Number(balanceStr.trim());
          return {
            rank: index,
            address: address.trim(),
            amount,
          };
        })
        .filter((addr: TopAddress): addr is TopAddress => addr.amount > 0);

      ranking.sort((a: TopAddress, b: TopAddress) => b.amount - a.amount);

      ranking = ranking.map((addr, index) => ({
        ...addr,
        rank: index,
      }));

      return { ranking };
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    gcTime: Infinity,
  });
};