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

/* ------------------------------------------------------
   Helper: Compare selectedVariants arrays safely
------------------------------------------------------- */
const isSameVariantCombo = (
  a: TSelectedVariant[],
  b: TSelectedVariant[]
): boolean => {
  if (a.length !== b.length) return false;
  return JSON.stringify(a) === JSON.stringify(b);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* =======================================================
       ADD TO CART
       - Do NOT duplicate if same variant combo exists
    ======================================================== */
    addToCart: (state, action: PayloadAction<TCartItem>) => {
      const newItem = action.payload;

      const exists = state.items.some(
        (item) =>
          item.product._id === newItem.product._id &&
          isSameVariantCombo(item.selectedVariants, newItem.selectedVariants)
      );

      if (!exists) {
        state.items.push(newItem);
      }
    },

    /* =======================================================
       REMOVE FROM CART by productId + selectedVariants
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
            isSameVariantCombo(
              item.selectedVariants,
              action.payload.selectedVariants
            )
          )
      );
    },

    /* =======================================================
       UPDATE QUANTITY for specific variant combination
    ======================================================== */
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        selectedVariants: TSelectedVariant[];
        quantity: number;
      }>
    ) => {
      const found = state.items.find(
        (item) =>
          item.product._id === action.payload.productId &&
          isSameVariantCombo(
            item.selectedVariants,
            action.payload.selectedVariants
          )
      );

      if (found) {
        found.quantity = action.payload.quantity;
      }
    },

    /* =======================================================
       SHIPPING OPTION
    ======================================================== */
    updateShippingOption: (
      state,
      action: PayloadAction<"dhaka" | "outside">
    ) => {
      state.shippingOption = action.payload;
    },

    /* =======================================================
       CLEAR CART COMPLETELY
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
  updateShippingOption,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
