import { Button } from "../../../components";

interface EventsTableProps {
  events: any[];
  onCreateEvent: () => void;
  onSuspendEvent: (eventId: string) => void;
  onReactivateEvent: (eventId: string) => void;
  onOpenRescheduleModal: (event: any) => void;
  calculateEndTime: (startTime: string, duration: number) => string;
}

export const EventsTable = ({
  events,
  onCreateEvent,
  onSuspendEvent,
  onReactivateEvent,
  onOpenRescheduleModal,
  calculateEndTime,
}: EventsTableProps) => {
  // Filtrar solo eventos futuros
  const getFutureEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (events || []).filter((event: any) => {
      if (!event.eventDate) return false;
      const eventDate = new Date(event.eventDate);
      return eventDate >= today;
    });
  };

  const futureEvents = getFutureEvents();

  return (
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
              onClick={onCreateEvent}
              icon="fa-plus"
            >
              Crear Evento
            </Button>
          </div>
          <div className="ibox-content">
            {futureEvents.length > 0 ? (
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
                    {futureEvents.map((event: any) => (
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
                          <div
                            className="justify-content-center"
                            style={{ display: "flex", gap: 8 }}
                          >
                            {event.suspended ? (
                              <Button
                                className="btn btn-xs btn-success"
                                onClick={() => onReactivateEvent(event._id)}
                              >
                                Reactivar
                              </Button>
                            ) : (
                              <Button
                                className="btn btn-xs btn-danger"
                                onClick={() => onSuspendEvent(event._id)}
                              >
                                Suspender
                              </Button>
                            )}

                            <Button
                              className="btn btn-xs btn-warning"
                              disabled={event.suspended}
                              onClick={() => onOpenRescheduleModal(event)}
                            >
                              Reprogramar
                            </Button>
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
  );
};
