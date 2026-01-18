import { Accepted, NotAccepted } from "../Accepted";
import Coinbase from "../Coinbase";
import IconMessageBox from "../IconMessageBox";
import VeLink from "../VeLink";
import PageSelector from "../PageSelector";
import PageTable from "../PageTable";
import Spinner from "../Spinner";
import Tooltip, { TooltipDisplayMode } from "../Tooltip";
import AccountBalanceWallet from "../assets/account_balance_wallet.svg";
import ArrowRight from "../assets/arrow-right.svg";
import Info from "../assets/info.svg";
import Vecno from "../assets/vecnos.svg";
import { MarketDataContext } from "../context/MarketDataProvider";
import { useAddressBalance } from "../hooks/useAddressBalance";
import { useAddressNames } from "../hooks/useAddressNames";
import { useAddressTxCount } from "../hooks/useAddressTxCount";
import { useAddressUtxos } from "../hooks/useAddressUtxos";
import { useTransactions } from "../hooks/useTransactions";
import FooterHelper from "../layout/FooterHelper";
import { isValidVecnoAddressSyntax } from "../utils/vecno";
import type { Route } from "./+types/addressdetails";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import numeral from "numeral";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

dayjs.locale("en");
dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

export async function loader({ params }: Route.LoaderArgs) {
  const address = params.address;

  if (!isValidVecnoAddressSyntax(address)) {
    throw new Response(`Vecno address ${address} doesn't follow the vecno address schema.`, { status: 400 });
  }

  return { address };
}

export function meta({ params }: Route.LoaderArgs) {
  return [
    { title: `Vecno Address ${params.address} | Vecnoscan` },
    {
      name: "description",
      content: "Check Vecno address details. View transaction history, balance, and associated blocks.",
    },
    { name: "keywords", content: "Vecno address, transactions, wallet balance, blockchain address lookup" },
  ];
}

