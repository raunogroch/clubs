import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  total: number;
  page: number;
  limit: number;
  name: string;
}

const initialState: FilterState = {
  total: 0,
  page: 1,
  limit: 5,
  name: "",
};

const filterSlice = createSlice({
  name: "filters", // 👈 ya no "users" para evitar conflicto
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setPage, setLimit, setName, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
