/**
 * Componente principal del calendario para mostrar horarios y eventos
 */

import React, { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, DateLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  getDay,
  addDays,
  addWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import type { Group, CalendarEvent, Athlete, AthleteColorMap } from "../types";
import {
  CALENDAR_PALETTE,
  CALENDAR_MESSAGES,
  CALENDAR_FORMATS,
  CALENDAR_MIN_HOUR,
  CALENDAR_MAX_HOUR,
} from "../constants";
import { getDayOffset, getClubName, getAthleteFullName } from "../utils";
import { EventCardWithTooltip } from "./EventCardWithTooltip";

interface ProCalendarProps {
  groups: Group[];
}

const localizer: DateLocalizer = dateFnsLocalizer({
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

export const ProCalendar: React.FC<ProCalendarProps> = ({ groups }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "day">("week");

  // Memoized athletes list extraction
  const athletesList = useMemo(() => {
    const map: Record<string, Athlete> = {};

    groups.forEach((g) => {
      (g.athletes || []).forEach((a) => {
        if (a && a._id) {
          map[a._id] = {
            _id: a._id,
            name: a.name || "",
            lastname: a.lastname || "",
          };
        }
      });
    });

    return Object.values(map);
  }, [groups]);

  // Memoized athlete color mapping
  const athleteColorMap = useMemo(() => {
    const colorMap: AthleteColorMap = {};

    athletesList.forEach((a, i) => {
      colorMap[a._id] = CALENDAR_PALETTE[i % CALENDAR_PALETTE.length];
    });

    return colorMap;
  }, [athletesList]);

  // Generate calendar events from groups
  useEffect(() => {
    const calendarEvents: CalendarEvent[] = [];

    const weekStarts: Date[] = [];
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    let cursor = startOfWeek(monthStart, { weekStartsOn: 1 });

    while (cursor <= monthEnd) {
      weekStarts.push(new Date(cursor));
      cursor = addWeeks(cursor, 1);
    }

    groups.forEach((group) => {
      // Process special events (events_added)
      if (group.events_added && group.events_added.length > 0) {
        group.events_added.forEach((evt) => {
          try {
            const [year, month, day] = evt.eventDate.split("-").map(Number);
            const eventDate = new Date(year, month - 1, day);
            const [eventHour, eventMin] = evt.eventTime.split(":").map(Number);

            const startTime = new Date(eventDate);
            startTime.setHours(eventHour, eventMin, 0, 0);

            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + evt.duration);

            calendarEvents.push({
              id: `event-${evt._id}`,
              title: `📍 ${evt.name}`,
              start: startTime,
              end: endTime,
              eventType: "event",
              resource: {
                club: getClubName(group) || "",
                group: group.name,
                location: evt.location,
              },
            });
          } catch (error) {
            console.error("Error processing event:", evt, error);
          }
        });
      }

      // Process schedules
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

            if (group.athletes && group.athletes.length > 0) {
              const clubName = getClubName(group) || "";
              const hasMultiple = group.athletes.length > 1;

              const title = hasMultiple
                ? `${clubName} / ${group.name}`
                : `${clubName} / ${group.name} - ${getAthleteFullName(
                    group.athletes[0].name,
                    group.athletes[0].lastname,
                  )}`;

              calendarEvents.push({
                id: `${group._id}-${sched.day}-${sched.startTime}-${eventDate.toISOString()}`,
                title,
                start: startTime,
                end: endTime,
                eventType: "schedule",
                resource: {
                  club: clubName,
                  group: group.name,
                  athletes: group.athletes as any[],
                },
              });
            } else {
              calendarEvents.push({
                id: `${group._id}-${sched.day}-${sched.startTime}-${eventDate.toISOString()}`,
                title: group.name,
                start: startTime,
                end: endTime,
                eventType: "schedule",
                resource: {
                  club: getClubName(group) || "",
                  group: group.name,
                },
              });
            }
          });
        });
      }
    });

    setEvents(calendarEvents);
  }, [groups, date, view]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors = [
      "#3174ad",
      "#f50057",
      "#ff9800",
      "#4caf50",
      "#2196f3",
      "#9c27b0",
    ];

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
        } as React.CSSProperties,
      };
    }

    const athletes = event.resource?.athletes || [];

    if (athletes.length > 1) {
      return {
        style: {
          backgroundColor: "#6c757d",
          borderRadius: "5px",
          opacity: 0.7,
          color: "white",
          border: "0px",
          display: "block",
          zIndex: 1,
        } as React.CSSProperties,
      };
    }

    const singleAthlete = athletes[0];
    const backgroundColor =
      singleAthlete && athleteColorMap[singleAthlete._id]
        ? athleteColorMap[singleAthlete._id]
        : colors[event.title.charCodeAt(0) % colors.length];

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.7,
        color: "white",
        border: "0px",
        display: "block",
        zIndex: 1,
      } as React.CSSProperties,
    };
  };

  return (
    <div className="mb-4">
      {/* Athletes Legend */}
      {athletesList.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {athletesList.map((a) => (
            <div
              key={a._id}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  background: athleteColorMap[a._id],
                  display: "inline-block",
                  borderRadius: 3,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
              <span style={{ fontSize: 12 }}>
                {getAthleteFullName(a.name, a.lastname)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar */}
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
          components={{
            event: (props: any) => (
              <EventCardWithTooltip
                event={props.event}
                athleteColorMap={athleteColorMap}
              />
            ),
          }}
          popup
          selectable
          min={new Date(2024, 0, 1, CALENDAR_MIN_HOUR, 0, 0)}
          max={new Date(2024, 0, 1, CALENDAR_MAX_HOUR, 0, 0)}
          step={30}
          showMultiDayTimes
          views={["week", "day"]}
          culture="es"
          formats={CALENDAR_FORMATS}
          messages={CALENDAR_MESSAGES}
        />
      </div>
    </div>
  );
};
