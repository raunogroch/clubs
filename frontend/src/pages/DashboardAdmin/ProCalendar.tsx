import { useState, useEffect } from "react";
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

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  addMonths,
  locales: { es },
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

const dayNameMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const ProCalendar = ({ groups }: { groups: any[] }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("week");
  const [groupsWithEvents, setGroupsWithEvents] = useState<any[]>([]);

  useEffect(() => {
    if (groups.length > 0) {
      setGroupsWithEvents(groups);
    }
  }, [groups]);

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = [];
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });

    groupsWithEvents.forEach((group) => {
      if (group.events_added && group.events_added.length > 0) {
        group.events_added.forEach((evt: any) => {
          try {
            const [year, month, day] = evt.eventDate.split("-").map(Number);
            const eventDate = new Date(year, month - 1, day);
            const [eventHour, eventMin] = evt.eventTime.split(":").map(Number);

            const startTime = new Date(eventDate);
            startTime.setHours(eventHour, eventMin, 0, 0);

            const endTime = new Date(startTime);
            const durationMinutes = evt.duration || 60;
            endTime.setMinutes(endTime.getMinutes() + durationMinutes);

            calendarEvents.push({
              id: `event-${evt._id}`,
              title: `[Evento] ${evt.name}${evt.location ? ` (${evt.location})` : ""} - ${group.name}`,
              start: startTime,
              end: endTime,
              resource: {
                club: group.club?.name || "",
                group: group.name,
              },
            });
          } catch (e) {
            console.error("Error processing event:", evt, e);
          }
        });
      }

      if (group.schedule && group.schedule.length > 0) {
        group.schedule.forEach((sched: any) => {
          const [startHour, startMin] = sched.startTime.split(":").map(Number);
          const [endHour, endMin] = sched.endTime.split(":").map(Number);

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
            id: `schedule-${group._id}-${sched.day}-${sched.startTime}`,
            title: `[Horario] ${group.name} (${sched.startTime} - ${sched.endTime})`,
            start: startTime,
            end: endTime,
            resource: {
              club: group.club?.name || "",
              group: group.name,
            },
          });
        });
      }
    });

    setEvents(calendarEvents);
  }, [groupsWithEvents, date]);

  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.title.includes("[Evento]")) {
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

    return {
      style: {
        backgroundColor: "#4472C4",
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
          onView={(v: any) => setView(v)}
          date={date}
          onNavigate={(d: any) => setDate(d)}
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
