import Container from "@/components/shared/Ui/Container";
import { Metadata } from "next";
import { CheckoutSteps } from "../../../components/common/Cart/CheckoutSteps";
import BillingDetails from "./_components/BillingDetails";

export const metadata: Metadata = {
  title: "Checkout | Pushtihub",
  description: "Eat & Live Healthy",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Container className="py-6">
        <CheckoutSteps currentStep={2} />

        <BillingDetails />
      </Container>
    </div>
  );
}
