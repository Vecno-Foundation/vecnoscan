import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

// Types matching the backend response
export interface HashratePoint {
  timestamp: string;     // ISO 8601 string
  blueScore: number;
  hashrate: number;      // in MH/s, already rounded
}

export interface HashrateHistory {
  data: HashratePoint[];
}

export const useHashrateHistory = () =>
  useQuery({
    queryKey: ["hashrate-history"],
    queryFn: async (): Promise<HashrateHistory> => {
      const { data } = await axios.get<HashrateHistory>(
        `${API_BASE}/info/hashrate/history`
      );
      return data;
    },
    refetchInterval: 60000,    // Refresh every 60 seconds (new point every ~10 min)
    staleTime: 30000,          // Consider data fresh for 30 seconds
  });