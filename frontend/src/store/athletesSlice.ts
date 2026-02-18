import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAthletes,
  fetchParentsByCISearch,
  fetchAllParents,
  uploadAthleteImage,
  uploadAthleteCI,
  fetchAthleteParent,
  fetchMyAthletes,
} from "./athletesThunk";
import { updateUser } from "./usersThunk";

interface Athlete {
  _id: string;
  name: string;
  lastname: string;
  ci: string;
  phone: string;
  gender: string;
  birth_date: string;
  images: { small: string; medium: string; large: string };
  parent_id?: string;
  documentPath?: string;
  [key: string]: any;
}

interface Parent {
  _id: string;
  name: string;
  lastname: string;
  ci: string;
  phone: string;
  [key: string]: any;
}

interface AthletesState {
  athletes: Athlete[];
  myAthletes: Athlete[];
  allParents: Parent[];
  searchedParent: Parent | null;
  athleteParent: Parent | null;
  loading: boolean;
  loadingMyAthletes: boolean;
  loadingParent: boolean;
  searchingParent: boolean;
  uploadingImage: boolean;
  uploadingCI: boolean;
  error: string | null;
}

const initialState: AthletesState = {
  athletes: [],
  myAthletes: [],
  allParents: [],
  searchedParent: null,
  athleteParent: null,
  loading: false,
  loadingMyAthletes: false,
  loadingParent: false,
  searchingParent: false,
  uploadingImage: false,
  uploadingCI: false,
  error: null,
};

const athletesSlice = createSlice({
  name: "athletes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchedParent: (state) => {
      state.searchedParent = null;
    },
    clearAthleteParent: (state) => {
      state.athleteParent = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Athletes
    builder
      .addCase(fetchAthletes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAthletes.fulfilled, (state, action) => {
        state.loading = false;
        state.athletes = action.payload;
      })
      .addCase(fetchAthletes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.athletes = [];
      });

    // Fetch Parents by CI
    builder
      .addCase(fetchParentsByCISearch.pending, (state) => {
        state.searchingParent = true;
        state.error = null;
      })
      .addCase(fetchParentsByCISearch.fulfilled, (state, action) => {
        state.searchingParent = false;
        state.searchedParent = action.payload;
      })
      .addCase(fetchParentsByCISearch.rejected, (state, action) => {
        state.searchingParent = false;
        state.error = action.payload as string;
        state.searchedParent = null;
      });

    // Fetch All Parents
    builder
      .addCase(fetchAllParents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllParents.fulfilled, (state, action) => {
        state.loading = false;
        state.allParents = action.payload;
      })
      .addCase(fetchAllParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload Athlete Image
    builder
      .addCase(uploadAthleteImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadAthleteImage.fulfilled, (state) => {
        state.uploadingImage = false;
      })
      .addCase(uploadAthleteImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload as string;
      });

    // Upload Athlete CI
    builder
      .addCase(uploadAthleteCI.pending, (state) => {
        state.uploadingCI = true;
        state.error = null;
      })
      .addCase(uploadAthleteCI.fulfilled, (state) => {
        state.uploadingCI = false;
      })
      .addCase(uploadAthleteCI.rejected, (state, action) => {
        state.uploadingCI = false;
        state.error = action.payload as string;
      });

    // Fetch Athlete Parent
    builder
      .addCase(fetchAthleteParent.pending, (state) => {
        state.loadingParent = true;
      })
      .addCase(fetchAthleteParent.fulfilled, (state, action) => {
        state.loadingParent = false;
        state.athleteParent = action.payload;
      })
      .addCase(fetchAthleteParent.rejected, (state, action) => {
        state.loadingParent = false;
        state.error = action.payload as string;
      });

    // Fetch My Athletes (for parent)
    builder
      .addCase(fetchMyAthletes.pending, (state) => {
        state.loadingMyAthletes = true;
        state.error = null;
      })
      .addCase(fetchMyAthletes.fulfilled, (state, action) => {
        state.loadingMyAthletes = false;
        state.myAthletes = action.payload;
      })
      .addCase(fetchMyAthletes.rejected, (state, action) => {
        state.loadingMyAthletes = false;
        state.error = action.payload as string;
        state.myAthletes = [];
      });

    // Update User (for athletes)
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // Update athlete in the athletes list if it's an athlete
      const updatedUser = action.payload;
      if (updatedUser?.role === "athlete") {
        const athleteIndex = state.athletes.findIndex(
          (a) => a._id === updatedUser._id,
        );
        if (athleteIndex !== -1) {
          state.athletes[athleteIndex] = {
            ...state.athletes[athleteIndex],
            ...updatedUser,
          };
        }
      }
      // Update parent in athleteParent if it's the parent being viewed
      if (
        updatedUser?.role === "parent" &&
        state.athleteParent?._id === updatedUser._id
      ) {
        state.athleteParent = updatedUser;
      }
      // Update parent in allParents list
      if (updatedUser?.role === "parent") {
        const parentIndex = state.allParents.findIndex(
          (p) => p._id === updatedUser._id,
        );
        if (parentIndex !== -1) {
          state.allParents[parentIndex] = {
            ...state.allParents[parentIndex],
            ...updatedUser,
          };
        }
      }
    });
  },
});

export const { clearError, clearSearchedParent, clearAthleteParent } =
  athletesSlice.actions;

export default athletesSlice.reducer;
