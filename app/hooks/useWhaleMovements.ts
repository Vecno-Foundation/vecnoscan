import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface WhaleMovement {
  transaction_id: string;
  block_time: number;
  amount: number;
  from_address: string | null;
  to_address: string;
  is_coinbase: boolean;
  index: number;
}

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://api.vecnoscan.org";

export const useWhaleMovements = () => {
  return useQuery({
    queryKey: ["whaleMovements"],
    queryFn: () => axios.get(`${API_URL}/transactions/whale-movements`),
    select: (res) => res.data,
    refetchInterval: 10000,
  });
};