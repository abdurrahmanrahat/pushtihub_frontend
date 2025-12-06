import Footer from "@/components/shared/Ui/Footer/Footer";
import Navbar from "@/components/shared/Ui/Navbar/Navbar";
import WhatsAppAction from "@/components/shared/Ui/WhatsAppAction";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pushtihub",
  description: "Eat & Live Healthy",
};

const CommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
      <WhatsAppAction />
    </div>
  );
};

export default CommonLayout;
