/**
 * Página Principal de Grupos
 *
 * Contenedor que orquesta toda la lógica de negocio y componentes.
 * Separación clara entre presentación y lógica.
 *
 * Estructura:
 * 1. Imports
 * 2. State Management (hooks)
 * 3. Data Loading (useEffect)
 * 4. Event Handlers (operaciones CRUD)
 * 5. JSX Rendering
 */

import { useState, useEffect } from "react";
import toastr from "toastr";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

// Thunks
import {
  fetchGroupsByClub,
  createGroup,
  updateGroup,
  deleteGroup,
  addCoachToGroup,
  removeCoachFromGroup,
  addAthleteToGroup,
  removeAthleteFromGroup,
  addScheduleToGroup,
  removeScheduleFromGroup,
} from "../../store/groupsThunk";
import { fetchAllClubs } from "../../store/clubsThunk";
import { fetchAllSports } from "../../store/sportsThunk";
import { fetchUsersByRole } from "../../store/usersThunk";

// Servicios
import userService from "../../services/userService";
import eventsService from "../../services/eventsService";

// Tipos
import type { Group, Sport, User, MemberDetail } from "./types";

// Hooks custom
import {
  useGroupForm,
  useGroupExpansion,
  useAddMemberModal,
  useScheduleModal,
} from "./hooks";

// Componentes
import {
  GroupFormModal,
  AddMemberModal,
  EditScheduleModal,
  GroupCard,
  ScheduleList,
  MemberList,
  EventsList,
  CreateEventModal,
} from "./components";

// Estilos y constantes
import { groupsStyles } from "./styles/groups.styles";
import { MESSAGES } from "./constants";
import { buildMemberDetailsMap } from "./utils";

/**
 * Props del componente Groups
 */
interface GroupsProps {
  clubId: string;
  onBack: () => void;
}

/**
 * Componente principal de Grupos
 *
 * Gestiona:
 * - Carga de grupos y datos relacionados
 * - CRUD de grupos
 * - Gestión de miembros (coaches/athletes)
 * - Gestión de horarios
 */
