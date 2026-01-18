import QrCodeModal from "./QrCodeModal";
import Tooltip, { TooltipDisplayMode } from "./Tooltip";
import Copy from "./assets/copy.svg";
import CopyCheck from "./assets/copycheck.svg";
import QrCode from "./assets/qr_code.svg";
import { useAddressNames } from "./hooks/useAddressNames";
import { useState } from "react";
import { Link } from "react-router-dom";

interface VeLinkProps {
  linkType: "transaction" | "block" | "address" | "movements" | "analytics";
  linkAdditionalParams?: string;
  to: string;
  className?: string;
  copy?: boolean;
  qr?: boolean;
  link?: boolean;
  active?: boolean;
  shorten?: boolean;
  resolveName?: boolean;
  mono?: boolean;
}

const linkTypeToAddress: Record<VeLinkProps["linkType"], string> = {
  transaction: "/transactions/",
  block: "/blocks/",
  address: "/addresses/",
  movements: "/movements/",
  analytics: "/analytics/",
};

const VeLink = ({ to, linkType, copy, qr, link, shorten, resolveName, mono }: VeLinkProps) => {
  const [clicked, setClicked] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const linkHref = linkTypeToAddress[linkType] + to;

  const { data: addressNames, isLoading: isLoading } = useAddressNames();

  const handleClick = () => {
    navigator.clipboard.writeText(to);
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
  };

  if (!to) {
    return <></>;
  }

  const splitAt = linkType === "address" ? 13 : 8;
  let displayValue: string | React.ReactNode = shorten
    ? to.substring(0, splitAt) + "…" + to.substring(to.length - 8)
    : to;

  if (!isLoading && linkType === "address" && addressNames![to] && resolveName) {
    displayValue = (
      <>
        <span className="hidden md:inline">
          <Tooltip message={to} display={TooltipDisplayMode.Hover}>
            {addressNames![to]}
          </Tooltip>
        </span>
        <span className="md:hidden">{addressNames![to]}</span>
      </>
    );
  }

  return (
    <span>
      <span className={"break-all " + (mono ? "font-mono tracking-tighter" : "")}>
        {link && linkHref ? (
          <Link className="text-link hover:underline" to={linkHref}>
            {displayValue}
          </Link>
        ) : (
          displayValue
        )}
      </span>
      <span className="fill-gray-500">
        <Tooltip message={"Copied"} display={TooltipDisplayMode.Click} clickTimeout={1000}>
          {copy &&
            (!clicked ? (
              <Copy
                className="hover:fill-primary mx-1 inline h-4 w-4 align-middle hover:cursor-pointer"
                onClick={handleClick}
              />
            ) : (
              <CopyCheck className="mx-1 inline h-4 w-4 align-middle" />
            ))}
        </Tooltip>

        {qr && (
          <QrCode
            className="hover:fill-primary relative inline h-4 w-4 align-middle hover:cursor-pointer"
            onClick={() => setShowQr(!showQr)}
          />
        )}
      </span>
      {showQr && <QrCodeModal value={to} setShowQr={setShowQr} />}
    </span>
  );
};

export default VeLink;
