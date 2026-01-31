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

// Servicios
import groupsService from "../../services/groups.service";
import clubsService from "../../services/clubs.service";
import { sportService } from "../../services/sportService";
import userService from "../../services/userService";

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
  // STATE MANAGEMENT
  // ============================================

  // Datos principales
  const [groups, setGroups] = useState<Group[]>([]);
  const [clubName, setClubName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [memberDetails, setMemberDetails] = useState<
    Record<string, MemberDetail>
  >({});

  // Formulario de grupo
  const groupForm = useGroupForm(clubId);

  // Estado de expansión
  const groupExpansion = useGroupExpansion();

  // Modal de agregar miembro
  const addMemberModal = useAddMemberModal();

  // Modal de editar horarios
  const scheduleModal = useScheduleModal();

  // Modal de crear/editar grupo
  const [showGroupModal, setShowGroupModal] = useState(false);

  // ============================================
  // EFECTOS
  // ============================================

  /**
   * Carga inicial de datos al montar el componente
   */
  useEffect(() => {
    loadData();
  }, [clubId]);

  // ============================================
  // OPERACIONES DE DATOS
  // ============================================

  /**
   * Carga grupos, información del club y detalles de miembros
   */
  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar datos en paralelo
      const [groupsData, clubData, sportsData] = await Promise.all([
        groupsService.getByClub(clubId),
        clubsService.getById(clubId),
        sportService.getAll(),
      ]);

      setGroups(groupsData);

      // Obtener nombre del deporte
      const sport = sportsData?.find((s: Sport) => s._id === clubData.sport_id);
      setClubName(sport?.name || `Deporte ID: ${clubData.sport_id}`);

      // Cargar detalles de miembros
      await loadMembersDetails(groupsData);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toastr.error(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga y cachea los detalles de todos los miembros
   */
  const loadMembersDetails = async (groupsData: Group[]) => {
    try {
      // Intentar extraer detalles desde datos poblados
      let details = buildMemberDetailsMap(groupsData);

      // Si no hay detalles, hacer llamada a API
      if (Object.keys(details).length === 0) {
        const allMemberIds = Array.from(
          new Set(
            groupsData.flatMap((g) => [
              ...(g.coaches || []),
              // extraer athlete ids desde athletes_added (registration.athlete_id)
              ...((g as any).athletes_added || []).map((r: any) =>
                r && r.athlete_id ? r.athlete_id._id || r.athlete_id : r,
              ),
              ...(g.members || []),
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

    try {
      setLoading(true);

      if (groupForm.editingId) {
        // Actualizar grupo existente
        const updated = await groupsService.update(groupForm.editingId, {
          name: groupForm.formData.name,
          description: groupForm.formData.description,
        });
        setGroups(
          groups.map((g) => (g._id === groupForm.editingId ? updated : g)),
        );
        toastr.success(MESSAGES.SUCCESS_GROUP_UPDATED);
      } else {
        // Crear nuevo grupo
        const created = await groupsService.create(groupForm.formData);
        setGroups([...groups, created]);
        toastr.success(MESSAGES.SUCCESS_GROUP_CREATED);
      }

      setShowGroupModal(false);
      groupForm.resetForm();
    } catch (error: any) {
      console.error("Error al guardar grupo:", error);
      toastr.error(error.message || "Error al guardar el grupo");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un grupo con confirmación
   */
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm(MESSAGES.CONFIRM_DELETE_GROUP)) {
      return;
    }

    try {
      setLoading(true);
      await groupsService.delete(groupId);
      setGroups(groups.filter((g) => g._id !== groupId));
      toastr.success(MESSAGES.SUCCESS_GROUP_DELETED);
    } catch (error: any) {
      console.error("Error al eliminar grupo:", error);
      toastr.error(error.message || "Error al eliminar el grupo");
    } finally {
      setLoading(false);
    }
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

    try {
      addMemberModal.setSearchLoading(true);
      let updatedGroup: Group | undefined;

      if (addMemberModal.memberType === "coach") {
        updatedGroup = await groupsService.addCoach(
          addMemberModal.selectedGroupId,
          addMemberModal.searchResult._id,
        );
      } else if (addMemberModal.memberType === "athlete") {
        updatedGroup = await groupsService.addAthlete(
          addMemberModal.selectedGroupId,
          addMemberModal.searchResult._id,
        );
      }

      if (updatedGroup) {
        setGroups((prev) =>
          prev.map((g) =>
            g._id === addMemberModal.selectedGroupId ? updatedGroup! : g,
          ),
        );

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
      }

      const type =
        addMemberModal.memberType === "coach" ? "Entrenador" : "Deportista";
      toastr.success(`${type} ${MESSAGES.SUCCESS_MEMBER_ADDED}`);
      addMemberModal.closeModal();
    } catch (error: any) {
      console.error("Error al agregar miembro:", error);
      toastr.error(error.message || "Error al agregar el miembro");
    } finally {
      addMemberModal.setSearchLoading(false);
    }
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

      // Generar username automáticamente: primera palabra del nombre +
      // primera palabra del apellido, separados por punto, en minúsculas y sin acentos
      const normalizeWord = (s: string) =>
        s
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase();

      const firstNameWord = normalizeWord(name.trim().split(/\s+/)[0] || "");
      const firstLastnameWord = normalizeWord(
        lastname.trim().split(/\s+/)[0] || "",
      );
      const generatedUsername = `${firstNameWord}.${firstLastnameWord}`;

      // Usar CI como contraseña
      const generatedPassword = ci.trim();

      const newUser = await userService.createAthlete({
        name,
        lastname,
        ci,
        username: generatedUsername,
        password: generatedPassword,
        role: addMemberModal.memberType,
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

    try {
      setLoading(true);
      const updatedGroup = await groupsService.removeCoach(groupId, coachId);
      setGroups((prev) =>
        prev.map((g) => (g._id === groupId ? updatedGroup : g)),
      );
      toastr.success("Entrenador eliminado correctamente");
    } catch (error: any) {
      console.error("Error al remover entrenador:", error);
      toastr.error(error.message || "Error al remover el entrenador");
    } finally {
      setLoading(false);
    }
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

    try {
      setLoading(true);
      const updatedGroup = await groupsService.removeAthlete(
        groupId,
        athleteId,
      );
      setGroups((prev) =>
        prev.map((g) => (g._id === groupId ? updatedGroup : g)),
      );
      toastr.success("Deportista eliminado correctamente");
    } catch (error: any) {
      console.error("Error al remover deportista:", error);
      toastr.error(error.message || "Error al remover el deportista");
    } finally {
      setLoading(false);
    }
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

    try {
      setLoading(true);

      const currentGroup = groups.find(
        (g) => g._id === scheduleModal.editingGroupId,
      );
      const currentSchedules = currentGroup?.schedule || [];

      // Remover horarios antiguos
      for (let i = 0; i < currentSchedules.length; i++) {
        await groupsService.removeSchedule(scheduleModal.editingGroupId, 0);
      }

      // Agregar nuevos horarios
      let updatedGroup = currentGroup;
      for (const schedule of scheduleModal.editingSchedules) {
        updatedGroup = await groupsService.addSchedule(
          scheduleModal.editingGroupId,
          schedule.day,
          schedule.startTime,
          schedule.endTime,
        );
      }

      setGroups((prev) =>
        prev.map((g) =>
          g._id === scheduleModal.editingGroupId ? updatedGroup : g,
        ),
      );

      toastr.success(MESSAGES.SUCCESS_SCHEDULES_SAVED);
      scheduleModal.closeModal();
    } catch (error: any) {
      console.error("Error al guardar horarios:", error);
      toastr.error(error.message || "Error al guardar los horarios");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un horario de un grupo
   */
  const handleRemoveSchedule = async (groupId: string, index: number) => {
    if (!window.confirm(MESSAGES.CONFIRM_DELETE_SCHEDULE)) {
      return;
    }

    try {
      setLoading(true);
      const updatedGroup = await groupsService.removeSchedule(groupId, index);
      setGroups((prev) =>
        prev.map((g) => (g._id === groupId ? updatedGroup : g)),
      );
      toastr.success(MESSAGES.SUCCESS_SCHEDULE_DELETED);
    } catch (error: any) {
      console.error("Error al remover horario:", error);
      toastr.error(error.message || "Error al remover el horario");
    } finally {
      setLoading(false);
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    <i className="fa fa-plus"></i> Crear Grupo
                  </button>
                </div>
              </div>

              <div className="ibox-content">
                {loading ? (
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
                        group={group}
                        isExpanded={groupExpansion.isExpanded(group._id)}
                        isLoading={loading}
                        onToggleExpand={() =>
                          groupExpansion.toggleGroupExpansion(group._id)
                        }
                        onEdit={() => {
                          groupForm.openForEdit(group);
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
                              isLoading={loading}
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
                            isLoading={loading}
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
                            onAddMember={() =>
                              addMemberModal.openModal(group._id, "athlete")
                            }
                            onRemoveMember={(memberId: string) =>
                              handleRemoveAthlete(group._id, memberId)
                            }
                            isLoading={loading}
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
        loading={loading}
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
        loading={loading}
        onClose={scheduleModal.closeModal}
        onSave={handleSaveSchedules}
        onAddRow={scheduleModal.addScheduleRow}
        onUpdateRow={scheduleModal.updateScheduleRow}
        onRemoveRow={scheduleModal.removeScheduleRow}
      />
    </>
  );
};

export default Groups;
