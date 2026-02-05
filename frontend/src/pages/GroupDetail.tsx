/**
 * Página de Detalle de Grupo
 *
 * Vista independiente para mostrar detalles de un subgrupo
 * - Información general del grupo
 * - Miembros (coaches y atletas)
 * - Horarios
 * - Eventos
 *
 * Ruta: /clubs/:club_id/groups/:id_subgrupo/group
 */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, NavHeader } from "../components";
import type { RootState, AppDispatch } from "../store/store";
import { fetchGroupSummary } from "../store/groupsThunk";

// Group and Event shape are dynamic; using `any` in UI layer for flexibility

export const GroupDetail = () => {
  const { club_id, id_subgrupo } = useParams<{
    club_id: string;
    id_subgrupo: string;
  }>();

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedGroup: group,
    status,
    error,
  } = useSelector((s: RootState) => s.groups);

  useEffect(() => {
    if (!id_subgrupo) return;
    const fields = [
      "name",
      "location",
      "schedule",
      "events_added",
      "coaches",
      "athletes_added",
    ];
    dispatch(fetchGroupSummary({ id: id_subgrupo, fields }));
  }, [id_subgrupo, dispatch]);

  console.log("GroupDetail render", { group, status, error });

  if (status === "loading") {
    return (
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center" style={{ padding: "40px" }}>
              <div
                className="sk-spinner sk-spinner-pulse"
                style={{ margin: "0 auto" }}
              ></div>
              <p style={{ marginTop: "20px" }}>
                Cargando información del grupo...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavHeader name={group?.name || "Grupo"} />
      <div className="wrapper wrapper-content animated fadeInRight">
        {/* Información General */}
        <div className="row m-t-md">
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">{group?.coaches?.length || 0}</h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-user-tie text-navy"></i> Entrenadores
                </div>
                <small>Asignados al grupo</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">
                  {group?.athletes_added?.length || 0}
                </h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-users text-navy"></i> Atletas
                </div>
                <small>Miembros activos</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">{group?.schedule?.length || 0}</h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-calendar text-navy"></i> Horarios
                </div>
                <small>Sesiones por semana</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">
                  {(group?.events_added || []).length}
                </h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-calendar-check-o text-navy"></i> Eventos
                </div>
                <small>Próximas actividades</small>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="row m-t-md">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>
                  <i className="fa fa-info-circle"></i> Información General
                </h5>
                <div className="ibox-tools">
                  <a className="collapse-link">
                    <i className="fa fa-chevron-up"></i>
                  </a>
                </div>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-6">
                    <dl className="dl-horizontal">
                      <dt>
                        <i className="fa fa-map-marker"></i> Ubicación
                      </dt>
                      <dd>{group?.location || "No especificada"}</dd>
                    </dl>
                  </div>
                  <div className="col-sm-6">
                    <button
                      className="btn btn-sm btn-default float-right"
                      onClick={() => navigate(`/clubs/${club_id}/groups`)}
                    >
                      <i className="fa fa-arrow-left"></i> Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horarios */}
        {group?.schedule &&
          Array.isArray(group.schedule) &&
          group.schedule.length > 0 && (
            <div className="row m-t-md">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-title">
                    <h5>
                      <i className="fa fa-calendar"></i> Horarios de
                      Entrenamiento
                    </h5>
                    <div className="ibox-tools">
                      <a className="collapse-link">
                        <i className="fa fa-chevron-up"></i>
                      </a>
                    </div>
                  </div>
                  <div className="ibox-content">
                    <ul className="list-group">
                      {group!.schedule.map((schedule: any, idx: number) => (
                        <li key={idx} className="list-group-item">
                          <div className="row">
                            <div className="col-md-4">
                              <strong>{schedule.day}</strong>
                            </div>
                            <div className="col-md-8">
                              <i className="fa fa-clock-o text-navy"></i>{" "}
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Entrenadores */}
        {group?.coaches &&
          Array.isArray(group.coaches) &&
          group.coaches.length > 0 && (
            <div className="row m-t-md">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-title">
                    <h5>
                      <i className="fa fa-user-tie"></i> Entrenadores (
                      <span className="label label-primary">
                        {group!.coaches.length}
                      </span>
                      )
                    </h5>
                    <div className="ibox-tools">
                      <a className="collapse-link">
                        <i className="fa fa-chevron-up"></i>
                      </a>
                    </div>
                  </div>
                  <div className="ibox-content">
                    <div className="row">
                      {group!.coaches.map((coach: any, idx: number) => {
                        const coachName =
                          typeof coach === "string"
                            ? coach
                            : coach?.name || coach?.firstName || "Entrenador";
                        const coachEmail =
                          typeof coach === "string" ? "" : coach?.email || "";
                        return (
                          <div className="col-lg-3 col-md-6" key={idx}>
                            <div className="contact-box center-version">
                              <a href="#">
                                {coach.images?.small ? (
                                  <Image
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={coach.images.small}
                                  />
                                ) : (
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(coachName)}`}
                                  />
                                )}
                                <h3 className="m-b-xs">
                                  <strong>{coachName}</strong>
                                </h3>
                                {coachEmail && (
                                  <p className="text-muted small m-b-xs">
                                    {coachEmail}
                                  </p>
                                )}
                              </a>
                              <div className="contact-box-footer">
                                <div className="m-t-xs btn-group">
                                  <a href="#" className="btn btn-xs btn-white">
                                    <i className="fa fa-envelope"></i> Contactar
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Atletas */}
        {(group?.athletes || group?.athletes_added) &&
          group?.athletes_added?.length &&
          group.athletes_added.length > 0 && (
            <div className="row m-t-md">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-title">
                    <h5>
                      <i className="fa fa-users"></i> Atletas (
                      <span className="label label-warning">
                        {group?.athletes_added?.length &&
                          group.athletes_added.length}
                      </span>
                      )
                    </h5>
                    <div className="ibox-tools">
                      <a className="collapse-link">
                        <i className="fa fa-chevron-up"></i>
                      </a>
                    </div>
                  </div>
                  <div className="ibox-content">
                    <div className="row">
                      {Array.isArray(group.athletes) &&
                        group!.athletes.map((athlete: any, idx: number) => {
                          const athleteName =
                            typeof athlete === "string"
                              ? athlete
                              : athlete?.name || athlete?.firstName || "Atleta";
                          const athleteEmail =
                            typeof athlete === "string"
                              ? ""
                              : athlete?.email || "";
                          return (
                            <div className="col-lg-3 col-md-6" key={`a-${idx}`}>
                              <div className="contact-box center-version">
                                <a href="#">
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(athleteName)}`}
                                  />
                                  <h3 className="m-b-xs">
                                    <strong>{athleteName}</strong>
                                  </h3>
                                  {athleteEmail && (
                                    <p className="text-muted small m-b-xs">
                                      {athleteEmail}
                                    </p>
                                  )}
                                </a>
                                <div className="contact-box-footer">
                                  <div className="m-t-xs btn-group">
                                    <a
                                      href="#"
                                      className="btn btn-xs btn-white"
                                    >
                                      <i className="fa fa-envelope"></i>{" "}
                                      Contactar
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {Array.isArray(group.athletes_added) &&
                        group!.athletes_added.map((entry: any, idx: number) => {
                          const athleteName =
                            entry?.athlete_id?.name ||
                            entry?.athlete_id?.firstName ||
                            "Atleta";
                          const athleteEmail = entry?.athlete_id?.email || "";
                          return (
                            <div
                              className="col-lg-3 col-md-6"
                              key={`aa-${idx}`}
                            >
                              <div className="contact-box center-version">
                                <a href="#">
                                  {entry.athlete_id.images?.small ? (
                                    <Image
                                      alt="avatar"
                                      className="rounded-circle"
                                      src={entry.athlete_id.images.small}
                                    />
                                  ) : (
                                    <img
                                      alt="avatar"
                                      className="rounded-circle"
                                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(athleteName)}`}
                                    />
                                  )}

                                  <h3 className="m-b-xs">
                                    <strong>{athleteName}</strong>
                                  </h3>
                                  {athleteEmail && (
                                    <p className="text-muted small m-b-xs">
                                      {athleteEmail}
                                    </p>
                                  )}
                                </a>
                                <div className="contact-box-footer">
                                  <div className="m-t-xs btn-group">
                                    <a
                                      href="#"
                                      className="btn btn-xs btn-white"
                                    >
                                      <i className="fa fa-envelope"></i>{" "}
                                      Contactar
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Eventos */}
        {(group?.events_added || []).length > 0 && (
          <div className="row m-t-md">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>
                    <i className="fa fa-calendar"></i> Eventos (
                    <span className="label label-info">
                      {(group?.events_added || []).length}
                    </span>
                    )
                  </h5>
                  <div className="ibox-tools">
                    <a className="collapse-link">
                      <i className="fa fa-chevron-up"></i>
                    </a>
                  </div>
                </div>
                <div className="ibox-content">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Evento</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Ubicación</th>
                          <th>Duración</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(group!.events_added || []).map((event: any) => (
                          <tr key={event._id}>
                            <td>
                              <strong>{event.name}</strong>
                            </td>
                            <td>
                              <i className="fa fa-calendar-o"></i>{" "}
                              {event.eventDate || "-"}
                            </td>
                            <td>
                              <i className="fa fa-clock-o"></i>{" "}
                              {event.eventTime || "-"}
                            </td>
                            <td>
                              <i className="fa fa-map-marker"></i>{" "}
                              {event.location || "-"}
                            </td>
                            <td>
                              {event.duration ? (
                                <span className="label label-primary">
                                  {event.duration} min
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
