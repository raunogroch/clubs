/**
 * Modal para Editar Horarios
 * 
 * Componente presentacional que maneja la edición de horarios.
 */

import React from 'react';
import type { Schedule } from '../types';
import { DayName } from '../types';
import { CONFIG } from '../constants';

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
      className="modal"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Editar Horarios</h4>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
              disabled={loading}
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div
              style={{ maxHeight: `${CONFIG.SCHEDULE_MODAL_MAX_HEIGHT}px`, overflowY: 'auto' }}
            >
              {schedules.map((schedule, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  {/* Selector de día */}
                  <div style={{ flex: '0 1 120px' }}>
                    <select
                      className="form-control"
                      value={schedule.day}
                      onChange={(e) =>
                        onUpdateRow(idx, 'day', e.target.value)
                      }
                      disabled={loading}
                    >
                      <option value="Monday">{DayName.Monday}</option>
                      <option value="Tuesday">{DayName.Tuesday}</option>
                      <option value="Wednesday">{DayName.Wednesday}</option>
                      <option value="Thursday">{DayName.Thursday}</option>
                      <option value="Friday">{DayName.Friday}</option>
                      <option value="Saturday">{DayName.Saturday}</option>
                      <option value="Sunday">{DayName.Sunday}</option>
                    </select>
                  </div>

                  {/* Input hora inicio */}
                  <div style={{ flex: '0 1 110px' }}>
                    <input
                      type="time"
                      className="form-control"
                      value={schedule.startTime}
                      onChange={(e) =>
                        onUpdateRow(idx, 'startTime', e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  {/* Input hora fin */}
                  <div style={{ flex: '0 1 110px' }}>
                    <input
                      type="time"
                      className="form-control"
                      value={schedule.endTime}
                      onChange={(e) =>
                        onUpdateRow(idx, 'endTime', e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  {/* Botón eliminar fila */}
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => onRemoveRow(idx)}
                    title="Remover fila"
                    disabled={loading}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Botón agregar fila */}
            <div style={{ marginTop: '15px' }}>
              <button
                className="btn btn-xs btn-info"
                onClick={onAddRow}
                title="Agregar nueva fila"
                disabled={loading}
              >
                <i className="fa fa-plus"></i> Agregar horario
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-xs btn-primary"
              onClick={onSave}
              disabled={loading || schedules.length === 0}
            >
              <i className="fa fa-save"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
