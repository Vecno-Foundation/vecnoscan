import VeLink from "../VeLink";
import LoadingMessage from "../LoadingMessage";
import PageTable from "../PageTable";
import ArrowRight from "../assets/arrow-right.svg";
import Group from "../assets/group.svg";
import Vecno from "../assets/vecnos.svg";

import { useAddressNames } from "../hooks/useAddressNames";
import { useWhaleMovements } from "../hooks/useWhaleMovements";
import { MarketDataContext } from "../context/MarketDataProvider";

import Card from "../layout/Card";
import CardContainer from "../layout/CardContainer";
import FooterHelper from "../layout/FooterHelper";
import MainBox from "../layout/MainBox";
import numeral from "numeral";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useContext } from "react";

dayjs.extend(relativeTime);

const VE = 100_000_000;

interface WhaleMovement {
  transaction_id: string;
  block_time: number;
  amount: number;
  from_address: string | null;
  to_address: string;
}

export function meta() {
  return [
    { title: "Vecno Whale Movements | Vecnoscan" },
    { name: "description", content: "Real-time tracking of large Vecno transfers (whale movements)." },
    { name: "keywords", content: "Vecno whale transfers, large transactions, whale watching" },
  ];
}

export default function Movements() {
  const { data: rawMovements = [], isLoading } = useWhaleMovements();
  const { price } = useContext(MarketDataContext);

  if (isLoading) {
    return <LoadingMessage>Loading whale movements...</LoadingMessage>;
  }

  const movements = [...rawMovements]
    .sort((a, b) => b.block_time - a.block_time)
    .slice(0, 100);

  const totalMovements = movements.length;
  const totalVolumeVE = movements.reduce((sum: number, m: WhaleMovement) => sum + m.amount, 0) / VE;
  const totalValueUSD = totalVolumeVE * (price ?? 0);
  const largestMovementVE =
    movements.length > 0 ? Math.max(...movements.map((m: WhaleMovement) => m.amount)) / VE : 0;

  return (
    <>
      <MainBox>
        <CardContainer title="Whale Activity">
          <Card
            title="Movements"
            value={numeral(totalMovements).format("0,0")}
            subtext="in recent blocks"
          />
          <Card
            title="Total Volume"
            value={`${numeral(totalVolumeVE).format("0,0.[00]")} VE`}
            subtext="transferred"
          />
          <Card
            title="Total Value"
            value={`$${numeral(totalValueUSD).format("0,0.[00]")}`}
            subtext="at current price"
          />
          <Card
            title="Largest Transfer"
            value={`${numeral(largestMovementVE).format("0,0.[00]")} VE`}
            subtext="single movement"
          />
        </CardContainer>
      </MainBox>
      <div className="hidden md:block w-full">
        <div className="flex w-full flex-col rounded-4xl bg-white p-4 text-left text-gray-500 sm:p-8">
          <PageTable
            className="text-black"
            headers={["Time", "From", "", "To", "Amount", "Value", "Transaction"]}
            additionalClassNames={{
              1: "min-w-[180px]",
              3: "min-w-[180px]",
              4: "text-right",
              5: "text-right pr-4",
              6: "text-left",
            }}
            rows={movements.map((m: WhaleMovement) => {
              const time = dayjs(m.block_time);
              const amountVE = m.amount / VE;
              const valueUSD = amountVE * (price ?? 0);

              return [
                <div key="time" className="text-sm">
                  {time.fromNow()}
                </div>,
                <div key="from">
                  {m.from_address ? (
                    <VeLink linkType="address" to={m.from_address} shorten mono resolveName link />
                  ) : (
                    <span className="text-gray-400 italic">Unknown</span>
                  )}
                </div>,
                <ArrowRight key="arrow" className="h-5 w-5 text-gray-400 mx-2" />,
                <div key="to">
                  <VeLink linkType="address" to={m.to_address} shorten mono resolveName link />
                </div>,
                <div key="amount" className="text-right font-medium text-nowrap flex items-center justify-end gap-1">
                  {numeral(amountVE).format("0,0.[0000]")}
                  <Vecno className="h-4 w-4 fill-current text-gray-600" />
                </div>,
                <div key="value" className="text-right font-bold text-green-600">
                  ${numeral(valueUSD).format("0,0.[00]")}
                </div>,
                <VeLink key="tx" linkType="transaction" to={m.transaction_id} shorten mono link />,
              ];
            })}
          />
        </div>
      </div>
      <div className="block md:hidden">
        <div className="p-4 space-y-4">
          {movements.map((m: WhaleMovement) => {
            const time = dayjs(m.block_time);
            const amountVE = m.amount / VE;
            const valueUSD = amountVE * (price ?? 0);

            return (
              <div key={m.transaction_id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium">{time.fromNow()}</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Transfer</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {m.from_address ? (
                      <VeLink
                        linkType="address"
                        to={m.from_address}
                        shorten
                        mono
                        resolveName
                        link
                        className="text-sm break-all"
                      />
                    ) : (
                      <span className="text-sm text-gray-400 italic">Unknown</span>
                    )}
                    <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <VeLink
                      linkType="address"
                      to={m.to_address}
                      shorten
                      mono
                      resolveName
                      link
                      className="text-sm break-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Amount</span>
                    <div className="text-right font-medium flex items-center gap-1">
                      {numeral(amountVE).format("0,0.[0000]")}
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
                    <span className="text-sm text-gray-500">Transaction</span>
                    <VeLink
                      linkType="transaction"
                      to={m.transaction_id}
                      shorten
                      mono
                      link
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FooterHelper icon={Group}>
        Whale movements track significant transfers of VE on the network. USD values are estimated using current market price.
      </FooterHelper>
    </>
  );
}