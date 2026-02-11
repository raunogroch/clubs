import "./RescheduleEvent.spinner.css";
import { useState, useEffect } from "react";
import { Button } from "../Button";
import GenericModal from "../GenericModal";

interface RescheduleEventModalProps {
  isOpen: boolean;
  event: any;
  loading: boolean;
  onClose: () => void;
  onSave: (eventDate: string, eventTime: string) => Promise<void>;
}

export const RescheduleEventModal = ({
  isOpen,
  event,
  loading,
  onClose,
  onSave,
}: RescheduleEventModalProps) => {
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      setEventDate(event.eventDate || "");
      setEventTime(event.eventTime || "");
    }
  }, [isOpen, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventDate || !eventTime) {
      alert("Por favor completa la fecha y hora");
      return;
    }

    setLocalLoading(true);
    try {
      await onSave(eventDate, eventTime);
      onClose();
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const isDisabled = loading || localLoading;

  const footer = (
    <>
      <Button className="btn btn-white" onClick={onClose} disabled={isDisabled}>
        Cancelar
      </Button>
      <Button
        type="submit"
        className="btn btn-primary"
        disabled={isDisabled}
        form="reschedule-form"
      >
        {isDisabled ? "Guardando..." : "Guardar"}
      </Button>
    </>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <i className="fa fa-calendar modal-icon"></i> Reprogramar Evento
        </>
      }
      subtitle={<span className="font-bold">{event.name}</span>}
      size="sm"
      footer={footer}
    >
      <form id="reschedule-form" onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          {(loading || localLoading) && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                zIndex: 100,
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div className="spinner"></div>
                <span>Actualizando...</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reschedule-date">Fecha del Evento</label>
            <input
              id="reschedule-date"
              type="date"
              className="form-control"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              disabled={isDisabled}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reschedule-time">Hora del Evento</label>
            <input
              id="reschedule-time"
              type="time"
              className="form-control"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              disabled={isDisabled}
              required
            />
          </div>
        </div>
      </form>
    </GenericModal>
  );
};
