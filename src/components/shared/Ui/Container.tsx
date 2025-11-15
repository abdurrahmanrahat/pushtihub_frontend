import { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-[92%] md:w-[90%] max-w-[1280px] mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
