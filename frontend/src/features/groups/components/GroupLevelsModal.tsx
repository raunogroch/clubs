/**
 * Modal para gestionar logros/levels de un grupo
 *
 * Permite ver y crear levels asignados a un grupo específico
 */

import React, { useState, useEffect } from "react";
import toastr from "toastr";
import levelsService from "../../../services/levelsService";
import type { Group } from "../types";

interface LevelAssignment {
  order: number;
  name: string;
  description?: string;
}

interface Level {
  _id?: string;
  name: string;
  level_assignment: LevelAssignment[];
  createdAt?: string;
  updatedAt?: string;
}

interface GroupLevelsModalProps {
  isOpen: boolean;
  group: Group | null;
  onClose: () => void;
}

export const GroupLevelsModal: React.FC<GroupLevelsModalProps> = ({
  isOpen,
  group,
  onClose,
}) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelAssignments, setNewLevelAssignments] = useState<
    LevelAssignment[]
  >([]);

  useEffect(() => {
    if (isOpen && group) {
      loadLevels();
      // Cargar los levels asignados al grupo desde localStorage o estado
      const groupLevels = localStorage.getItem(`group_levels_${group._id}`);
      if (groupLevels) {
        try {
          setSelectedLevels(JSON.parse(groupLevels));
        } catch {
          setSelectedLevels([]);
        }
      } else {
        setSelectedLevels([]);
      }
    }
  }, [isOpen, group]);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const data = await levelsService.getAll();
      setLevels(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error al cargar niveles:", error);
      setLevels([]);
      toastr.error("Error al cargar los niveles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = () => {
    const newAssignment: LevelAssignment = {
      order: (newLevelAssignments.length || 0) + 1,
      name: "",
      description: "",
    };
    setNewLevelAssignments([...newLevelAssignments, newAssignment]);
  };

  const handleRemoveAssignment = (index: number) => {
    const updated = newLevelAssignments.filter((_, i) => i !== index);
    setNewLevelAssignments(updated);
  };

  const handleAssignmentChange = (index: number, field: string, value: any) => {
    const updated = [...newLevelAssignments];
    updated[index] = { ...updated[index], [field]: value };
    setNewLevelAssignments(updated);
  };

  const handleCreateLevel = async () => {
    if (!newLevelName.trim()) {
      toastr.warning("El nombre del nivel es requerido");
      return;
    }

    if (newLevelAssignments.length === 0) {
      toastr.warning("Debe agregar al menos una asignación");
      return;
    }

    try {
      setLoading(true);
      if (editingLevelId) {
        // Modo edición
        const updatedLevel = await levelsService.update(editingLevelId, {
          name: newLevelName,
          level_assignment: newLevelAssignments,
        });
        setLevels(
          levels.map((l) => (l._id === editingLevelId ? updatedLevel : l)),
        );
        toastr.success("Nivel actualizado exitosamente");
      } else {
        // Modo creación
        const newLevel = await levelsService.create({
          name: newLevelName,
          level_assignment: newLevelAssignments,
        });

        setLevels([...levels, newLevel]);
        toastr.success("Nivel creado exitosamente");
      }
      setNewLevelName("");
      setNewLevelAssignments([]);
      setEditingLevelId(null);
      setShowLevelForm(false);
    } catch (error: any) {
      console.error("Error al guardar nivel:", error);
      toastr.error(
        error.response?.data?.message || "Error al guardar el nivel",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLevel = (levelId: string) => {
    const updated = selectedLevels.includes(levelId)
      ? selectedLevels.filter((id) => id !== levelId)
      : [...selectedLevels, levelId];

    setSelectedLevels(updated);
    if (group) {
      localStorage.setItem(
        `group_levels_${group._id}`,
        JSON.stringify(updated),
      );
    }
    toastr.success("Logros actualizados para el grupo");
  };

  const handleEditLevel = (level: Level) => {
    setEditingLevelId(level._id || null);
    setNewLevelName(level.name);
    setNewLevelAssignments([...level.level_assignment]);
    setShowLevelForm(true);
  };

  const handleDeleteLevel = async (levelId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este nivel?")) {
      return;
    }

    try {
      setLoading(true);
      await levelsService.delete(levelId);
      setLevels(levels.filter((l) => l._id !== levelId));
      toastr.success("Nivel eliminado exitosamente");
    } catch (error: any) {
      console.error("Error al eliminar nivel:", error);
      toastr.error("Error al eliminar el nivel");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !group) return null;

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
            {loading && !showLevelForm && (
              <div className="text-center">
                <p>Cargando niveles...</p>
              </div>
            )}

            {!loading && !showLevelForm && (
              <>
                {!levels || levels.length === 0 ? (
                  <div className="alert alert-info">
                    No hay niveles disponibles. Crea uno nuevo.
                  </div>
                ) : (
                  <div className="levels-list">
                    {Array.isArray(levels) &&
                      levels.map((level) => (
                        <div
                          key={level._id}
                          style={{
                            padding: "10px",
                            marginBottom: "10px",
                            backgroundColor: selectedLevels.includes(
                              level._id || "",
                            )
                              ? "#d4edda"
                              : "#f9f9f9",
                            borderLeft: "3px solid #3498db",
                            borderRadius: "4px",
                          }}
                        >
                          <div className="row">
                            <div className="col-md-8">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`level_${level._id}`}
                                  checked={selectedLevels.includes(
                                    level._id || "",
                                  )}
                                  onChange={() =>
                                    handleToggleLevel(level._id || "")
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`level_${level._id}`}
                                >
                                  <strong>{level.name}</strong>
                                  <div
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "0.9em",
                                      color: "#666",
                                    }}
                                  >
                                    {level.level_assignment.map(
                                      (assignment, idx) => (
                                        <div key={idx}>
                                          <span className="badge badge-secondary">
                                            {assignment.order}.{" "}
                                            {assignment.name}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </label>
                              </div>
                            </div>
                            <div
                              className="col-md-4"
                              style={{ textAlign: "right" }}
                            >
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleEditLevel(level)}
                                disabled={loading}
                                title="Editar nivel"
                                style={{ marginRight: "5px" }}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() =>
                                  handleDeleteLevel(level._id || "")
                                }
                                disabled={loading}
                                title="Eliminar nivel"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {showLevelForm && (
              <div>
                <div style={{ marginBottom: "15px" }}>
                  <h5>
                    {editingLevelId ? "Editar Nivel" : "Crear Nuevo Nivel"}
                  </h5>
                </div>
                <div className="form-group">
                  <label>Nombre del Nivel</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newLevelName}
                    onChange={(e) => setNewLevelName(e.target.value)}
                    placeholder="Ej: Nivel Principiante"
                  />
                </div>

                <div className="form-group">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <label>Asignaciones</label>
                    <button
                      className="btn btn-xs btn-success"
                      onClick={handleAddAssignment}
                      type="button"
                    >
                      <i className="fa fa-plus"></i> Agregar
                    </button>
                  </div>

                  {newLevelAssignments.length === 0 ? (
                    <div className="alert alert-info">
                      Agrega al menos una asignación
                    </div>
                  ) : (
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "4px",
                      }}
                    >
                      {newLevelAssignments.map((assignment, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "15px",
                            padding: "10px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "4px",
                            borderLeft: "3px solid #3498db",
                          }}
                        >
                          <div className="row">
                            <div className="col-md-2">
                              <label>Orden</label>
                              <input
                                type="number"
                                className="form-control"
                                value={assignment.order}
                                onChange={(e) =>
                                  handleAssignmentChange(
                                    index,
                                    "order",
                                    Number(e.target.value),
                                  )
                                }
                                min="1"
                              />
                            </div>
                            <div className="col-md-5">
                              <label>Nombre</label>
                              <input
                                type="text"
                                className="form-control"
                                value={assignment.name}
                                onChange={(e) =>
                                  handleAssignmentChange(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: Nivel 1"
                              />
                            </div>
                            <div className="col-md-5">
                              <label>Descripción</label>
                              <input
                                type="text"
                                className="form-control"
                                value={assignment.description || ""}
                                onChange={(e) =>
                                  handleAssignmentChange(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: Descripción..."
                              />
                            </div>
                          </div>
                          <button
                            className="btn btn-xs btn-danger"
                            onClick={() => handleRemoveAssignment(index)}
                            style={{ marginTop: "10px" }}
                            type="button"
                          >
                            <i className="fa fa-trash"></i> Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  onClick={() => {
                    setShowLevelForm(false);
                    setNewLevelName("");
                    setNewLevelAssignments([]);
                    setEditingLevelId(null);
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateLevel}
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : editingLevelId
                      ? "Actualizar Nivel"
                      : "Crear Nivel"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowLevelForm(true)}
                  disabled={loading}
                >
                  <i className="fa fa-plus"></i> Crear Nuevo Nivel
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

export default GroupLevelsModal;
