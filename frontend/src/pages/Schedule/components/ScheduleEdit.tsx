import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ErrorMessage, LoadingIndicator, NavHeader } from "../../../components";
import type { pageParamProps } from "../../../interfaces/pageParamProps";
import type { Schedule } from "../types/scheduleTypes";
import { useSchedule } from "../hooks/useSchedule";
import { ScheduleForm } from "./ScheduleForm";

export const ScheduleEdit = ({ name, sub }: pageParamProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getScheduleById } = useSchedule();

  useEffect(() => {
    setLoading(true);
    getScheduleById(id)
      .then((data) => {
        setSchedule(data);
      })
      .catch(() => {
        setError("Error al cargar las disciplinas");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSuccess = () => {
    navigate("/schedules", {
      state: {
        message: "La disciplina fue actualizado exitosamente",
        messageKind: "success",
      },
    });
  };

  const handleCancel = () => {
    navigate("/schedules");
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Editar la disciplina</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <ScheduleForm
                      initialData={schedule}
                      onSuccess={handleSuccess}
                      onCancel={handleCancel}
                    />
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
