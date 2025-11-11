import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  busca: "",
  status: "TODOS",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFiltros(state, action) {
      return { ...state, ...action.payload };
    },
    resetFiltros() {
      return initialState;
    },
  },
});

export const { setFiltros, resetFiltros } = filtersSlice.actions;
export default filtersSlice.reducer;
