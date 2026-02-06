import "./RescheduleEvent.spinner.css";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Button } from "../Button";

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

  const modalContent = (
    <div
      className="modal inmodal"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 99999,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          pointerEvents: "auto",
          width: "90vw",
          maxWidth: "500px",
          margin: "auto",
        }}
      >
        <div
          className="modal-content animated bounceInRight"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
              disabled={isDisabled}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <i className="fa fa-calendar modal-icon"></i>
            <h4 className="modal-title">Reprogramar Evento</h4>
            <small className="font-bold">{event.name}</small>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="modal-body"
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
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

            <div className="modal-footer">
              <Button
                className="btn btn-white"
                onClick={onClose}
                disabled={isDisabled}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                disabled={isDisabled}
              >
                {isDisabled ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
