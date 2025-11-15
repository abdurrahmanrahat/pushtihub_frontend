import Banner from "@/components/common/Banner";
import Container from "@/components/shared/Ui/Container";
import { Metadata } from "next";
import CompanyStory from "./_components/CompanyStory";
import CTA from "./_components/CTA";
import ValuesGrid from "./_components/ValuesGrid";

export const metadata: Metadata = {
  title: "About | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const About = () => {
  return (
    <Container className="py-8">
      <Banner
        bgImage="/images/banners/about-page-banner.jpg"
        title="About"
        description="Gadgetoria offers smart, affordable, innovative gadgets that simplify and enhance everyday life."
        breadcrumbs={[{ label: "About", href: "/about" }]}
      />

      <main className="py-16">
        {/* Company Story */}
        <CompanyStory />

        {/* Values Grid */}
        <ValuesGrid />

        {/* CTA Section */}
        <CTA />
      </main>
    </Container>
  );
};

export default About;
