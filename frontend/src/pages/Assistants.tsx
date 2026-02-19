import { useEffect } from "react";
import { NavHeader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchUsersByRole } from "../store/usersThunk";

export const Assistants = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const assistants = useSelector((state: RootState) => state.users.items);
  const clubs = useSelector((state: RootState) => state.clubs.items);
  const loading = useSelector(
    (state: RootState) => state.users.status === "loading",
  );

  useEffect(() => {
    dispatch(fetchUsersByRole("assistant"));
  }, [dispatch]);

  // Obtener assignment_id del admin actual
  const assignmentId = user?.role === "admin" ? user.assignment_id : null;

  // Filtrar clubes que pertenecen al assignment_id del admin
  const clubsOfAssignment = clubs.filter(
    (club: any) => club.assignment_id === assignmentId,
  );
  const clubIds = clubsOfAssignment.map((club: any) => club._id);

  // Filtrar asistentes cuyo club pertenezca a los clubes filtrados
  const filteredAssistants = assistants.filter((assistant: any) =>
    clubIds.includes(assistant.club),
  );

  return (
    <div>
      <NavHeader name="Secretarios(as)" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-content">
            {loading ? (
              <div>Cargando asistentes...</div>
            ) : filteredAssistants.length === 0 ? (
              <div>No hay secretarios(as) registrados en tus clubes.</div>
            ) : (
              <ul>
                {filteredAssistants.map((assistant: any) => (
                  <li key={assistant._id}>
                    {assistant.name} {assistant.lastname}{" "}
                    {assistant.username && <span>({assistant.username})</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
