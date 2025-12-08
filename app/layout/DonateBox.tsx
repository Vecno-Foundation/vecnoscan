interface DonateBoxProps {
  children: React.ReactNode;
  className?: string;
}

const DonateBox = ({ children, className = "" }: DonateBoxProps) => (
  <div
    className={`w-full rounded-4xl bg-transparent p-4 text-left text-black sm:p-8 mt-2 ${className}`}
  >
    {children}
  </div>
);

export default DonateBox;