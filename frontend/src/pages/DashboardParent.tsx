import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const DashboardParent = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h2>Bienvenido, {user?.name}</h2>
          </div>
          <div className="ibox-content">
            <p>Este es tu panel de control como padre/tutor.</p>
            <p>
              Aquí puedes ver la información de tus hijos, sus inscripciones,
              calendarios de entrenamientos, pagos y más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
