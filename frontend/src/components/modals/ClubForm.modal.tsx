/**
 * Modal para Crear/Editar Club
 *
 * Componente presentacional que maneja la UI del formulario.
 * No tiene lógica de negocio, solo props.
 */

import React from "react";
import { Button } from "../Button";
import type { CreateClubRequest } from "../../services/clubs.service";

interface ClubFormModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isEditing: boolean;
  formData: CreateClubRequest;
  sports: any[];
  levels?: Array<{
    _id?: string;
    position: number;
    name: string;
    description?: string;
  }>;
  onClose: () => void;
  onSave: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export const ClubFormModal: React.FC<ClubFormModalProps> = ({
  isOpen,
  isLoading,
  isEditing,
  formData,
  sports,
  onClose,
  onSave,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal inmodal"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,.5)",
      }}
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
            <i className="fa fa-building modal-icon"></i>
            <h4 className="modal-title">
              {isEditing ? "Editar Club" : "Crear Club"}
            </h4>
            <small className="font-bold">
              {isEditing
                ? "Actualiza los datos del club"
                : "Completa los datos del nuevo club"}
            </small>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="club-name">Nombre del Club</label>
              <input
                id="club-name"
                type="text"
                className="form-control"
                name="name"
                value={formData.name || ""}
                onChange={onChange}
                placeholder="Ej: Club Deportivo Central"
                disabled={isLoading}
              />
              <small className="form-text text-muted">
                Nombre del club (opcional)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="sport-id">
                Disciplina <span className="text-danger">*</span>
              </label>
              <select
                id="sport-id"
                className="form-control"
                name="sport_id"
                value={formData.sport_id}
                onChange={onChange}
                disabled={isLoading}
              >
                <option value="">-- Selecciona una disciplina --</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Ubicación</label>
              <input
                id="location"
                type="text"
                className="form-control"
                name="location"
                value={formData.location || ""}
                onChange={onChange}
                placeholder="Ej: Cancha 1"
                disabled={isLoading}
              />
              <small className="form-text text-muted">
                Lugar donde se realizan las actividades
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <Button
              type="button"
              variant="primary"
              className="btn-xs"
              onClick={onSave}
              disabled={isLoading}
            >
              {isEditing ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
