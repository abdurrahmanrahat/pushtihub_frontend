import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TOrder } from "@/types/order.type";
import { formatDateFromIOS } from "@/utils/date";
import { getOrderStatusColor } from "@/utils/getOrderStatusColor";
import { Calendar, Eye, MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";

const OrderDetailsModal = ({ order }: { order: TOrder }) => {
  return (
    <Dialog>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 2xl:h-9 2xl:w-9 hover:bg-muted"
        >
          <Eye className="h-4 w-4 2xl:h-5 2xl:w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="!max-w-4xl max-h-[90vh] overflow-y-auto scroll-hidden"
        // showCloseButton={false}
        aria-describedby={undefined}
      >
        {/* Header */}
        <div className="space-y-1 mb-4">
          <h2 className="text-lg md:text-xl 2xl:text-2xl font-semibold">
            Order Details —{" "}
            <span className="text-primary">{order.orderNumber}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm 2xl:text-base text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <p>
              <span className="text-gray-800 dark:text-gray-100 font-medium">
                Placed on
              </span>{" "}
              {formatDateFromIOS(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-2">
          {/* Customer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm 2xl:text-base font-medium">
                Customer Information
              </span>
            </div>

            <div className="text-sm 2xl:text-base leading-relaxed space-y-[2px]">
              <p>
                <span className="font-semibold text-foreground">Name:</span>{" "}
                {order.fullName}
              </p>
              <p>
                <span className="font-semibold text-foreground">Address:</span>{" "}
                {order.fullAddress}
              </p>
              <p>
                <span className="font-semibold text-foreground">Country:</span>{" "}
                {order.country}
              </p>
              <p>
                <span className="font-semibold text-foreground">Phone:</span>{" "}
                {order.phone}
              </p>
              {order.orderNotes && (
                <p className="italic text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground not-italic">
                    Notes:
                  </span>{" "}
                  “{order.orderNotes}”
                </p>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span className="text-sm 2xl:text-base font-medium">
                Shipping & Status
              </span>
            </div>

            <div className="text-sm 2xl:text-base leading-relaxed space-y-[2px]">
              <p>
                <span className="font-semibold text-foreground">
                  Shipping Option:
                </span>{" "}
                <span className="capitalize">
                  {order.shippingOption === "dhaka"
                    ? "Inside Dhaka (1–3 Days)"
                    : "Outside Dhaka (3–5 Days)"}
                </span>
              </p>

              <p>
                <span className="font-semibold text-foreground">Status:</span>{" "}
                <span
                  className={cn(
                    "inline-flex items-center justify-center px-3 py-[3px] rounded-full text-xs 2xl:text-sm font-semibold capitalize select-none transition-all duration-200",
                    getOrderStatusColor(order.status)
                  )}
                >
                  {order.status}
                </span>
              </p>

              <p>
                <span className="font-semibold text-foreground">
                  Payment Method:
                </span>{" "}
                <span className="uppercase">{order.paymentMethod}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Package className="h-4 w-4" />
            <h3 className="2xl:text-lg font-medium">Order Items</h3>
          </div>

          <div className="space-y-2">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-cardLightShadow dark:shadow-cardDarkShadow"
              >
                <div className="flex items-center gap-3">
                  <Link href={`/shop/${item.product.slug}`}>
                    <MyImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover bg-muted"
                    />
                  </Link>
                  <div>
                    <Link href={`/shop/${item.product.slug}`}>
                      <p className="font-medium text-sm 2xl:text-base md:text-base line-clamp-2">
                        {item.product.name}
                      </p>
                    </Link>

                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-sm 2xl:text-base md:text-base">
                  ${item.product.sellingPrice * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-2 text-sm 2xl:text-base md:text-base mt-4 mb-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping:</span>
            <span className="font-medium">
              ${(order.total - order.subtotal).toFixed(2)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
