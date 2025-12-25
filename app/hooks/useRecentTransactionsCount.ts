import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

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
        `${API_BASE}/stats/transactions/recent-count`
      );
      return data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    retry: 3,
    retryDelay: 2000,
  });