/**
 * Modal para crear/editar eventos
 *
 * Permite crear eventos con nombre, descripción, fecha y hora
 */

import React, { useState, useEffect } from "react";
import { Button } from "../../components";
import GenericModal from "../GenericModal";

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

  const footer = (
    <>
      <Button
        type="button"
        variant="white"
        onClick={onClose}
        disabled={submitting}
      >
        Cancelar
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() => {}}
        disabled={submitting || isLoading}
        icon="fa-calendar-plus-o"
        form="create-event-form"
      >
        {submitting ? "Creando..." : "Crear Evento"}
      </Button>
    </>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <i className="fa fa-calendar modal-icon"></i> Crear Evento
        </>
      }
      subtitle={
        <span className="font-bold">Agenda un nuevo evento para el grupo</span>
      }
      size="md"
      footer={footer}
    >
      <form id="create-event-form" onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          {submitting && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#5c6cfa",
                    animation: "pulse-spinner 1.5s ease-in-out infinite",
                  }}
                />
                <small style={{ color: "#666", fontWeight: "500" }}>
                  Guardando evento...
                </small>
              </div>
              <style>{`@keyframes pulse-spinner {0% {opacity: 1; transform: scale(1);}50% {opacity: 0.6; transform: scale(0.9);}100% {opacity: 1; transform: scale(1);}}`}</style>
            </div>
          )}

          {/* Nombre del evento */}
          <div className="form-group">
            <label htmlFor="event-name">
              <i className="fa fa-pencil"></i> Nombre del Evento{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              id="event-name"
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
            <small className="form-text text-muted">
              Ej: Entrenamiento de velocidad, Partido amistoso, etc.
            </small>
          </div>

          {/* Ubicación */}
          <div className="form-group">
            <label htmlFor="event-location">
              <i className="fa fa-map-marker"></i> Ubicación
            </label>
            <input
              id="event-location"
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
            <small className="form-text text-muted">
              Lugar donde se llevará a cabo el evento
            </small>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div className="form-group">
              <label htmlFor="event-date">
                <i className="fa fa-calendar-o"></i> Fecha{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                id="event-date"
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
              <label htmlFor="event-time">
                <i className="fa fa-clock-o"></i> Hora{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                id="event-time"
                type="time"
                className="form-control"
                value={formData.eventTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventTime: e.target.value })
                }
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="event-duration">
              <i className="fa fa-hourglass"></i> Duración{" "}
              <span className="text-danger">*</span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                id="event-duration"
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
              />
              <small style={{ whiteSpace: "nowrap", color: "#666" }}>
                minutos
              </small>
            </div>
            <small className="form-text text-muted">
              Duración estimada del evento (en minutos)
            </small>
          </div>
        </div>
      </form>
    </GenericModal>
  );
};
