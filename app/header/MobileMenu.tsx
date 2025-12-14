import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import VecnoFoundation from "../assets/VecnoFoundation.svg";
import SearchIcon from "../assets/search.svg";
import ErrorIcon from "../assets/error.svg";
import Spinner from "../Spinner";
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
    }
  }, [blockFound, localHash, navigate]);

  useEffect(() => {
    if (txFound && localHash) {
      navigate(`/transactions/${localHash}`);
      setSearchValue("");
      setLocalHash("");
      setHasError(false);
    }
  }, [txFound, localHash, navigate]);

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
    <nav className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-gray-950 border-t border-gray-800 lg:hidden">
      <div className="px-6 pt-6 pb-4">
        <form onSubmit={handleSubmit}>
          <div
            className={`
              group relative flex items-center h-14 rounded-xl bg-white/5 backdrop-blur-2xl
              border transition-all duration-300
              ${hasError && !isLoading ? "border-red-500/70" : "border-white/10"}
              ${isLoading ? "border-cyan-500/60" : ""}
              focus-within:border-cyan-400/70 hover:border-white/30
            `}
            onClick={() => inputRef.current?.focus()}
          >
            <SearchIcon className="ml-4 w-5 h-5 fill-gray-400 transition-colors group-focus-within:fill-cyan-400" />
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
                <ErrorIcon className="w-5 h-5 fill-red-500 animate-pulse" />
              ) : isLoading ? (
                <Spinner className="w-5 h-5" />
              ) : searchValue ? (
                <kbd className="text-gray-500 text-xs font-medium select-none">Enter</kbd>
              ) : (
                <kbd className="text-gray-600 text-xs font-medium select-none">/</kbd>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-6">
        <div className="space-y-3">
          <MenuItem name="Blocks" to="/blocks" onClick={onCloseRequest} />
          <MenuItem name="Transactions" to="/transactions" onClick={onCloseRequest} />
          <MenuItem name="Addresses" to="/addresses" onClick={onCloseRequest} />
          <MenuItem name="Movements" to="/movements" onClick={onCloseRequest} />
        </div>
      </div>
      <div className="shrink-0 py-12 px-6 border-t border-gray-800 bg-black/40">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Powered by
          </span>
          <a
            href="https://vecnofoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform duration-300 hover:scale-110 active:scale-95 mt-3"
            aria-label="Vecno Foundation"
          >
            <VecnoFoundation className="h-28 w-auto opacity-90 drop-shadow-2xl" />
          </a>
        </div>
      </div>
    </nav>
  );
};

interface MenuItemProps {
  name: string;
  to: string;
  onClick?: () => void;
}

const MenuItem = ({ name, to, onClick }: MenuItemProps) => {
  return (
    <NavLink to={to} end className="block w-full" onClick={onClick}>
      {({ isActive }) => (
        <div
          className={`
            group relative flex items-center h-16 px-8 rounded-2xl transition-all duration-400 ease-out
            ${isActive
              ? "bg-cyan-900/60 text-cyan-300 font-semibold shadow-xl shadow-cyan-500/20 border border-cyan-800"
              : "text-gray-300 hover:bg-gray-900 hover:text-cyan-400 border border-transparent"
            }
          `}
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full transition-all duration-500 ${
              isActive ? "bg-cyan-500 shadow-lg shadow-cyan-500/50" : "bg-transparent"
            }`}
          />
          <span className="relative z-10 text-lg font-medium tracking-tight">
            {name}
          </span>
        </div>
      )}
    </NavLink>
  );
};

export default MobileMenu;