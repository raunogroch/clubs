import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./messageSlice";
import authReducer, { login } from "./authSlice";
import loadingReducer from "./loadingSlice";
import filtersReducer from "./filtersSlice";
import entitiesReducer from "./entitiesSlice";
import queriesReducer from "./querySlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
    loading: loadingReducer,
    filters: filtersReducer,
    entities: entitiesReducer,
    queries: queriesReducer,
  },
});

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
if (token && user) {
  store.dispatch(login({ user: JSON.parse(user), token }));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
