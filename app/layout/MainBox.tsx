interface MainBoxProps {
  children: React.ReactNode;
  className?: string;
}

const MainBox = ({ children, className = "" }: MainBoxProps) => (
  <div
    className={`w-full rounded-4xl bg-white p-4 text-left text-black sm:p-8 mt-22 ${className}`}
  >
    {children}
  </div>
);

export default MainBox;