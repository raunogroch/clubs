import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./messageSlice";
import authReducer, { login } from "./authSlice";
import usersReducer from "./usersSlice";
import clubsReducer from "./clubsSlice";
import groupsReducer from "./groupsSlice";
import sportsReducer from "./sportsSlice";
import assignmentsReducer from "./assignmentsSlice";
import levelsReducer from "./levelsSlice";
import { tokenSessionMiddleware } from "./middleware/tokenSessionMiddleware";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
    users: usersReducer,
    clubs: clubsReducer,
    groups: groupsReducer,
    sports: sportsReducer,
    assignments: assignmentsReducer,
    levels: levelsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenSessionMiddleware),
});

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
if (token && user) {
  store.dispatch(login({ user: JSON.parse(user), token }));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
