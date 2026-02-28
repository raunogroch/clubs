import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  getDay,
  addDays,
  addWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSchedules } from "../customHooks/useSchedules";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  addWeeks,
  locales: { es },
});

// sencillo traductor de días para manejar la conversión al calendario
const dayOffsets: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

export default function SchedulePersonal() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { items, status } = useSchedules(user);
  const [events, setEvents] = useState<any[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    // build calendar events when schedules arrive
    const newEvents: any[] = [];
    const weekStarts: Date[] = [];
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    let cursor = startOfWeek(monthStart, { weekStartsOn: 1 });
    while (cursor <= monthEnd) {
      weekStarts.push(new Date(cursor));
      cursor = addWeeks(cursor, 1);
    }

    items.forEach((item: any) => {
      // algunos endpoints devuelven dia/startTime/endTime directamente
      const dayOffset = dayOffsets[item.day?.toLowerCase()] ?? 0;
      const [sh, sm] = item.startTime.split(":").map(Number);
      const [eh, em] = item.endTime.split(":").map(Number);

      weekStarts.forEach((wk) => {
        const d = new Date(wk);
        d.setDate(d.getDate() + (dayOffset === 0 ? 6 : dayOffset - 1));
        const start = new Date(d);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(d);
        end.setHours(eh, em, 0, 0);

        newEvents.push({
          id: `${item.group_id || item._id}-${item.day}-${item.startTime}-${start.toISOString()}`,
          title: item.group_name || item.name || "Horario",
          start,
          end,
        });
      });
    });

    setEvents(newEvents);
  }, [items, date]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Mi calendario</h2>
      {status === "loading" && <p>Cargando...</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={date}
        onNavigate={(d) => setDate(d as Date)}
      />
    </div>
  );
}
