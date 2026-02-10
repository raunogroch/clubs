/**
 * Modal para Crear/Editar Grupo
 *
 * Componente presentacional que maneja la UI del formulario.
 * No tiene lógica de negocio, solo props.
 */

import React from "react";
import { Button } from "../Button";
import type { GroupFormState } from "../../features/groups/types";

interface GroupFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  formData: GroupFormState;
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (
    field: keyof GroupFormState,
    value: string | number | undefined,
  ) => void;
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
      className="modal inmodal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-content animated bounceInRight">
          <div className="modal-header">
            <i className="fa fa-sitemap modal-icon"></i>
            <h4 className="modal-title">
              {isEditMode ? "Editar Grupo" : "Crear Grupo"}
            </h4>
            <small className="font-bold">
              {isEditMode
                ? "Actualiza los datos del grupo"
                : "Completa los datos del nuevo grupo"}
            </small>
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
              <label htmlFor="group-name">Nombre del Grupo</label>
              <input
                id="group-name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="Ej: Grupo A"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              {/* description intentionally omitted */}
            </div>

            <div className="form-group">
              <label htmlFor="group-monthly-fee">Precio Mensual (Bs.)</label>
              <input
                id="group-monthly-fee"
                type="number"
                className="form-control"
                value={formData.monthly_fee || ""}
                onChange={(e) =>
                  onFieldChange(
                    "monthly_fee",
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                placeholder="Ej: 50.00"
                step="0.01"
                min="0"
                disabled={loading}
              />
              <small className="form-text text-muted">
                Costo de la inscripción mensual para este grupo
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
              disabled={loading}
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <Button
              type="button"
              variant="primary"
              className="btn-xs"
              onClick={onSave}
              disabled={loading}
            >
              {isEditMode ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
