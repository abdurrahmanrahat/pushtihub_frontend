import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const NotFoundCartItems = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 2xl:w-24 2xl:h-24 text-muted-foreground mb-4" />
      <h2 className="text-2xl 2xl:text-3xl font-semibold ">
        Your cart is empty
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 2xl:text-lg">
        Add some products to get started
      </p>

      <Link href="/shop">
        <Button size="lg">Continue Shopping</Button>
      </Link>
    </div>
  );
};

export default NotFoundCartItems;
