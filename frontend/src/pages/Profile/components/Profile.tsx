import { NavHeader, PopUpMessage, Image } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Role, type pageParamProps } from "../../../interfaces";
import { useEffect } from "react";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";

export const Profile = ({ name }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { code } = JSON.parse(localStorage.getItem("user"));
  const {
    selectedUser: user,
    error,
    status,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(findUserById(code));
  }, [dispatch, code]);

  return (
    <>
      <NavHeader name={name} />
      <PopUpMessage />
      {error && <div className="alert alert-danger">{error}</div>}
      {status === "succeeded" && (
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
                      {user?.name} {user?.lastname}
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
      )}
    </>
  );
};
