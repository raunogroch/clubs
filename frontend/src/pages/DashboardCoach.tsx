import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { useEffect, useState } from "react";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Group {
  _id: string;
  name: string;
  club_id: {
    _id: string;
    name: string;
  };
  schedule?: Schedule[];
}

export const DashboardCoach = ({ name }: pageParamProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = `${import.meta.env.VITE_BACKEND_URI}/api/groups/my-coach-groups`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Error: Se esperaba JSON pero se recibió ${contentType || "desconocido"}. Status: ${response.status}`,
          );
        }

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setGroups(data);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachGroups();
  }, []);

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-md-12">
              <h2>Mis Grupos</h2>
            </div>
          </div>

          {loading && <p>Cargando grupos...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && groups.length === 0 && (
            <p>No tienes grupos asignados como entrenador.</p>
          )}

          {!loading && groups.length > 0 && (
            <div className="row">
              {groups.map((group) => (
                <div key={group._id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{group.name}</h5>
                      <p className="card-text">
                        <small className="text-muted">
                          Club: {group.club_id.name}
                        </small>
                      </p>

                      {group.schedule && group.schedule.length > 0 ? (
                        <div className="mt-3">
                          <h6 className="mb-2">Horarios:</h6>
                          <ul className="list-unstyled">
                            {group.schedule.map((sched, idx) => (
                              <li key={idx} className="small mb-1">
                                <strong>{sched.day}:</strong> {sched.startTime}{" "}
                                - {sched.endTime}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="small text-muted mt-3">
                          Sin horarios asignados
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
