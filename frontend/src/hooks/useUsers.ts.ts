import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import type { User } from "../interfaces/userInterface";
import api from "../services/api";

export const useUsers = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [state, setState] = useState<{
    users: User[];
    loading: boolean;
    error: string | null;
  }>({
    users: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setState((prev) => ({ ...prev, users: response.data }));
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
        setState((prev) => ({
          ...prev,
          error: err.response?.data?.message || "Error al cargar los usuarios",
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchUsers();
  }, [logout, navigate]);

  return state;
};
