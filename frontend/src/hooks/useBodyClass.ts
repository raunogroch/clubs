// hooks/useBodyClass.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useBodyClass = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/login") {
      document.body.classList.add("gray-bg");
    } else {
      document.body.classList.remove("gray-bg");
    }

    return () => {
      document.body.classList.remove("gray-bg");
    };
  }, [location.pathname]);
};
