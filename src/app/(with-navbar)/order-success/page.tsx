import { getSingleOrderFromDB } from "@/app/actions/order";
import Container from "@/components/shared/Ui/Container";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  title: "Order Success | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
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
            <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-400 mt-1">
              Thank you for your order. We&apos;ll send you a confirmation call
              shortly.
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
                      <p className="text-sm 2xl:text-base text-muted-foreground mb-1">
                        Order Number
                      </p>
                      <p className="font-semibold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base text-muted-foreground mb-1">
                        Order Date
                      </p>
                      <p className="font-semibold">
                        {formatDateFromIOS(order.createdAt)}
                        {/* {new Date(order.createdAt).toLocaleDateString("en-GB")} */}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base text-muted-foreground mb-1">
                        Payment Method
                      </p>
                      <p className="font-semibold">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base text-muted-foreground mb-1">
                        Status
                      </p>
                      <p
                        className={`font-semibold ${
                          order.status === "PENDING"
                            ? "text-yellow-600"
                            : order.status === "COMPLETED"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
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
                      <p className="font-medium">{order.fullName}</p>
                      <p className="text-sm 2xl:text-base text-muted-foreground">
                        {order.fullAddress}
                      </p>
                      <p className="text-sm 2xl:text-base text-muted-foreground">
                        {order.country}
                      </p>
                      <p className="text-sm 2xl:text-base text-muted-foreground">
                        {order.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">
                        Estimated Delivery
                      </p>
                      <p className="text-sm 2xl:text-base">
                        {order.shippingOption === "dhaka"
                          ? "1–2 Days (Inside Dhaka)"
                          : "2–4 Days (Outside Dhaka)"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.orderItems.map((item: any) => (
                    <div key={item._id} className="flex gap-2 md:gap-4">
                      <MyImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <p className="text-sm 2xl:text-base md:text-base font-medium line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm 2xl:text-base text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        $
                        {(item.product.sellingPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 -mt-2">
                  <div className="flex justify-between text-sm 2xl:text-base">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      ${order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm 2xl:text-base">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">
                      ${(order.total - order.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Link href="/shop">
                  <Button size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Invoice Download */}
                <InvoiceDownloadButton order={order} />
              </div>

              <Card>
                <CardHeader className="">
                  <CardTitle className="text-base">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 -mt-4">
                  <p className="text-sm 2xl:text-base text-muted-foreground">
                    Contact our customer support team for any questions about
                    your order.
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
