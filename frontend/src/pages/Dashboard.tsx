import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const Dashboard = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Verificar si el admin tiene assignments
  const hasAssignments =
    user?.role === "admin"
      ? Array.isArray((user as any)?.assignments) &&
        (user as any).assignments.length > 0
      : true; // Superadmin y otros roles siempre tienen acceso

  // Si es admin sin assignments, mostrar mensaje especial
  if (user?.role === "admin" && !hasAssignments) {
    return (
      <>
        <NavHeader name={name} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-warning">⚠️ Sin Asignación</h3>
            <div className="error-desc">
              <p>
                Aún no has sido asignado a ningún módulo. Por favor, ponte en
                contacto con el superadministrador para que te asigne a los
                módulos correspondientes.
              </p>
              <p className="text-muted m-t-md">
                Una vez que seas asignado, tendrás acceso a la sección de
                Usuarios y otras funcionalidades.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

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
