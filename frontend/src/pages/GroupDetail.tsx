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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toastr from "toastr";
import { NavHeader } from "../components";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchGroupSummary,
  removeAthleteFromGroup,
  addCoachToGroup,
  removeCoachFromGroup,
  addAthleteToGroup,
} from "../store/groupsThunk";
import { AddMemberModal } from "../components/modals";
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

  const handleAddCoach = async () => {
    addMemberModal.openModal(id_subgrupo!, "coach");
  };

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
                      <button
                        className="btn btn-success"
                        onClick={handleAddCoach}
                        title="Agregar entrenador"
                      >
                        <i className="fa fa-plus"></i>
                      </button>
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
        {(group?.events_added || []).length > 0 && (
          <div className="row m-t-md">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>
                    <i className="fa fa-calendar"></i> Proximos eventos
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
      </div>
    </>
  );
};
