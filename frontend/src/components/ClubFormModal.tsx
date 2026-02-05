import React from "react";
import { Button } from "./Button";
import type { CreateClubRequest } from "../services/clubs.service";

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
  levels = [],
  onClose,
  onSave,
  onChange,
}) => {
  // Debug logging
  React.useEffect(() => {
    if (isEditing && levels.length > 0) {
      console.log("DEBUG ClubFormModal - Rendering levels:", levels.length);
    }
  }, [isEditing, levels]);

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
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

            {isEditing && (
              <div className="form-group">
                <label>Niveles/Logros</label>
                {levels && levels.length > 0 ? (
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <table className="table table-sm table-striped table-hover">
                      <thead className="bg-light">
                        <tr>
                          <th style={{ width: "80px", textAlign: "center" }}>
                            Posición
                          </th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...levels]
                          .sort((a, b) => a.position - b.position)
                          .map((level) => (
                            <tr key={level._id || `level-${level.position}`}>
                              <td style={{ textAlign: "center" }}>
                                <span className="badge badge-info">
                                  {level.position}
                                </span>
                              </td>
                              <td>
                                <strong>{level.name}</strong>
                              </td>
                              <td
                                className="text-muted"
                                style={{ fontSize: "0.9em" }}
                              >
                                {level.description || <em>Sin descripción</em>}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className="alert alert-info alert-sm"
                    style={{ marginBottom: 0, padding: "10px" }}
                  >
                    <i className="fa fa-info-circle"></i> Este club no tiene
                    niveles/logros configurados aún.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
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
