import { useNavigate } from "react-router-dom";
import type { pageParamProps } from "../../interfaces/pageParamProps";
import { NavHeader } from "../../components/NavHeader";
import { FormUser } from "./FormUser";

export const UserNew = ({ name, sub }: pageParamProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/users", {
      state: {
        message: "El usuario fue creado exitosamente",
        messageKind: "success",
      },
    });
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>
                  Basic form <small>Simple login form example</small>
                </h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <FormUser onSuccess={handleSuccess} />
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
