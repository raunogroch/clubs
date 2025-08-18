import { useState, useEffect, useContext } from "react";
import { userService } from "../../../services/userService";
import { AuthContext } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();

      if (response.code === 200) {
        const { data } = response;
        setUsers(data);
      }

      if (response.code === 401) {
        logout();
        navigate("/login");
      }
    } catch (err) {
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (err) {
      throw new Error("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, deleteUser };
};
