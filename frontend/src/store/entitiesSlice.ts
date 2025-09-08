import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EntitiesState {
  clubs: any[];
  sports: any[];
  users: any[];
  schedules: any[];
}

const initialState: EntitiesState = {
  clubs: [],
  sports: [],
  users: [],
  schedules: [],
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    setEntities: (
      state,
      action: PayloadAction<{ name: keyof EntitiesState; data: any[] }>
    ) => {
      state[action.payload.name] = action.payload.data;
    },
    clearEntities: (state, action: PayloadAction<keyof EntitiesState>) => {
      state[action.payload] = [];
    },
  },
});

export const { setEntities, clearEntities } = entitiesSlice.actions;
export default entitiesSlice.reducer;
