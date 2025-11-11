import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "admin",
  role: "ADMIN",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
