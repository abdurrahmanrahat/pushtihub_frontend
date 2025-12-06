import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="pt-8 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
        প্রস্তুত কি আপনার পুষ্টির যাত্রা শুরু করতে?
      </h2>

      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        আমাদের যত্নের সাথে বাছাই করা সুপার ফুড, বাদাম, ড্রাই-ফুড এবং স্বাস্থ্যকর
        পণ্যের কালেকশন এক্সপ্লোর করুন। আপনার এবং পরিবারের সুস্থতার জন্য সেরা
        পণ্যের সন্ধান এখানেই।
      </p>

      <Link href="/shop">
        <Button size="lg">পণ্য দেখুন</Button>
      </Link>
    </section>
  );
};

export default CTA;
