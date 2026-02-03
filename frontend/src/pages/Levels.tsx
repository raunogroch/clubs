import { useState, useEffect } from "react";
import toastr from "toastr";
import { NavHeader } from "../components";
import levelsService from "../services/levelsService";
import type { pageParamProps } from "../interfaces/pageParamProps";

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

export const Levels = ({ name }: pageParamProps) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Level>({
    name: "",
    level_assignment: [],
  });

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const data = await levelsService.getAll();
      setLevels(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error al cargar niveles:", error);
      toastr.error("Error al cargar los niveles");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (level?: Level) => {
    if (level) {
      setEditingId(level._id || null);
      setFormData({ ...level });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        level_assignment: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      level_assignment: [],
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toastr.warning("El nombre es requerido");
      return;
    }

    if (formData.level_assignment.length === 0) {
      toastr.warning("Debe agregar al menos un nivel");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await levelsService.update(editingId, formData);
        toastr.success("Nivel actualizado exitosamente");
      } else {
        await levelsService.create(formData);
        toastr.success("Nivel creado exitosamente");
      }
      handleCloseModal();
      loadLevels();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      toastr.error(error.response?.data?.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este nivel?")) {
      return;
    }

    try {
      setLoading(true);
      await levelsService.delete(id);
      toastr.success("Nivel eliminado exitosamente");
      loadLevels();
    } catch (error: any) {
      console.error("Error al eliminar:", error);
      toastr.error("Error al eliminar el nivel");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = () => {
    const newAssignment: LevelAssignment = {
      order: (formData.level_assignment.length || 0) + 1,
      name: "",
      description: "",
    };
    setFormData({
      ...formData,
      level_assignment: [...formData.level_assignment, newAssignment],
    });
  };

  const handleRemoveAssignment = (index: number) => {
    const updated = formData.level_assignment.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      level_assignment: updated,
    });
  };

  const handleAssignmentChange = (index: number, field: string, value: any) => {
    const updated = [...formData.level_assignment];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      level_assignment: updated,
    });
  };

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Niveles</h5>
                <div className="ibox-tools">
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => handleOpenModal()}
                    disabled={loading}
                  >
                    <i className="fa fa-plus"></i> Crear Nivel
                  </button>
                </div>
              </div>

              <div className="ibox-content">
                {loading && !showModal && (
                  <div className="text-center">
                    <p>Cargando...</p>
                  </div>
                )}

                {!loading && levels.length === 0 && (
                  <div className="text-center text-muted">
                    <p>No hay niveles creados</p>
                  </div>
                )}

                {levels.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Asignaciones</th>
                          <th>Fecha Creación</th>
                          <th style={{ textAlign: "center" }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {levels.map((level) => (
                          <tr key={level._id}>
                            <td>
                              <strong>{level.name}</strong>
                            </td>
                            <td>
                              <span className="badge badge-info">
                                {level.level_assignment.length}
                              </span>
                            </td>
                            <td>
                              {level.createdAt
                                ? new Date(level.createdAt).toLocaleDateString(
                                    "es-ES",
                                  )
                                : "-"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="btn btn-xs btn-warning"
                                onClick={() => handleOpenModal(level)}
                                disabled={loading}
                                title="Editar"
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-xs btn-danger"
                                onClick={() => handleDelete(level._id!)}
                                disabled={loading}
                                title="Eliminar"
                                style={{ marginLeft: "5px" }}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingId ? "Editar Nivel" : "Crear Nivel"}
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre del Nivel</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Principiante, Intermedio, Avanzado"
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

                  {formData.level_assignment.length === 0 ? (
                    <div className="alert alert-info">
                      Agrega al menos una asignación
                    </div>
                  ) : (
                    <div
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "4px",
                      }}
                    >
                      {formData.level_assignment.map((assignment, index) => (
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

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Levels;
