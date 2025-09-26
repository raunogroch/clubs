import { useEffect } from "react";

export const useUserClubs = () => {
  const clubs = [];
  const fetchUserClubs = async () => {
    //obtiene los clubs a los que pertenece el usuario
  };

  useEffect(() => {
    fetchUserClubs();
  }, []);

  return { clubs, fetchUserClubs };
};
