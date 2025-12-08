import VeLink from "../VeLink";
import PageTable from "../PageTable";
import Transaction from "../assets/transaction.svg";
import { MarketDataContext } from "../context/MarketDataProvider";
import { useFeeEstimate } from "../hooks/useFeeEstimate";
import { useIncomingBlocks } from "../hooks/useIncomingBlocks";
import { useMempoolSize } from "../hooks/useMempoolSize";
import { useTransactionCount } from "../hooks/useTransactionCount";
import { useTransactionsCount } from "../hooks/useTransactionsCount";
import Card from "../layout/Card";
import CardContainer from "../layout/CardContainer";
import FooterHelper from "../layout/FooterHelper";
import HelperBox from "../layout/HelperBox";
import MainBox from "../layout/MainBox";
import numeral from "numeral";
import { useContext } from "react";

export function meta() {
  return [
    { title: "Vecno Transactions List | Vecnoscan" },
    {
      name: "description",
      content: "Track the latest Vecno transactions. View transaction ID, sender, recipient, fees, and block confirmations.",
    },
    { name: "keywords", content: "Vecno transactions, blockchain transfers, transaction ID, sender, receiver, fees" },
  ];
}

export default function Transactions() {
  const { transactions } = useIncomingBlocks();
  const { data: transactionCount, isLoading: isLoadingTxCount } = useTransactionCount();
  const { data: feeEstimate, isLoading: isLoadingFee } = useFeeEstimate();
  const marketData = useContext(MarketDataContext);
  const { data: transactionsCountTotal, isLoading: isLoadingTxCountTotal } = useTransactionsCount();
  const { mempoolSize } = useMempoolSize();

  // Smart total transactions (540K, 1.2M, etc.)
  const totalTxCount = isLoadingTxCountTotal
    ? ""
    : transactionsCountTotal
      ? numeral(transactionsCountTotal.total).format("0.[0]a").toUpperCase()
      : "0";

  const txCount =
    transactionCount && transactionCount.length > 0
      ? ((transactionCount[0].regular + transactionCount[0].coinbase) / 3600).toFixed(1)
      : "-";

  const regularFee = feeEstimate
    ? (feeEstimate.normalBuckets[0].feerate * 2036) / 100_000_000
    : 0;
  const regularFeeUsd = regularFee * (marketData?.price ?? 0);

  return (
    <>
      <MainBox>
        <CardContainer title="Transactions">
          <Card
            title="Total transactions"
            value={totalTxCount}
            loading={isLoadingTxCountTotal}
          />
          <Card
            title="Average TPS (1 hr)"
            value={txCount}
            loading={isLoadingTxCount}
          />
          <Card
            title="Regular fee"
            value={`${numeral(regularFee).format("0.00000000")} VE`}
            subtext={`${numeral(regularFeeUsd).format("$0,0.00[0000]")}`}
            loading={isLoadingFee}
          />
          <Card title="Mempool size" value={mempoolSize || "0"} />
        </CardContainer>
      </MainBox>

      <MainBox>
        <HelperBox>Blocks and transactions are arriving at 1 block per second.</HelperBox>

        <PageTable
          className="text-black w-full"
          headers={["Timestamp", "Transaction ID", "Amount"]}
          additionalClassNames={{ 1: "overflow-hidden" }}
          rows={transactions.map((tx) => [
            "a moment ago",
            <VeLink linkType="transaction" link to={tx.txId} mono />,
            <>
              {numeral(
                tx.outputs.reduce((acc, o) => acc + Number(o[1]), 0) / 100_000_000
              ).format("0,0.[00]")}
              <span className="text-gray-500"> VE</span>
            </>,
          ])}
        />
      </MainBox>

      <FooterHelper icon={Transaction}>
        A transaction is a cryptographically signed command that modifies the blockchain's state. Block explorers monitor and display the details of every transaction within the network.
      </FooterHelper>
    </>
  );
}