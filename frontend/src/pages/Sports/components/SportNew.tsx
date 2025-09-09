import { useNavigate } from "react-router-dom";
import { NavHeader } from "../../../components/NavHeader";
import type { UsersPageProps } from "../../Users/interfaces/userTypes";
import { SportForm } from "./SportForm";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";

export const SportNew = ({ name, sub }: UsersPageProps) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSuccess = () => {
    dispatch(
      setMessage({
        message: "La disciplina fue creada exitosamente",
        type: "success",
      })
    );
    // Espera breve para asegurar que el mensaje se muestre antes de navegar
    setTimeout(() => navigate("/sports"), 100);
  };

  const handleCancel = () => {
    navigate("/sports");
  };

  return (
    <>
      <NavHeader name={name} sub={sub} pageCreate="Nueva disciplina" />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row justify-content-center">
          <div className="col-6">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Crear nueva disciplina</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12">
                    <SportForm
                      onSuccess={handleSuccess}
                      onCancel={handleCancel}
                      // onError eliminado, los errores ahora son globales
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
