import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../store/store";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const DashboardCoach = ({ name }: pageParamProps) => {
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

const DashboardAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<any>>([]);
  const [breakdown, setBreakdown] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userService = (await import("../services/userService")).userService;

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
                    {breakdown?.total ??
                      (breakdown && breakdown.clubs
                        ? breakdown.clubs.reduce((total: number, club: any) => {
                            return (
                              total +
                              (club.groups || []).reduce(
                                (gTotal: number, group: any) =>
                                  gTotal + (group.athleteCount || 0),
                                0,
                              )
                            );
                          }, 0)
                        : 0)}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Atletas sin matricula</h5>
                </div>
                <div className="ibox-content text-center">
                  <h2 className="font-bold text-danger">
                    {breakdown && breakdown.clubs
                      ? breakdown.clubs.reduce(
                          (totalUnpaid: number, club: any) => {
                            return (
                              totalUnpaid +
                              (club.groups || []).reduce(
                                (clubUnpaid: number, group: any) => {
                                  return clubUnpaid + (group.unpaidCount || 0);
                                },
                                0,
                              )
                            );
                          },
                          0,
                        )
                      : 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
