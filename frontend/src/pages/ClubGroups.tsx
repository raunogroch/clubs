/**
 * Página de Grupos por Club
 *
 * Muestra todos los grupos de un club específico y permite:
 * - Ver todos los grupos del club
 * - Crear nuevos grupos
 * - Actualizar grupos existentes
 * - Eliminar grupos
 * - Ver detalles de cada grupo
 *
 * Ruta: /clubs/:club_id/groups
 */

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { fetchGroupsByClub } from "../store/groupsThunk";
import { useEffect } from "react";
import { NavHeader } from "../components";
import { Groups } from "./Groups";

export const ClubGroups = () => {
  const { club_id } = useParams<{ club_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (club_id) {
      dispatch(fetchGroupsByClub(club_id));
    }
  }, [club_id, dispatch]);

  const handleBack = () => {
    navigate("/clubs");
  };

  return (
    <>
      <NavHeader
        name="Grupos"
        backButton={{
          label: "Volver",
          icon: "fa-arrow-left",
          onClick: handleBack,
        }}
      />
      <div className="wrapper wrapper-content">
        {club_id && <Groups clubId={club_id} onBack={handleBack} />}
      </div>
    </>
  );
};
