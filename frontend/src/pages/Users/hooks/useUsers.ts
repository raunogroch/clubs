import { useState, useEffect } from "react";
import { userService } from "../../../services/userService";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await userService.getAll();

      if (data) {
        setUsers(data);
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
      fetchUsers(); // Actualizar la lista después de eliminar
    } catch (err) {
      throw new Error("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, deleteUser };
};
