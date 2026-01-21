/**
 * Modal para Crear/Editar Grupo
 * 
 * Componente presentacional que maneja la UI del formulario.
 * No tiene lógica de negocio, solo props.
 */

import React from 'react';
import type { GroupFormState } from '../types';

interface GroupFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  formData: GroupFormState;
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof GroupFormState, value: string) => void;
}

export const GroupFormModal: React.FC<GroupFormModalProps> = ({
  isOpen,
  isEditMode,
  formData,
  loading,
  onClose,
  onSave,
  onFieldChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              {isEditMode ? 'Editar Grupo' : 'Crear Grupo'}
            </h4>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="group-name">
                Nombre del Grupo <span className="text-danger">*</span>
              </label>
              <input
                id="group-name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder="Ej: Grupo A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="group-description">Descripción</label>
              <textarea
                id="group-description"
                className="form-control"
                value={formData.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                placeholder="Ej: Descripción del grupo"
                rows={3}
              />
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
              disabled={loading}
            >
              {isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
