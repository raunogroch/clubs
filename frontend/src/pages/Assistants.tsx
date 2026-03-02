import { useEffect } from "react";
import { NavHeader } from "../components";
import { Image } from "../components/Image";
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

  console.log("Asistentes asignados:", assignmentAssistants);

  return (
    <div>
      <NavHeader name="Secretarios" />
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
                      <th style={{ width: "60px" }}>Foto</th>
                      <th>Apellidos</th>
                      <th>Nombres</th>
                      <th>Clubs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentAssistants.map((a: any) => (
                      <tr key={a._id}>
                        <td>
                          {a.images?.small ? (
                            <Image
                              src={a.images.small}
                              alt={`${a.name} ${a.lastname}`}
                              className="rounded-circle"
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle"
                              style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: "#e8e8e8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i
                                className="fa fa-user"
                                style={{ fontSize: "24px", color: "#999" }}
                              ></i>
                            </div>
                          )}
                        </td>
                        <td className="align-middle">{a.lastname}</td>
                        <td className="align-middle">{a.name}</td>
                        <td className="align-middle">
                          {a.clubs.map((c: any, idx: number) => (
                            <div key={idx}>- {c.name}</div>
                          ))}
                        </td>
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
