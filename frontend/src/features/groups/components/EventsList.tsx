/**
 * Componente para mostrar lista de eventos
 *
 * Presenta los eventos de un grupo de forma ordenada
 */

import React from "react";

interface Event {
  _id: string;
  name: string;
  location?: string;
  duration?: number;
  eventDate: string;
  eventTime: string;
}

interface EventsListProps {
  events: Event[];
  onAdd: () => void;
  onDelete: (eventId: string) => void;
  isLoading?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({
  events = [],
  onAdd,
  onDelete,
  isLoading = false,
}) => {
  const MESSAGES = {
    NO_EVENTS: "Sin eventos asignados",
    BUTTON_ADD: "Agregar Evento",
  };

  const formatDate = (dateStr: string): string => {
    try {
      // Parsear la fecha YYYY-MM-DD sin procesamiento de timezone
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(year, month - 1, day));
    } catch {
      return dateStr;
    }
  };

  // Filtrar eventos: solo mostrar eventos con fecha actual o futura
  const isEventFuture = (eventDate: string): boolean => {
    try {
      const [year, month, day] = eventDate.split("-").map(Number);
      const eventDateObj = new Date(year, month - 1, day);

      // Obtener fecha actual (sin hora)
      const today = new Date();
      const todayDateObj = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      // Comparar fechas
      return eventDateObj >= todayDateObj;
    } catch {
      return true; // Si hay error, mostrar el evento
    }
  };

  const futureEvents = events.filter((event) => isEventFuture(event.eventDate));

  return (
    <div className="section-box">
      <h5 className="d-flex justify-content-between">
        <div>
          <i className="fa fa-calendar"></i> Eventos
          <span className="badge badge-secondary ml-2">
            {futureEvents.length}
          </span>
        </div>
        <button
          className="btn btn-info btn-xs"
          onClick={onAdd}
          title={MESSAGES.BUTTON_ADD}
          disabled={isLoading}
        >
          <i className="fa fa-plus"></i> {MESSAGES.BUTTON_ADD}
        </button>
      </h5>

      <div className="members-list">
        {futureEvents.length === 0 ? (
          <p className="text-muted">
            <em>{MESSAGES.NO_EVENTS}</em>
          </p>
        ) : (
          <ul className="row mb-0 d-flex align-items-center justify-content-center">
            {futureEvents.map((event, idx) => (
              <li
                key={idx}
                className="col-3 mx-1 event-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "3px",
                  marginBottom: "5px",
                  backgroundColor: "#f0f7ff",
                  border: "1px solid #dde7f3",
                }}
              >
                <span style={{ flex: 1 }}>
                  <strong>{event.name}</strong>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    {formatDate(event.eventDate)} {event.eventTime}
                  </div>
                  {event.location && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        marginTop: "3px",
                      }}
                    >
                      📍 {event.location}
                    </div>
                  )}
                  {event.duration && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                      }}
                    >
                      ⏱️ {event.duration} min
                    </div>
                  )}
                </span>
                <button
                  className="btn btn-danger btn-xs"
                  onClick={() => onDelete(event._id)}
                  title="Remover evento"
                  disabled={isLoading}
                  style={{ marginLeft: "8px" }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
