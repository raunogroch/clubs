import React from "react";
import { Button, Image } from "./index";
import Dropdown from "./Dropdown";

interface ClubItem {
  _id: string;
  name: string;
  location?: string;
  athletes_added?: number;
  coaches?: number;
  images?: any;
  sport?: string;
}

interface ClubsListProps {
  clubs: ClubItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenLevels: (id: string) => void;
  onOpenGroups: (id: string) => void;
  onUpdateLogo: (id: string, current?: string) => void;
  isLoading?: boolean;
  onCreateClub?: () => void;
}

export const ClubsList: React.FC<ClubsListProps> = ({
  clubs,
  onEdit,
  onDelete,
  onOpenLevels,
  onOpenGroups,
  onUpdateLogo,
  isLoading,
  onCreateClub,
}) => {
  return (
    <>
      <div
        className="ibox-title d-flex justify-content-between"
        style={{ alignItems: "center" }}
      >
        <h5 className="m-0">
          <i className="fa fa-building"></i> Clubs
        </h5>
        {onCreateClub && (
          <Button
            className="btn btn-primary"
            icon="fa-plus"
            onClick={onCreateClub}
            disabled={isLoading}
          >
            Crear Club
          </Button>
        )}
      </div>
      <div className="ibox">
        <div className="ibox-content">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Nombre del Club</th>
                  <th>Disciplina</th>
                  <th>Ubicación</th>
                  <th className="text-center">Atletas</th>
                  <th className="text-center">Entrenadores</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clubs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      <em>No hay clubs creados aún</em>
                    </td>
                  </tr>
                ) : (
                  clubs.map((club) => (
                    <tr
                      key={club._id}
                      style={{ height: "var(--member-row-height)" }}
                    >
                      <td style={{ verticalAlign: "middle", width: "70px" }}>
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          {club.images?.small ? (
                            <Image
                              src={club.images.small}
                              alt={club.name}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: "6px",
                                background: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                color: "#999",
                                fontWeight: 600,
                              }}
                            >
                              No logo
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-xs btn-info"
                            style={{
                              position: "absolute",
                              bottom: "-6px",
                              right: "-6px",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              padding: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() =>
                              onUpdateLogo(club._id, club.images?.small)
                            }
                            title="Editar logo"
                          >
                            <i
                              className="fa fa-pencil"
                              style={{ fontSize: "10px" }}
                            />
                          </button>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <strong>{club.name}</strong>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {club.sport || "-"}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {club.location || "-"}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {club.athletes_added || 0}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {club.coaches || 0}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        <div
                          className="btn-group"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            className="btn btn-xs btn-info"
                            onClick={() => onOpenGroups(club._id)}
                            disabled={isLoading}
                            icon="fa-sitemap"
                            title="Grupos"
                          >
                            Grupos
                          </Button>
                          <Button
                            className="btn btn-xs btn-primary"
                            onClick={() => onOpenLevels(club._id)}
                            disabled={isLoading}
                            icon="fa-trophy"
                            title="Rangos"
                          >
                            Rangos
                          </Button>
                          <Dropdown
                            options={[
                              {
                                label: "Editar",
                                icon: "fa-pencil",
                                onClick: () => onEdit(club._id),
                                disabled: isLoading,
                              },
                              {
                                label: "Eliminar",
                                icon: "fa-trash",
                                onClick: () => onDelete(club._id),
                                disabled: isLoading,
                              },
                            ]}
                          >
                            <button
                              type="button"
                              className="btn btn btn-white"
                              title="Más"
                              style={{
                                background: "none",
                                border: "none",
                                padding: "0 8px",
                              }}
                            >
                              <i
                                className="fa fa-ellipsis-v"
                                style={{
                                  fontSize: 15,
                                  letterSpacing: 4,
                                  marginRight: 0,
                                }}
                              ></i>
                            </button>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubsList;
