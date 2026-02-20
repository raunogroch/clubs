import React from "react";
import { Button, Image } from "./index";
import Dropdown from "./Dropdown";
import { ClubAssistantsModal } from "./modals/ClubAssistants.modal";
import { userService } from "../services/userService";
import clubsService from "../services/clubs.service";

interface ClubItem {
  _id: string;
  name?: string; // may be missing when only minimal info is loaded
  location?: string;
  athletes_added?: number;
  coaches?: number;
  assistants_added?: string[];
  images?: any;
  sport?: string | { _id: string; name: string; active: boolean };
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
  const [assistantsModalClubId, setAssistantsModalClubId] = React.useState<
    string | null
  >(null);
  const [currentClub, setCurrentClub] = React.useState<ClubItem | null>(null);
  const [assistantsLoading, setAssistantsLoading] = React.useState(false);
  const [assistants, setAssistants] = React.useState<any[]>([]);
  const [assignedIds, setAssignedIds] = React.useState<string[]>([]);

  const handleOpenAssistants = async (club: ClubItem) => {
    setAssistantsModalClubId(club._id);
    setAssistantsLoading(true);
    try {
      // fetch fresh club details (might include updated assistants_added)
      const clubResp = await clubsService.getById(club._id);
      const fullClub = clubResp || club;
      setCurrentClub(fullClub);

      let list: any[] = [];
      if (fullClub.assistants_added && fullClub.assistants_added.length > 0) {
        const resp = await userService.getUsersById(fullClub.assistants_added);
        list = resp.data || [];
      }
      setAssistants(list);

      setAssignedIds((prev) => {
        if (!currentClub || currentClub._id !== fullClub._id) {
          return fullClub.assistants_added || [];
        }
        const fromClub = fullClub.assistants_added || [];
        return Array.from(new Set([...fromClub, ...prev]));
      });
    } catch (err) {
      console.error(err);
    }
    setAssistantsLoading(false);
  };

  const handleCloseAssistants = () => {
    setAssistantsModalClubId(null);
    setCurrentClub(null);
    setAssignedIds([]); // ensure no leftovers when closing
  };

  // search is now handled inside modal

  const handleCreateAssistant = async (
    name: string,
    lastname: string,
    ci: string,
  ) => {
    setAssistantsLoading(true);
    const resp = await userService.createUser({
      name,
      lastname,
      ci,
      role: "assistant",
    });
    if (resp.code === 201 || resp.code === 200) {
      const created = resp.data;
      await handleAssignAssistant(created._id);
      // refresh list using current club state
      if (currentClub) {
        handleOpenAssistants(currentClub);
      }
    }
    setAssistantsLoading(false);
  };

  const handleAssignAssistant = async (assistantId: string) => {
    if (!assistantsModalClubId) return;
    setAssistantsLoading(true);
    try {
      await clubsService.addAssistant(assistantsModalClubId, assistantId);
      setAssignedIds((prev) => [...new Set([...prev, assistantId])]);
      // also update currentClub to keep it in sync
      setCurrentClub((c) => {
        if (!c) return c;
        const existing = c.assistants_added || [];
        return {
          ...c,
          assistants_added: Array.from(new Set([...existing, assistantId])),
        };
      });
      // refresh list from backend to ensure state consistency
      if (currentClub) handleOpenAssistants(currentClub);
    } catch (err) {
      console.error(err);
    }
    setAssistantsLoading(false);
  };

  const handleRemoveAssistant = async (assistantId: string) => {
    if (!assistantsModalClubId) return;
    setAssistantsLoading(true);
    try {
      await clubsService.removeAssistant(assistantsModalClubId, assistantId);
      setAssignedIds((prev) => prev.filter((id) => id !== assistantId));
      setCurrentClub((c) => {
        if (!c) return c;
        const existing = c.assistants_added || [];
        return {
          ...c,
          assistants_added: existing.filter((id) => id !== assistantId),
        };
      });
      // refresh list as well
      if (currentClub) handleOpenAssistants(currentClub);
    } catch (err) {
      console.error(err);
    }
    setAssistantsLoading(false);
  };
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
                        {typeof club.sport === "string"
                          ? club.sport
                          : club.sport?.name || "-"}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {club.location || "-"}
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
                            className="btn btn-xs btn-warning"
                            onClick={() => handleOpenAssistants(club)}
                            disabled={isLoading}
                            icon="fa-user-secret"
                            title="Secretarios(as)"
                          >
                            Secretarios(as)
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
      {assistantsModalClubId && (
        <ClubAssistantsModal
          isOpen={!!assistantsModalClubId}
          isLoading={assistantsLoading}
          clubName={currentClub?.name || ""}
          assistants={assistants}
          onClose={handleCloseAssistants}
          onCreate={handleCreateAssistant}
          onAssign={handleAssignAssistant}
          onRemove={handleRemoveAssistant}
          assignedIds={assignedIds}
        />
      )}
    </>
  );
};

export default ClubsList;
