import Footer from "@/components/shared/Ui/Footer/Footer";
import Navbar from "@/components/shared/Ui/Navbar/Navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pushtihub",
  description: "Eat & Live Healthy",
};

const CommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
};

export default CommonLayout;
