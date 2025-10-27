import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Payment } from "../pages/Payments/IPayments";
import { createPayment, getPaidMonths } from "./paymentThunks";

interface PaymentsState {
  paidMonthsMap: Record<string, Payment>;
  loading: boolean;
  error?: any;
  lastCreated?: Payment | null;
}

const initialState: PaymentsState = {
  paidMonthsMap: {},
  loading: false,
  error: undefined,
  lastCreated: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearLastCreated(state) {
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaidMonths.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        getPaidMonths.fulfilled,
        (state, action: PayloadAction<Payment[]>) => {
          state.loading = false;
          state.error = undefined;
          const map: Record<string, Payment> = {};
          (action.payload || []).forEach((p) => {
            const key =
              p.month || (p.createdAt ? p.createdAt.slice(0, 7) : undefined);
            if (key) map[key] = p;
          });
          state.paidMonthsMap = map;
        }
      )
      .addCase(getPaidMonths.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        createPayment.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          state.error = undefined;
          state.lastCreated = action.payload;
          const key =
            action.payload.month ||
            (action.payload.createdAt
              ? action.payload.createdAt.slice(0, 7)
              : undefined);
          if (key) state.paidMonthsMap[key] = action.payload;
        }
      )
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { clearLastCreated } = paymentsSlice.actions;
export default paymentsSlice.reducer;
