import { QuantityStepper } from "@/components/common/Product/QuantityStepper";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/redux/hooks";
import { removeFromCart, updateQuantity } from "@/redux/reducers/cartSlice";
import { TCartItem } from "@/types";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CartSheetCard = ({ item }: { item: TCartItem }) => {
  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("You have to put at least 1 quantity!");
    } else if (newQuantity > item.product.stock) {
      toast.error("Out of stock!");
    } else {
      dispatch(
        updateQuantity({ productId: item.product._id, quantity: newQuantity })
      );
    }
  };

  const dispatch = useAppDispatch();

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  return (
    <Card className="p-2">
      <div className="flex gap-2">
        <Link href={`/product/${item.product.slug}`}>
          <MyImage
            src={item.product.images[0]}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1 space-y-2">
          <Link href={`/product/${item.product.slug}`}>
            <h3 className="text-sm font-medium hover:text-primary transition-colors">
              {item.product.name.length > 35
                ? `${item.product.name.slice(0, 35)}...`
                : item.product.name}
            </h3>
          </Link>
          <p className="font-semibold text-sm">${item.product.sellingPrice}</p>
          <div className="flex items-center gap-3">
            <QuantityStepper
              value={item.quantity}
              onChange={handleUpdateQuantity}
              max={item.product.stock}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(item.product._id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            ${(item.product.sellingPrice * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CartSheetCard;
