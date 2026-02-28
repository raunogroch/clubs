import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ProCalendar } from "./DashboardAdmin/ProCalendar";
import { useAdminSchedules } from "../customHooks/useAdminSchedules";

export const SchedulesAdmin = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { calendarGroups, calendarLoading, error } = useAdminSchedules(user);

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 px-0">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Calendario de Horarios de Grupos</h5>
                </div>
                <div className="ibox-content">
                  {calendarLoading === "loading" && (
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

                  {calendarLoading !== "loading" &&
                    calendarGroups.length === 0 &&
                    !error && (
                      <div className="text-center text-muted">
                        No hay grupos con horarios en esta asignación.
                      </div>
                    )}

                  {calendarLoading !== "loading" &&
                    calendarGroups.length > 0 &&
                    !error && <ProCalendar groups={calendarGroups} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
