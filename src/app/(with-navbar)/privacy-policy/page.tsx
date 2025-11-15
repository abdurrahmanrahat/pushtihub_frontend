import Banner from "@/components/common/Banner";
import Container from "@/components/shared/Ui/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import PrivacyPolicyLists from "./_components/PrivacyPolicyLists";

export const metadata: Metadata = {
  title: "Privacy Policy | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const PrivacyPolicyPage = () => {
  return (
    <Container className="py-8">
      <Banner
        bgImage="/images/banners/privacy-policy-page-banner.jpg"
        title="Privacy Policy"
        description="Gadgetoria values your privacy and is committed to protecting your information with transparency and security."
        breadcrumbs={[{ label: "Privacy Policy", href: "/privacy-policy" }]}
      />

      <main className="py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="">
              <p className="text-muted-foreground mb-2">
                <strong>Last Updated:</strong> January 15, 2025
              </p>
              <p className="text-muted-foreground text-justify">
                At Gadgetoria, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website and use our
                services. Please read this policy carefully to understand our
                practices regarding your personal data.
              </p>
            </CardContent>
          </Card>

          {/* lists */}
          <PrivacyPolicyLists />

          <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground text-center">
              By using our website, you consent to our Privacy Policy and agree
              to its terms. If you do not agree with this policy, please do not
              use our services.
            </p>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default PrivacyPolicyPage;
