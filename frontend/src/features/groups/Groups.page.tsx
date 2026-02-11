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
import { CreateEventModal } from "../../components/modals/CreateEvent.modal";
import { RescheduleEventModal } from "../../components/modals/RescheduleEvent.modal";
import { fetchEventsByClub, createEvent } from "../../store/eventsThunk";
import { updateEvent } from "../../store/eventsThunk";

// Estilos y constantes
import { MESSAGES } from "./constants";
import OverlayLoader from "../../components/Loader/OverlayLoader";
import { Button } from "../../components";

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
    // load club events (for listing or calendar elsewhere)
    dispatch(fetchEventsByClub(clubId));
  }, [clubId, dispatch]);

  const [showEventModal, setShowEventModal] = useState(false);
  const eventsData = useSelector((s: RootState) => s.events);
  const events = eventsData.items || [];

  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    event: null as any,
    loading: false,
  });

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  const getFutureEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (events || []).filter((event: any) => {
      if (!event.eventDate) return false;
      const eventDate = new Date(event.eventDate);
      return eventDate >= today;
    });
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      await dispatch(
        // attach club_id so backend registers event under club
        // payload shape expected by eventsService: { club_id, name, ... }
        // we rely on thunk to handle errors
        createEvent({ club_id: clubId, ...eventData }) as any,
      );
      toastr.success("Evento creado exitosamente");
      setShowEventModal(false);
      // refresh events list
      dispatch(fetchEventsByClub(clubId));
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
      await dispatch(
        updateEvent({
          id: eventId,
          eventData: { eventDate, eventTime, rescheduled: true },
        }) as any,
      );
      toastr.success("Evento reprogramado exitosamente");
      handleCloseRescheduleModal();
      dispatch(fetchEventsByClub(clubId));
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
      await dispatch(
        updateEvent({ id: eventId, eventData: { suspended: true } }) as any,
      );
      toastr.success("Evento suspendido");
      dispatch(fetchEventsByClub(clubId));
    } catch (err) {
      console.error(err);
      toastr.error("Error al suspender evento");
    }
  };

  const handleReactivateEvent = async (eventId: string) => {
    if (!window.confirm("¿Deseas reactivar este evento?")) return;
    try {
      await dispatch(
        updateEvent({ id: eventId, eventData: { suspended: false } }) as any,
      );
      toastr.success("Evento reactivado");
      dispatch(fetchEventsByClub(clubId));
    } catch (err) {
      console.error(err);
      toastr.error("Error al reactivar evento");
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
          isLoading={groupsStatus !== "succeeded"}
        />
      )}

      {/* Eventos del club */}
      <div className="row m-t-md" style={{ marginTop: 16 }}>
        <div className="col-lg-12">
          <div className="ibox">
            <div
              className="ibox-title d-flex justify-content-between"
              style={{ alignItems: "center" }}
            >
              <h5 className="m-0">
                <i className="fa fa-calendar"></i> Próximos eventos del club
              </h5>
              <Button
                className="btn btn-xs btn-primary"
                onClick={() => setShowEventModal(true)}
                icon="fa-plus"
              >
                Crear Evento
              </Button>
            </div>
            <div className="ibox-content">
              {getFutureEvents().length > 0 ? (
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
                      {getFutureEvents().map((event: any) => (
                        <tr key={event._id}>
                          <td style={{ opacity: event.suspended ? 0.6 : 1 }}>
                            {event.rescheduled ? (
                              <span className="text-warning">
                                ( Reprogramado )
                              </span>
                            ) : null}
                            &nbsp;{event.name}
                          </td>
                          <td style={{ opacity: event.suspended ? 0.6 : 1 }}>
                            <i className="fa fa-calendar-o"></i>{" "}
                            {event.eventDate || "-"}
                          </td>
                          <td style={{ opacity: event.suspended ? 0.6 : 1 }}>
                            <i className="fa fa-clock-o"></i> {event.eventTime}
                            {event.duration &&
                              ` - ${calculateEndTime(event.eventTime, event.duration)}`}
                          </td>
                          <td style={{ opacity: event.suspended ? 0.6 : 1 }}>
                            <i className="fa fa-map-marker"></i>{" "}
                            {event.location || "-"}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 8 }}>
                              {event.suspended ? (
                                <button
                                  className="btn btn-xs btn-success"
                                  onClick={() =>
                                    handleReactivateEvent(event._id)
                                  }
                                >
                                  Reactivar
                                </button>
                              ) : (
                                <button
                                  className="btn btn-xs btn-danger"
                                  onClick={() => handleSuspendEvent(event._id)}
                                >
                                  Suspender
                                </button>
                              )}

                              <button
                                className="btn btn-xs btn-warning"
                                disabled={event.suspended}
                                onClick={() => handleOpenRescheduleModal(event)}
                              >
                                Reprogramar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">Sin eventos</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {rescheduleModal.isOpen && (
        <RescheduleEventModal
          isOpen={rescheduleModal.isOpen}
          event={rescheduleModal.event}
          loading={rescheduleModal.loading}
          onClose={handleCloseRescheduleModal}
          onSave={handleSaveReschedule}
        />
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

      {showEventModal && (
        <CreateEventModal
          isOpen={showEventModal}
          // CreateEventModal expects groupId prop but not used; we keep for compat
          groupId={clubId}
          onClose={() => setShowEventModal(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </>
  );
};

export default Groups;
