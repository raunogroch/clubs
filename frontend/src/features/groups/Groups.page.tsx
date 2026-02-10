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
} from "../../store/groupsThunk";

// Hooks custom
import { useGroupForm } from "./hooks";

// Componentes
import { GroupFormModal, GroupsTable } from "./components";

// Estilos y constantes
import { MESSAGES } from "./constants";
import OverlayLoader from "../../components/Loader/OverlayLoader";

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

  // Formulario de grupo
  const groupForm = useGroupForm(clubId);

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
  }, [clubId, dispatch]);

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

  return (
    <>
      {groupsStatus === "loading" ? (
        <div className="col-12 text-center">
          <OverlayLoader isLoading={true} message="Cargando grupos..." />
        </div>
      ) : groupsStatus === "failed" ? (
        <div className="col-12 text-center text-danger">
          Error al cargar los grupos
        </div>
      ) : groups.length === 0 ? (
        <div className="col-12 text-center">No hay grupos registrados</div>
      ) : (
        <div className="col-12">
          <GroupsTable
            groups={groups as any}
            onIngresar={(group) =>
              navigate(`/clubs/${clubId}/groups/${group._id}/group`)
            }
            onEdit={(group) => {
              groupForm.openForEdit(group as any);
              setShowGroupModal(true);
            }}
            onDelete={handleDeleteGroup}
            isLoading={groupsStatus !== "succeeded"}
          />
        </div>
      )}

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
