import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const DashboardAthlete = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h2>Bienvenido, {user?.name}</h2>
          </div>
          <div className="ibox-content">
            <p>Este es tu panel de control como atleta.</p>
            <p>
              Aquí puedes viewar información sobre tus inscripciones,
              calendarios de entrenamientos, eventos y más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
