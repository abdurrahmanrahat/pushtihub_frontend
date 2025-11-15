import Banner from "@/components/common/Banner";
import Container from "@/components/shared/Ui/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import TermsAndConditionsLists from "./_components/TermsAndConditionsLists";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const TermsAndConditionsPage = () => {
  return (
    <Container className="py-8">
      <Banner
        bgImage="/images/banners/terms-and-conditions-banner.jpg"
        title="Terms & Conditions"
        description="Gadgetoria’s terms and conditions outline fair usage, customer responsibilities, and transparent service policies."
        breadcrumbs={[
          { label: "Terms & Conditions", href: "/terms-and-conditions" },
        ]}
      />

      <main className="py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="">
              <p className="text-muted-foreground mb-2">
                <strong>Effective Date:</strong> January 15, 2025
              </p>
              <p className="text-muted-foreground text-justify">
                Welcome to Gadgetoria. These Terms and Conditions
                (&quot;Terms&quot;) govern your use of our website and services.
                By accessing or using our Site, you agree to comply with and be
                bound by these Terms. Please read them carefully before using
                our services.
              </p>
            </CardContent>
          </Card>

          {/* lists */}
          <TermsAndConditionsLists />

          <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground text-center">
              By using Gadgetoria, you acknowledge that you have read,
              understood, and agree to be bound by these Terms and Conditions.
              If you do not agree, please discontinue use of our services
              immediately.
            </p>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default TermsAndConditionsPage;
