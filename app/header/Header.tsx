import Close from "../assets/close.svg";
import LogoIcon from "../assets/vscan.svg";
import Menu from "../assets/menu.svg";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import SearchBox from "./SearchBox";
import Price from "./Price";
import Hashrate from "./Hashrate";
import { useState } from "react";
import { Link, useLocation } from "react-router";

type HeaderProps = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
};

const Header = ({ expanded, setExpanded }: HeaderProps) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const isHome = location.pathname === "/";

  return (
    <header
      id="header"
      className={`
        fixed inset-x-0 top-0 z-[9999] flex flex-col
        bg-black/90 backdrop-blur-2xl border-b border-cyan-900/30 text-white
        transition-all duration-500
        ${expanded ? "h-screen overflow-y-auto" : "h-16 sm:h-20"}
      `}
    >
      <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 h-16 sm:h-20">
        <div className="flex items-center gap-6 z-10">
          <Link to="/" className="flex items-center">
            <LogoIcon className="h-9 w-36 sm:h-10 sm:w-44 md:h-11 md:w-48" />
          </Link>
          <div className="hidden md:block">
            <Hashrate />
          </div>
        </div>
        {!isHome && (
          <div className="hidden lg:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-center pointer-events-none px-4">
            <div className="w-full max-w-sm pointer-events-auto">
              <SearchBox value={searchValue} onChange={setSearchValue} />
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 sm:gap-6 z-10">
          <div className="hidden lg:block">
            <DesktopMenu />
          </div>

          <Price className="hidden md:block" />

          <button
            onClick={() => setExpanded(!expanded)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all"
            aria-label={expanded ? "Close menu" : "Open menu"}
          >
            {expanded ? (
              <Close className="h-7 w-7 fill-white" />
            ) : (
              <Menu className="h-7 w-7 fill-white" />
            )}
          </button>
        </div>
      </div>
      {!expanded && !isHome && (
        <div className="px-6 pb-4 md:hidden flex flex-col items-center gap-2">
          <Price />
          <Hashrate />
        </div>
      )}
      <MobileMenu showMenu={expanded} onCloseRequest={() => setExpanded(false)} />
    </header>
  );
};

export default Header;