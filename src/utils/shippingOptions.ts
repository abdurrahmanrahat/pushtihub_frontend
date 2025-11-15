import {
  insideDhakaShippingCost,
  outsideDhakaShippingCost,
} from "@/constants/shippingKey";

export type TShippingOption = {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
};

export const shippingOptions: TShippingOption[] = [
  {
    id: "dhaka",
    name: "Inside Dhaka city (2-3 Days)",
    price: insideDhakaShippingCost,
    estimatedDays: "1-2 days",
  },
  {
    id: "outside",
    name: "Outside Dhaka City (3-5 Days)",
    price: outsideDhakaShippingCost,
    estimatedDays: "2-4 days",
  },
];

// test
