import { NavHeader, PopUpMessage } from "../../../components";
import { useDispatch, useSelector } from "react-redux";

import type { pageParamProps } from "../../../interfaces/pageParamProps";

import type { AppDispatch } from "../../../store";
import { useEffect } from "react";
import { fetchSchedules } from "../../../store/scheduleThunks";
import { ScheduleTable } from "./ScheduleTable";

export const Schedule = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    schedules: schedules,
    error,
    status,
  } = useSelector((state: any) => state.schedules);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, []);

  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo horario" />
      <PopUpMessage />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row justify-content-center">
          <div className="col-6">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de horarios</h5>
              </div>
              <div className="ibox-content">
                {error && <div className="alert alert-danger">{error}</div>}
                {status === "succeeded" && (
                  <ScheduleTable schedules={schedules} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
