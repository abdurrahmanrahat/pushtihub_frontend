import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="pt-8 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
        Ready to Explore?
      </h2>

      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Discover our curated collection of premium tech products and find the
        perfect gadgets to enhance your digital lifestyle.
      </p>
      <Link href="/shop">
        <Button size="lg">Browse Products</Button>
      </Link>
    </section>
  );
};

export default CTA;
