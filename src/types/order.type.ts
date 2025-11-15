import { TProduct } from "./product.type";

export type TOrderItem = {
  _id: string;
  product: TProduct;
  quantity: number;
};

export type TOrder = {
  _id: string;
  orderNumber: string;
  fullName: string;
  fullAddress: string;
  phone: string;
  country: string;
  orderNotes?: string;
  shippingOption: "dhaka" | "outside";
  orderItems: TOrderItem[];
  subtotal: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
