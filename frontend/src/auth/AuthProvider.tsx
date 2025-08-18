import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

interface User {
  name: string;
  lastname: string;
  role: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Null indica "cargando"

  useEffect(() => {
    const token = localStorage.getItem("UUID");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data", error);
        logout();
      }
    } else {
      setIsAuthenticated(false); // Marcamos explícitamente como no autenticado
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("UUID", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("UUID");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Esperamos a terminar de verificar la autenticación
  if (isAuthenticated === null) {
    return (
      <div style={{ position: "absolute", top: "50%", left: "50%" }}>
        Loading...
      </div>
    ); // O un spinner de carga

    if (window.location.pathname !== "/login") {
      document.body.classList.remove("gray-bg");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
