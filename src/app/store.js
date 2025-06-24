import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { adminApi } from "../features/api/adminApi";
import { authApi } from "../features/api/authApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware,authApi.middleware),
});
