import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CatalogsState {
  sports: any[];
  roles: any[];
  schedules: any[];
}

const initialState: CatalogsState = {
  sports: [],
  roles: [],
  schedules: [],
};

const catalogsSlice = createSlice({
  name: "catalogs",
  initialState,
  reducers: {
    setCatalog: (
      state,
      action: PayloadAction<{ name: keyof CatalogsState; data: any[] }>
    ) => {
      state[action.payload.name] = action.payload.data;
    },
    clearCatalog: (state, action: PayloadAction<keyof CatalogsState>) => {
      state[action.payload] = [];
    },
  },
});

export const { setCatalog, clearCatalog } = catalogsSlice.actions;
export default catalogsSlice.reducer;