export const Groups = ({ clubId, onBack }: GroupsProps) => {
  // ============================================
  // STATE MANAGEMENT - REDUX
  // ============================================

  const dispatch = useDispatch<AppDispatch>();
  const groupsData = useSelector((state: RootState) => state.groups);
  const groupsStatus = groupsData.status as
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";
  const groups = groupsData.items;
  const { items: clubs } = useSelector((state: RootState) => state.clubs);
  const { items: sports } = useSelector((state: RootState) => state.sports);

  // ============================================
  // STATE MANAGEMENT - LOCAL
  // ============================================

  const [clubName, setClubName] = useState<string>("");
  const [memberDetails, setMemberDetails] = useState<
    Record<string, MemberDetail>
  >({});
  const [athleteRegistrationInfo, setAthleteRegistrationInfo] = useState<
    Record<string, Record<string, { registration_pay: boolean }>>
  >({});

  // Formulario de grupo
  const groupForm = useGroupForm(clubId);

  // Estado de expansión
  const groupExpansion = useGroupExpansion();

  // Modal de agregar miembro
  const addMemberModal = useAddMemberModal();

  // Modal de editar horarios
  const scheduleModal = useScheduleModal();

  // Modal de crear evento
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventGroupId, setEventGroupId] = useState<string | null>(null);
  const [groupEvents, setGroupEvents] = useState<Record<string, any[]>>({});

  // Modal de crear/editar grupo
  const [showGroupModal, setShowGroupModal] = useState(false);

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Carga inicial de datos al montar el componente
   */
  useEffect(() => {
    dispatch(fetchGroupsByClub(clubId));
    dispatch(fetchAllClubs());
    dispatch(fetchAllSports());
    dispatch(fetchUsersByRole("coach"));
    dispatch(fetchUsersByRole("athlete"));
  }, [clubId, dispatch]);

  /**
   * Actualizar nombre del club cuando cambian los datos
   */
  useEffect(() => {
    if (clubs.length > 0) {
      const club = clubs.find((c: any) => c._id === clubId);
      if (club) {
        const sport = (sports as Sport[]).find((s) => s._id === club.sport_id);
        setClubName(sport?.name || `Deporte ID: ${club.sport_id}`);
      }
    }
  }, [clubs, sports, clubId]);

  /**
   * Cargar eventos cuando se expande un grupo - ACTUALIZADO: usar eventos poblados
   */
  useEffect(() => {
    // Los eventos ahora vienen poblados desde el servidor, no necesitamos cargarlos por separado
    if (groupExpansion.expandedGroupId && groups.length > 0) {
      const expandedGroup = groups.find(
        (g: any) => g._id === groupExpansion.expandedGroupId,
      );
      if (expandedGroup && expandedGroup.events_added) {
        setGroupEvents((prev) => ({
          ...prev,
          [groupExpansion.expandedGroupId]: expandedGroup.events_added || [],
        }));
      }
    }
  }, [groupExpansion.expandedGroupId, groups]);

  /**
   * Cargar detalles de miembros cuando cambian los grupos
   */
  useEffect(() => {
    if (groups.length > 0) {
      loadMembersDetails(groups as Group[]);
    }
  }, [groups]);

  /**
   * Carga y cachea los detalles de todos los miembros
   */
  const loadMembersDetails = async (groupsData: Group[]) => {
    try {
      // Intentar extraer detalles desde datos poblados
      const details = buildMemberDetailsMap(groupsData);

      // Construir mapa de información de registro por grupo y atleta
      const regInfo: Record<
        string,
        Record<string, { registration_pay: boolean }>
      > = {};
      groupsData.forEach((group) => {
        regInfo[group._id] = {};
        ((group as any).athletes_added || []).forEach((registration: any) => {
          const athleteId =
            registration.athlete_id?._id || registration.athlete_id;
          if (athleteId) {
            regInfo[group._id][athleteId] = {
              registration_pay: registration.registration_pay || null,
            };
          }
        });
      });
      setAthleteRegistrationInfo(regInfo);

      // Si no hay detalles, hacer llamada a API
      if (Object.keys(details).length === 0) {
        const allMemberIds = Array.from(
          new Set(
            groupsData.flatMap((g) => [
              ...(Array.isArray((g as any).athletes_added)
                ? (g as any).athletes_added
                    .map((a: any) => a.athlete_id?._id || a.athlete_id)
                    .filter(Boolean)
                : []),
              ...(Array.isArray((g as any).athletes)
                ? (g as any).athletes.filter(Boolean)
                : []),
              ...(Array.isArray((g as any).coaches)
                ? (g as any).coaches.filter(Boolean)
                : []),
            ]),
          ),
        );

        if (allMemberIds.length > 0) {
          const response = await userService.getUsersById(allMemberIds);

          if (response.code === 200 && Array.isArray(response.data)) {
            response.data.forEach((user: User) => {
              details[user._id] = {
                name: user.name || "",
                lastname: user.lastname || "",
                role: user.role || "unknown",
                ci: user.ci || "",
              };
            });
          }
        }
      }

      setMemberDetails(details);
    } catch (error: any) {
      console.error("Error al cargar detalles de miembros:", error);
      setMemberDetails({});
    }
  };

  // ============================================
  // OPERACIONES CRUD - GRUPOS
  // ============================================

  /**
   * Crea o actualiza un grupo según el estado
   */
  const handleSaveGroup = async () => {
    if (!groupForm.formData.name.trim()) {
      toastr.warning(MESSAGES.ERROR_GROUP_NAME_REQUIRED);
      return;
    }

    if (groupForm.editingId) {
      // Actualizar grupo existente
      const updateData: any = { name: groupForm.formData.name };
      if (groupForm.formData.monthly_fee !== undefined) {
        updateData.monthly_fee = groupForm.formData.monthly_fee;
      }
      await dispatch(
        updateGroup({
          id: groupForm.editingId,
          group: updateData,
        }),
      );
    } else {
      // Crear nuevo grupo
      await dispatch(createGroup(groupForm.formData));
    }

    setShowGroupModal(false);
    groupForm.resetForm();
  };

  /**
   * Elimina un grupo con confirmación
   */
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm(MESSAGES.CONFIRM_DELETE_GROUP)) {
      return;
    }

    await dispatch(deleteGroup(groupId));
  };

  // ============================================
  // OPERACIONES CRUD - MIEMBROS
  // ============================================

  /**
   * Busca un usuario por CI
   */
  const handleSearchMember = async () => {
    if (!addMemberModal.searchCi.trim()) {
      toastr.warning(MESSAGES.ERROR_CI_REQUIRED);
      return;
    }

    if (!addMemberModal.memberType) {
      toastr.warning(MESSAGES.ERROR_MEMBER_TYPE_REQUIRED);
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
        if (response.data.role === addMemberModal.memberType) {
          // Verificar si el usuario ya está en el grupo
          const currentGroup = groups.find(
            (g) => g._id === addMemberModal.selectedGroupId,
          );
          if (currentGroup) {
            // Verificar en coaches
            if (
              addMemberModal.memberType === "coach" &&
              currentGroup.coaches?.includes(response.data._id)
            ) {
              toastr.warning("Este entrenador ya está registrado en el grupo");
              addMemberModal.setShowCreateUserForm(false);
              addMemberModal.setSearchResult(null);
              return;
            }

            // Verificar en athletes_added
            if (addMemberModal.memberType === "athlete") {
              const isAthleteInGroup = (
                currentGroup as any
              ).athletes_added?.some(
                (reg: any) =>
                  (reg.athlete_id?._id || reg.athlete_id) === response.data._id,
              );
              if (isAthleteInGroup) {
                toastr.warning(
                  "Este deportista ya está registrado en el grupo",
                );
                addMemberModal.setShowCreateUserForm(false);
                addMemberModal.setSearchResult(null);
                return;
              }
            }
          }

          addMemberModal.setSearchResult(response.data);
        } else {
          // Rol no coincide, mostrar opción de crear
          toastr.warning(
            `${MESSAGES.INFO_MEMBER_ROLE_MISMATCH}`
              .replace("{{role}}", response.data.role)
              .replace("{{expectedRole}}", addMemberModal.memberType),
          );
          addMemberModal.setShowCreateUserForm(true);
          addMemberModal.updateCreateUserData("ci", addMemberModal.searchCi);
        }
      } else {
        // Usuario no encontrado
        const type =
          addMemberModal.memberType === "coach" ? "Entrenador" : "Deportista";
        toastr.info(`${type} ${MESSAGES.INFO_MEMBER_NOT_FOUND}`);
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

  /**
   * Agrega un miembro al grupo
   */
  const handleAddMember = async () => {
    if (!addMemberModal.selectedGroupId || !addMemberModal.searchResult) {
      toastr.warning(MESSAGES.ERROR_USER_NOT_SELECTED);
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

    // Actualizar detalles locales
    const newDetails = { ...memberDetails };
    if (addMemberModal.searchResult) {
      newDetails[addMemberModal.searchResult._id] = {
        name: addMemberModal.searchResult.name,
        lastname: addMemberModal.searchResult.lastname,
        role: addMemberModal.searchResult.role,
        ci: addMemberModal.searchResult.ci,
      };
    }
    setMemberDetails(newDetails);

    const type =
      addMemberModal.memberType === "coach" ? "Entrenador" : "Deportista";
    toastr.success(`${type} ${MESSAGES.SUCCESS_MEMBER_ADDED}`);
    addMemberModal.closeModal();
  };

  /**
   * Crea un nuevo usuario (coach o athlete)
   */
  const handleCreateUser = async () => {
    const { name, lastname, ci } = addMemberModal.createUserData;

    if (!name.trim()) {
      toastr.warning(MESSAGES.ERROR_USER_NAME_REQUIRED);
      return;
    }
    if (!lastname.trim()) {
      toastr.warning(MESSAGES.ERROR_USER_LASTNAME_REQUIRED);
      return;
    }
    if (!ci.trim()) {
      toastr.warning("CI es requerido");
      return;
    }

    try {
      addMemberModal.setSearchLoading(true);

      const newUser = await userService.createAthlete({
        name,
        lastname,
        ci,
        role: addMemberModal.memberType,
        // Para athletes: no enviamos username, el backend lo generará
        // Para coaches: tampoco enviamos, lo generará el backend de forma única
      });

      if (newUser.code === 201 || newUser.code === 200) {
        addMemberModal.setSearchResult(newUser.data);
        addMemberModal.setShowCreateUserForm(false);
        const type =
          addMemberModal.memberType === "coach" ? "Entrenador" : "Deportista";
        toastr.success(`${type} ${MESSAGES.SUCCESS_USER_CREATED}`);
      } else {
        toastr.error("Error al crear el usuario");
      }
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      toastr.error(error.message || "Error al crear el usuario");
    } finally {
      addMemberModal.setSearchLoading(false);
    }
  };

  /**
   * Remover entrenador de un grupo
   */
  const handleRemoveCoach = async (groupId: string, coachId: string) => {
    if (
      !window.confirm("¿Estás seguro de que deseas remover este entrenador?")
    ) {
      return;
    }

    await dispatch(removeCoachFromGroup({ groupId, coachId }));
  };

  /**
   * Remover deportista de un grupo
   */
  const handleRemoveAthlete = async (groupId: string, athleteId: string) => {
    if (
      !window.confirm("¿Estás seguro de que deseas remover este deportista?")
    ) {
      return;
    }

    await dispatch(removeAthleteFromGroup({ groupId, athleteId }));
  };

  // ============================================
  // OPERACIONES CRUD - HORARIOS
  // ============================================

  /**
   * Guarda todos los horarios de un grupo
   */
  const handleSaveSchedules = async () => {
    if (
      !scheduleModal.editingGroupId ||
      scheduleModal.editingSchedules.length === 0
    ) {
      toastr.warning(MESSAGES.ERROR_AT_LEAST_ONE_SCHEDULE);
      return;
    }

    const currentGroup = groups.find(
      (g) => g._id === scheduleModal.editingGroupId,
    );
    const currentSchedules = currentGroup?.schedule || [];

    // Remover horarios antiguos
    for (let i = 0; i < currentSchedules.length; i++) {
      await dispatch(
        removeScheduleFromGroup({
          groupId: scheduleModal.editingGroupId,
          scheduleIndex: 0,
        }),
      );
    }

    // Agregar nuevos horarios
    for (const schedule of scheduleModal.editingSchedules) {
      await dispatch(
        addScheduleToGroup({
          groupId: scheduleModal.editingGroupId,
          schedule: {
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        }),
      );
    }

    toastr.success(MESSAGES.SUCCESS_SCHEDULES_SAVED);
    scheduleModal.closeModal();
  };

  /**
   * Elimina un horario de un grupo
   */
  const handleRemoveSchedule = async (groupId: string, index: number) => {
    if (!window.confirm(MESSAGES.CONFIRM_DELETE_SCHEDULE)) {
      return;
    }

    await dispatch(removeScheduleFromGroup({ groupId, scheduleIndex: index }));
  };

  const handleOpenEventModal = (groupId: string) => {
    setEventGroupId(groupId);
    setShowEventModal(true);
  };

  const handleCreateEvent = async (eventData: {
    name: string;
    location: string;
    duration: number;
    eventDate: string;
    eventTime: string;
  }) => {
    if (!eventGroupId) return;

    try {
      const createdEvent = await eventsService.create({
        group_id: eventGroupId,
        ...eventData,
      });

      // Actualizar estado local con el nuevo evento
      setGroupEvents((prev) => ({
        ...prev,
        [eventGroupId]: [...(prev[eventGroupId] || []), createdEvent],
      }));

      // Refrescar los datos del grupo desde el servidor para obtener events_added actualizado
      await dispatch(fetchGroupsByClub(clubId));

      toastr.success("Evento creado exitosamente");
    } catch (error) {
      console.error("Error al crear evento:", error);
      toastr.error("Error al crear el evento");
    }
  };

  const handleDeleteEvent = async (groupId: string, eventId: string) => {
    if (!window.confirm("¿Eliminar este evento?")) {
      return;
    }

    try {
      await eventsService.delete(eventId);

      // Actualizar estado local removiendo el evento
      setGroupEvents((prev) => ({
        ...prev,
        [groupId]: (prev[groupId] || []).filter((e: any) => e._id !== eventId),
      }));

      // Refrescar los datos del grupo desde el servidor
      await dispatch(fetchGroupsByClub(clubId));

      toastr.success("Evento eliminado");
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toastr.error("Error al eliminar el evento");
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <style>{groupsStyles}</style>

      <div className="wrapper wrapper-content groups-wrapper">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Grupos del club de {clubName}</h5>
                <div className="ibox-tools">
                  <button
                    className="btn btn-xs btn-default"
                    onClick={onBack}
                    title="Volver a clubs"
                    disabled={groupsStatus === "loading"}
                  >
                    <i className="fa fa-arrow-left"></i> Volver
                  </button>{" "}
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => {
                      groupForm.openForCreate();
                      setShowGroupModal(true);
                    }}
                    title="Crear nuevo grupo"
                    disabled={groupsStatus === "loading"}
                  >
                    <i className="fa fa-plus"></i> Crear Grupo
                  </button>
                </div>
              </div>

              <div className="ibox-content">
                {groupsStatus === "loading" ? (
                  <div className="text-center">
                    <p>{MESSAGES.STATE_LOADING}</p>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">{MESSAGES.STATE_NO_GROUPS}</p>
                  </div>
                ) : (
                  <div>
                    {groups.map((group) => (
                      <GroupCard
                        key={group._id}
                        group={group as any}
                        clubId={clubId}
                        isExpanded={groupExpansion.isExpanded(group._id)}
                        isLoading={(groupsStatus as string) === "loading"}
                        onToggleExpand={() =>
                          groupExpansion.toggleGroupExpansion(group._id)
                        }
                        onEdit={() => {
                          groupForm.openForEdit(group as any);
                          setShowGroupModal(true);
                        }}
                        onDelete={() => handleDeleteGroup(group._id)}
                      >
                        {/* Contenido expandible del grupo */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <ScheduleList
                              schedules={group.schedule || []}
                              onEdit={() =>
                                scheduleModal.openModal(
                                  group._id,
                                  group.schedule,
                                )
                              }
                              onDeleteSchedule={(idx) =>
                                handleRemoveSchedule(group._id, idx)
                              }
                              isEditing={
                                scheduleModal.editingGroupId === group._id
                              }
                              isLoading={(groupsStatus as any) === "loading"}
                            />
                          </div>
                        </div>

                        {/* Eventos */}
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <EventsList
                              events={groupEvents[group._id] || []}
                              onAdd={() => handleOpenEventModal(group._id)}
                              onDelete={(eventId) =>
                                handleDeleteEvent(group._id, eventId)
                              }
                              isLoading={(groupsStatus as any) === "loading"}
                            />
                          </div>
                        </div>

                        {/* Coaches y Athletes */}
                        <div className="row">
                          <MemberList
                            title="Entrenadores"
                            icon="fa-user-tie"
                            badge="badge-info"
                            members={group.coaches || []}
                            memberDetails={memberDetails}
                            memberCount={group.coaches?.length || 0}
                            onAddMember={() =>
                              addMemberModal.openModal(group._id, "coach")
                            }
                            onRemoveMember={(memberId: string) =>
                              handleRemoveCoach(group._id, memberId)
                            }
                            isLoading={(groupsStatus as any) === "loading"}
                          />

                          <MemberList
                            title="Deportistas"
                            icon="fa-person-running"
                            badge="badge-primary"
                            members={
                              (group as any).athletes_added
                                ? (group as any).athletes_added.map((r: any) =>
                                    r && r.athlete_id
                                      ? r.athlete_id._id || r.athlete_id
                                      : r,
                                  )
                                : []
                            }
                            memberDetails={memberDetails}
                            memberCount={
                              (group as any).athletes_added?.length || 0
                            }
                            registrationInfo={
                              athleteRegistrationInfo[group._id] || {}
                            }
                            onAddMember={() =>
                              addMemberModal.openModal(group._id, "athlete")
                            }
                            onRemoveMember={(memberId: string) =>
                              handleRemoveAthlete(group._id, memberId)
                            }
                            isLoading={(groupsStatus as any) === "loading"}
                          />
                        </div>
                      </GroupCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <GroupFormModal
        isOpen={showGroupModal}
        isEditMode={!!groupForm.editingId}
        formData={groupForm.formData}
        loading={groupsStatus === "loading"}
        onClose={() => {
          setShowGroupModal(false);
          groupForm.resetForm();
        }}
        onSave={handleSaveGroup}
        onFieldChange={(field, value) => groupForm.updateField(field, value)}
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
        onSearchCiChange={addMemberModal.setSearchCi}
        onSearch={handleSearchMember}
        onAddMember={handleAddMember}
        onCreateUser={handleCreateUser}
        onCreateUserDataChange={addMemberModal.updateCreateUserData}
      />

      <EditScheduleModal
        isOpen={scheduleModal.showModal}
        schedules={scheduleModal.editingSchedules}
        loading={groupsStatus === "loading"}
        onClose={scheduleModal.closeModal}
        onSave={handleSaveSchedules}
        onAddRow={scheduleModal.addScheduleRow}
        onUpdateRow={scheduleModal.updateScheduleRow}
        onRemoveRow={scheduleModal.removeScheduleRow}
      />

      <CreateEventModal
        isOpen={showEventModal}
        groupId={eventGroupId || ""}
        onClose={() => {
          setShowEventModal(false);
          setEventGroupId(null);
        }}
        onCreate={handleCreateEvent}
        isLoading={groupsStatus === "loading"}
      />

      {/* Modal de crear/editar grupo */}
      {showGroupModal && (
        <GroupFormModal
          isOpen={showGroupModal}
          isEditMode={groupForm.editingId !== null}
          formData={groupForm.formData}
          loading={groupsStatus === "loading"}
          onClose={() => {
            setShowGroupModal(false);
            groupForm.resetForm();
          }}
          onSave={handleSaveGroup}
          onFieldChange={groupForm.updateField}
        />
      )}
    </>
  );
};

export default Groups;
