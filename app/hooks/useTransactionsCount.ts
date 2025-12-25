import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

export interface TransactionsCount {
  total: number;
  regular: number;
  timestamp: number;
}

export const useTransactionsCount = () =>
  useQuery<TransactionsCount>({
    queryKey: ["transactionsCount"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/stats/transactions`);
      return data;
    },
    staleTime: 1000 * 60 * 2,     // 2 minutes
    refetchInterval: 1000 * 60 * 2,
    retry: 3,
    retryDelay: 2000,
  });