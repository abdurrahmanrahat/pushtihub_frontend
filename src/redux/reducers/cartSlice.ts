import { TCartItem } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TCartState = {
  items: TCartItem[];
  shippingOption: "dhaka" | "outside";
};

const initialState: TCartState = {
  items: [],
  shippingOption: "dhaka",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<TCartItem>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    updateShippingOption: (
      state,
      action: PayloadAction<"dhaka" | "outside">
    ) => {
      state.shippingOption = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateShippingOption,
} = cartSlice.actions;
export default cartSlice.reducer;
