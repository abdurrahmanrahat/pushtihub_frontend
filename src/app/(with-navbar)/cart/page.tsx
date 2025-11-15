import Container from "@/components/shared/Ui/Container";
import { Metadata } from "next";
import { CheckoutSteps } from "../../../components/common/Cart/CheckoutSteps";
import CartLists from "./_components/CartLists";

export const metadata: Metadata = {
  title: "Cart | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

export default function CartPage() {
  return (
    <div className="min-h-screen">
      <Container className="py-6">
        <CheckoutSteps currentStep={1} />

        {/* list */}
        <CartLists />
      </Container>
    </div>
  );
}
