import { accessExpiry, authKey } from "@/constants/authKey";
import authReducer from "@/redux/reducers/authSlice";
import cartReducer from "@/redux/reducers/cartSlice";
import wishlistReducer from "@/redux/reducers/wishlistSlice";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
// import { baseApi } from "./api/baseApi";
import { createExpireStorage } from "./createExpireStorage";

const persistConfig = {
  key: authKey,
  storage: createExpireStorage(accessExpiry * 1000),
};

const cartPersistConfig = {
  key: "moTeCart",
  storage: createExpireStorage(1 * 24 * 60 * 60 * 1000), // (here -> 1 days)
};
const wishlistPersistConfig = {
  key: "moTeWishlist",
  storage: createExpireStorage(2 * 24 * 60 * 60 * 1000), // (here -> 2 days)
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer
);

export const store = configureStore({
  reducer: {
    // [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
