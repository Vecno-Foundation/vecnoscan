import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import VecnoFoundation from "../assets/VecnoFoundation.svg";
import SearchIcon from "../assets/search.svg";
import ErrorIcon from "../assets/error.svg";
import { Hash } from "lucide-react";
import Spinner from "../Spinner";
import { useHashrate } from "../hooks/useHashRate";
import { useBlockById } from "../hooks/useBlockById";
import { useTransactionById } from "../hooks/useTransactionById";
import { isValidHashSyntax, isValidVecnoAddressSyntax } from "../utils/vecno";

interface MobileMenuProps {
  showMenu: boolean;
  onCloseRequest: () => void;
}

const MobileMenu = ({ showMenu, onCloseRequest }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathname.current !== null && prevPathname.current !== location.pathname) {
      onCloseRequest();
    }
    prevPathname.current = location.pathname;
  }, [location.pathname, onCloseRequest]);

  const [searchValue, setSearchValue] = useState("");
  const [localHash, setLocalHash] = useState("");
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSuccess: blockFound, isLoading: blockLoading } = useBlockById(localHash);
  const { isSuccess: txFound, isLoading: txLoading, isError: txError } = useTransactionById(localHash);
  const isLoading = blockLoading || txLoading;

  useEffect(() => {
    if (blockFound && localHash) {
      navigate(`/blocks/${localHash}`);
      setSearchValue("");
      setLocalHash("");
      setHasError(false);
      onCloseRequest();
    }
  }, [blockFound, localHash, navigate, onCloseRequest]);

  useEffect(() => {
    if (txFound && localHash) {
      navigate(`/transactions/${localHash}`);
      setSearchValue("");
      setLocalHash("");
      setHasError(false);
      onCloseRequest();
    }
  }, [txFound, localHash, navigate, onCloseRequest]);

  useEffect(() => {
    if (txError && localHash) setHasError(true);
  }, [txError, localHash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;

    if (isValidVecnoAddressSyntax(query)) {
      navigate(`/addresses/${query}`);
      setSearchValue("");
      onCloseRequest();
      return;
    }

    if (isValidHashSyntax(query)) {
      setLocalHash(query);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [showMenu]);

  if (!showMenu) return null;

  return (
    <nav className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-gray-950/95 backdrop-blur-xl border-t border-cyan-800/30 lg:hidden">
      <div className="px-5 pt-5 pb-4">
        <form onSubmit={handleSubmit}>
          <div
            className={`
              relative flex items-center h-12 rounded-xl
              bg-cyan-900/15 backdrop-blur-md border
              transition-all duration-300
              ${hasError && !isLoading ? "border-red-500/60" : "border-cyan-800/40"}
              ${isLoading ? "border-cyan-500/60" : ""}
              focus-within:border-cyan-500/70 hover:border-cyan-700/50
            `}
            onClick={() => inputRef.current?.focus()}
          >
            <SearchIcon className="ml-4 w-5 h-5 fill-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setHasError(false);
                setLocalHash("");
              }}
              placeholder="Search blocks, txs, addresses..."
              className="w-full bg-transparent px-3 py-3 text-white placeholder-gray-500 outline-none text-base"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className="mr-4">
              {hasError && !isLoading ? (
                <ErrorIcon className="w-5 h-5 fill-red-500" />
              ) : isLoading ? (
                <Spinner className="w-5 h-5 text-cyan-400" />
              ) : searchValue ? (
                <kbd className="text-xs text-gray-500 font-medium">Enter</kbd>
              ) : null}
            </div>
          </div>
        </form>
      </div>
      <div className="px-5 pb-5">
        <MobileHashrate />
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="space-y-3">
          <MobileMenuItem name="Blocks" to="/blocks" onClick={onCloseRequest} />
          <MobileMenuItem name="Transactions" to="/transactions" onClick={onCloseRequest} />
          <MobileMenuItem name="Addresses" to="/addresses" onClick={onCloseRequest} />
          <MobileMenuItem name="Movements" to="/movements" onClick={onCloseRequest} />
          <MobileMenuItem name="Analytics" to="/analytics" onClick={onCloseRequest} />
        </div>
      </div>
      <div className="shrink-0 border-t border-cyan-800/30 bg-black/40 px-6 py-10 flex flex-col items-center">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Powered by
        </span>
        <a
          href="https://vecnofoundation.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 hover:scale-105 active:scale-95 transition-transform duration-300"
        >
          <VecnoFoundation className="h-24 w-auto opacity-85" />
        </a>
      </div>
    </nav>
  );
};

// Mobile-optimized Hashrate Display
const MobileHashrate = () => {
  const { data, isLoading, error } = useHashrate();

  const formatHashrate = (hashrateMh: number): string => {
    const n = hashrateMh;
    if (n < 1_000) return `${n.toFixed(2)} MH/s`;
    if (n < 1_000_000) return `${(n / 1_000).toFixed(2)} GH/s`;
    if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(2)} TH/s`;
    if (n < 1_000_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} PH/s`;
    return `${n.toFixed(2)} MH/s`;
  };

  const formatted = data ? formatHashrate(data.hashrate) : null;

  return (
    <div className="flex items-center justify-between h-12 px-5 rounded-xl bg-cyan-900/15 backdrop-blur-md border border-cyan-800/40 hover:border-cyan-700/50 transition-all duration-300">
      <div className="flex items-center gap-3">
        <Hash className="w-4 h-4 text-cyan-500" />
        <span className="text-sm text-gray-400">Network Hashrate</span>
      </div>

      <span className="text-sm font-bold text-white">
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : error ? (
          <span className="text-red-400">—</span>
        ) : (
          formatted
        )}
      </span>
    </div>
  );
};

const MobileMenuItem = ({ name, to, onClick }: { name: string; to: string; onClick: () => void }) => {
  return (
    <NavLink to={to} end className="block" onClick={onClick}>
      {({ isActive }) => (
        <div
          className={`
            flex items-center justify-center h-12 px-6 rounded-xl text-sm font-medium tracking-wide
            transition-all duration-300
            bg-cyan-900/15 backdrop-blur-md border
            ${isActive
              ? "border-cyan-700/60 text-cyan-300 shadow-lg shadow-cyan-900/30 font-semibold"
              : "border-cyan-800/30 text-gray-300 hover:bg-cyan-900/25 hover:border-cyan-700/50 hover:text-cyan-400"
            }
          `}
        >
          {name}
        </div>
      )}
    </NavLink>
  );
};

export default MobileMenu;