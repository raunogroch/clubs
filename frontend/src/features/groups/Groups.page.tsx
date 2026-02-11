import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useClubGroupsAndEvents } from "../../customHooks/useClubGroupsAndEvents";
import { useGroupForm } from "./hooks";
import { createGroup, updateGroup, deleteGroup } from "../../store/groupsThunk";
import { GroupFormModal, GroupsTable, EventsTable } from "./components";
import { CreateEventModal } from "../../components/modals/CreateEvent.modal";
import { RescheduleEventModal } from "../../components/modals/RescheduleEvent.modal";
import { createEvent, updateEvent } from "../../store/eventsThunk";
import { MESSAGES } from "./constants";
import OverlayLoader from "../../components/Loader/OverlayLoader";

interface GroupsProps {
  clubId: string;
}

export const Groups = ({ clubId }: GroupsProps) => {
  const { groups, events, isLoading } = useClubGroupsAndEvents(clubId);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const groupForm = useGroupForm(clubId);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    event: null as any,
    loading: false,
  });

  // Helpers
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  // Event Handlers
  const handleCreateEvent = async (eventData: any) => {
    try {
      const result = await dispatch(
        createEvent({ club_id: clubId, ...eventData }) as any,
      );
      if (result.meta.requestStatus === "fulfilled") {
        toastr.success("Evento creado exitosamente");
        setShowEventModal(false);
      } else {
        toastr.error("Error al crear evento");
      }
    } catch (err) {
      console.error(err);
      toastr.error("Error al crear evento");
    }
  };

  const handleOpenRescheduleModal = (event: any) => {
    setRescheduleModal({ isOpen: true, event, loading: false });
  };

  const handleCloseRescheduleModal = () => {
    setRescheduleModal({ isOpen: false, event: null, loading: false });
  };

  const handleSaveReschedule = async (eventDate: string, eventTime: string) => {
    if (!rescheduleModal.event) return;
    const eventId = rescheduleModal.event._id;
    setRescheduleModal((p) => ({ ...p, loading: true }));
    try {
      const result = await dispatch(
        updateEvent({
          id: eventId,
          eventData: { eventDate, eventTime, rescheduled: true },
        }) as any,
      );
      if (result.meta.requestStatus === "fulfilled") {
        toastr.success("Evento reprogramado exitosamente");
        handleCloseRescheduleModal();
      } else {
        toastr.error("Error al reprogramar evento");
        setRescheduleModal((p) => ({ ...p, loading: false }));
      }
    } catch (err) {
      console.error(err);
      toastr.error("Error al reprogramar evento");
      setRescheduleModal((p) => ({ ...p, loading: false }));
    }
  };

  const handleSuspendEvent = async (eventId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas suspender este evento?"))
      return;
    try {
      const result = await dispatch(
        updateEvent({ id: eventId, eventData: { suspended: true } }) as any,
      );
      if (result.meta.requestStatus === "fulfilled") {
        toastr.success("Evento suspendido");
      } else {
        toastr.error("Error al suspender evento");
      }
    } catch (err) {
      console.error(err);
      toastr.error("Error al suspender evento");
    }
  };

  const handleReactivateEvent = async (eventId: string) => {
    if (!window.confirm("¿Deseas reactivar este evento?")) return;
    try {
      const result = await dispatch(
        updateEvent({ id: eventId, eventData: { suspended: false } }) as any,
      );
      if (result.meta.requestStatus === "fulfilled") {
        toastr.success("Evento reactivado");
      } else {
        toastr.error("Error al reactivar evento");
      }
    } catch (err) {
      console.error(err);
      toastr.error("Error al reactivar evento");
    }
  };

  // Group Handlers
  const handleSaveGroup = async () => {
    if (!groupForm.formData.name.trim()) {
      toastr.warning(MESSAGES.ERROR_GROUP_NAME_REQUIRED);
      return;
    }

    try {
      if (groupForm.editingId) {
        const updateData: any = { name: groupForm.formData.name };
        if (groupForm.formData.monthly_fee !== undefined) {
          updateData.monthly_fee = groupForm.formData.monthly_fee;
        }
        const result = await dispatch(
          updateGroup({ id: groupForm.editingId, group: updateData }),
        );
        if (result.meta.requestStatus === "fulfilled") {
          toastr.success("Grupo actualizado exitosamente");
        } else {
          toastr.error("Error al actualizar grupo");
        }
      } else {
        const result = await dispatch(createGroup(groupForm.formData));
        if (result.meta.requestStatus === "fulfilled") {
          toastr.success("Grupo creado exitosamente");
        } else {
          toastr.error("Error al crear grupo");
        }
      }

      setShowGroupModal(false);
      groupForm.resetForm();
    } catch (err) {
      console.error(err);
      toastr.error("Error al guardar grupo");
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm(MESSAGES.CONFIRM_DELETE_GROUP)) return;
    try {
      const result = await dispatch(deleteGroup(groupId));
      if (result.meta.requestStatus === "fulfilled") {
        toastr.success("Grupo eliminado exitosamente");
      } else {
        toastr.error("Error al eliminar grupo");
      }
    } catch (err) {
      console.error(err);
      toastr.error("Error al eliminar grupo");
    }
  };

  // Render
  if (isLoading) {
    return (
      <div className="col-12 text-center">
        <OverlayLoader
          isLoading={true}
          message="Cargando grupos y eventos..."
        />
      </div>
    );
  }

  if (groups.length === 0) {
    return <div className="col-12 text-center">No hay grupos registrados</div>;
  }

  return (
    <>
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
        onCreateGroup={() => {
          groupForm.openForCreate();
          setShowGroupModal(true);
        }}
        isLoading={isLoading}
      />
      <EventsTable
        events={events}
        onCreateEvent={() => setShowEventModal(true)}
        onSuspendEvent={handleSuspendEvent}
        onReactivateEvent={handleReactivateEvent}
        onOpenRescheduleModal={handleOpenRescheduleModal}
        calculateEndTime={calculateEndTime}
      />

      {rescheduleModal.isOpen && (
        <RescheduleEventModal
          isOpen={rescheduleModal.isOpen}
          event={rescheduleModal.event}
          loading={rescheduleModal.loading}
          onClose={handleCloseRescheduleModal}
          onSave={handleSaveReschedule}
        />
      )}

      {showGroupModal && (
        <GroupFormModal
          isOpen={showGroupModal}
          isEditMode={groupForm.editingId !== null}
          formData={groupForm.formData}
          loading={isLoading}
          onClose={() => {
            setShowGroupModal(false);
            groupForm.resetForm();
          }}
          onSave={handleSaveGroup}
          onFieldChange={groupForm.updateField}
        />
      )}

      {showEventModal && (
        <CreateEventModal
          isOpen={showEventModal}
          groupId={clubId}
          onClose={() => setShowEventModal(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </>
  );
};

export default Groups;
