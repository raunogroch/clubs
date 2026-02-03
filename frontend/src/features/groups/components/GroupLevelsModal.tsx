import React, { useState } from "react";
import toastr from "toastr";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  addClubLevel,
  updateClubLevel,
  deleteClubLevel,
} from "../../../store/levelsThunk";
import type { Group } from "../types";

interface GroupLevelsModalProps {
  isOpen: boolean;
  group: Group | null;
  onClose: () => void;
  onLevelUpdated?: () => void;
}

const GroupLevelsModal: React.FC<GroupLevelsModalProps> = ({
  isOpen,
  group,
  onClose,
  onLevelUpdated,
}) => {
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    position: 1,
    name: "",
    description: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.levels);

  const club = useSelector((state: RootState) =>
    state.clubs.items.find((c: any) => c._id === (group ? group.club_id : "")),
  );
  const levels = (
    club && Array.isArray(club.levels) ? club.levels : []
  ) as Array<any>;

  if (!isOpen || !group) return null;

  const resetForm = () => {
    setFormData({ position: 1, name: "", description: "" });
    setEditingLevelId(null);
    setShowLevelForm(false);
  };

  const handleAddLevel = async () => {
    if (!formData.name.trim()) {
      toastr.warning("El nombre del nivel es requerido");
      return;
    }

    try {
      await dispatch(
        addClubLevel({
          clubId: group.club_id,
          level: {
            position: formData.position,
            name: formData.name,
            description: formData.description,
          },
        }) as any,
      );
      resetForm();
      if (onLevelUpdated) onLevelUpdated();
    } catch (err) {
      console.error("Error al agregar nivel:", err);
    }
  };

  const handleUpdateLevel = async () => {
    if (!formData.name.trim() || !editingLevelId) {
      toastr.warning("El nombre del nivel es requerido");
      return;
    }

    try {
      await dispatch(
        updateClubLevel({
          clubId: group.club_id,
          levelId: editingLevelId,
          level: {
            position: formData.position,
            name: formData.name,
            description: formData.description,
          },
        }) as any,
      );
      resetForm();
      if (onLevelUpdated) onLevelUpdated();
    } catch (err) {
      console.error("Error al actualizar nivel:", err);
    }
  };

  const handleEditLevel = (level: any) => {
    setEditingLevelId(level._id || null);
    setFormData({
      position: level.position || 1,
      name: level.name || "",
      description: level.description || "",
    });
    setShowLevelForm(true);
  };

  const handleDeleteLevel = async (levelId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este nivel?"))
      return;

    try {
      await dispatch(
        deleteClubLevel({ clubId: group.club_id, levelId }) as any,
      );
      if (onLevelUpdated) onLevelUpdated();
    } catch (err) {
      console.error("Error al eliminar nivel:", err);
    }
  };

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              Logros del grupo: <strong>{group.name}</strong>
            </h4>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="modal-body">
            {!showLevelForm ? (
              levels.length === 0 ? (
                <div className="alert alert-info">
                  No hay niveles creados para este club.
                </div>
              ) : (
                <div className="levels-list">
                  {levels.map((level) => (
                    <div
                      key={level._id}
                      style={{
                        padding: 12,
                        marginBottom: 10,
                        backgroundColor: "#f9f9f9",
                        borderLeft: "4px solid #3498db",
                        borderRadius: 4,
                      }}
                    >
                      <div className="row">
                        <div className="col-md-8">
                          <strong style={{ fontSize: "1.1em" }}>
                            {level.position}. {level.name}
                          </strong>
                          {level.description && (
                            <p style={{ marginTop: 6, color: "#666" }}>
                              {level.description}
                            </p>
                          )}
                        </div>
                        <div
                          className="col-md-4"
                          style={{ textAlign: "right" }}
                        >
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => handleEditLevel(level)}
                            disabled={loading}
                            style={{ marginRight: 6 }}
                            title="Editar nivel"
                          >
                            <i className="fa fa-edit" />
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => handleDeleteLevel(level._id || "")}
                            disabled={loading}
                            title="Eliminar nivel"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div>
                <h5 style={{ marginBottom: 12 }}>
                  {editingLevelId ? "Editar Nivel" : "Crear Nuevo Nivel"}
                </h5>
                <div className="form-group">
                  <label>Posición</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: Number(e.target.value),
                      })
                    }
                    min={1}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del Nivel</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {showLevelForm ? (
              <>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editingLevelId ? handleUpdateLevel : handleAddLevel}
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : editingLevelId
                      ? "Actualizar Nivel"
                      : "Agregar Nivel"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setShowLevelForm(true);
                    setFormData({
                      position: levels.length + 1,
                      name: "",
                      description: "",
                    });
                  }}
                  disabled={loading}
                >
                  <i className="fa fa-plus" /> Agregar Nivel
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { GroupLevelsModal };
export default GroupLevelsModal;
