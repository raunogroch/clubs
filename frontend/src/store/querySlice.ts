import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface QueryState {
  filter: {
    page: number;
    limit: number;
    name: string;
  };
}

interface QueryFilter {
  page?: number;
  limit?: number;
  name?: string;
}

const initialState: QueryState = {
  filter: { page: 1, limit: 10, name: "" },
};
const querySlice = createSlice({
  name: "queries",
  initialState,
  reducers: {
    setQuery: (
      state,
      action: PayloadAction<{
        module: keyof QueryState;
        filter: Partial<QueryFilter>;
      }>
    ) => {
      state[action.payload.module] = {
        ...state[action.payload.module],
        ...action.payload.filter,
      };
    },
    clearQuery: (state, action: PayloadAction<keyof QueryState>) => {
      state[action.payload] = { page: 1, limit: 10, name: "" };
    },
  },
});

export const { setQuery, clearQuery } = querySlice.actions;
export default querySlice.reducer;
