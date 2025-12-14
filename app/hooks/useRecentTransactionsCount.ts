import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:7000";

export interface RecentTransactionsCount {
  transactions_last_24h: number;
  period_start_timestamp_ms: number;
  period_end_timestamp_ms: number;
  generated_at_ms: number;
}

export const useRecentTransactionsCount = () =>
  useQuery<RecentTransactionsCount>({
    queryKey: ["recentTransactionsCount"],
    queryFn: async () => {
      const { data } = await axios.get<RecentTransactionsCount>(
        `${API_URL}/stats/transactions/recent-count`
      );
      return data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    retry: 3,
    retryDelay: 2000,
  });