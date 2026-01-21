/**
 * Componente para mostrar lista de horarios
 *
 * Presenta los horarios de un grupo de forma ordenada
 */

import React from "react";
import type { Schedule } from "../types";
import { DayName } from "../types";

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: () => void;
  onDeleteSchedule: (index: number) => void;
  isEditing: boolean;
  isLoading?: boolean;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onEdit,
  onDeleteSchedule,
  isEditing,
  isLoading = false,
}) => {
  const MESSAGES = {
    NO_SCHEDULES: "Sin horarios asignados",
    EDITING: "Editando horarios...",
    BUTTON_EDIT: "Editar Horarios",
  };

  return (
    <div className="section-box">
      <h5 className="d-flex justify-content-between">
        <div>
          <i className="fa fa-calendar"></i> Horarios
          <span className="badge badge-secondary ml-2">{schedules.length}</span>
        </div>
        <button
          className="btn btn-warning btn-xs"
          onClick={onEdit}
          title={MESSAGES.BUTTON_EDIT}
          disabled={isLoading || isEditing}
        >
          <i className="fa fa-edit"></i> {MESSAGES.BUTTON_EDIT}
        </button>
      </h5>

      {isEditing ? (
        <p className="text-muted">
          <em>{MESSAGES.EDITING}</em>
        </p>
      ) : (
        <div className="members-list">
          {schedules.length === 0 ? (
            <p className="text-muted">
              <em>{MESSAGES.NO_SCHEDULES}</em>
            </p>
          ) : (
            <ul className="row mb-0" style={{ marginBottom: "10px" }}>
              {schedules.map((schedule, idx) => (
                <li
                  key={idx}
                  className="col-2 mx-1 schedule-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "3px",
                    marginBottom: "5px",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ddd",
                  }}
                >
                  <span>
                    <strong>
                      {(DayName as any)[schedule.day]}: {schedule.startTime} -{" "}
                      {schedule.endTime}
                    </strong>
                  </span>
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => onDeleteSchedule(idx)}
                    title="Remover horario"
                    disabled={isLoading || isEditing}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
