import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

export interface HashrateInfo {
  hashrate: number; // in MH/s
}

export const useHashrate = () =>
  useQuery({
    queryKey: ["hashrate"],
    queryFn: async () => {
      const { data } = await axios.get<HashrateInfo>(
        `${API_BASE}/info/hashrate`
      );
      return data;
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });