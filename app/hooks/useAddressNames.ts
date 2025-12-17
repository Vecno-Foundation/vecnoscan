import { ADDRESS_NAMES } from "../data/addressNames";

export const useAddressNames = () => {
  return {
    data: ADDRESS_NAMES,
    isLoading: false,
    isError: false,
  };
};