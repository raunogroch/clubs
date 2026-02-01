import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllSports,
  fetchSportById,
  createSport,
  updateSport,
  deleteSport,
  restoreSport,
} from "./sportsThunk";

interface Sport {
  _id: string;
  [key: string]: any;
}

interface SportsState {
  items: Sport[];
  selectedSport: Sport | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SportsState = {
  items: [],
  selectedSport: null,
  status: "idle",
  error: null,
};

const sportsSlice = createSlice({
  name: "sports",
  initialState,
  reducers: {
    clearSports(state) {
      state.items = [];
      state.selectedSport = null;
      state.status = "idle";
      state.error = null;
    },
    setSelectedSport(state, action: PayloadAction<Sport | null>) {
      state.selectedSport = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllSports
      .addCase(fetchAllSports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllSports.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          state.items = action.payload || [];
        },
      )
      .addCase(fetchAllSports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchSportById
      .addCase(fetchSportById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSportById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.selectedSport = action.payload;
        },
      )
      .addCase(fetchSportById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // createSport
      .addCase(createSport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSport.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createSport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updateSport
      .addCase(updateSport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSport.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selectedSport?._id === action.payload._id) {
          state.selectedSport = action.payload;
        }
      })
      .addCase(updateSport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // deleteSport
      .addCase(deleteSport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSport.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items = state.items.filter((i) => i._id !== action.payload.id);
        if (state.selectedSport?._id === action.payload.id) {
          state.selectedSport = null;
        }
      })
      .addCase(deleteSport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // restoreSport
      .addCase(restoreSport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreSport.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(restoreSport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearSports, setSelectedSport } = sportsSlice.actions;
export default sportsSlice.reducer;
