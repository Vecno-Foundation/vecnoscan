import Spinner from "../Spinner";
import ErrorIcon from "../assets/error.svg";
import SearchIcon from "../assets/search.svg";
import { useBlockById } from "../hooks/useBlockById";
import { useTransactionById } from "../hooks/useTransactionById";
import { isValidHashSyntax, isValidVecnoAddressSyntax } from "../utils/vecno";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBox = ({
  className = "",
  value,
  onChange,
  placeholder = "Search blocks, txs, addresses...",
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [localHash, setLocalHash] = useState("");
  const [hasError, setHasError] = useState(false);

  const { isSuccess: blockFound, isLoading: blockLoading } = useBlockById(localHash);
  const { isSuccess: txFound, isLoading: txLoading, isError: txError } = useTransactionById(localHash);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    onChange(e.target.value);
  };

  const go = (path: string) => {
    onChange("");
    setLocalHash("");
    navigate(path);
  };

  useEffect(() => {
    if (blockFound && localHash) go(`/blocks/${localHash}`);
  }, [blockFound, localHash]);

  useEffect(() => {
    if (txFound && localHash) go(`/transactions/${localHash}`);
  }, [txFound, localHash]);

  useEffect(() => {
    if (txError && localHash) setHasError(true);
  }, [txError, localHash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;

    if (isValidVecnoAddressSyntax(query)) {
      go(`/addresses/${query}`);
      return;
    }

    if (isValidHashSyntax(query)) {
      setLocalHash(query);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const isLoading = blockLoading || txLoading;
  const showError = hasError && !isLoading;

  return (
    <div
      className={`
        group relative flex items-center
        h-12 sm:h-14
        rounded-xl
        bg-white/5 backdrop-blur-2xl
        border transition-all duration-300
        ${showError ? "border-red-500/70" : "border-white/10"}
        ${isLoading ? "border-cyan-500/60" : ""}
        hover:border-white/30 focus-within:border-cyan-400/70
        ${className}
      `}
      onClick={() => inputRef.current?.focus()}
    >
      <SearchIcon className="ml-4 w-5 h-5 fill-gray-400 transition-colors group-focus-within:fill-cyan-400" />

      <input
        ref={inputRef}
        type="search"
        id="global-search"
        name="q"
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-3 text-white placeholder-gray-500 outline-none text-sm sm:text-base"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoComplete="off"
      />

      <div className="mr-4 flex items-center">
        {showError ? (
          <ErrorIcon className="w-5 h-5 fill-red-500 animate-pulse" />
        ) : isLoading ? (
          <Spinner className="w-5 h-5" />
        ) : value ? (
          <kbd className="text-gray-500 text-xs font-medium select-none">Enter</kbd>
        ) : (
          <kbd className="text-gray-600 text-xs font-medium select-none">/</kbd>
        )}
      </div>

      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity text-xs text-gray-500 whitespace-nowrap">
        Press Enter to search
      </div>
    </div>
  );
};

export default SearchBox;