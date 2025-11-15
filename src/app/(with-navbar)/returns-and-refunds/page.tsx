import Banner from "@/components/common/Banner";
import Container from "@/components/shared/Ui/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import ContactSection from "./_components/ContactSection";
import RefundPolicy from "./_components/RefundPolicy";
import ReturnPolicy from "./_components/ReturnPolicy";
import ReturnProcess from "./_components/ReturnProcess";

export const metadata: Metadata = {
  title: "Returns & Refunds | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const ReturnsAndRefundsPage = () => {
  return (
    <Container className="py-8">
      <Banner
        bgImage="/images/banners/returns-and-refunds-banner.jpg"
        title="Returns & Refunds"
        description="Gadgetoria ensures a simple and transparent return and refund process for your satisfaction."
        breadcrumbs={[
          { label: "Returns & Refunds", href: "/returns-and-refunds" },
        ]}
      />

      <main className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="">
              <p className="text-muted-foreground text-justify">
                We want you to be completely satisfied with your purchase from
                Gadgetoria. If you&apos;re not happy with your order for any
                reason, we offer a hassle-free 30-day return policy. Please
                review the details below to understand our return and refund
                process.
              </p>
            </CardContent>
          </Card>

          {/* Return Policy */}
          <ReturnPolicy />

          {/* Return Process */}
          <ReturnProcess />

          {/* Refund Policy */}
          <RefundPolicy />

          {/* Contact Section */}
          <ContactSection />
        </div>
      </main>
    </Container>
  );
};

export default ReturnsAndRefundsPage;
