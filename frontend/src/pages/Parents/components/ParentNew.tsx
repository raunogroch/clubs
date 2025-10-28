import { useNavigate } from "react-router-dom";
import { NavHeader } from "../../../components/NavHeader";
import { ParentForm } from ".";
import type { UsersPageProps } from "../../../interfaces";

export const ParentNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/users/parents");
  };

  const handleCancel = () => {
    navigate("/users/parents");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Crear Nuevo Padre</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <ParentForm
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

export default ParentNew;
