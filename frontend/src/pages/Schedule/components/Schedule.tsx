import { Link } from "react-router-dom";
import { NavHeader, LoadingIndicator, PopUpMessage } from "../../../components";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import type { pageParamProps } from "../../../interfaces/pageParamProps";
import { useSchedule } from "../hooks/useSchedule";
import { ScheduleTable } from "./ScheduleTable";

export const Schedule = ({ name }: pageParamProps) => {
  const { schedules, loading, error, deleteSchedule } = useSchedule();

  const dispatch = useDispatch();
  if (loading) return <LoadingIndicator />;
  if (error) {
    dispatch(setMessage({ message: error, type: "danger" }));
  }

  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo horario" />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de horarios</h5>
                <div className="ibox-tools">
                  <Link
                    to="/schedules/create"
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
