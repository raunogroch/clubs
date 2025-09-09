import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  clubs: Record<string, unknown>;
  sports: Record<string, unknown>;
  users: Record<string, unknown>;
  schedules: Record<string, unknown>;
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
    setFilter: <K extends keyof FiltersState>(
      state: FiltersState,
      action: PayloadAction<{ module: K; filter: FiltersState[K] }>
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
