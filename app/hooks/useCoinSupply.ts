import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

export interface CoinSupplyInfo {
  circulatingSupply: number;
  maxSupply: number;
}

export const useCoinSupply = () =>
  useQuery({
    queryKey: ["coinSupply"],
    queryFn: async () => {
      const { data } = await axios.get<CoinSupplyInfo>(
        `${API_BASE}/info/coinsupply`
      );
      return data;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });