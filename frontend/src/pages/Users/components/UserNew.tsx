import { useNavigate } from "react-router-dom";
import { NavHeader } from "../../../components/NavHeader";
import { UserForm } from "./UserForm";
import type { UsersPageProps } from "../../../interfaces";

export const UserNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = (role: string) => {
    navigate(`/users/${role}`); // Redirect based on the role
  };

  const handleCancel = () => {
    navigate(`/`);
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
                    <UserForm
                      onSuccess={(role) => handleSuccess(role)} // Pass a function reference
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
