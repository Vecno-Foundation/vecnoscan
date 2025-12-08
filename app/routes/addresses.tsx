// app/routes/addresses.tsx
import VeLink from "../VeLink";
import LoadingMessage from "../LoadingMessage";
import PageTable from "../PageTable";
import AccountBalanceWallet from "../assets/account_balance_wallet.svg";

import { useAddressNames } from "../hooks/useAddressNames";
import { useCoinSupply } from "../hooks/useCoinSupply";
import { useTopAddresses } from "../hooks/useTopAddresses";

import Card from "../layout/Card";
import CardContainer from "../layout/CardContainer";
import FooterHelper from "../layout/FooterHelper";
import MainBox from "../layout/MainBox";
import numeral from "numeral";

const VE = 100_000_000; // 1 VE = 100,000,000 smallest units

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
  const { data: addressNames = {} } = useAddressNames(); // ← now local & instant

  if (loadingTop || loadingSupply || !topData || !supply) {
    return <LoadingMessage>Loading addresses...</LoadingMessage>;
  }

  const { ranking } = topData;
  const circulatingSupply = supply.circulatingSupply;
  const circulatingVE = circulatingSupply / VE;

  const sumTop = (n: number) => ranking.slice(0, n).reduce((s, a) => s + a.amount, 0);
  const percent = (n: number) => (sumTop(n) / circulatingSupply) * 100;
  const addressesWith1VE = ranking.filter(a => a.amount >= VE).length;

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
            title="Top 1000 addresses"
            value={`${numeral(percent(1000)).format("0.00")}%`}
            subtext="of circulating supply"
          />
        </CardContainer>
      </MainBox>

      <div className="flex w-full flex-col rounded-4xl bg-white p-4 text-left text-gray-500 sm:p-8">
        <PageTable
          className="text-black"
          headers={["Rank", "Address", "Label", "Balance", "Percentage"]}
          rows={ranking.slice(0, 100).map((addr) => [
            addr.rank + 1,
            <VeLink linkType="address" link to={addr.address} mono />,
            addressNames[addr.address] ? (
              <div className="inline-block bg-accent-yellow text-alert rounded-full px-2 text-center text-nowrap min-h-5">
                {addressNames[addr.address]}
              </div>
            ) : null,
            <span className="text-nowrap">
              {numeral(addr.amount / VE).format("0,0.[0000]")}
              <span className="text-gray-500"> VE</span>
            </span>,
            <>
              {numeral((addr.amount / circulatingSupply) * 100).format("0.00")}
              <span className="text-gray-500"> %</span>
            </>,
          ])}
        />
      </div>

      <FooterHelper icon={AccountBalanceWallet}>
        An address is a unique identifier on the blockchain used to send, receive, and store assets or data. It holds
        balances and interacts with the network securely.
      </FooterHelper>
    </>
  );
}