import { Link } from "react-router-dom";
import { NavHeader, LoadingIndicator, ErrorMessage } from "../../components";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { useSchedule } from "./hooks/useSchedule";
import { ScheduleTable } from "./components/ScheduleTable";

export const Schedule = ({ name }: pageParamProps) => {
  const { schedules, loading, error, deleteSchedule } = useSchedule();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de horarios</h5>
                <div className="ibox-tools">
                  <Link
                    to="/users/create"
                    className="btn btn-rounded btn-outline"
                  >
                    <i className="fa fa-plus"></i> Nuevo horario
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <ScheduleTable
                  schedules={schedules}
                  onDelete={deleteSchedule}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
