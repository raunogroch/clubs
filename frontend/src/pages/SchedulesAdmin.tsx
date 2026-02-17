import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { useEffect, useState } from "react";
import { useCalendarEvents } from "../customHooks/useDashboardAdmin";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ProCalendar } from "./DashboardAdmin/ProCalendar";

export const SchedulesAdmin = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { calendarGroups, calendarLoading } = useCalendarEvents(user);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si hay error en la carga, guardarlo
    if (!calendarLoading && calendarGroups.length === 0) {
      const hasAssignment = (user as any)?.assignment_id;
      if (!hasAssignment) {
        setError(
          "No tienes una asignación configurada. Contacta al administrador.",
        );
      }
    }
  }, [calendarLoading, calendarGroups, user]);

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Calendario de Horarios de Grupos</h5>
                </div>
                <div className="ibox-content">
                  {calendarLoading && (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Cargando...</span>
                      </div>
                      <p>Cargando horarios...</p>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-warning">
                      <p>{error}</p>
                    </div>
                  )}

                  {!calendarLoading &&
                    calendarGroups.length === 0 &&
                    !error && (
                      <div className="text-center text-muted">
                        No hay grupos con horarios en esta asignación.
                      </div>
                    )}

                  {!calendarLoading && calendarGroups.length > 0 && !error && (
                    <ProCalendar groups={calendarGroups} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
