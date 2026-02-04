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
  initialLevels?: Array<{
    _id?: string;
    position: number;
    name: string;
    description?: string;
  }>;
}

const GroupLevelsModal: React.FC<GroupLevelsModalProps> = ({
  isOpen,
  group,
  onClose,
  onLevelUpdated,
  initialLevels = [],
}) => {
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [draggedLevelId, setDraggedLevelId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.levels);

  // Obtener levels del grupo/club que se pasa como prop o del initialLevels
  const rawLevels =
    initialLevels.length > 0
      ? initialLevels
      : (((group as any) && Array.isArray((group as any).levels)
          ? (group as any).levels
          : []) as Array<any>);

  // Ordenar niveles por posición
  const levels = [...rawLevels].sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );

  if (!isOpen || !group) return null;

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingLevelId(null);
  };

  const handleAddLevel = async () => {
    if (!formData.name.trim()) {
      toastr.warning("El nombre del nivel es requerido");
      return;
    }

    try {
      const nextPosition =
        levels.length > 0
          ? Math.max(...levels.map((l) => l.position || 0)) + 1
          : 1;

      await dispatch(
        addClubLevel({
          clubId: group.club_id,
          level: {
            position: nextPosition,
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
      const currentLevel = levels.find((l) => l._id === editingLevelId);
      await dispatch(
        updateClubLevel({
          clubId: group.club_id,
          levelId: editingLevelId,
          level: {
            position: currentLevel?.position || 1,
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

  const handleSelectLevel = (level: any) => {
    setEditingLevelId(level._id || null);
    setFormData({
      name: level.name || "",
      description: level.description || "",
    });
  };

  const handleDeleteLevel = async (levelId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este nivel?"))
      return;

    try {
      await dispatch(
        deleteClubLevel({ clubId: group.club_id, levelId }) as any,
      );
      if (editingLevelId === levelId) {
        resetForm();
      }
      if (onLevelUpdated) onLevelUpdated();
    } catch (err) {
      console.error("Error al eliminar nivel:", err);
    }
  };

  const handleDragStart = (levelId: string) => {
    setDraggedLevelId(levelId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (targetLevel: any) => {
    if (!draggedLevelId || draggedLevelId === targetLevel._id) return;

    try {
      // Encontrar índices en la lista ordenada
      const draggedIndex = levels.findIndex((l) => l._id === draggedLevelId);
      const targetIndex = levels.findIndex((l) => l._id === targetLevel._id);

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Crear copia y reorganizar
      const newLevels = [...levels];
      const [draggedLevel] = newLevels.splice(draggedIndex, 1);
      newLevels.splice(targetIndex, 0, draggedLevel);

      // Crear actualizaciones con nuevas posiciones secuenciales
      const updatesToMake = newLevels.map((level, index) => ({
        levelId: level._id!,
        newPosition: index + 1,
      }));

      // Actualizar todas las posiciones en paralelo
      const updatePromises = updatesToMake.map((update) =>
        dispatch(
          updateClubLevel({
            clubId: group.club_id,
            levelId: update.levelId,
            level: { position: update.newPosition },
          }) as any,
        ),
      );

      await Promise.all(updatePromises);
      if (onLevelUpdated) onLevelUpdated();
    } catch (err) {
      console.error("Error al reordenar niveles:", err);
      toastr.error("Error al reordenar los niveles");
    }

    setDraggedLevelId(null);
  };

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1000px" }}
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

          <div
            className="modal-body"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            <div className="row" style={{ height: "100%" }}>
              {/* Columna Izquierda - Lista con Drag & Drop */}
              <div className="col-md-5">
                <h5 style={{ marginBottom: "15px" }}>
                  <i className="fa fa-list"></i> Niveles
                </h5>

                {levels.length === 0 ? (
                  <div className="alert alert-info">
                    No hay niveles creados. Crea uno nuevo en el formulario.
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "10px",
                      minHeight: "300px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    {levels.map((level) => (
                      <div
                        key={level._id}
                        draggable
                        onDragStart={() => handleDragStart(level._id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(level)}
                        onClick={() => handleSelectLevel(level)}
                        style={{
                          padding: "10px",
                          marginBottom: "8px",
                          backgroundColor:
                            editingLevelId === level._id ? "#e3f2fd" : "#fff",
                          border:
                            editingLevelId === level._id
                              ? "2px solid #2196F3"
                              : "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "move",
                          userSelect: "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <strong>{level.name}</strong>
                            {level.description && (
                              <p
                                style={{
                                  fontSize: "0.85em",
                                  color: "#999",
                                  marginTop: "3px",
                                  marginBottom: 0,
                                }}
                              >
                                {level.description.substring(0, 40)}
                                {level.description.length > 40 ? "..." : ""}
                              </p>
                            )}
                          </div>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLevel(level._id);
                            }}
                            disabled={loading}
                            title="Eliminar nivel"
                            style={{ marginLeft: "8px" }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Columna Derecha - Formulario */}
              <div className="col-md-7">
                <h5 style={{ marginBottom: "15px" }}>
                  <i className="fa fa-plus-circle"></i>{" "}
                  {editingLevelId ? "Editar Nivel" : "Crear Nuevo Nivel"}
                </h5>

                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
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
                      placeholder="Ej: Cinturón Blanco"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      disabled={loading}
                      placeholder="Describe los requisitos o características de este nivel..."
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={
                        editingLevelId ? handleUpdateLevel : handleAddLevel
                      }
                      disabled={loading || !formData.name.trim()}
                      style={{ flex: 1 }}
                    >
                      {loading
                        ? "Guardando..."
                        : editingLevelId
                          ? "Actualizar Nivel"
                          : "Agregar Nivel"}
                    </button>
                    {editingLevelId && (
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={resetForm}
                        disabled={loading}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>

                {editingLevelId && (
                  <div
                    className="alert alert-info"
                    style={{ marginTop: "15px" }}
                  >
                    <small>
                      <i className="fa fa-info-circle"></i> Nivel seleccionado
                      para edición. Modifica los campos y haz clic en
                      "Actualizar Nivel" o haz clic en "Limpiar" para
                      deseleccionar.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              onClick={onClose}
              disabled={loading}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GroupLevelsModal };
export default GroupLevelsModal;
