// app/hooks/useTransactionsCount.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://api.vecnoscan.org";

export interface TransactionsCount {
  total: number;
  regular: number;
  coinbase: number;
  timestamp: number;
}

export const useTransactionsCount = () =>
  useQuery<TransactionsCount>({
    queryKey: ["transactionsCount"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/stats/transactions`);
      return data;
    },
    staleTime: 1000 * 60 * 2,     // 2 minutes
    refetchInterval: 1000 * 60 * 2,
    retry: 3,
    retryDelay: 2000,
  });