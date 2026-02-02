import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  addMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Group {
  _id: string;
  name: string;
  club_id: {
    _id: string;
    name: string;
  };
  schedule?: Schedule[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    club: string;
    group: string;
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

const dayNameMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
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
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });

    groups.forEach((group) => {
      if (group.schedule && group.schedule.length > 0) {
        group.schedule.forEach((sched) => {
          const [startHour, startMin] = sched.startTime.split(":").map(Number);
          const [endHour, endMin] = sched.endTime.split(":").map(Number);

          // Filtrar horarios entre 12:00 y 14:00
          if (
            (startHour >= 12 && startHour < 14) ||
            (endHour > 12 && endHour <= 14)
          ) {
            return;
          }

          const dayOffset = dayNameMap[sched.day] || 0;
          const eventDate = new Date(weekStart);
          eventDate.setDate(
            eventDate.getDate() + (dayOffset === 0 ? 6 : dayOffset - 1),
          );

          const startTime = new Date(eventDate);
          startTime.setHours(startHour, startMin, 0, 0);

          const endTime = new Date(eventDate);
          endTime.setHours(endHour, endMin, 0, 0);

          calendarEvents.push({
            id: `${group._id}-${sched.day}-${sched.startTime}`,
            title: group.name,
            start: startTime,
            end: endTime,
            resource: {
              club: group.club_id?.name || "",
              group: group.name,
            },
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
    const backgroundColor = colors[event.title.charCodeAt(0) % colors.length];

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
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
          min={new Date(2024, 0, 1, 8, 0, 0)}
          max={new Date(2024, 0, 1, 22, 0, 0)}
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
