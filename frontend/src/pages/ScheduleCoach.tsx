import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  getDay,
  addDays,
  addMonths,
  addWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Event {
  _id: string;
  name: string;
  location: string;
  duration: number;
  eventDate: string;
  eventTime: string;
}

interface Group {
  _id: string;
  name: string;
  club_id: {
    _id: string;
    name: string;
  };
  schedule?: Schedule[];
  schedules_added?: Schedule[];
  events_added?: Event[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  eventType: "schedule" | "event"; // Para diferenciar entre horarios y eventos
  resource?: {
    club: string;
    group: string;
    location?: string;
  };
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  addMonths,
  locales: {
    es,
  },
});

const formats = {
  dateFormat: "dd",
  dayFormat: "EEE dd",
  weekdayFormat: "EEE",
  monthHeaderFormat: "MMMM yyyy",
  dayHeaderFormat: "EEEE dd MMMM",
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`,
  agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`,
  agendaDateFormat: "EEE MMM dd",
  agendaTimeFormat: "HH:mm",
  agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: es })} - ${format(end, "HH:mm", { locale: es })}`,
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: es })} - ${format(end, "HH:mm", { locale: es })}`,
  eventAccessor: "title",
  resourceIdAccessor: "resourceId",
  slotLabelFormat: "HH:mm",
};

const getDayOffset = (day?: string) => {
  if (!day) return 0;
  const d = day.trim().toLowerCase();

  const map: Record<string, number> = {
    sunday: 0,
    sun: 0,
    domingo: 0,
    dom: 0,

    monday: 1,
    mon: 1,
    lunes: 1,
    lun: 1,

    tuesday: 2,
    tue: 2,
    martes: 2,
    mar: 2,

    wednesday: 3,
    wed: 3,
    miercoles: 3,
    miércoles: 3,
    mie: 3,

    thursday: 4,
    thu: 4,
    jueves: 4,
    jue: 4,

    friday: 5,
    fri: 5,
    viernes: 5,
    vie: 5,

    saturday: 6,
    sat: 6,
    sabado: 6,
    sábado: 6,
    sab: 6,
  };

  if (map[d] !== undefined) return map[d];

  const asNumber = Number(d);
  if (!Number.isNaN(asNumber) && asNumber >= 0 && asNumber <= 6)
    return asNumber;

  return 0;
};

const messages = {
  today: "Hoy",
  previous: "Atrás",
  next: "Siguiente",
  yesterday: "Ayer",
  tomorrow: "Mañana",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
  showMore: (total: number) => `+${total} más`,
};

const ProCalendar = ({ groups }: { groups: Group[] }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("week");

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = [];

    // Build an array of week starts to generate events for visible range.
    const weekStarts: Date[] = [];
    if (view === "month") {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      let cursor = startOfWeek(monthStart, { weekStartsOn: 1 });
      while (cursor <= monthEnd) {
        weekStarts.push(new Date(cursor));
        cursor = addWeeks(cursor, 1);
      }
    } else {
      weekStarts.push(startOfWeek(date, { weekStartsOn: 1 }));
    }

    groups.forEach((group) => {
      // Agregar primero eventos especiales (events_added) para que tengan prioridad visual
      if (group.events_added && group.events_added.length > 0) {
        group.events_added.forEach((event) => {
          try {
            const [year, month, day] = event.eventDate.split("-").map(Number);
            const eventDate = new Date(year, month - 1, day);
            const [eventHour, eventMin] = event.eventTime
              .split(":")
              .map(Number);

            const startTime = new Date(eventDate);
            startTime.setHours(eventHour, eventMin, 0, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + event.duration);

            calendarEvents.push({
              id: `event-${event._id}`,
              title: `📍 ${event.name}`,
              start: startTime,
              end: endTime,
              eventType: "event",
              resource: {
                club: group.club_id?.name || "",
                group: group.name,
                location: event.location,
              },
            });
          } catch (error) {
            console.error("Error procesando evento:", event, error);
          }
        });
      }

      // Mostrar solo `schedules_added` (usar `schedule` está deprecado)

      if (group.schedules_added && group.schedules_added.length > 0) {
        group.schedules_added.forEach((sched) => {
          const [startHour, startMin] = sched.startTime.split(":").map(Number);
          const [endHour, endMin] = sched.endTime.split(":").map(Number);

          const dayOffset = getDayOffset(sched.day);

          weekStarts.forEach((wk) => {
            const eventDate = new Date(wk);
            eventDate.setDate(
              eventDate.getDate() + (dayOffset === 0 ? 6 : dayOffset - 1),
            );

            const startTime = new Date(eventDate);
            startTime.setHours(startHour, startMin, 0, 0);

            const endTime = new Date(eventDate);
            endTime.setHours(endHour, endMin, 0, 0);

            calendarEvents.push({
              id: `${group._id}-schedules_added-${sched.day}-${sched.startTime}-${eventDate.toISOString()}`,
              title: group.name,
              start: startTime,
              end: endTime,
              eventType: "schedule",
              resource: {
                club: group.club_id?.name || "",
                group: group.name,
              },
            });
          });
        });
      }
    });

    setEvents(calendarEvents);
  }, [groups, date]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors = [
      "#3174ad",
      "#f50057",
      "#ff9800",
      "#4caf50",
      "#2196f3",
      "#9c27b0",
    ];

    // Eventos especiales (eventos creados) con máxima prioridad visual
    if (event.eventType === "event") {
      return {
        style: {
          backgroundColor: "#e91e63",
          borderRadius: "5px",
          opacity: 1,
          color: "white",
          border: "3px solid #c2185b",
          display: "block",
          fontWeight: "bold",
          zIndex: 999,
        },
      };
    }

    // Horarios regulares (schedule) con menor prioridad visual
    const backgroundColor = colors[event.title.charCodeAt(0) % colors.length];
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.7,
        color: "white",
        border: "0px",
        display: "block",
        zIndex: 1,
      },
    };
  };

  return (
    <div className="mb-4">
      <div style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          defaultView="week"
          eventPropGetter={eventStyleGetter}
          popup
          selectable
          min={new Date(2024, 0, 1, 6, 0, 0)}
          max={new Date(2024, 0, 1, 23, 59, 59)}
          step={30}
          showMultiDayTimes
          views={["month", "week", "day", "agenda"]}
          culture="es"
          formats={formats}
          messages={messages}
        />
      </div>
    </div>
  );
};

export const ScheduleCoach = ({ name }: pageParamProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = `${import.meta.env.VITE_BACKEND_URI}/api/groups/my-coach-groups`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        // DEBUG: mostrar en consola lo que recibe ScheduleCoach desde el backend
        try {
          console.log(
            "ScheduleCoach - /api/groups/my-coach-groups response:",
            data,
          );
        } catch (e) {
          console.log(
            "ScheduleCoach - received response (unable to stringify)",
          );
        }

        setGroups(data);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachGroups();
  }, []);

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="container-fluid">
          {loading && (
            <div className="alert alert-info">
              <p>Cargando grupos...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && groups.length === 0 && (
            <div className="alert alert-warning">
              <p>No tienes grupos asignados como entrenador.</p>
            </div>
          )}

          {!loading && groups.length > 0 && <ProCalendar groups={groups} />}
        </div>
      </div>
    </>
  );
};
