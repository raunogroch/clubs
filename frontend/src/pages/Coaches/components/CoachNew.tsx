import { useNavigate } from "react-router-dom";
import { NavHeader } from "../../../components/NavHeader";
import type { UsersPageProps } from "../interfaces/userTypes";
import { CoachForm } from "./CoachForm";

export const CoachNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/users/coaches");
  };

  const handleCancel = () => {
    navigate("/users/coaches");
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
                    <CoachForm
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
