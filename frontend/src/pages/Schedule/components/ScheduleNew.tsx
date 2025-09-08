import { useNavigate } from "react-router-dom";
import { NavHeader } from "../../../components";
import type { UsersPageProps } from "../../Users/interfaces/userTypes";
import { ScheduleForm } from "./ScheduleForm";

export const ScheduleNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/schedules");
  };

  const handleCancel = () => {
    navigate("/schedules");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Crear nuevo horario</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <ScheduleForm
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
