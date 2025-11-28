import { NavHeader, Image, Spinner } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Role, type pageParamProps } from "../../../interfaces";
import { useEffect } from "react";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const ProfileAthlete = ({ name }: pageParamProps) => {
  const activityHistory = [
    {
      date: "2025-08-10",
      type: "Competencia",
      description: "Torneo regional de atletismo",
      result: "2º puesto",
    },
    {
      date: "2025-07-22",
      type: "Entrenamiento",
      description: "Entrenamiento de velocidad",
      result: "Mejora de marca personal",
    },
    {
      date: "2025-06-15",
      type: "Competencia",
      description: "Copa municipal",
      result: "Participación",
    },
  ];

  const gallery = [
    { src: "/public/assets/athlete1.jpg", alt: "Entrenamiento 1" },
    { src: "/public/assets/athlete2.jpg", alt: "Competencia 1" },
    { src: "/public/assets/athlete3.jpg", alt: "Premiación" },
  ];
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
                {(user as any)?.images?.small || user.image ? (
                  <Image
                    src={(user as any)?.images?.small || user.image}
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
              <h4 className="text-muted">{Role[user.role]}</h4>
              <div className="mt-2">
                <span className="badge badge-primary px-3 py-2">
                  {user?.sport || "Sin deporte"}
                </span>
                <span className="badge badge-info px-3 py-2 ml-2">
                  {user?.club || "Sin club"}
                </span>
              </div>
              <small className="d-block mt-3 text-muted">
                {user?.bio ||
                  "Aquí tiene que ir un poco de la historia del usuario"}
              </small>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Estadísticas</h5>
                </div>
                <div className="ibox-content">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Grupos: <strong>{user?.groups?.length || 0}</strong>
                    </li>
                    <li className="list-group-item">
                      Entrenadores:{" "}
                      <strong>{user?.coaches?.length || 0}</strong>
                    </li>
                    <li className="list-group-item">
                      Compañeros: <strong>{user?.athletes?.length || 0}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="ibox mt-3">
                <div className="ibox-title">
                  <h5>Contacto</h5>
                </div>
                <div className="ibox-content">
                  {/* Email removed from UI */}
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
                  <h5>Logros</h5>
                </div>
                <div className="ibox-content">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Medallas de oro: <strong>{user?.goldMedals || 0}</strong>
                    </li>
                    <li className="list-group-item">
                      Medallas de plata:{" "}
                      <strong>{user?.silverMedals || 0}</strong>
                    </li>
                    <li className="list-group-item">
                      Medallas de bronce:{" "}
                      <strong>{user?.bronzeMedals || 0}</strong>
                    </li>
                    <li className="list-group-item">
                      Campeonatos: <strong>{user?.championships || 0}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="ibox mt-3">
                <div className="ibox-title">
                  <h5>Tiempo inscrito</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="no-margins">
                    {user?.membershipDuration || "Sin datos"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* Historial de actividades y galería */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Historial de Actividades</h5>
                </div>
                <div className="ibox-content">
                  <ul className="timeline">
                    {activityHistory.map((activity, idx) => (
                      <li key={idx} className="timeline-item mb-2">
                        <span className="timeline-date badge badge-light mr-2">
                          {activity.date}
                        </span>
                        <span className="timeline-type badge badge-info mx-2">
                          {activity.type}
                        </span>
                        <span className="timeline-desc">
                          {activity.description}
                        </span>
                        <span className="timeline-result text-success ml-2">
                          {activity.result}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Galería</h5>
                </div>
                <div className="ibox-content d-flex flex-wrap">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="m-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
