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
      onMouseLeave={() => {
        const timer = setTimeout(() => setIsOpen(false), 180);
        return () => clearTimeout(timer);
      }}
    >
      <div
        className={`
          flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm tracking-wider
          transition-all duration-400 select-none cursor-pointer border
          ${isOpen
            ? "bg-cyan-900/70 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/30"
            : "bg-gray-900/90 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-cyan-700 hover:text-cyan-400"
          }
        `}
      >
        {label}
        {expandable && (
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-400 ${isOpen ? "rotate-180" : ""}`}
            fill="currentColor"
          />
        )}
      </div>
      {expandable && items && (
        <div
          className={`
            absolute left-1/2 -translate-x-1/2
            w-80 origin-top
            transition-all duration-300 ease-out
            ${isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }
          `}
          style={{ top: "100%" }}
        >
          <div className="absolute inset-x-0 -top-4 h-8" />
          <div className="rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-600 to-transparent" />
            <div className="py-4">
              {items.map((child, idx) => (
                <NavLink
                  key={child.linkTo}
                  to={child.linkTo}
                  className="block px-10 py-4 text-gray-100 font-medium hover:bg-cyan-900/50 hover:text-cyan-300 hover:pl-12 transition-all duration-300"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {child.name}
                </NavLink>
              ))}
            </div>

            <div className="h-px bg-gray-800" />
            <div className="bg-black/40 py-10 flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Powered by
              </span>
              <a
                href="https://vecnofoundation.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:scale-105 active:scale-95 transition-transform duration-300"
              >
                <VecnoFoundation className="h-24 w-auto opacity-90" />
              </a>
            </div>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-5 h-5 rotate-45 bg-gray-950 border-l border-t border-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;