export default function Addressdetails({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const { data: balanceData, isLoading: isLoadingBalance } = useAddressBalance(loaderData.address);
  const { data: utxoData, isLoading: isLoadingUtxos } = useAddressUtxos(loaderData.address);
  const { data: txCountData, isLoading: isLoadingTxCount } = useAddressTxCount(loaderData.address);
  const { data: addressNames } = useAddressNames();
  const marketData = useContext(MarketDataContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [beforeAfter, setBeforeAfter] = useState<[number, number]>([0, 0]);

  const [cursorOlder, setCursorOlder] = useState<number | null>(null);
  const [cursorNewer, setCursorNewer] = useState<number | null>(null);

  const [expandedTxs, setExpandedTxs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrentPage(1);
    setBeforeAfter([0, 0]);
    setCursorOlder(null);
    setCursorNewer(null);
    setExpandedTxs(new Set());
  }, [loaderData.address]);

  const { data: txPageData } = useTransactions(
    loaderData.address,
    50,
    beforeAfter[0],
    beforeAfter[1],
    "",
    "light"
  );

  useEffect(() => {
    if (txPageData?.transactions?.length) {
      const newestTxTime = txPageData.transactions[0]?.block_time;
      const oldestTxTime = txPageData.transactions[txPageData.transactions.length - 1]?.block_time;

      setCursorOlder(
        txPageData.nextBefore ? Number(txPageData.nextBefore) : oldestTxTime ?? null
      );
      setCursorNewer(
        txPageData.nextAfter ? Number(txPageData.nextAfter) : newestTxTime ?? null
      );
    } else {
      setCursorOlder(null);
      setCursorNewer(null);
    }
  }, [txPageData]);

  const handlePageChange = (action: number) => {
    if (action === 0) {
      setBeforeAfter([0, 0]);
      setCurrentPage(1);
    }
    else if (action === 1 && cursorOlder !== null && cursorOlder !== 0) {
      setBeforeAfter([cursorOlder, 0]);
      setCurrentPage(p => p + 1);
    }
    else if (action === 2 && cursorNewer !== null && cursorNewer !== 0) {
      setBeforeAfter([0, cursorNewer]);
      setCurrentPage(p => Math.max(1, p - 1));
    }
    else if (action === 3) {
      const lastPage = txCountData ? Math.ceil(txCountData.total / 50) : 1;
      setBeforeAfter([0, 1]);
      setCurrentPage(lastPage);
    }
  };

  const transactions = txPageData?.transactions ?? [];

  const balanceFormatted = numeral((balanceData?.balance ?? 0) / 1e8).format("0,0.00[000000]");
  const usdValue = numeral(((balanceData?.balance ?? 0) / 1e8) * (marketData?.price ?? 0)).format("$0,0.00");

  const totalPages = txCountData ? Math.ceil(txCountData.total / 50) : 1;

  if (!loaderData.address) return null;

  const isTabActive = (tab: string) => {
    const params = new URLSearchParams(location.search);
    return (tab === "transactions" && !params.has("tab")) || params.get("tab") === tab;
  };

  return (
    <>
      <div className="mt-22 relative flex w-full flex-col rounded-4xl bg-white p-4 text-left text-black sm:p-8">
        <div className="flex flex-row items-center text-2xl sm:col-span-2">
          <AccountBalanceWallet className="mr-2 h-8 w-8" />
          <span>Address details</span>
        </div>

        <span className="mt-4 mb-0">Balance</span>

        {isLoadingBalance ? (
          <Spinner className="h-8 w-8" />
        ) : (
          <>
            <span className="flex flex-row items-center text-[32px]">
              {balanceFormatted.split(".")[0]}.
              <span className="self-end pb-[0.4rem] text-2xl">{balanceFormatted.split(".")[1]}</span>
              <Vecno className="fill-primary ml-1 h-8 w-8" />
            </span>
            <span className="ml-1 text-gray-500">{usdValue}</span>
          </>
        )}

        <div className="my-4 h-[1px] bg-gray-100 sm:col-span-2" />

        <div className="grid grid-cols-1 gap-x-14 gap-y-2 sm:grid-cols-[auto_1fr]">
          <FieldName name="Address" infoText="A unique Vecno address used to send and receive funds." />
          <FieldValue value={<VeLink linkType="address" copy qr to={loaderData.address} />} />

          {addressNames?.[loaderData.address] && (
            <>
              <FieldName name="Address Label" infoText="A label assigned to this address." />
              <FieldValue
                value={
                  <span className="bg-accent-yellow rounded-full px-2 min-h-5 py-0.5 text-center text-nowrap text-alert">
                    {addressNames[loaderData.address]}
                  </span>
                }
              />
            </>
          )}

          <FieldName name="Transactions" infoText="Total number of transactions involving this address." />
          <FieldValue
            value={isLoadingTxCount ? <Spinner className="h-5 w-5" /> : numeral(txCountData?.total ?? 0).format("0,")}
          />

          <FieldName name="UTXOs" infoText="Unspent, available outputs available at this address." />
          <FieldValue
            value={isLoadingUtxos ? <Spinner className="h-5 w-5" /> : numeral(utxoData?.length ?? 0).format("0,")}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-x-18 gap-y-6 rounded-4xl bg-white p-4 text-left text-black sm:p-8">
        <div className="mr-auto flex w-auto flex-row items-center justify-around gap-x-1 rounded-full bg-gray-50 p-1 px-1">
          <NavLink
            to={`/addresses/${loaderData.address}?tab=transactions`}
            preventScrollReset
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 hover:cursor-pointer hover:bg-white ${isActive ? "bg-white" : ""}`
            }
          >
            Transactions
          </NavLink>
          <NavLink
            to={`/addresses/${loaderData.address}?tab=utxos`}
            preventScrollReset
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 hover:cursor-pointer hover:bg-white ${isActive ? "bg-white" : ""}`
            }
          >
            UTXOs
          </NavLink>
        </div>

        {isTabActive("transactions") && (
          <div className="w-full">
            {transactions.length > 0 ? (
              <>
                <PageTable
                  alignTop
                  headers={["Timestamp", "ID", "From", "", "To", "Amount", "Status"]}
                  className="w-full md:text-sm lg:text-base"
                  additionalClassNames={{
                    2: "md:w-40 lg:w-50",
                    4: "md:w-40 lg:w-50",
                    3: "hidden md:table-cell",
                  }}
                  rows={transactions.map((tx) => [
                    <Tooltip
                      key="ts"
                      message={dayjs(tx.block_time).format("MMM D, YYYY h:mm A")}
                      display={TooltipDisplayMode.Hover}
                    >
                      {dayjs(tx.block_time).fromNow()}
                    </Tooltip>,

                    <VeLink key="txid" shorten linkType="transaction" link to={tx.transaction_id} mono />,

                    tx.inputs?.length ? (
                      <ul key="inputs" className="leading-tight">
                        {tx.inputs
                          .slice(0, expandedTxs.has(tx.transaction_id) ? undefined : 5)
                          .map((input, i) =>
                            input.previous_outpoint_address ? (
                              <li key={i}>
                                <VeLink
                                  link={input.previous_outpoint_address !== loaderData.address}
                                  linkType="address"
                                  to={input.previous_outpoint_address}
                                  shorten
                                  resolveName
                                  mono
                                />
                              </li>
                            ) : null
                          )}

                        {tx.inputs.length > 5 && !expandedTxs.has(tx.transaction_id) && (
                          <span
                            className="text-link cursor-pointer hover:underline"
                            onClick={() => setExpandedTxs(prev => new Set([...prev, tx.transaction_id]))}
                          >
                            Show more (+{tx.inputs.length - 5})
                          </span>
                        )}
                      </ul>
                    ) : (
                      <Coinbase key="coinbase" />
                    ),

                    <ArrowRight key="arrow" className="inline h-4 w-4" />,

                    <ul key="outputs" className="leading-tight">
                      {tx.outputs?.map((out, i) => (
                        <li key={i}>
                          <VeLink
                            linkType="address"
                            to={out.script_public_key_address}
                            link={loaderData.address !== out.script_public_key_address}
                            shorten
                            resolveName
                            mono
                          />
                        </li>
                      ))}
                    </ul>,

                    <>
                      {numeral(
                        ((tx.outputs?.reduce(
                          (sum, o) => sum + (o.script_public_key_address === loaderData.address ? o.amount : 0),
                          0
                        ) ?? 0) -
                          (tx.inputs?.reduce(
                            (sum, inp) =>
                              sum +
                              (inp.previous_outpoint_address === loaderData.address ? inp.previous_outpoint_amount ?? 0 : 0),
                            0
                          ) ?? 0)) /
                        1e8
                      ).format("+0,0.00[000000]")}
                      <span className="text-gray-500 text-nowrap"> VE</span>
                    </>,

                    <span key="status" className="text-sm">
                      {tx.is_accepted ? <Accepted /> : <NotAccepted />}
                    </span>,
                  ])}
                />

                <div className="mt-6 flex justify-center">
                  {!isLoadingTxCount && (
                    <PageSelector
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </>
            ) : (
              <IconMessageBox
                icon="data"
                title="No Transactions"
                description="This address doesn't have any transactions at the moment."
              />
            )}
          </div>
        )}

        {isTabActive("utxos") && (
          <>
            {(utxoData?.length ?? 0) > 0 ? (
              <>
                <PageTable
                  headers={["Block DAA Score", "Transaction ID", "Index", "Amount"]}
                  rows={(utxoData ?? []).slice(0, 50).map((utxo, idx) => [
                    utxo.utxoEntry.blockDaaScore,
                    <VeLink key={idx} linkType="transaction" to={utxo.outpoint.transactionId} link />,
                    utxo.outpoint.index,
                    `${numeral(Number(utxo.utxoEntry.amount) / 1e8).format("0,0.00[000000]")} VE`,
                  ])}
                />
                {utxoData && utxoData.length > 50 && (
                  <div className="mt-4 text-center text-gray-600">
                    There are more than 50 UTXOs for this address (only first 50 shown)
                  </div>
                )}
              </>
            ) : (
              <IconMessageBox
                icon="data"
                title="No UTXOs"
                description="This address doesn't have any UTXOs at the moment."
              />
            )}
          </>
        )}
      </div>

      <FooterHelper icon={AccountBalanceWallet}>
        <span>
          An address is a unique identifier on the blockchain used to send, receive, and store assets or data. It holds
          balances and interacts with the network securely.
        </span>
      </FooterHelper>
    </>
  );
}

const FieldName = ({ name, infoText }: { name: string; infoText?: string }) => (
  <div className="flex items-start text-gray-500 sm:col-start-1">
    <div className="flex items-center">
      {infoText && (
        <Tooltip message={infoText} display={TooltipDisplayMode.Hover} multiLine>
          <Info className="h-4 w-4" />
        </Tooltip>
      )}
      <span className="ml-1">{name}</span>
    </div>
  </div>
);

const FieldValue = ({ value }: { value: React.ReactNode }) => <div>{value}</div>;