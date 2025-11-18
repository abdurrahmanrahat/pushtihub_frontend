import { getSingleOrderFromDB } from "@/app/actions/order";
import Container from "@/components/shared/Ui/Container";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TOrderItem } from "@/types/order.type";
import { formatDateFromIOS } from "@/utils/date";
import {
  Calendar,
  CheckCircle2,
  MapPin,
  Package,
  PhoneCall,
  Truck,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutSteps } from "../../../components/common/Cart/CheckoutSteps";
import { InvoiceDownloadButton } from "./_components/InvoiceDownloadButton";

export const metadata: Metadata = {
  title: "Order Success | Pushtihub",
  description: "Eat & Live Healthy",
};

const OrderSuccessPage = async (props: {
  searchParams: Promise<{ orderId: string }>;
}) => {
  const searchParams = await props.searchParams;
  const orderId = searchParams.orderId;

  if (!orderId) redirect("/shop");

  const res = await getSingleOrderFromDB(orderId);
  if (!res?.data) redirect("/shop");

  const order = res.data;

  const customer = order.customerInfo;

  return (
    <div className="min-h-screen">
      <Container className="py-6">
        <div className="max-w-4xl mx-auto">
          <CheckoutSteps currentStep={3} />

          {/* Success Message */}
          <div className="text-center my-8">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h1 className="text-xl md:text-2xl 2xl:text-3xl font-semibold">
              Order Placed Successfully!
            </h1>
            {/* <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-400 mt-1">
              Thank you for your order. We’ll send you a confirmation call soon.
            </p> */}
            {/* Bengali Message */}
            <p className="mt-4 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-[70ch] mx-auto">
              PushTi Hub এর সাথে থাকায় অভিনন্দন। অতি শীঘ্রই আমাদের একজন
              প্রতিনিধি আপনার দেয়া নাম্বারে যোগাযোগ করবে এবং আপনার অর্ডারটি
              ডেলিভারির জন্য পাঠানো হবে।
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6" />
                    <CardTitle>Order Details</CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Order Number
                      </p>
                      <p className="font-semibold">{order?.orderNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Payment Method
                      </p>
                      <p className="font-semibold capitalize">
                        {order.paymentDetails?.method}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Payment Number
                      </p>
                      <p className="font-semibold capitalize">
                        {order.paymentDetails?.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Payment TransactionId
                      </p>
                      <p className="font-semibold capitalize">
                        {order.paymentDetails?.transactionId}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Order Date
                      </p>
                      <p className="font-semibold">
                        {formatDateFromIOS(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Status
                      </p>
                      <p
                        className={`font-semibold ${
                          order.status === "pending"
                            ? "text-yellow-600"
                            : order.status === "processing"
                            ? "text-blue-600"
                            : order.status === "shipped"
                            ? "text-indigo-600"
                            : order.status === "delivered"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6" />
                    <CardTitle>Shipping Information</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{customer.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.fullAddress}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.country}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">
                        Estimated Delivery
                      </p>
                      <p className="text-sm">
                        {order.shippingOption === "dhaka"
                          ? "1–2 Days (Inside Dhaka)"
                          : "2–4 Days (Outside Dhaka)"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ordered Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {order.orderItems.map((item: TOrderItem, index: number) => {
                    // Construct variant output
                    const variantMap = {
                      weight: "",
                      size: "",
                      color: "",
                    };

                    item.selectedVariants.forEach((v) => {
                      variantMap[v.type] = v.item.value;
                    });

                    return (
                      <div key={item._id || index} className="flex gap-3">
                        <MyImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded object-cover bg-muted"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.product.name}
                          </p>

                          {/* Variant List */}
                          <div className="text-xs 2xl:text-sm text-muted-foreground leading-4 mt-1">
                            {variantMap.weight && (
                              <p>weight: {variantMap.weight}</p>
                            )}
                            {variantMap.size && <p>size: {variantMap.size}</p>}
                            {variantMap.color && (
                              <p>color: {variantMap.color}</p>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <span className="font-medium">
                          ৳{(item.unitSellingPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      ৳{order.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">
                      ৳{order.shippingCost.toFixed(2)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>৳{order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>

                <InvoiceDownloadButton order={order} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Need Help?</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for order-related help.
                  </p>
                  <Button variant="outline" className="w-full">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderSuccessPage;
