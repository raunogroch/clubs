import React from "react";
import type { CreateClubRequest } from "../services/clubs.service";

interface ClubFormModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isEditing: boolean;
  formData: CreateClubRequest;
  sports: any[];
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
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              {isEditing ? "Editar Club" : "Crear Club"}
            </h4>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Deporte *</label>
              <select
                className="form-control"
                name="sport_id"
                value={formData.sport_id}
                onChange={onChange}
              >
                <option value="">-- Selecciona un deporte --</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location || ""}
                onChange={onChange}
                placeholder="Ej: Cancha 1"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-xs btn-primary"
              onClick={onSave}
              disabled={isLoading}
            >
              {isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
