import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { assignAssistants, findClubById } from "../../../store/clubsThunks";
import { userService } from "../../../services/userService";
import type { AppDispatch, RootState } from "../../../store";
import type { User } from "../../../interfaces";
import { NavHeader } from "../../../components";

export const ClubAssignAssistants: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const club = useSelector((s: RootState) => s.clubs.selectedClub);

  const [allAssistants, setAllAssistants] = useState<User[]>([]);
  const [localClub, setLocalClub] = useState<any | null>(club ?? null);

  // Keep localClub in sync with store updates
  useEffect(() => {
    setLocalClub(club ?? null);
  }, [club]);

  // Load club by id
  useEffect(() => {
    if (id) dispatch(findClubById(id));
  }, [dispatch, id]);

  // Load assistants list separately (do not mutate global users slice)
  useEffect(() => {
    let mounted = true;
    userService
      .getAssistants(500)
      .then((res) => {
        if (!mounted) return;
        if (res.code && res.code >= 400) {
          // Error handled silently
        } else setAllAssistants(res.data || []);
      })
      .catch(() => {
        // Error handled silently
      });
    return () => {
      mounted = false;
    };
  }, []);

  const idOf = (item: any) =>
    typeof item === "string" ? item : item?._id || "";

  const assignedIds: string[] = useMemo(() => {
    return (localClub?.assistants || []).map(idOf).filter(Boolean) as string[];
  }, [localClub]);

  const assignedNormalized: User[] = useMemo(() => {
    return assignedIds.map(
      (aid) =>
        allAssistants.find((a) => a._id === aid) || {
          _id: aid,
          name: "",
          lastname: "",
          username: "",
        }
    );
  }, [assignedIds, allAssistants]);

  const availableToAdd: User[] = allAssistants;

  // Optimistic add
  const handleAdd = async (assistant: User) => {
    if (!id || !localClub || !assistant._id) return;
    const previous = localClub;
    const ids = [...assignedIds, assistant._id];
    setLocalClub({ ...localClub, assistants: ids });

    try {
      await dispatch(
        assignAssistants({ clubId: id, assistants: ids })
      ).unwrap();
      toastr.success("Asistente asignado al club");
    } catch (err) {
      setLocalClub(previous);
      toastr.error("No se pudo asignar el asistente");
    }
  };

  // Optimistic remove
  const handleRemove = async (assistantId?: string) => {
    if (!id || !localClub || !assistantId) return;
    const previous = localClub;
    const ids = assignedIds.filter((x) => x !== assistantId);
    setLocalClub({ ...localClub, assistants: ids });

    try {
      await dispatch(
        assignAssistants({ clubId: id, assistants: ids })
      ).unwrap();
      toastr.success("Asistente removido del club");
    } catch (err) {
      setLocalClub(previous);
      toastr.error("No se pudo remover el asistente");
    }
  };

  return (
    <>
      <NavHeader name="Clubs" sub="Asignaciones" sub1="Asistentes" />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-md-6">
            <div className="ibox-title">
              Asistentes asignados ({assignedNormalized.length})
            </div>
            <div className="ibox-content">
              <ul className="list-group">
                {assignedNormalized.length === 0 && (
                  <li className="list-group-item">Sin asistentes asignados</li>
                )}

                {assignedNormalized.map((a) => (
                  <li
                    key={a._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {a.name || "-"} {a.lastname || ""}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-xs btn-danger"
                        onClick={() => handleRemove(a._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="ibox-title">
              Asistentes disponibles ({availableToAdd.length})
            </div>
            <div className="ibox-content">
              <ul className="list-group">
                {availableToAdd.length === 0 && (
                  <li className="list-group-item">
                    No hay asistentes disponibles
                  </li>
                )}

                {availableToAdd.map((a) => {
                  const inClub = assignedIds.includes(a._id);
                  return (
                    <li
                      key={a._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {a.name || "-"} {a.lastname || ""}
                      </div>
                      <div>
                        {inClub ? (
                          ""
                        ) : (
                          <button
                            type="button"
                            className="btn btn-xs btn-success"
                            onClick={() => handleAdd(a)}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubAssignAssistants;
