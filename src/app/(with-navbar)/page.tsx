import { Metadata } from "next";
import Categories from "./_components/Categories/Categories";
import Features from "./_components/Features/Features";
import HeroBanner from "./_components/HeroBanner/HeroBanner";
import RecentProducts from "./_components/RecentProducts/RecentProducts";

export const metadata: Metadata = {
  title: "Home | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

export default function HomePage() {
  return (
    <div className="pb-12 md:pb-16">
      <HeroBanner />
      <Categories />
      <RecentProducts />
      <Features />
    </div>
  );
}
