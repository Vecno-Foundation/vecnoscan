import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HashrateInfo {
  hashrate: number; // in MH/s
}

export const useHashrate = () =>
  useQuery({
    queryKey: ["hashrate"],
    queryFn: async () => {
      const { data } = await axios.get("https://api.vecnoscan.org/info/hashrate");
      return data as HashrateInfo;
    },
    refetchInterval: 30000,
  });