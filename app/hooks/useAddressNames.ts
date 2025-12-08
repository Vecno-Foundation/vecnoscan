// app/hooks/useAddressNames.ts
import { ADDRESS_NAMES } from "../data/addressNames";

// Simple hook that returns static name tags
export const useAddressNames = () => {
  return {
    data: ADDRESS_NAMES,
    isLoading: false,
    isError: false,
  };
};