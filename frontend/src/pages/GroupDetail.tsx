import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toastr from "toastr";
import { Button, NavHeader } from "../components";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchGroupSummary,
  removeAthleteFromGroup,
  addCoachToGroup,
  removeCoachFromGroup,
  addAthleteToGroup,
} from "../store/groupsThunk";
import { AddMemberModal, RescheduleEventModal } from "../components/modals";
import { useAddMemberModal, useScheduleModal } from "../features/groups/hooks";
import {
  MemberList,
  EditScheduleModal,
  CreateEventModal,
} from "../features/groups/components";
import userService from "../services/userService";
import eventsService from "../services/eventsService";
import {
  addScheduleToGroup,
  removeScheduleFromGroup,
} from "../store/groupsThunk";
import { updateEventInSelectedGroup } from "../store/groupsSlice";

// Group and Event shape are dynamic; using `any` in UI layer for flexibility

export const GroupDetail = () => {
  const { club_id, id_subgrupo } = useParams<{
    club_id: string;
    id_subgrupo: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedGroup: group,
    status,
    error,
  } = useSelector((s: RootState) => s.groups);

  const isLoading = status === "loading";

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

  /**
   * Maneja la eliminación de un atleta del grupo
   */
  const handleRemoveAthlete = async (athleteId: string, registration: any) => {
    // Verificar si el atleta tiene matrícula pagada
    if (
      registration?.registration_pay !== null &&
      registration?.registration_pay !== undefined
    ) {
      toastr.error(
        "No se puede remover un atleta con matrícula pagada. Contacta al administrador.",
      );
      return;
    }

    if (
      !window.confirm("¿Estás seguro de que deseas remover este deportista?")
    ) {
      return;
    }

    await dispatch(
      removeAthleteFromGroup({ groupId: id_subgrupo!, athleteId }),
    );
  };

  const handleRemoveCoach = async (coachId: string) => {
    if (
      !window.confirm("¿Estás seguro de que deseas remover este entrenador?")
    ) {
      return;
    }

    await dispatch(removeCoachFromGroup({ groupId: id_subgrupo!, coachId }));
  };

  const addMemberModal = useAddMemberModal();

  const handleSearchMember = async () => {
    if (!addMemberModal.searchCi.trim()) {
      toastr.warning("CI es requerido");
      return;
    }

    if (!addMemberModal.memberType) {
      toastr.warning("Tipo de miembro no especificado");
      return;
    }

    try {
      addMemberModal.setSearchLoading(true);
      addMemberModal.setShowCreateUserForm(false);

      const response = await userService.findUserByCiAndRole(
        addMemberModal.searchCi,
        addMemberModal.memberType,
      );

      if (response.code === 200 && response.data) {
        // Verificar si ya está en el grupo
        const currentGroup = group;
        if (currentGroup) {
          if (
            addMemberModal.memberType === "coach" &&
            currentGroup.coaches?.includes(response.data._id)
          ) {
            toastr.warning("Este entrenador ya está registrado en el grupo");
            addMemberModal.setShowCreateUserForm(false);
            addMemberModal.setSearchResult(null);
            return;
          }

          if (addMemberModal.memberType === "athlete") {
            const isAthleteInGroup = (currentGroup as any).athletes_added?.some(
              (reg: any) =>
                (reg.athlete_id?._id || reg.athlete_id) === response.data._id,
            );
            if (isAthleteInGroup) {
              toastr.warning("Este deportista ya está registrado en el grupo");
              addMemberModal.setShowCreateUserForm(false);
              addMemberModal.setSearchResult(null);
              return;
            }
          }
        }

        addMemberModal.setSearchResult(response.data);
      } else {
        // No encontrado -> mostrar formulario de creación
        toastr.info("Usuario no encontrado");
        addMemberModal.setShowCreateUserForm(true);
        addMemberModal.updateCreateUserData("ci", addMemberModal.searchCi);
      }
    } catch (error: any) {
      console.error("Error al buscar usuario:", error);
      addMemberModal.setShowCreateUserForm(true);
      addMemberModal.updateCreateUserData("ci", addMemberModal.searchCi);
    } finally {
      addMemberModal.setSearchLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!addMemberModal.selectedGroupId || !addMemberModal.searchResult) {
      toastr.warning("Usuario no seleccionado");
      return;
    }

    if (addMemberModal.memberType === "coach") {
      await dispatch(
        addCoachToGroup({
          groupId: addMemberModal.selectedGroupId,
          coachId: addMemberModal.searchResult._id,
        }),
      );
    } else if (addMemberModal.memberType === "athlete") {
      await dispatch(
        addAthleteToGroup({
          groupId: addMemberModal.selectedGroupId,
          athleteId: addMemberModal.searchResult._id,
        }),
      );
    }

    // actualizar vista local mínima y cerrar modal
    toastr.success("Miembro agregado");
    addMemberModal.closeModal();
  };

  const handleCreateUser = async () => {
    const { name, lastname, ci } = addMemberModal.createUserData;
    if (!name.trim() || !lastname.trim() || !ci.trim()) {
      toastr.warning("Completa los datos requeridos");
      return;
    }

    try {
      addMemberModal.setSearchLoading(true);
      const newUser = await userService.createAthlete({
        name,
        lastname,
        ci,
        role: addMemberModal.memberType,
      });

      if (newUser.code === 201 || newUser.code === 200) {
        addMemberModal.setSearchResult(newUser.data);
        addMemberModal.setShowCreateUserForm(false);
        toastr.success("Usuario creado");
      } else {
        toastr.error("Error al crear el usuario");
      }
    } catch (error: any) {
      console.error(error);
      toastr.error("Error al crear usuario");
    } finally {
      addMemberModal.setSearchLoading(false);
    }
  };

  // schedule & events helpers
  const scheduleModal = useScheduleModal();
  const [showEventModal, setShowEventModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    event: null as any,
    loading: false,
  });

  const handleCreateEvent = async (eventData: any) => {
    if (!id_subgrupo) return;
    try {
      await eventsService.create({ group_id: id_subgrupo, ...eventData });
      const fields = [
        "name",
        "location",
        "schedule",
        "events_added",
        "coaches",
        "athletes_added",
      ];
      await dispatch(fetchGroupSummary({ id: id_subgrupo, fields }));
      toastr.success("Evento creado exitosamente");
    } catch (err) {
      console.error(err);
      toastr.error("Error al crear evento");
    } finally {
      setShowEventModal(false);
    }
  };

  const handleOpenRescheduleModal = (event: any) => {
    setRescheduleModal({
      isOpen: true,
      event,
      loading: false,
    });
  };

  const handleCloseRescheduleModal = () => {
    setRescheduleModal({
      isOpen: false,
      event: null,
      loading: false,
    });
  };

  const handleSaveReschedule = async (eventDate: string, eventTime: string) => {
    if (!id_subgrupo || !rescheduleModal.event) return;

    const eventId = rescheduleModal.event._id;
    const prevEvent = (group?.events_added || []).find(
      (e: any) => e._id === eventId,
    );
    const prevState = prevEvent
      ? { eventDate: prevEvent.eventDate, eventTime: prevEvent.eventTime }
      : { eventDate: "", eventTime: "" };

    // Optimistic update
    dispatch(
      updateEventInSelectedGroup({
        eventId,
        changes: {
          eventDate,
          eventTime,
          rescheduled: true,
        },
      }),
    );

    setRescheduleModal((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const updated = await eventsService.update(eventId, {
        eventDate,
        eventTime,
        rescheduled: true,
      });

      dispatch(
        updateEventInSelectedGroup({
          eventId,
          changes: {
            eventDate: updated.eventDate,
            eventTime: updated.eventTime,
            rescheduled: updated.rescheduled,
            updatedAt: updated.updatedAt,
          },
        }),
      );

      toastr.success("Evento reprogramado exitosamente");
      handleCloseRescheduleModal();
    } catch (err) {
      console.error(err);
      // revert optimistic update
      dispatch(
        updateEventInSelectedGroup({
          eventId,
          changes: prevState,
        }),
      );
      toastr.error("Error al reprogramar el evento");
      setRescheduleModal((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleSuspendEvent = async (eventId: string) => {
    if (!id_subgrupo) return;

    if (!window.confirm("¿Estás seguro de que deseas suspender este evento?")) {
      return;
    }

    // Optimistic update: store previous state, update UI first
    const prevEvent = (group?.events_added || []).find(
      (e: any) => e._id === eventId,
    );
    const prevState = prevEvent
      ? { suspended: prevEvent.suspended }
      : { suspended: false };

    dispatch(
      updateEventInSelectedGroup({ eventId, changes: { suspended: true } }),
    );

    try {
      const updated = await eventsService.update(eventId, { suspended: true });
      // ensure updatedAt from server is reflected
      dispatch(
        updateEventInSelectedGroup({
          eventId,
          changes: { updatedAt: updated.updatedAt },
        }),
      );
      toastr.success("Evento suspendido");
    } catch (err) {
      console.error(err);
      // revert optimistic update
      dispatch(
        updateEventInSelectedGroup({
          eventId,
          changes: { suspended: prevState.suspended },
        }),
      );
      toastr.error("Error al suspender el evento");
    }
  };

  const handleReactivateEvent = async (eventId: string) => {
    if (!id_subgrupo) return;

    if (!window.confirm("¿Deseas reactivar este evento?")) {
      return;
    }

    // Optimistic update
    const prevEvent = (group?.events_added || []).find(
      (e: any) => e._id === eventId,
    );
    const prevState = prevEvent
      ? { suspended: prevEvent.suspended }
      : { suspended: false };

    dispatch(
      updateEventInSelectedGroup({ eventId, changes: { suspended: false } }),
    );

    try {
      const updated = await eventsService.update(eventId, { suspended: false });
      dispatch(
        updateEventInSelectedGroup({
          eventId,
          changes: { updatedAt: updated.updatedAt },
        }),
      );
      toastr.success("Evento reactivado");
    } catch (err) {
      console.error(err);
      // revert
      dispatch(
        updateEventInSelectedGroup({
          eventId,
          changes: { suspended: prevState.suspended },
        }),
      );
      toastr.error("Error al reactivar el evento");
    }
  };

  const handleSaveSchedules = async () => {
    if (
      !scheduleModal.editingGroupId ||
      scheduleModal.editingSchedules.length === 0
    ) {
      toastr.warning("Debe haber al menos un horario");
      return;
    }

    const currentGroup = group;
    const currentSchedules = currentGroup?.schedule || [];

    for (let i = 0; i < currentSchedules.length; i++) {
      await dispatch(
        removeScheduleFromGroup({
          groupId: scheduleModal.editingGroupId!,
          scheduleIndex: 0,
        }),
      );
    }

    for (const schedule of scheduleModal.editingSchedules) {
      await dispatch(
        addScheduleToGroup({
          groupId: scheduleModal.editingGroupId!,
          schedule: {
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        }),
      );
    }

    toastr.success("Horarios guardados");
    scheduleModal.closeModal();
  };

  /**
   * Calcula la hora de fin basada en la hora de inicio y la duración
   */
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  /**
   * Agrupa horarios por hora y genera un formato de visualización compacto
   */
  const getGroupedSchedules = () => {
    const schedules = group?.schedule || [];
    if (schedules.length === 0) return [];

    const grouped = schedules.reduce(
      (acc: any, schedule: any) => {
        const key = `${schedule.startTime}-${schedule.endTime}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(schedule.day);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const dayOrder: Record<string, number> = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };

    const dayNameMap: Record<string, string> = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };

    return Object.entries(grouped).map(([time, days]) => {
      const sortedDays = (days as string[]).sort(
        (a, b) => (dayOrder[a] || 0) - (dayOrder[b] || 0),
      );
      const [startTime, endTime] = time.split("-");

      let displayDays = "";
      if (sortedDays.length === 1) {
        displayDays = dayNameMap[sortedDays[0]] || sortedDays[0];
      } else if (sortedDays.length <= 3) {
        displayDays = sortedDays.map((d) => dayNameMap[d] || d).join(", ");
      } else {
        displayDays = `${dayNameMap[sortedDays[0]] || sortedDays[0]} - ${dayNameMap[sortedDays[sortedDays.length - 1]] || sortedDays[sortedDays.length - 1]}`;
      }

      return {
        days: displayDays,
        startTime,
        endTime,
      };
    });
  };

  console.log("GroupDetail render", { group, status, error });

  // Build member details map and registration info for MemberList
  const memberDetails: Record<string, any> = {};
  const registrationInfo: Record<string, { registration_pay: any }> = {};

  if (group) {
    // coaches
    (group.coaches || []).forEach((c: any) => {
      const id = c?._id || c;
      memberDetails[id] = {
        name: c?.name || "",
        lastname: c?.lastname || "",
        role: c?.role || "coach",
        ci: c?.ci || "",
      };
    });

    // athletes
    (group.athletes_added || []).forEach((reg: any) => {
      const athlete = reg?.athlete_id;
      const id = athlete?._id || reg?.athlete_id;
      if (id) {
        memberDetails[id] = {
          name: athlete?.name || "",
          lastname: athlete?.lastname || "",
          role: athlete?.role || "athlete",
          ci: athlete?.ci || "",
        };
        registrationInfo[id] = {
          registration_pay: reg?.registration_pay || null,
        };
      }
    });
  }

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
      <NavHeader
        name={group?.name || "Grupo"}
        button={{
          label: "Volver",
          icon: "fa-arrow-left",
          url: `/clubs/${club_id}/groups`,
        }}
      />
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
                  {(group?.athletes_added || []).filter(
                    (entry: any) =>
                      entry?.registration_pay !== null &&
                      entry?.registration_pay !== undefined,
                  ).length || 0}
                </h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-users text-navy"></i> Atletas Pagados
                </div>
                <small>Matrícula confirmada</small>
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
                      <Button
                        className="btn btn-xs btn-success"
                        icon="fa-plus"
                        onClick={() =>
                          scheduleModal.openModal(
                            id_subgrupo!,
                            group?.schedule || [],
                          )
                        }
                      >
                        {(group?.schedule?.length || 0) > 0
                          ? "Actualizar horarios"
                          : "Asignar horarios"}
                      </Button>
                      <a className="collapse-link">
                        <i className="fa fa-chevron-up"></i>
                      </a>
                    </div>
                  </div>
                  <div className="ibox-content">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {getGroupedSchedules().map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <i
                            className="fa fa-calendar-o text-navy"
                            style={{ marginRight: "12px", fontSize: "16px" }}
                          ></i>
                          <span style={{ flex: 1 }}>
                            <strong>{item.days}</strong>
                          </span>
                          <span
                            style={{
                              marginLeft: "12px",
                              color: "#666",
                              fontWeight: "500",
                            }}
                          >
                            <i
                              className="fa fa-clock-o"
                              style={{ marginRight: "6px" }}
                            ></i>
                            {item.startTime} a {item.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="row m-t-md">
          <MemberList
            title="Entrenadores"
            type="coach"
            icon="fa-users"
            members={group?.coaches || []}
            memberDetails={memberDetails}
            memberCount={group?.coaches?.length || 0}
            onAddMember={() => addMemberModal.openModal(id_subgrupo!, "coach")}
            onRemoveMember={(memberId: string) => handleRemoveCoach(memberId)}
            isLoading={isLoading}
            rowClassName="col-lg-5"
          />

          <MemberList
            type="athlete"
            title="Atletas"
            icon="fa-users"
            members={(group?.athletes_added || []).map(
              (r: any) => r?.athlete_id?._id || r?.athlete_id,
            )}
            memberDetails={memberDetails}
            memberCount={(group?.athletes_added || []).length}
            onAddMember={() =>
              addMemberModal.openModal(id_subgrupo!, "athlete")
            }
            onRemoveMember={(memberId: string) => {
              // find registration entry
              const entry = (group?.athletes_added || []).find(
                (reg: any) =>
                  (reg?.athlete_id?._id || reg?.athlete_id) === memberId,
              );
              handleRemoveAthlete(memberId, entry);
            }}
            isLoading={isLoading}
            rowClassName="col-lg-7"
            registrationInfo={registrationInfo}
          />
        </div>
        {/* Eventos */}
        <div className="row m-t-md">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>
                  <i className="fa fa-calendar"></i> Proximos eventos
                </h5>
                <div className="ibox-tools">
                  <Button
                    className="btn btn-xs btn-success"
                    icon="fa-plus"
                    onClick={() => setShowEventModal(true)}
                  >
                    Agregar
                  </Button>
                  <a className="collapse-link">
                    <i className="fa fa-chevron-up"></i>
                  </a>
                </div>
              </div>
              <div className="ibox-content">
                {(group?.events_added || []).length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Evento</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Ubicación</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(group!.events_added || []).map((event: any) => (
                          <tr key={event._id}>
                            <td
                              title={event.suspended ? "Reactivar" : undefined}
                              style={{
                                opacity: event.suspended ? 0.6 : 1,
                                textDecoration:
                                  event.suspended && "line-through",
                              }}
                            >
                              {event.rescheduled ? (
                                <span className="text-warning">
                                  ( Reprogramado )
                                </span>
                              ) : null}
                              &nbsp;
                              {event.name}
                            </td>
                            <td
                              title={event.suspended ? "Reactivar" : undefined}
                              style={{
                                opacity: event.suspended ? 0.6 : 1,
                                textDecoration:
                                  event.suspended && "line-through",
                              }}
                            >
                              <i className="fa fa-calendar-o"></i>{" "}
                              {event.eventDate || "-"}
                            </td>
                            <td
                              title={event.suspended ? "Reactivar" : undefined}
                              style={{
                                opacity: event.suspended ? 0.6 : 1,
                                textDecoration:
                                  event.suspended && "line-through",
                              }}
                            >
                              <i className="fa fa-clock-o"></i>{" "}
                              {event.eventTime}
                              {event.duration &&
                                ` - ${calculateEndTime(event.eventTime, event.duration)}`}
                            </td>
                            <td
                              title={event.suspended ? "Reactivar" : undefined}
                              style={{
                                opacity: event.suspended ? 0.6 : 1,
                                textDecoration:
                                  event.suspended && "line-through",
                              }}
                            >
                              <i className="fa fa-map-marker"></i>{" "}
                              {event.location || "-"}
                            </td>
                            <td>
                              <div
                                className="justify-content-center"
                                style={{ display: "flex", gap: "8px" }}
                              >
                                {event.suspended ? (
                                  <Button
                                    className="btn btn-xs btn-success"
                                    icon="fa-play-circle"
                                    onClick={() =>
                                      handleReactivateEvent(event._id)
                                    }
                                  >
                                    Reactivar
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn btn-xs btn-danger"
                                    icon="fa-pause-circle"
                                    onClick={() =>
                                      handleSuspendEvent(event._id)
                                    }
                                  >
                                    Suspender
                                  </Button>
                                )}

                                <Button
                                  className="btn btn-xs btn-warning"
                                  icon="fa-calendar"
                                  disabled={event.suspended}
                                  onClick={() =>
                                    handleOpenRescheduleModal(event)
                                  }
                                >
                                  Reprogramar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className="alert alert-info alert-with-icon"
                    data-notify="container"
                  >
                    <span
                      data-notify="icon"
                      className="fa fa-info-circle"
                    ></span>
                    &nbsp; Sin eventos
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <EditScheduleModal
          isOpen={scheduleModal.showModal}
          schedules={scheduleModal.editingSchedules}
          loading={isLoading}
          onClose={scheduleModal.closeModal}
          onSave={handleSaveSchedules}
          onAddRow={scheduleModal.addScheduleRow}
          onUpdateRow={scheduleModal.updateScheduleRow}
          onRemoveRow={scheduleModal.removeScheduleRow}
        />

        <CreateEventModal
          isOpen={showEventModal}
          groupId={id_subgrupo || ""}
          onClose={() => setShowEventModal(false)}
          onCreate={handleCreateEvent}
          isLoading={isLoading}
        />

        <AddMemberModal
          isOpen={addMemberModal.showModal}
          memberType={addMemberModal.memberType}
          searchCi={addMemberModal.searchCi}
          searchResult={addMemberModal.searchResult}
          showCreateUserForm={addMemberModal.showCreateUserForm}
          createUserData={addMemberModal.createUserData}
          loading={addMemberModal.searchLoading}
          onClose={addMemberModal.closeModal}
          onSearchCiChange={(val: string) => addMemberModal.setSearchCi(val)}
          onSearch={handleSearchMember}
          onAddMember={handleAddMember}
          onCreateUser={handleCreateUser}
          onCreateUserDataChange={addMemberModal.updateCreateUserData}
        />

        <RescheduleEventModal
          isOpen={rescheduleModal.isOpen}
          event={rescheduleModal.event}
          loading={rescheduleModal.loading}
          onClose={handleCloseRescheduleModal}
          onSave={handleSaveReschedule}
        />
      </div>
    </>
  );
};
