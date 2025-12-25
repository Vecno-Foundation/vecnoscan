import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE } from "../api/vecno-api-client";

export interface WhaleMovement {
  transaction_id: string;
  block_time: number;
  amount: number;
  from_address: string | null;
  to_address: string;
  is_coinbase: boolean;
  index: number;
}

export const useWhaleMovements = () => {
  return useQuery({
    queryKey: ["whaleMovements"],
    queryFn: () => axios.get(`${API_BASE}/transactions/whale-movements`),
    select: (res) => res.data,
    refetchInterval: 10000,
  });
};