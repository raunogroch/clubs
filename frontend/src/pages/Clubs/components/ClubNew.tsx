import { useNavigate } from "react-router-dom";
import type { UsersPageProps } from "../../Users/interfaces";
import { NavHeader, PopUpMessage } from "../../../components";
import { ClubForm } from ".";

export const ClubNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/clubs");
  };

  const handleCancel = () => {
    navigate("/clubs");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <PopUpMessage />
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
                    <ClubForm
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
