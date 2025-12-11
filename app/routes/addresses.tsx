// app/routes/addresses.tsx
import VeLink from "../VeLink";
import LoadingMessage from "../LoadingMessage";
import PageTable from "../PageTable";
import AccountBalanceWallet from "../assets/account_balance_wallet.svg";
import Vecno from "../assets/vecnos.svg"; // VE icon

import { useAddressNames } from "../hooks/useAddressNames";
import { useCoinSupply } from "../hooks/useCoinSupply";
import { useTopAddresses } from "../hooks/useTopAddresses";
import { MarketDataContext } from "../context/MarketDataProvider";

import Card from "../layout/Card";
import CardContainer from "../layout/CardContainer";
import FooterHelper from "../layout/FooterHelper";
import MainBox from "../layout/MainBox";
import numeral from "numeral";
import { useContext } from "react";

const VE = 100_000_000;

export function meta() {
  return [
    { title: "Vecno Addresses List | Vecnoscan" },
    { name: "description", content: "Browse Vecno addresses. Track balances, transaction history, and recent activity on the network." },
    { name: "keywords", content: "Vecno addresses, blockchain explorer, wallet, transaction history, balances" },
  ];
}

export default function Addresses() {
  const { data: topData, isLoading: loadingTop } = useTopAddresses();
  const { data: supply, isLoading: loadingSupply } = useCoinSupply();
  const { data: addressNames = {} } = useAddressNames();
  const { price } = useContext(MarketDataContext); // Current VE price in USD

  if (loadingTop || loadingSupply || !topData || !supply) {
    return <LoadingMessage>Loading addresses...</LoadingMessage>;
  }

  const { ranking } = topData;
  const circulatingSupply = supply.circulatingSupply;
  const circulatingVE = circulatingSupply / VE;

  const sumTop = (n: number) => ranking.slice(0, n).reduce((s, a) => s + a.amount, 0);
  const percent = (n: number) => (sumTop(n) / circulatingSupply) * 100;
  const addressesWith1VE = ranking.filter(a => a.amount >= VE).length;

  // Total value of top 100 addresses in USD
  const totalValueTop100USD = ranking
    .slice(0, 100)
    .reduce((sum, a) => sum + (a.amount / VE) * (price ?? 0), 0);

  return (
    <>
      <MainBox>
        <CardContainer title="Addresses">
          <Card
            title="Number of addresses"
            value={numeral(addressesWith1VE).format("0,0")}
            subtext="with at least 1 VE"
          />
          <Card
            title="Top 10 addresses"
            value={`${numeral(percent(10)).format("0.00")}%`}
            subtext="of circulating supply"
          />
          <Card
            title="Top 100 addresses"
            value={`${numeral(percent(100)).format("0.00")}%`}
            subtext="of circulating supply"
          />
          <Card
            title="Top 100 Value"
            value={`$${numeral(totalValueTop100USD).format("0,0.[00]")}`}
            subtext="estimated at current price"
          />
        </CardContainer>
      </MainBox>

      <div className="flex w-full flex-col rounded-4xl bg-white p-4 text-left text-gray-500 sm:p-8">
        <PageTable
          className="text-black"
          headers={["Rank", "Address", "Label", "Balance", "Value", "Percentage"]}
          additionalClassNames={{
            3: "text-right",
            4: "text-right pr-4",
            5: "text-right",
          }}
          rows={ranking.slice(0, 100).map((addr) => {
            const balanceVE = addr.amount / VE;
            const valueUSD = balanceVE * (price ?? 0);

            return [
              addr.rank + 1,
              <VeLink linkType="address" link to={addr.address} mono />,
              addressNames[addr.address] ? (
                <div className="inline-block bg-accent-yellow text-alert rounded-full px-2 text-center text-nowrap min-h-5 text-xs">
                  {addressNames[addr.address]}
                </div>
              ) : null,
              <div className="text-right font-medium text-nowrap flex items-center justify-end gap-1">
                {numeral(balanceVE).format("0,0.[0000]")}
                <Vecno className="h-4 w-4 fill-current text-gray-600" />
              </div>,
              <div className="text-right font-bold text-green-600">
                ${numeral(valueUSD).format("0,0.[00]")}
              </div>,
              <div className="text-right text-nowrap">
                {numeral((addr.amount / circulatingSupply) * 100).format("0.00")}
                <span className="text-gray-500 ml-1">%</span>
              </div>,
            ];
          })}
        />
      </div>

      <FooterHelper icon={AccountBalanceWallet}>
        An address is a unique identifier on the blockchain used to send, receive, and store assets or data. USD values are estimated using current market price.
      </FooterHelper>
    </>
  );
}