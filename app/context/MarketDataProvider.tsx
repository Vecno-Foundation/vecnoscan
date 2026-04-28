import { getMarketData } from "../api/vecno-api-client";
import numeral from "numeral";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface VecnoMarketResponse {
  current_price?: {
    usd?: number;
  };
  usd?: number;
  price_change_percentage_24h?: number;
}

interface MarketData {
  price: number | null;
  change24h: string | null;
  isLoading: boolean;
  error: boolean;
}

const initialMarketData: MarketData = {
  price: null,
  change24h: null,
  isLoading: true,
  error: false,
};

export const MarketDataContext = createContext<MarketData>(initialMarketData);

export const MarketDataProvider = ({ children }: { children: ReactNode }) => {
  const [marketData, setMarketData] = useState<MarketData>(initialMarketData);

  const updateMarketData = async () => {
    try {
      const resp = (await getMarketData()) as VecnoMarketResponse;

      const usdPrice = resp?.current_price?.usd ?? resp?.usd ?? null;
      const change24hRaw = resp?.price_change_percentage_24h ?? null;

      let formattedPrice: number | null = null;
      if (typeof usdPrice === "number" && !isNaN(usdPrice) && usdPrice > 0) {
        formattedPrice = Number(usdPrice.toFixed(5));
      }

      // Format 24h change
      let formattedChange: string | null = null;
      if (typeof change24hRaw === "number" && !isNaN(change24hRaw)) {
        formattedChange = numeral(change24hRaw).format("+0.00%");
      }

      setMarketData({
        price: formattedPrice,
        change24h: formattedChange ?? "0.00%",
        isLoading: false,
        error: false,
      });
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setMarketData({
        price: null,
        change24h: null,
        isLoading: false,
        error: true,
      });
    }
  };

  useEffect(() => {
    updateMarketData();
    const interval = setInterval(updateMarketData, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MarketDataContext.Provider value={marketData}>
      {children}
    </MarketDataContext.Provider>
  );
};