export const API_BASE = "https://api.vecnoscan.org";

const DEFAULT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-cache",
};

export async function getMarketData() {
  const res = await fetch(`${API_BASE}/info/market-data`, {
    headers: DEFAULT_HEADERS,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}