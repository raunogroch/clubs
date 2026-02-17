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

// Paleta de colores para grupos
const GROUP_COLORS = [
  "#FF6B6B", // Rojo
  "#4ECDC4", // Turquesa
  "#FFE66D", // Amarillo
  "#95E1D3", // Menta
  "#F38181", // Rosa coral
  "#AA96DA", // Púrpura
  "#FCBAD3", // Rosa pálido
  "#A8D8EA", // Azul claro
  "#FF8C42", // Naranja
  "#FB6467", // Coral
  "#6BCB77", // Verde
  "#4D96FF", // Azul
];

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
    groupId?: string;
  };
}

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

export const ProCalendar = ({ groups }: { groups: any[] }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("week");
  const [groupsWithEvents, setGroupsWithEvents] = useState<any[]>([]);
  const [groupColorMap, setGroupColorMap] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (groups.length > 0) {
      setGroupsWithEvents(groups);

      // Crear mapa de colores para cada grupo
      const colorMap: Record<string, string> = {};
      groups.forEach((group, index) => {
        colorMap[group._id] = GROUP_COLORS[index % GROUP_COLORS.length];
      });
      setGroupColorMap(colorMap);
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
              title: `[Evento] ${evt.name}`,
              start: startTime,
              end: endTime,
              resource: {
                club: group.club?.name || "",
                group: group.name,
                groupId: group._id,
              },
            });
          } catch (e) {
            console.error("Error processing event:", evt, e);
          }
        });
      }

      // Mostrar solo `schedules_added` (ignorar `schedule` deprecated)
      if (group.schedules_added && group.schedules_added.length > 0) {
        group.schedules_added.forEach((sched: any) => {
          try {
            const [startHour, startMin] = sched.startTime
              .split(":")
              .map(Number);
            const [endHour, endMin] = sched.endTime.split(":").map(Number);

            const dayOffset = getDayOffset(sched.day);
            const eventDate = new Date(weekStart);
            eventDate.setDate(
              eventDate.getDate() + (dayOffset === 0 ? 6 : dayOffset - 1),
            );

            const startTime = new Date(eventDate);
            startTime.setHours(startHour, startMin, 0, 0);

            const endTime = new Date(eventDate);
            endTime.setHours(endHour, endMin, 0, 0);

            calendarEvents.push({
              id: `schedules_added-${group._id}-${sched.day}-${sched.startTime}`,
              title: `${group.club?.name} ${group.name}`,
              start: startTime,
              end: endTime,
              resource: {
                club: group.club?.name || "",
                group: group.name,
                groupId: group._id,
              },
            });
          } catch (e) {
            console.error("Error processing schedule:", sched, e);
          }
        });
      }
    });

    setEvents(calendarEvents);
  }, [groupsWithEvents, date]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const groupId = event.resource?.groupId;
    const baseColor =
      groupId && groupColorMap[groupId] ? groupColorMap[groupId] : "#4472C4";

    if (event.title.includes("[Evento]")) {
      return {
        style: {
          backgroundColor: "#000000",
          borderRadius: "5px",
          opacity: 1,
          color: "white",
          border: "3px solid #000000",
          display: "block",
          fontWeight: "bold",
          zIndex: 999,
        },
      };
    }

    return {
      style: {
        backgroundColor: baseColor,
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
