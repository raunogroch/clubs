import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredUsers } from "./filterThunks";

interface LoadingState {
  users: {
    loading: boolean;
    error: string | null;
  };
}

const initialState: LoadingState = {
  users: {
    loading: false,
    error: null,
  },
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchFilteredUsers.fulfilled, (state) => {
        state.users.loading = false;
        state.users.error = null;
      })
      .addCase(fetchFilteredUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error?.message || "Error al cargar usuarios";
      });
  },
});

export default loadingSlice.reducer;
