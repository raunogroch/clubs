import React from "react";
import type { Schedule } from "../../features/groups/types";
import "./EditSchedule.spinner.css";

interface EditScheduleModalProps {
  isOpen: boolean;
  schedules: Schedule[];
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
  onAddRow: () => void;
  onUpdateRow: (index: number, field: keyof Schedule, value: string) => void;
  onRemoveRow: (index: number) => void;
}

const DayNameMap: Record<string, string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  schedules,
  loading,
  onClose,
  onSave,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal inmodal"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,.5)",
        zIndex: 1050,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "900px",
          width: "90vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          margin: "auto",
        }}
      >
        <div
          className="modal-content animated bounceInRight"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "90vh",
          }}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
              disabled={loading}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <i className="fa fa-calendar modal-icon"></i>
            <h4 className="modal-title">Editar Horarios</h4>
            <small className="font-bold">
              Gestiona los horarios de entrenamiento por día
            </small>
          </div>

          <div
            className="modal-body"
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  zIndex: 100,
                  borderRadius: "4px",
                }}
              >
                <div className="sk-spinner sk-spinner-pulse"></div>
              </div>
            )}
            {schedules.length === 0 ? (
              <div
                className="alert alert-info alert-with-icon"
                data-notify="container"
              >
                <span data-notify="icon" className="fa fa-info-circle"></span>
                <span data-notify="message">
                  <strong>Sin horarios:</strong> Haz clic en "Agregar horario"
                  para crear el primer horario de entrenamiento.
                </span>
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: "15px",
                }}
              >
                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: "30%", textAlign: "center" }}>
                          <i className="fa fa-calendar-o"></i> Día
                        </th>
                        <th style={{ width: "25%", textAlign: "center" }}>
                          <i className="fa fa-clock-o"></i> Hora Inicio
                        </th>
                        <th style={{ width: "25%", textAlign: "center" }}>
                          <i className="fa fa-clock-o"></i> Hora Fin
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((schedule, idx) => (
                        <tr key={idx}>
                          <td>
                            <select
                              className="form-control "
                              value={schedule.day}
                              onChange={(e) =>
                                onUpdateRow(idx, "day", e.target.value)
                              }
                              disabled={loading}
                            >
                              <option value="Monday">
                                {DayNameMap.Monday}
                              </option>
                              <option value="Tuesday">
                                {DayNameMap.Tuesday}
                              </option>
                              <option value="Wednesday">
                                {DayNameMap.Wednesday}
                              </option>
                              <option value="Thursday">
                                {DayNameMap.Thursday}
                              </option>
                              <option value="Friday">
                                {DayNameMap.Friday}
                              </option>
                              <option value="Saturday">
                                {DayNameMap.Saturday}
                              </option>
                              <option value="Sunday">
                                {DayNameMap.Sunday}
                              </option>
                            </select>
                          </td>

                          {/* Input hora inicio */}
                          <td>
                            <input
                              type="time"
                              className="form-control "
                              value={schedule.startTime}
                              onChange={(e) =>
                                onUpdateRow(idx, "startTime", e.target.value)
                              }
                              disabled={loading}
                            />
                          </td>

                          {/* Input hora fin */}
                          <td>
                            <input
                              type="time"
                              className="form-control "
                              value={schedule.endTime}
                              onChange={(e) =>
                                onUpdateRow(idx, "endTime", e.target.value)
                              }
                              disabled={loading}
                            />
                          </td>

                          {/* Botón eliminar fila */}
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="btn btn-danger"
                              onClick={() => onRemoveRow(idx)}
                              title="Eliminar horario"
                              disabled={loading}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Botón agregar fila */}
            <div
              style={{
                paddingTop: "10px",
                borderTop: schedules.length > 0 ? "1px solid #e0e0e0" : "none",
              }}
            >
              <button
                className="btn btn-info btn-sm"
                onClick={onAddRow}
                title="Agregar nuevo horario"
                disabled={loading}
              >
                <i className="fa fa-plus-circle"></i> Agregar horario
              </button>
              {schedules.length === 0 && (
                <small
                  className="form-text text-muted"
                  style={{ display: "block", marginTop: "8px" }}
                >
                  <i className="fa fa-arrow-right"></i> Comienza agregando un
                  nuevo horario de entrenamiento
                </small>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-white"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSave}
              disabled={loading || schedules.length === 0}
            >
              <i className="fa fa-check"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
