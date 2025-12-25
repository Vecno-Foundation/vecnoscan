import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

export interface BlockRewardInfo {
  blockreward: number;
}

export const useBlockReward = () =>
  useQuery({
    queryKey: ["blockReward"],
    queryFn: async () => {
      const { data } = await axios.get<BlockRewardInfo>(
        `${API_BASE}/info/blockreward`
      );
      return data;
    },
    staleTime: 60000,
  });