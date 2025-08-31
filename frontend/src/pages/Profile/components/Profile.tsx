import {
  NavHeader,
  Image,
  LoadingIndicator,
  ErrorMessage,
} from "../../../components";
import { Role, type pageParamProps } from "../../../interfaces";
import { useProfile } from "../hooks";

export const Profile = ({ name }: pageParamProps) => {
  const { user, loading, error } = useProfile();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row m-b-lg m-t-lg">
          <div className="col-md-6">
            <div className="profile-image">
              {user.image ? (
                <Image
                  src={user.image}
                  className="rounded-circle circle-border m-b-md"
                  alt="profile"
                />
              ) : (
                "Sin Imagen"
              )}
            </div>
            <div className="profile-info">
              <div className="">
                <div>
                  <h2 className="no-margins">
                    {user.name} {user.lastname}
                  </h2>
                  <h4>{Role[user.role]}</h4>
                  <small>
                    aqui tiene que ir un poco de la historia del usuario
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <table className="table small m-b-xs">
              <tbody>
                <tr>
                  <td>
                    <strong>0</strong> Medallas de oro
                  </td>
                  <td>
                    <strong>2</strong> Campeonatos
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>0</strong> Medallas de plata
                  </td>
                  <td>
                    <strong>3</strong> Disciplinas
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>0</strong> Medallas de bronce
                  </td>
                  <td>
                    <strong>2</strong> nivel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-3">
            <small>Tiempo inscrita/o</small>
            <h2 className="no-margins">3 Meses</h2>
            <div id="sparkline1"></div>
          </div>
        </div>
      </div>
    </>
  );
};
