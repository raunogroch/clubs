import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type MessageType = "danger" | "warning" | "info" | "success";

export interface MessageState {
  message: string | null;
  type: MessageType | null;
}

const initialState: MessageState = {
  message: null,
  type: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (
      state,
      action: PayloadAction<{ message: string; type: MessageType }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearMessage: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
