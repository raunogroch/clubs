import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClubs } from "../store/clubsThunk";
import type { RootState } from "../store/store";

/**
 * useAssignmentStatus
 * Este hook reutiliza el thunk `fetchAllClubs` para consultar el servidor
 * y decide el estado de la asignación basándose en el estado de Redux.
 * Usar datos de redux (en lugar de peticiones manuales) mantiene el código
 * consistente y facilita el rastreo/debug para desarrolladores junior.
 */
export const useAssignmentStatus = (user: any | undefined) => {
  const dispatch = useDispatch<any>();
  const { status, error } = useSelector((state: RootState) => state.clubs);

  // Verificar si el usuario es admin sin asignación
  const isAdminWithoutAssignment =
    user?.role === "admin" &&
    (user?.assignment_id === null || user?.assignment_id === undefined);

  useEffect(() => {
    if (!user) return;
    // Si es admin sin assignment, no hacer petición
    if (isAdminWithoutAssignment) return;

    // recargar cada vez que cambie el identificador relevante
    dispatch(fetchAllClubs());
  }, [dispatch, user?.code, user?.sub, isAdminWithoutAssignment]);

  const checking = status === "loading";
  // si es admin sin assignment, tratar como forbidden
  const forbidden =
    isAdminWithoutAssignment ||
    (status === "failed" && error && error.status === 403);
  const otherError = status === "failed" && !forbidden;

  return {
    checking,
    forbidden,
    error: otherError,
  };
};

export default useAssignmentStatus;
