import React, { useState } from "react";
import { createPortal } from "react-dom";
import toastr from "toastr";
import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

// Componente para cada item ordenable
const SortableLevelItem: React.FC<{
  level: any;
  isEditing: boolean;
  isLoading: boolean;
  onSelect: (level: any) => void;
  onDelete: (levelId: string) => void;
}> = ({ level, isEditing, isLoading, onSelect, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: level._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        padding: "10px",
        marginBottom: "8px",
        backgroundColor: isEditing ? "#e3f2fd" : "#fff",
        border: isEditing ? "2px solid #2196F3" : "1px solid #ddd",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <i
          className="fa fa-bars"
          style={{
            color: "#999",
            marginTop: "2px",
            flexShrink: 0,
            cursor: "grab",
          }}
          {...attributes}
          {...listeners}
        ></i>
        <div
          style={{ flex: 1, cursor: "pointer" }}
          onClick={() => onSelect(level)}
        >
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
      </div>
      <button
        type="button"
        className="btn btn-danger btn-xs"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(level._id);
        }}
        disabled={isLoading}
        title="Eliminar nivel"
        style={{ marginLeft: "8px" }}
      >
        <i className="fa fa-trash"></i>
      </button>
    </div>
  );
};

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

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.levels);

  // Sensores para dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    try {
      const oldIndex = levels.findIndex((l) => l._id === active.id);
      const newIndex = levels.findIndex((l) => l._id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newLevels = arrayMove(levels, oldIndex, newIndex);

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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "10px",
                        maxHeight: "290px",
                        overflowY: "auto",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <SortableContext
                        items={levels.map((l) => l._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {levels.map((level) => (
                          <SortableLevelItem
                            key={level._id}
                            level={level}
                            isEditing={editingLevelId === level._id}
                            isLoading={loading}
                            onSelect={handleSelectLevel}
                            onDelete={handleDeleteLevel}
                          />
                        ))}
                      </SortableContext>
                    </div>
                  </DndContext>
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
