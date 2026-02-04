import React from "react";
import { useNavigate } from "react-router-dom";
import type { Club } from "../services/clubs.service";

interface ClubsTableProps {
  clubs: any[];
  clubMembers: Record<string, { athletes: number; coaches: number }>;
  isLoading: boolean;
  getSportName: (sportId: string) => string;
  onEdit: (club: Club) => void;
  onDelete: (clubId: string) => void;
  onOpenLevels: (club: Club) => void;
}

export const ClubsTable: React.FC<ClubsTableProps> = ({
  clubs,
  clubMembers,
  isLoading,
  getSportName,
  onEdit,
  onDelete,
  onOpenLevels,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted">
          No hay clubs creados aún. Crea uno nuevo para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }}>Disciplina</th>
            <th style={{ verticalAlign: "middle" }}>Ubicación</th>
            <th style={{ verticalAlign: "middle", textAlign: "center" }}>
              Grupos
            </th>
            <th style={{ verticalAlign: "middle", textAlign: "center" }}>
              Niveles
            </th>
            <th style={{ verticalAlign: "middle" }}>Deportistas</th>
            <th style={{ verticalAlign: "middle" }}>Entrenadores</th>
            <th style={{ verticalAlign: "middle", textAlign: "center" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club._id}>
              <td style={{ verticalAlign: "middle" }}>
                <strong>{getSportName(club.sport_id)}</strong>
              </td>
              <td style={{ verticalAlign: "middle" }}>
                {club.location || "-"}
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                <button
                  className="btn btn-info btn-xs"
                  onClick={() => navigate(`/clubs/${club._id}/groups`)}
                  title="Gestionar grupos"
                >
                  <i className="fa fa-sitemap"></i>&nbsp;Gestionar
                </button>
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                <button
                  className="btn btn-success btn-xs mx-1"
                  onClick={() => onOpenLevels(club)}
                  title="Gestionar logros"
                >
                  <i className="fa fa-trophy"></i>&nbsp;Gestionar
                </button>
              </td>
              <td style={{ verticalAlign: "middle" }}>
                Registrados ({clubMembers[club._id]?.athletes || 0})
              </td>
              <td style={{ verticalAlign: "middle" }}>
                Registrados ({clubMembers[club._id]?.coaches || 0})
              </td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                <button
                  className="btn btn-primary btn-xs mx-1"
                  onClick={() => onEdit(club)}
                  title="Editar"
                >
                  <i className="fa fa-edit"></i> Editar
                </button>
                <button
                  className="btn btn-danger btn-xs mx-1"
                  onClick={() => onDelete(club._id)}
                  title="Eliminar"
                >
                  <i className="fa fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
