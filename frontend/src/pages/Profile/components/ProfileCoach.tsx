import { NavHeader, Image, Spinner } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { type pageParamProps } from "../../../interfaces";
import { useEffect } from "react";
import { findUserById } from "../../../store/usersThunks";
import type { AppDispatch, RootState } from "../../../store";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const ProfileCoach = ({ name }: pageParamProps) => {
  const coachStats = {
    groups: 5,
    athletes: 42,
    championships: 3,
    yearsExperience: 8,
    certifications: [
      "Entrenador Nacional",
      "Primeros Auxilios",
      "Preparador Físico",
    ],
  };

  const recentSessions = [
    { date: "2025-09-16", group: "Juvenil A", topic: "Técnica de carrera" },
    { date: "2025-09-14", group: "Infantil B", topic: "Resistencia" },
    {
      date: "2025-09-12",
      group: "Juvenil A",
      topic: "Entrenamiento de fuerza",
    },
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
              <h4 className="text-muted">Entrenador</h4>
              <small className="d-block mt-3 text-muted">
                {user?.bio ||
                  "Entrenador con experiencia en formación de atletas y gestión de grupos."}
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
                      Grupos a cargo: <strong>{coachStats.groups}</strong>
                    </li>
                    <li className="list-group-item">
                      Atletas entrenados: <strong>{coachStats.athletes}</strong>
                    </li>
                    <li className="list-group-item">
                      Campeonatos dirigidos:{" "}
                      <strong>{coachStats.championships}</strong>
                    </li>
                    <li className="list-group-item">
                      Años de experiencia:{" "}
                      <strong>{coachStats.yearsExperience}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="ibox mt-3">
                <div className="ibox-title">
                  <h5>Certificaciones</h5>
                </div>
                <div className="ibox-content">
                  <ul className="list-group list-group-flush">
                    {coachStats.certifications.map((cert, idx) => (
                      <li key={idx} className="list-group-item">
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Sesiones Recientes</h5>
                </div>
                <div className="ibox-content">
                  <ul className="list-group list-group-flush">
                    {recentSessions.map((session, idx) => (
                      <li key={idx} className="list-group-item">
                        <span className="badge badge-light mr-2">
                          {session.date}
                        </span>
                        <strong>{session.group}</strong>: {session.topic}
                      </li>
                    ))}
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
          </div>
        </div>
      )}
    </>
  );
};
