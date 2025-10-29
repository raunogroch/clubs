import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { updateGroup, findGroupById } from "../../../store/groupsThunks";
import { fetchEntities } from "../../../store/entitiesThunks";
import type { AppDispatch, RootState } from "../../../store";
import type { User } from "../../../interfaces";

interface Props {
  name?: string;
}

export const GroupAthletes = ({ name }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubId, groupId } = useParams<{ clubId: string; groupId?: string }>();

  const group = useSelector((s: RootState) => s.groups.selectedGroup);
  const allAthletes = useSelector((s: RootState) => s.entities.athletes || []);

  // Local optimistic state so UI updates instantly while server call completes
  const [localGroup, setLocalGroup] = useState<any | null>(group ?? null);

  // Keep localGroup in sync with store updates (server response)
  useEffect(() => {
    setLocalGroup(group ?? null);
  }, [group]);

  // Load group if URL params provided
  useEffect(() => {
    if (clubId && groupId) dispatch(findGroupById({ clubId, groupId }));
  }, [dispatch, clubId, groupId]);

  // Ensure athletes are loaded
  useEffect(() => {
    if (!allAthletes || allAthletes.length === 0) dispatch(fetchEntities());
  }, [dispatch, allAthletes]);

  const idOf = (item: any) =>
    typeof item === "string" ? item : item?._id || "";

  // IDs of athletes currently in the (local) group
  const groupAthleteIds: string[] = useMemo(() => {
    return (localGroup?.athletes || []).map(idOf).filter(Boolean) as string[];
  }, [localGroup]);

  // Normalized athlete objects for the group's left column
  const groupAthletesNormalized: User[] = useMemo(() => {
    return groupAthleteIds.map(
      (id) =>
        allAthletes.find((a) => a._id === id) || {
          _id: id,
          name: "",
          lastname: "",
          username: "",
        }
    );
  }, [groupAthleteIds, allAthletes]);

  // Right column: show all athletes but disable add when already in group
  const availableToAdd: User[] = allAthletes;

  // Optimistic add
  const handleAdd = async (athlete: User) => {
    if (!clubId || !localGroup || !athlete._id) return;
    const previous = localGroup;
    const ids = [...groupAthleteIds, athlete._id];
    setLocalGroup({ ...localGroup, athletes: ids });

    try {
      const updatedGroup: any = { ...localGroup, athletes: ids };
      await dispatch(updateGroup({ clubId, group: updatedGroup })).unwrap();
      toastr.success("Atleta añadido al grupo");
    } catch (err) {
      setLocalGroup(previous); // revert
      toastr.error("No se pudo añadir el atleta");
    }
  };

  // Optimistic remove
  const handleRemove = async (athleteId?: string) => {
    if (!clubId || !localGroup || !athleteId) return;
    const previous = localGroup;
    const ids = groupAthleteIds.filter((id) => id !== athleteId);
    setLocalGroup({ ...localGroup, athletes: ids });

    try {
      const updatedGroup: any = { ...localGroup, athletes: ids };
      await dispatch(updateGroup({ clubId, group: updatedGroup })).unwrap();
      toastr.success("Atleta removido del grupo");
    } catch (err) {
      setLocalGroup(previous);
      toastr.error("No se pudo remover el atleta");
    }
  };

  if (!localGroup) {
    return (
      <div className="ibox mt-3">
        <div className="ibox-title">
          <h5>{name ?? "Administrar atletas"}</h5>
        </div>
        <div className="ibox-content">No hay un grupo seleccionado.</div>
      </div>
    );
  }

  return (
    <div className="ibox mt-3">
      <div className="ibox-title">
        <h5>{name ?? "Administrar atletas"}</h5>
      </div>
      <div className="ibox-content">
        <div className="row">
          <div className="col-md-6">
            <h6>Atletas en el grupo ({groupAthletesNormalized.length})</h6>
            <ul className="list-group">
              {groupAthletesNormalized.length === 0 && (
                <li className="list-group-item">Sin atletas asignados</li>
              )}

              {groupAthletesNormalized.map((a) => (
                <li
                  key={a._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {a.name || "-"} {a.lastname || ""}
                    <div className="text-muted small">{a.username}</div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-xs btn-danger"
                      onClick={() => handleRemove(a._id)}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6">
            <h6>Atletas disponibles ({availableToAdd.length})</h6>
            <ul className="list-group">
              {availableToAdd.length === 0 && (
                <li className="list-group-item">No hay atletas disponibles</li>
              )}

              {availableToAdd.map((a) => {
                const inGroup = groupAthleteIds.includes(a._id);
                return (
                  <li
                    key={a._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {a.name || "-"} {a.lastname || ""}
                      <div className="text-muted small">{a.username}</div>
                    </div>
                    <div>
                      {inGroup ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          className="btn btn-xs btn-success"
                          onClick={() => handleAdd(a)}
                        >
                          Añadir
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
  );
};
