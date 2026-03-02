/**
 * Componente para renderizar tarjetas de eventos en el calendario con tooltip
 */

import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { CalendarEvent, AthleteColorMap } from "../types";
import { getAthleteFullName } from "../utils";

interface EventCardWithTooltipProps {
  event: CalendarEvent;
  athleteColorMap: AthleteColorMap;
}

export const EventCardWithTooltip: React.FC<EventCardWithTooltipProps> = ({
  event,
  athleteColorMap,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const athletes = event.resource?.athletes || [];
  const hasMultipleAthletes = athletes.length > 1;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasMultipleAthletes) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setTooltipPos({
      top: rect.top - 5,
      left: rect.left + rect.width / 2,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const tooltipLines: string[] =
    athletes.length > 0
      ? athletes
          .map((a) => `- ${getAthleteFullName(a.name, a.lastname)}`.trim())
          .filter((name) => name.length > 0)
      : [];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "0 4px",
          cursor: "pointer",
          minHeight: "24px",
          position: "relative",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasMultipleAthletes ? (
          <>
            <div style={{ fontWeight: "bold", fontSize: "12px", flex: 1 }}>
              {event.resource?.club} / {event.resource?.group}
            </div>
            <div style={{ display: "flex", gap: "2px" }}>
              {athletes.map((ath) => (
                <div
                  key={ath._id}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                    backgroundColor: athleteColorMap[ath._id] || "#999",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div>
            {event.resource?.club} / {event.resource?.group}
            {athletes.length === 1 && athletes[0] && (
              <>
                {" - "}
                {getAthleteFullName(athletes[0].name, athletes[0].lastname)}
              </>
            )}
          </div>
        )}
      </div>

      {hasMultipleAthletes &&
        showTooltip &&
        tooltipLines.length > 0 &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateX(-50%) translateY(-100%)",
              backgroundColor: "#333",
              color: "white",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "pre-wrap",
              zIndex: 1000000000,
              pointerEvents: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              transition: "opacity 0.15s ease-in-out",
              opacity: showTooltip ? 1 : 0,
              marginTop: "-8px",
            }}
          >
            {tooltipLines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};
