import { useState } from "react";
import { NavLink } from "react-router";
import ChevronUp from "../assets/chevron-up.svg";
import VecnoFoundation from "../assets/VecnoFoundation.svg";

type MenuChild = { name: string; linkTo: string };

const MAIN_MENU = [
  {
    name: "Explore",
    expandable: true,
    items: [
      { name: "Blocks", linkTo: "/blocks" },
      { name: "Transactions", linkTo: "/transactions" },
      { name: "Addresses", linkTo: "/addresses" },
      { name: "Movements", linkTo: "/movements" },
    ] as MenuChild[],
  },
] as const;

const DesktopMenu = () => {
  return (
    <div className="flex items-center gap-5">
      {MAIN_MENU.map((item) => (
        <MenuItem key={item.name} label={item.name} expandable={item.expandable} items={item.items} />
      ))}
    </div>
  );
};

interface MenuItemProps {
  label: string;
  expandable?: boolean;
  items?: MenuChild[];
}

const MenuItem = ({ label, expandable, items }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={`
          flex items-center justify-center h-10 min-w-32 gap-2.5 px-5
          rounded-xl text-sm font-medium tracking-wide
          transition-all duration-300 select-none cursor-pointer
          bg-cyan-900/15 backdrop-blur-md border
          ${isOpen
            ? "border-cyan-700/60 text-cyan-300 shadow-lg shadow-cyan-900/30"
            : "border-cyan-800/30 text-gray-300 hover:bg-cyan-900/25 hover:border-cyan-700/50 hover:text-cyan-400"
          }
        `}
      >
        {label}
        {expandable && (
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="currentColor"
          />
        )}
      </div>
      {expandable && items && (
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 pt-3
            w-64 origin-top
            transition-all duration-300 ease-out
            ${isOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible pointer-events-none"
            }
          `}
        >
          <div className="rounded-xl bg-gray-950/90 backdrop-blur-md border border-cyan-800/40 shadow-2xl overflow-hidden">
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-600/60 to-transparent" />

            <div className="py-2">
              {items.map((child, idx) => (
                <NavLink
                  key={child.linkTo}
                  to={child.linkTo}
                  className="block px-6 py-3 text-gray-200 font-medium hover:bg-cyan-900/30 hover:text-cyan-300 hover:px-8 transition-all duration-300"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {child.name}
                </NavLink>
              ))}
            </div>

            <div className="border-t border-gray-800/60 bg-black/30 px-6 py-6 flex flex-col items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Powered by
              </span>
              <a
                href="https://vecnofoundation.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:scale-105 active:scale-95 transition-transform duration-300"
              >
                <VecnoFoundation className="h-20 w-auto opacity-80" />
              </a>
            </div>
          </div>

          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
            <div className="w-3 h-3 rotate-45 bg-gray-950/90 border-l border-t border-cyan-800/40" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;