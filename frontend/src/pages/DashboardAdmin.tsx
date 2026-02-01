import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../store/store";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { registrationsService } from "../services/registrationsService";

export const DashboardAdmin = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Verificar si el admin tiene assignment_id
  const hasAssignment =
    user?.role === "admin"
      ? (user as any)?.assignment_id !== null &&
        (user as any)?.assignment_id !== undefined
      : true; // Superadmin y otros roles siempre tienen acceso

  // Si es admin sin assignment_id, mostrar mensaje especial
  if (user?.role === "admin" && !hasAssignment) {
    return (
      <>
        <NavHeader name={name} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-warning">⚠️ Sin Asignación</h3>
            <div className="error-desc">
              <p>
                Aún no has sido asignado a ningún módulo. Por favor, ponte en
                contacto con el superadministrador para que te asigne a los
                módulos correspondientes.
              </p>
              <p className="text-muted m-t-md">
                Una vez que seas asignado, tendrás acceso a la sección de
                Usuarios y otras funcionalidades.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <DashboardAssignments />
      </div>
    </>
  );
};

const calculateTotalAthletes = (breakdown: any): number => {
  if (!breakdown?.clubs) return 0;
  return breakdown.clubs.reduce((total: number, club: any) => {
    return (
      total +
      (club.groups || []).reduce(
        (gTotal: number, group: any) => gTotal + (group.athleteCount || 0),
        0,
      )
    );
  }, 0);
};

const calculateUnpaidAthletes = (breakdown: any): number => {
  if (!breakdown?.clubs) return 0;
  return breakdown.clubs.reduce((totalUnpaid: number, club: any) => {
    return (
      totalUnpaid +
      (club.groups || []).reduce(
        (clubUnpaid: number, group: any) =>
          clubUnpaid + (group.unpaidCount || 0),
        0,
      )
    );
  }, 0);
};

const DashboardAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<any>>([]);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [unpaidAthletes, setUnpaidAthletes] = useState<Array<any>>([]);
  const [unpaidLoading, setUnpaidLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userService = (await import("../services/userService.ts"))
        .userService;

      // Cargar conteos
      const res = await userService.getUnpaidByAssignment();
      if (res.code === 200) {
        setItems(res.data || []);
      } else {
        setItems([]);
      }

      // Cargar desglose detallado
      const breakdownRes = await userService.getAthletesBreakdownByAssignment();
      if (breakdownRes.code === 200) {
        setBreakdown(breakdownRes.data);
      }

      setLoading(false);
    };
    load();
  }, [user]);

  // Cargar registrations para el modal
  const handleOpenUnpaidModal = async () => {
    setShowUnpaidModal(true);
    setUnpaidLoading(true);

    try {
      const assignmentId = (user as any)?.assignment_id;
      if (!assignmentId) {
        setUnpaidAthletes([]);
        setUnpaidLoading(false);
        return;
      }

      const res =
        await registrationsService.getUnpaidByAssignment(assignmentId);
      if (res.code === 200) {
        setUnpaidAthletes(res.data || []);
      } else {
        setUnpaidAthletes([]);
      }
    } catch (e) {
      setUnpaidAthletes([]);
    } finally {
      setUnpaidLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="middle-box text-center animated fadeInRightBig">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="middle-box text-center animated fadeInRightBig">
        <h5>No hay datos disponibles</h5>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper wrapper-content">
        <div className="animated fadeInRightBig">
          <div className="row">
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Atletas inscritos</h5>
                </div>
                <div className="ibox-content text-center">
                  <h2 className="font-bold text-primary">
                    {calculateTotalAthletes(breakdown)}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Atletas sin matricula</h5>
                  <div className="ibox-tools">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={handleOpenUnpaidModal}
                      title="Ver atletas sin pago"
                    >
                      <i className="fa fa-list"></i> Ver lista
                    </button>
                  </div>
                </div>
                <div className="ibox-content text-center">
                  <h2 className="font-bold text-danger">
                    {calculateUnpaidAthletes(breakdown)}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Atletas sin pago */}
      {showUnpaidModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={() => setShowUnpaidModal(false)}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Usuarios registrados</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowUnpaidModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {unpaidLoading ? (
                  <div className="text-center">
                    <p>Cargando registrations...</p>
                  </div>
                ) : unpaidAthletes.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">
                      No hay registrations en esta asignación.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Apellido</th>
                          <th>Club</th>
                          <th>Estado de pago</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unpaidAthletes.map((reg) => (
                          <tr key={reg._id}>
                            <td>{reg.athlete_id?.name || "-"}</td>
                            <td>{reg.athlete_id?.lastname || "-"}</td>
                            <td>{reg.group_id?.name || "-"}</td>
                            <td>
                              {reg.registration_pay ? (
                                <span className="badge badge-success">
                                  Pagado
                                </span>
                              ) : (
                                <button className="btn btn-sm btn-primary">
                                  Pagar matrícula
                                </button>
                              )}
                            </td>
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
                  className="btn btn-default"
                  onClick={() => setShowUnpaidModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
