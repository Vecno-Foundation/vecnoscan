import Discord from "../assets/discord.svg";
import Github from "../assets/github.svg";
import Twitter from "../assets/twitter.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="sm:text-md mt-auto flex w-full flex-col items-center sm:items-start rounded-t-4xl bg-black px-4 pb-6 text-white sm:px-24 sm:pb-6">
      <div className="flex w-full flex-row justify-start pt-9 text-gray-500">
      </div>
      <div className="justify-center sm:justify-start mt-1 flex w-full flex-row flex-wrap gap-x-6 gap-y-5 text-white sm:mt-2 sm:gap-x-10">
        <Link to={"/blocks"} className="link-container">
          Blocks
        </Link>
        <Link to={"/transactions"} className="link-container">
          Transactions
        </Link>
        <Link to={"/addresses"} className="link-container">
          Addresses
        </Link>
        <Link to={"/movements"} className="link-container">
          Movements
        </Link>
        <Link to={"/analytics"} className="link-container">
          Analytics
        </Link>

      </div>
      <div className="my-4 h-[1px] w-full bg-gray-900" />
      <div className="flex w-full flex-row items-center justify-center sm:justify-start gap-x-6 text-gray-500">
        <a href="https://discord.gg/Vm7rc49cWm" target="_blank" rel="noopener noreferrer">
          <Discord className="h-6 w-6 fill-white hover:cursor-pointer hover:fill-gray-300" />
        </a>
        <a href="https://github.com/Vecno-Foundation/vecnoscan" target="_blank" rel="noopener noreferrer">
          <Github className="h-6 w-6 fill-white hover:cursor-pointer hover:fill-gray-300" />
        </a>
        <a href="https://x.com/vecnofoundation" target="_blank" rel="noopener noreferrer">
          <Twitter className="h-6 w-6 fill-white hover:cursor-pointer hover:fill-gray-300" />
        </a>
        <span className="ms-auto hidden text-nowrap sm:block">
          © 2026 Vecnoscan. All rights are reserved
        </span>
      </div>
      <span className="pt-4 text-nowrap text-gray-500 sm:hidden">
        © 2026 Vecnoscan. All rights are reserved
      </span>
    </div>
  );
};

export default Footer;