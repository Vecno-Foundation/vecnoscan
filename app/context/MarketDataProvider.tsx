import { getMarketData } from "../api/vecno-api-client";
import numeral from "numeral";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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
      const resp = await getMarketData();

      const usdPrice = resp?.current_price?.usd ?? resp?.usd ?? null;
      const change24hRaw = resp?.price_change_percentage_24h ?? null;

      let formattedChange: string | null = null;
      if (typeof change24hRaw === "number" && !isNaN(change24hRaw)) {
        formattedChange = numeral(change24hRaw).format("+0.00%");
      }

      setMarketData({
        price: typeof usdPrice === "number" ? usdPrice : null,
        change24h: formattedChange,
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
    // Initial fetch
    updateMarketData();

    // Update every 60 seconds
    const interval = setInterval(updateMarketData, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketDataContext.Provider value={marketData}>
      {children}
    </MarketDataContext.Provider>
  );
};