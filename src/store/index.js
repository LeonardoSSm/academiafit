import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import filtersReducer from "./filtersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
  },
});

export const RootState = store.getState;
