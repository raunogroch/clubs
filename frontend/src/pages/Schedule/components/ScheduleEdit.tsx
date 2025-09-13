import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { PopUpMessage, NavHeader } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import type { pageParamProps } from "../../../interfaces/pageParamProps";
import { ScheduleForm } from "./ScheduleForm";
import type { AppDispatch } from "../../../store";
import { findScheduleById } from "../../../store/scheduleThunks";

export const ScheduleEdit = ({ name, sub }: pageParamProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();
  const {
    selectedSchedule: schedule,
    error,
    status,
  } = useSelector((state: any) => state.schedules);

  const handleSuccess = () => {
    navigate("/schedules");
  };

  const handleCancel = () => {
    navigate("/schedules");
  };

  useEffect(() => {
    dispatch(findScheduleById(id)).unwrap();
  }, [id, dispatch]);

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Editar la disciplina</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {status === "succeeded" && schedule && (
                      <ScheduleForm
                        initialData={schedule}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
