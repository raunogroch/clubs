import { NavHeader, Image, Spinner } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { type pageParamProps } from "../../../interfaces";
import { useEffect } from "react";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const ProfileAdmin = ({ name }: pageParamProps) => {
  const adminStats = {
    clubs: 12,
    users: 120,
    groups: 34,
    reports: 5,
  };

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

  if (error) toastr.error(error);

  return (
    <>
      <NavHeader name={name} />
      {status === "loading" && <Spinner />}
      {status === "succeeded" && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row m-b-lg m-t-lg">
            <div className="col-md-4 text-center">
              <div className="profile-image mb-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    className="rounded-circle circle-border m-b-md"
                    alt="profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                    style={{ width: "120px", height: "120px" }}
                  >
                    Sin Imagen
                  </div>
                )}
              </div>
              <h2 className="no-margins">
                {user?.name} {user?.lastname}
              </h2>
              <h4 className="text-muted">Administrador</h4>
              <small className="d-block mt-3 text-muted">
                {user?.bio ||
                  "Administrador de la plataforma. Gestiona clubes, usuarios y reportes."}
              </small>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Estadísticas de Gestión</h5>
                </div>
                <div className="ibox-content">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Clubes gestionados: <strong>{adminStats.clubs}</strong>
                    </li>
                    <li className="list-group-item">
                      Usuarios gestionados: <strong>{adminStats.users}</strong>
                    </li>
                    <li className="list-group-item">
                      Grupos gestionados: <strong>{adminStats.groups}</strong>
                    </li>
                    <li className="list-group-item">
                      Reportes: <strong>{adminStats.reports}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="ibox mt-3">
                <div className="ibox-title">
                  <h5>Contacto</h5>
                </div>
                <div className="ibox-content">
                  <p>
                    <i className="fa fa-envelope"></i>{" "}
                    {user?.email || "Sin email"}
                  </p>
                  <p>
                    <i className="fa fa-phone"></i>{" "}
                    {user?.phone || "Sin teléfono"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Actividad Reciente</h5>
                </div>
                <div className="ibox-content">
                  <ul className="list-group list-group-flush">
                    {[
                      {
                        date: "2025-09-15",
                        action: 'Creó el club "Atletas Elite"',
                      },
                      {
                        date: "2025-09-10",
                        action: 'Eliminó el usuario "Juan Pérez"',
                      },
                      {
                        date: "2025-09-08",
                        action: 'Actualizó los datos del club "Fuerza Joven"',
                      },
                      {
                        date: "2025-09-01",
                        action: "Generó reporte mensual de actividad",
                      },
                    ].map((log, idx) => (
                      <li key={idx} className="list-group-item">
                        <span className="badge badge-light mr-2">
                          {log.date}
                        </span>
                        {log.action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
