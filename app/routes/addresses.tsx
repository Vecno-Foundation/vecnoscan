import VeLink from "../VeLink";
import LoadingMessage from "../LoadingMessage";
import PageTable from "../PageTable";
import PageSelector from "../PageSelector";
import AccountBalanceWallet from "../assets/account_balance_wallet.svg";
import Vecno from "../assets/vecnos.svg";
import { useAddressNames } from "../hooks/useAddressNames";
import { useCoinSupply } from "../hooks/useCoinSupply";
import { useTopAddresses } from "../hooks/useTopAddresses";
import { MarketDataContext } from "../context/MarketDataProvider";
import Card from "../layout/Card";
import CardContainer from "../layout/CardContainer";
import FooterHelper from "../layout/FooterHelper";
import MainBox from "../layout/MainBox";
import numeral from "numeral";
import { useContext, useState, useEffect } from "react";

const VE = 100_000_000;
const ITEMS_PER_PAGE = 100;

enum PageSelectorClick {
  FIRST = 0,
  LAST = 3,
  PREVIOUS = 2,
  NEXT = 1,
}

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
  const { price } = useContext(MarketDataContext);
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  if (loadingTop || loadingSupply || !topData || !supply) {
    return <LoadingMessage>Loading addresses...</LoadingMessage>;
  }

  const { ranking } = topData;
  const circulatingSupply = supply.circulatingSupply;

  const sumTop = (n: number) => ranking.slice(0, n).reduce((s, a) => s + a.amount, 0);
  const percent = (n: number) => (sumTop(n) / circulatingSupply) * 100;
  const addressesWith1VE = ranking.filter(a => a.amount >= VE).length;

  const totalValueTop100USD = ranking
    .slice(0, 100)
    .reduce((sum, a) => sum + (a.amount / VE) * (price ?? 0), 0);

  const totalPages = Math.ceil(ranking.length / ITEMS_PER_PAGE);
  const paginatedRanking = ranking.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (action: PageSelectorClick) => {
    let newPage = currentPage;

    switch (action) {
      case PageSelectorClick.FIRST:
        newPage = 1;
        break;
      case PageSelectorClick.LAST:
        newPage = totalPages;
        break;
      case PageSelectorClick.PREVIOUS:
        newPage = Math.max(1, currentPage - 1);
        break;
      case PageSelectorClick.NEXT:
        newPage = Math.min(totalPages, currentPage + 1);
        break;
    }

    setCurrentPage(newPage);
  };

  const renderLabel = (address: string) => {
    const label = addressNames[address];
    if (!label || label.trim() === "") return null;

    return (
      <div className="group relative inline-block">
        <span className="inline-block bg-accent-yellow text-alert font-medium rounded-full px-3 py-1 text-xs whitespace-nowrap">
          {label}
        </span>
        {label.length > 20 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    );
  };
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
      <div className="hidden md:block w-full">
        <div className="flex w-full flex-col rounded-4xl bg-white p-4 text-left text-gray-500 sm:p-8">
          <PageTable
            className="text-black"
            headers={["Rank", "Address", "Label", "Balance", "Value", "Percentage"]}
            additionalClassNames={{
              0: "w-16",
              1: "min-w-48",
              2: "w-40",
              3: "text-right",
              4: "text-right pr-4",
              5: "text-right",
            }}
            rows={paginatedRanking.map((addr) => {
              const balanceVE = addr.amount / VE;
              const valueUSD = balanceVE * (price ?? 0);
              const fullAddress = `vecno:${addr.address}`;

              return [
                addr.rank + 1,
                <VeLink linkType="address" link to={fullAddress} mono />,
                renderLabel(addr.address),
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
          <div className="mt-8 flex justify-center">
            <PageSelector
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <div className="p-4 space-y-4">
          {paginatedRanking.map((addr) => {
            const balanceVE = addr.amount / VE;
            const valueUSD = balanceVE * (price ?? 0);
            const percentage = (addr.amount / circulatingSupply) * 100;
            const fullAddress = `vecno:${addr.address}`;

            return (
              <div key={addr.address} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Rank</span>
                  <span className="font-bold text-lg">#{addr.rank + 1}</span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <VeLink linkType="address" link to={fullAddress} mono className="text-sm break-all" />
                </div>

                {renderLabel(addr.address) && (
                  <div className="mb-4 mt-2">
                    {renderLabel(addr.address)}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Balance</span>
                    <div className="text-right font-medium flex items-center gap-1">
                      {numeral(balanceVE).format("0,0.[0000]")}
                      <Vecno className="h-4 w-4 fill-current text-gray-600" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Value</span>
                    <span className="font-bold text-green-600">
                      ${numeral(valueUSD).format("0,0.[00]")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Percentage</span>
                    <span className="text-right">
                      {numeral(percentage).format("0.00")}<span className="text-gray-500 ml-1">%</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 flex justify-center">
          <PageSelector
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <FooterHelper icon={AccountBalanceWallet}>
        An address is a unique identifier on the blockchain used to send, receive, and store assets or data. USD values are estimated using current market price.
      </FooterHelper>
    </>
  );
}