import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../interfaces";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
  findUserById,
  restoreUser,
  softDeleteUser,
} from "./usersThunks";

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  name?: string;
}

interface UsersState {
  selectedUser: any;
  users: UsersResponse; // estructura paginada
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  selectedUser: null,
  users: { data: [], total: 0, page: 1, limit: 10, name: "" },
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = { data: [], total: 0, page: 1, limit: 10, name: "" };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload) {
        state.users.data.push(action.payload as User);
        state.users.total += 1;
      }
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.users.data.findIndex(
        (u) => u._id === action.payload._id
      );
      if (index >= 0) state.users.data[index] = action.payload as User;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.users.data = state.users.data.filter(
        (u) => u._id !== action.payload
      ); // Remove user from the list
      state.users.total -= 1; // Decrease total count
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // RESTORE
    builder.addCase(restoreUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(restoreUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.users.data.findIndex(
        (u) => u._id === action.payload._id
      );
      if (index >= 0) state.users.data[index] = action.payload as User;
    });
    builder.addCase(restoreUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // FIND BY ID
    builder.addCase(findUserById.pending, (state) => {
      state.status = "loading";
    });
    // DEBERÍA SER:
    builder.addCase(findUserById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedUser = action.payload;
    });
    builder.addCase(findUserById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // SOFT DELETE
    builder.addCase(softDeleteUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(softDeleteUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.users.data.findIndex((u) => u._id === action.payload);
      if (index >= 0) {
        state.users.data[index].active = false; // Mark user as inactive

        // Check current user's role
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.role !== "superadmin") {
          // Remove inactive user from the list if not superadmin
          state.users.data = state.users.data.filter(
            (u) => u._id !== action.payload
          );
        }
      }
    });
    builder.addCase(softDeleteUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
