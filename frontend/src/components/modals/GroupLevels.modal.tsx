import React, { useState } from "react";
import { createPortal } from "react-dom";
import toastr from "toastr";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
import type { AppDispatch, RootState } from "../../store/store";
import {
  addClubLevel,
  updateClubLevel,
  deleteClubLevel,
} from "../../store/levelsThunk";
import type { Group } from "../../features/groups/types";

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

  if (!isOpen || !group) return null;

  const modalContent = (
    <div
      className="modal inmodal"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 99999,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          pointerEvents: "auto",
          width: "90vw",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <div
          className="modal-content animated bounceInRight"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="modal-header">
            <Button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
              disabled={loading}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
            <i className="fa fa-trophy modal-icon"></i>
            <h4 className="modal-title">Logros del grupo</h4>
            <small className="font-bold">
              Gestiona los niveles y logros del grupo:{" "}
              <strong>{group.name}</strong>
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
            <div className="row" style={{ height: "100%", display: "flex" }}>
              {/* Columna Izquierda - Lista con Drag & Drop */}
              <div
                className="col-md-5"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h5 style={{ marginBottom: "15px" }}>
                  <i className="fa fa-list"></i> Niveles
                </h5>

                {levels.length === 0 ? (
                  <div
                    className="alert alert-info alert-with-icon"
                    data-notify="container"
                  >
                    <span
                      data-notify="icon"
                      className="fa fa-info-circle"
                    ></span>
                    <span data-notify="message">
                      <strong>Sin niveles:</strong> Crea uno nuevo en el
                      formulario.
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "10px",
                      flex: 1,
                      overflowY: "auto",
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
                            type="button"
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
              <div
                className="col-md-7"
                style={{ display: "flex", flexDirection: "column" }}
              >
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
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="level-name">Nombre del Nivel</label>
                    <input
                      id="level-name"
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

                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="level-description">Descripción</label>
                    <textarea
                      id="level-description"
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
                      style={{ resize: "vertical" }}
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
                    className="alert alert-info alert-with-icon"
                    style={{ marginTop: "15px" }}
                    data-notify="container"
                  >
                    <span
                      data-notify="icon"
                      className="fa fa-info-circle"
                    ></span>
                    <span data-notify="message">
                      <strong>Edición:</strong> Modifica los campos y haz clic
                      en "Actualizar Nivel" o "Limpiar" para deseleccionar.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              className="btn btn-default"
              onClick={onClose}
              disabled={loading}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export { GroupLevelsModal };
export default GroupLevelsModal;
