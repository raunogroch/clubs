import { useEffect } from "react";
import { NavHeader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchAssignmentAssistants } from "../store/clubsThunk";

export const Assistants = () => {
  const dispatch = useDispatch<AppDispatch>();
  const assignmentAssistants = useSelector(
    (state: RootState) => state.clubs.assignmentAssistants,
  );
  const loading = useSelector(
    (state: RootState) => state.clubs.assignmentAssistantsStatus === "loading",
  );

  useEffect(() => {
    dispatch(fetchAssignmentAssistants());
  }, [dispatch]);

  return (
    <div>
      <NavHeader name="Secretarios(as)" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-content">
            {loading ? (
              <div>Cargando asistentes...</div>
            ) : assignmentAssistants.length === 0 ? (
              <div>No hay secretarios(as) registrados en tus clubes.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Apellidos</th>
                      <th>Nombres</th>
                      <th>Clubs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentAssistants.map((a: any) => (
                      <tr key={a._id}>
                        <td>{a.lastname}</td>
                        <td>{a.name}</td>
                        <td>{a.clubs.map((c: any) => c.name).join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
