import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  image?: string;
}

interface UsersFilter {
  page?: number;
  limit?: number;
  total?: number;
  data: User[];
}

interface FiltersState {
  users: UsersFilter;
}

const initialState: FiltersState = {
  users: { page: 1, limit: 10, total: 0, data: [] },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        module: keyof FiltersState;
        filter: Partial<UsersFilter>;
      }>
    ) => {
      state[action.payload.module] = {
        ...state[action.payload.module],
        ...action.payload.filter,
      };
    },
    clearFilter: (state, action: PayloadAction<keyof FiltersState>) => {
      state[action.payload] = { page: 1, limit: 10, total: 0, data: [] };
    },
  },
});

export const { setFilter, clearFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
