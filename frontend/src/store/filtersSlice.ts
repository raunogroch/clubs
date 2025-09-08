import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  [key: string]: any;
}

const initialState: FiltersState = {
  clubs: {},
  sports: {},
  users: {},
  schedules: {},
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ module: string; filter: any }>
    ) => {
      state[action.payload.module] = action.payload.filter;
    },
    clearFilter: (state, action: PayloadAction<string>) => {
      state[action.payload] = {};
    },
  },
});

export const { setFilter, clearFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
