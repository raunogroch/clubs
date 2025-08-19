// hooks/useBodyClass.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook para cambiar la clase del body según la ruta actual.
 * Útil para aplicar estilos específicos en páginas como login.
 */
export const useBodyClass = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/login") {
      document.body.classList.add("gray-bg");
    } else {
      document.body.classList.remove("gray-bg");
    }

    // Limpia la clase al desmontar el componente
    return () => {
      document.body.classList.remove("gray-bg");
    };
  }, [location.pathname]);
};
