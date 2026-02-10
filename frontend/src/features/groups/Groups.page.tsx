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

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  addAthleteToGroup,
} from "../../store/groupsThunk";
import { fetchAllClubs } from "../../store/clubsThunk";
import { fetchAllSports } from "../../store/sportsThunk";
import { fetchUsersByRole } from "../../store/usersThunk";

// Redux actions
// (removed unused imports)

// Servicios
import userService from "../../services/userService";

// Tipos
import type { Group, User, MemberDetail } from "./types";

// Hooks custom
import { useGroupForm, useAddMemberModal } from "./hooks";

// Componentes
import { GroupFormModal, AddMemberModal, GroupCardSimple } from "./components";
import { Spinner } from "../../components/Spinner";

// Estilos y constantes
import { MESSAGES } from "./constants";
import { buildMemberDetailsMap } from "./utils";

/**
 * Props del componente Groups
 */
interface GroupsProps {
  clubId: string;
  onBack: () => void;
  // optional signal from parent to open the Create Group modal (increment to trigger)
  createSignal?: number;
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
export const Groups = ({ clubId, createSignal }: GroupsProps) => {
  // ============================================
  // STATE MANAGEMENT - REDUX
  // ============================================

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const groupsData = useSelector((state: RootState) => state.groups);
  const groupsStatus = groupsData.status as
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";
  const groups = groupsData.items;

  // ============================================
  // STATE MANAGEMENT - LOCAL
  // ============================================

  const [memberDetails, setMemberDetails] = useState<
    Record<string, MemberDetail>
  >({});

  // Formulario de grupo
  const groupForm = useGroupForm(clubId);

  // Modal de agregar miembro
  const addMemberModal = useAddMemberModal();

  // Modal de crear/editar grupo
  const [showGroupModal, setShowGroupModal] = useState(false);
  const prevCreateSignal = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof createSignal === "undefined") return;
    if (
      typeof prevCreateSignal.current !== "undefined" &&
      createSignal !== prevCreateSignal.current
    ) {
      groupForm.openForCreate();
      setShowGroupModal(true);
    }
    prevCreateSignal.current = createSignal;
  }, [createSignal, groupForm]);
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <div className="wrapper wrapper-content groups-wrapper">
        <div className="row mb-3">
          <div className="col-lg-12"></div>
        </div>
        <div className="row">
          {groupsStatus === "loading" ? (
            <div className="col-12 text-center">
              <Spinner variant="wave" />
            </div>
          ) : groupsStatus === "failed" ? (
            <div className="col-12 text-center text-danger">
              Error al cargar los grupos
            </div>
          ) : groups.length === 0 ? (
            <div className="col-12 text-center">No hay grupos registrados</div>
          ) : (
            groups.map((group) => (
              <GroupCardSimple
                key={group._id}
                group={group as any}
                onIngresar={() =>
                  navigate(`/clubs/${clubId}/groups/${group._id}/group`)
                }
                onEdit={() => {
                  groupForm.openForEdit(group as any);
                  setShowGroupModal(true);
                }}
                onDelete={() => handleDeleteGroup(group._id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modales */}
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
