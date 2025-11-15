import { TCartItem, TSelectedVariant } from "@/types";
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
    /* =======================================================
       ADD TO CART — Product + Variant(s)
       If same variant combination exists → do NOT duplicate
    ======================================================== */
    addToCart: (state, action: PayloadAction<TCartItem>) => {
      const newItem = action.payload;

      const exists = state.items.some(
        (item) =>
          item.product._id === newItem.product._id &&
          JSON.stringify(item.selectedVariants) ===
            JSON.stringify(newItem.selectedVariants)
      );

      if (!exists) {
        state.items.push(newItem);
      }
    },

    /* =======================================================
       REMOVE FROM CART — By productId + selectedVariants
    ======================================================== */
    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: string;
        selectedVariants: TSelectedVariant[];
      }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.product._id === action.payload.productId &&
            JSON.stringify(item.selectedVariants) ===
              JSON.stringify(action.payload.selectedVariants)
          )
      );
    },

    /* =======================================================
       UPDATE QUANTITY — For specific product + variant combo
    ======================================================== */
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        selectedVariants: TSelectedVariant[];
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.product._id === action.payload.productId &&
          JSON.stringify(item.selectedVariants) ===
            JSON.stringify(action.payload.selectedVariants)
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    /* =======================================================
       SHIPPING OPTION CHANGE
    ======================================================== */
    updateShippingOption: (
      state,
      action: PayloadAction<"dhaka" | "outside">
    ) => {
      state.shippingOption = action.payload;
    },

    /* =======================================================
       CLEAR CART
    ======================================================== */
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
