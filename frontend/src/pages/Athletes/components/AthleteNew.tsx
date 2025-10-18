import { useNavigate } from "react-router-dom";
import { NavHeader } from "../../../components/NavHeader";
import { AthleteForm } from "./AthleteForm";
import type { UsersPageProps } from "../../../interfaces";

export const AthleteNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/users/athletes");
  };

  const handleCancel = () => {
    navigate("/users/athletes");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Crear Nuevo Usuario</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <AthleteForm
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
