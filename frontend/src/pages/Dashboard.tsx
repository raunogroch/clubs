import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const Dashboard = ({ name }: pageParamProps) => {
  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="middle-box text-center animated fadeInRightBig">
          <h3 className="font-bold">Página en construcción</h3>
          <div className="error-desc">
            Actualmente no tienes informacion en esta pagina. Esta sección se
            encuentra en construcción, pronto podrás gestionar informacion
            general aquí.
          </div>
        </div>
      </div>
    </>
  );
};
