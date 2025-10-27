import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { CreatePaymentDto, Payment } from "../pages/Payments/IPayments";

export const createPayment = createAsyncThunk(
  "payments/create",
  async (data: CreatePaymentDto, { rejectWithValue }) => {
    try {
      const res = await api.post("/payments", data);
      return res.data as Payment;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

export const getPaidMonths = createAsyncThunk(
  "payments/getPaidMonths",
  async (
    params: { athleteId: string; clubId: string; months: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get("/payments/status", {
        params: {
          athleteId: params.athleteId,
          clubId: params.clubId,
          months: params.months.join(","),
        },
      });
      return (res.data || []) as Payment[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);
