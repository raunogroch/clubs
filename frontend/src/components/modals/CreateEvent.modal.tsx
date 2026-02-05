/**
 * Modal para crear/editar eventos
 *
 * Permite crear eventos con nombre, descripción, fecha y hora
 */

import React, { useState, useEffect } from "react";

interface CreateEventModalProps {
  isOpen: boolean;
  groupId: string;
  onClose: () => void;
  onCreate: (eventData: {
    name: string;
    location: string;
    duration: number;
    eventDate: string;
    eventTime: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    duration: 60,
    eventDate: "",
    eventTime: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        location: "",
        duration: 60,
        eventDate: "",
        eventTime: "",
      });
      setSubmitting(false);
    } else {
      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        eventDate: today,
        eventTime: "09:00",
      }));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("El nombre del evento es requerido");
      return;
    }

    if (!formData.eventDate) {
      alert("La fecha del evento es requerida");
      return;
    }

    if (!formData.eventTime) {
      alert("La hora del evento es requerida");
      return;
    }

    if (formData.duration <= 0) {
      alert("La duración debe ser mayor a 0 minutos");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate(formData);
      setFormData({
        name: "",
        location: "",
        duration: 60,
        eventDate: "",
        eventTime: "",
      });
      onClose();
    } catch (err) {
      console.error("Error al crear evento:", err);
      alert("Error al crear el evento");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Crear Evento</h4>
            <button
              type="button"
              className="close"
              onClick={onClose}
              disabled={submitting}
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre del Evento *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Entrenamiento Especial"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={submitting}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Cancha Central"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  disabled={submitting}
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label>Fecha del Evento *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Hora del Evento *</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.eventTime}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTime: e.target.value })
                  }
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Duración (minutos) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ej: 60"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value) || 60,
                    })
                  }
                  disabled={submitting}
                  min="1"
                  step="1"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || isLoading}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "5px" }}
                    ></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fa fa-plus"></i> Crear Evento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
