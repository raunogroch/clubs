import { useState, useEffect, useContext } from "react";
import { userService } from "../../../services/userService";
import { AuthContext } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userExist = localStorage.getItem("user");

      const response = await userService.getById(JSON.parse(userExist).code);

      if (response.code === 200) {
        const { data } = response;
        setUser(data);
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

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, fetchUser };
};
