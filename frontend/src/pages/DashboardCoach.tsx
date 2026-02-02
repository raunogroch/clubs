import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { useEffect, useState } from "react";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Athlete {
  _id: string;
  name: string;
  lastname: string;
  ci: string;
  phone: string;
}

interface Group {
  _id: string;
  name: string;
  club_id: {
    _id: string;
    name: string;
  };
  schedule?: Schedule[];
  athletes_added?: number;
}

interface GroupWithAthletes extends Group {
  athletesCount: number;
}

export const DashboardCoach = ({ name }: pageParamProps) => {
  const [groupsWithAthletes, setGroupsWithAthletes] = useState<
    GroupWithAthletes[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [athletesList, setAthletesList] = useState<Athlete[]>([]);
  const [athletesLoading, setAthletesLoading] = useState(false);

  useEffect(() => {
    const fetchCoachGroupsWithAthletes = async () => {
      try {
        const token = localStorage.getItem("token");
        const groupsUrl = `${import.meta.env.VITE_BACKEND_URI}/api/groups/my-coach-groups`;

        const groupsRes = await fetch(groupsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = groupsRes.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Error: Se esperaba JSON pero se recibió ${contentType || "desconocido"}. Status: ${groupsRes.status}`,
          );
        }

        if (!groupsRes.ok) {
          throw new Error(`Error HTTP`);
        }

        const groups: Group[] = await groupsRes.json();

        const groupsWithAthletesList = await Promise.all(
          groups.map(async (group) => {
            try {
              const paidUrl = `${import.meta.env.VITE_BACKEND_URI}/api/registrations/group/${group._id}/paid-athletes`;
              const paidRes = await fetch(paidUrl, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (paidRes.ok) {
                const paidAthletes = await paidRes.json();
                return {
                  ...group,
                  athletesCount: paidAthletes.length,
                };
              }

              return {
                ...group,
                athletesCount: 0,
              };
            } catch {
              return {
                ...group,
                athletesCount: 0,
              };
            }
          }),
        );

        setGroupsWithAthletes(groupsWithAthletesList);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachGroupsWithAthletes();
  }, []);

  const fetchAthletes = async (groupId: string) => {
    setAthletesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const paidUrl = `${import.meta.env.VITE_BACKEND_URI}/api/registrations/group/${groupId}/paid-athletes`;
      const paidRes = await fetch(paidUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (paidRes.ok) {
        const registrations = await paidRes.json();
        const athletes = registrations.map((reg: any) => ({
          _id: reg.athlete_id._id,
          name: reg.athlete_id.name,
          lastname: reg.athlete_id.lastname,
          ci: reg.athlete_id.ci,
          phone: reg.athlete_id.phone,
        }));
        setAthletesList(athletes);
        setSelectedGroupId(groupId);
      }
    } catch (err) {
      console.error("Error fetching athletes:", err);
    } finally {
      setAthletesLoading(false);
    }
  };

  const closeAthletesList = () => {
    setSelectedGroupId(null);
    setAthletesList([]);
  };

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="container-fluid">
          {loading && <p>Cargando grupos...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && groupsWithAthletes.length === 0 && (
            <p>No tienes grupos asignados como entrenador.</p>
          )}

          {!loading && groupsWithAthletes.length > 0 && (
            <div className="row">
              {groupsWithAthletes.map((group) => (
                <div key={group._id} className="col-md-4">
                  <div className="ibox">
                    <div className="ibox-title">
                      <h5>
                        <strong> Club:</strong> {group.name}
                      </h5>
                      <div className="ibox-tools">
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => fetchAthletes(group._id)}
                          title="Ver lista de atletas"
                        >
                          <i className="fa fa-list"></i> Ver lista
                        </button>
                      </div>
                    </div>
                    <div className="ibox-content text-center">
                      <h2 className="font-bold">
                        <span className="text-primary">
                          {group.athletesCount}
                        </span>
                      </h2>
                      <p className="text-muted">Atletas activos</p>

                      {group.athletes_added !== undefined && (
                        <div className="mt-3">
                          <p className="mb-1">
                            <small className="text-muted">Agregados:</small>
                          </p>
                          <h3 className="text-success">
                            {group.athletes_added}
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedGroupId && (
            <div
              className="modal d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog" style={{ width: "auto" }}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Lista de Atletas</h5>
                    <button
                      type="button"
                      className="btn-close btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={closeAthletesList}
                      style={{
                        width: "1.5em",
                        height: "1.5em",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "1.5em",
                          height: "1.5em",
                        }}
                        aria-hidden="true"
                      >
                        ×
                      </span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {athletesLoading && <p>Cargando atletas...</p>}
                    {!athletesLoading && athletesList.length === 0 && (
                      <p>No hay atletas para este grupo.</p>
                    )}
                    {!athletesLoading && athletesList.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre</th>
                              <th>Apellido</th>
                            </tr>
                          </thead>
                          <tbody>
                            {athletesList.map((athlete) => (
                              <tr key={athlete._id}>
                                <td>{athlete.name}</td>
                                <td>{athlete.lastname}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeAthletesList}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
