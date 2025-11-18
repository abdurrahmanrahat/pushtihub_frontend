import { TSelectedVariant } from "./cart.type";
import { TProduct } from "./product.type";

export type TCustomerInfo = {
  fullName: string;
  phone: string;
  fullAddress: string;
  country: string;
  orderNotes?: string;
};

export type TOrderItem = {
  _id: string;
  product: TProduct;
  quantity: number;

  selectedVariants: TSelectedVariant[];

  unitSellingPrice: number;
  unitPrice: number;
  lineTotal: number;
};

export type TPaymentDetails = {
  method: "bkash" | "nagad";
  phone: string;
  transactionId: string;
};

export type TOrder = {
  _id: string;
  orderNumber: string;

  customerInfo: TCustomerInfo;

  shippingOption: "dhaka" | "outside";
  shippingCost: number;

  orderItems: TOrderItem[];

  subtotal: number;
  total: number;

  paymentDetails: TPaymentDetails;

  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  __v: number;
};
