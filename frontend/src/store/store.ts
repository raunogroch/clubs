import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./messageSlice";
import authReducer, { login } from "./authSlice";
import usersReducer from "./usersSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
    users: usersReducer,
    filters: filterReducer,
  },
});

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
if (token && user) {
  store.dispatch(login({ user: JSON.parse(user), token }));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
