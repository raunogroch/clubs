import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { updateGroup, findGroupById } from "../../../store/groupsThunks";
import { fetchEntities } from "../../../store/entitiesThunks";
import type { AppDispatch, RootState } from "../../../store";
import type { User } from "../../../interfaces";
import { NavHeader } from "../../../components";

interface Props {
  name?: string;
  sub?: string;
  sub1?: string;
}

export const GroupCoaches = ({ name, sub, sub1 }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubId, groupId } = useParams<{ clubId: string; groupId?: string }>();

  const group = useSelector((s: RootState) => s.groups.selectedGroup);
  const allCoaches = useSelector((s: RootState) => s.entities.coaches || []);

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

  // Ensure coaches are loaded
  useEffect(() => {
    if (!allCoaches || allCoaches.length === 0) dispatch(fetchEntities());
  }, [dispatch, allCoaches]);

  const idOf = (item: any) =>
    typeof item === "string" ? item : item?._id || "";

  // IDs of coaches currently in the (local) group
  const groupCoachIds: string[] = useMemo(() => {
    return (localGroup?.coaches || []).map(idOf).filter(Boolean) as string[];
  }, [localGroup]);

  // Normalized coach objects for the group's left column
  const groupCoachesNormalized: User[] = useMemo(() => {
    return groupCoachIds.map(
      (id) =>
        allCoaches.find((a) => a._id === id) || {
          _id: id,
          name: "",
          lastname: "",
          username: "",
        }
    );
  }, [groupCoachIds, allCoaches]);

  // Right column: show all coaches but disable add when already in group
  const availableToAdd: User[] = allCoaches;

  // Optimistic add
  const handleAdd = async (coach: User) => {
    if (!clubId || !localGroup || !coach._id) return;
    const previous = localGroup;
    const ids = [...groupCoachIds, coach._id];
    setLocalGroup({ ...localGroup, coaches: ids });

    try {
      const updatedGroup: any = { ...localGroup, coaches: ids };
      await dispatch(updateGroup({ clubId, group: updatedGroup })).unwrap();
      toastr.success("Atleta añadido al grupo");
    } catch (err) {
      setLocalGroup(previous); // revert
      toastr.error("No se pudo añadir el atleta");
    }
  };

  // Optimistic remove
  const handleRemove = async (coachId?: string) => {
    if (!clubId || !localGroup || !coachId) return;
    const previous = localGroup;
    const ids = groupCoachIds.filter((id) => id !== coachId);
    setLocalGroup({ ...localGroup, coaches: ids });

    try {
      const updatedGroup: any = { ...localGroup, coaches: ids };
      await dispatch(updateGroup({ clubId, group: updatedGroup })).unwrap();
      toastr.success("Atleta removido del grupo");
    } catch (err) {
      setLocalGroup(previous);
      toastr.error("No se pudo remover el atleta");
    }
  };

  return (
    <>
      <NavHeader name={name} sub={sub} sub1={sub1} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-md-6">
            <div className="ibox-title">
              Atletas en el grupo ({groupCoachesNormalized.length})
            </div>
            <div className="ibox-content">
              <ul className="list-group">
                {groupCoachesNormalized.length === 0 && (
                  <li className="list-group-item">Sin atletas asignados</li>
                )}

                {groupCoachesNormalized.map((a) => (
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
              Atletas disponibles ({availableToAdd.length})
            </div>
            <div className="ibox-content">
              <ul className="list-group">
                {availableToAdd.length === 0 && (
                  <li className="list-group-item">
                    No hay atletas disponibles
                  </li>
                )}

                {availableToAdd.map((a) => {
                  const inGroup = groupCoachIds.includes(a._id);
                  return (
                    <li
                      key={a._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {a.name || "-"} {a.lastname || ""}
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
