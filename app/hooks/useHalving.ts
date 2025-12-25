import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

export interface HalvingInfo {
  nextHalvingTimestamp: number;
  nextHalvingDate: string;
  nextHalvingAmount: number;
}

export const useHalving = () =>
  useQuery({
    queryKey: ["halving"],
    queryFn: async () => {
      const { data } = await axios.get<HalvingInfo>(
        `${API_BASE}/info/halving`
      );
      return data;
    },
    staleTime: 60000 * 5,
  });