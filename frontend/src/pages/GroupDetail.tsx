/**
 * Página de Detalle de Grupo
 *
 * Muestra la información detallada de un grupo específico:
 * - Información general del grupo
 * - Lista de miembros (coaches y atletas)
 * - Horarios del grupo
 * - Eventos y actividades
 *
 * Ruta: /clubs/:club_id/groups/:group_id/group
 */

import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState, AppDispatch } from "../store/store";
import { fetchGroupsByClub } from "../store/groupsThunk";
import { NavHeader } from "../components";
import groupsService from "../services/groups.service";
import eventsService from "../services/eventsService";
import toastr from "toastr";

interface GroupDetail {
  _id: string;
  name: string;
  sport_id?: string;
  location?: string;
  coaches?: any[];
  athletes?: any[];
  athletes_added?: any[];
  schedules?: any[];
  [key: string]: any;
}

interface EventDetail {
  _id: string;
  name: string;
  date?: string;
  time?: string;
  [key: string]: any;
}

export const GroupDetail = () => {
  const { club_id, group_id } = useParams<{
    club_id: string;
    group_id: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: groups } = useSelector((state: RootState) => state.groups);

  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar grupos del club si no está en el estado
        if (club_id && (!groups || groups.length === 0)) {
          dispatch(fetchGroupsByClub(club_id));
        }

        // Obtener detalles del grupo específico
        if (group_id) {
          const groupData = await groupsService.getById(group_id);
          setGroupDetail(groupData);

          // Obtener eventos del grupo
          try {
            const eventsData = await eventsService.getByGroup(group_id);
            setEvents(eventsData || []);
          } catch (e) {
            // Si no hay eventos, simplemente continuamos
            setEvents([]);
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error al cargar el grupo";
        setError(errorMsg);
        toastr.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [group_id, club_id, dispatch, groups]);

  const handleBack = () => {
    navigate(`/clubs/${club_id}/groups`);
  };

  if (loading) {
    return (
      <>
        <NavHeader name="Detalles del Grupo" />
        <div className="wrapper wrapper-content">
          <div className="text-center">
            <p>Cargando información del grupo...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !groupDetail) {
    return (
      <>
        <NavHeader name="Detalles del Grupo" />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-danger">Error</h3>
            <div className="error-desc">
              <p>{error || "No se pudo cargar el grupo"}</p>
              <button className="btn btn-xs btn-primary" onClick={handleBack}>
                <i className="fa fa-arrow-left"></i> Volver a Grupos
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getCoachCount = () => {
    const coachIds = new Set<string>();
    if (Array.isArray(groupDetail?.coaches)) {
      for (const c of groupDetail.coaches) {
        if (!c) continue;
        if (typeof c === "string") coachIds.add(c);
        else if (c._id) coachIds.add(String(c._id));
      }
    }
    return coachIds.size;
  };

  const getAthleteCount = () => {
    const athleteIds = new Set<string>();
    if (Array.isArray(groupDetail?.athletes)) {
      for (const a of groupDetail.athletes) if (a) athleteIds.add(String(a));
    }
    if (Array.isArray(groupDetail?.athletes_added)) {
      for (const entry of groupDetail.athletes_added) {
        const idField = entry?.athlete_id;
        const id = typeof idField === "string" ? idField : idField?._id;
        if (id) athleteIds.add(String(id));
      }
    }
    return athleteIds.size;
  };

  return (
    <>
      <NavHeader name={`Grupo: ${groupDetail.name}`} />
      <div className="wrapper wrapper-content">
        <button
          className="btn btn-xs btn-default"
          onClick={handleBack}
          style={{ marginBottom: "15px" }}
        >
          <i className="fa fa-arrow-left"></i> Volver a Grupos
        </button>

        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>{groupDetail.name}</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-6">
                    <dl className="dl-horizontal">
                      <dt>Ubicación:</dt>
                      <dd>{groupDetail.location || "-"}</dd>

                      <dt>Entrenadores:</dt>
                      <dd>{getCoachCount()}</dd>

                      <dt>Deportistas:</dt>
                      <dd>{getAthleteCount()}</dd>
                    </dl>
                  </div>
                  <div className="col-sm-6">
                    {groupDetail.schedules &&
                      Array.isArray(groupDetail.schedules) && (
                        <>
                          <h5>Horarios</h5>
                          {groupDetail.schedules.length === 0 ? (
                            <p className="text-muted">
                              No hay horarios asignados
                            </p>
                          ) : (
                            <ul>
                              {groupDetail.schedules.map(
                                (schedule: any, idx: number) => (
                                  <li key={idx}>
                                    {schedule.day} - {schedule.start_time} a{" "}
                                    {schedule.end_time}
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Eventos */}
            {events && events.length > 0 && (
              <div className="ibox" style={{ marginTop: "15px" }}>
                <div className="ibox-title">
                  <h5>Eventos y Actividades</h5>
                </div>
                <div className="ibox-content">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event._id}>
                            <td>{event.name}</td>
                            <td>{event.date || "-"}</td>
                            <td>{event.time || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
