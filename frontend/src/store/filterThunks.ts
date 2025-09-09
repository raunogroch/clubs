import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { setFilter } from "./filtersSlice";

// Thunk para obtener usuarios filtrados y paginados
export const fetchFilteredUsers = createAsyncThunk(
  "filters/fetchFilteredUsers",
  async (
    filters: { page?: number; limit?: number; name?: string } = {},
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Solo enviar los filtros válidos
      const response = await api.get("/users", { params: filters });
      console.log("API response:", response.data);
      // Guarda los filtros de búsqueda y los metadatos por separado
      dispatch(
        setFilter({
          module: "users",
          filter: {
            data: response.data.data,
            page: response.data.page,
            limit: response.data.limit,
            total: response.data.total,
          },
        })
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar usuarios");
    }
  }
);
