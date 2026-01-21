/**
 * Página de Deportes
 *
 * Permite a los superadministradores:
 * - Ver todos los deportes registrados
 * - Crear nuevos deportes
 * - Actualizar deportes existentes
 * - Eliminar deportes
 * - Reactivar deportes desactivados
 *
 * Solo accesible por superadministradores
 */

import { useState, useEffect } from "react";
import toastr from "toastr";
import { NavHeader } from "../components";
import { sportService, type Sport } from "../services/sportService";

export const Sports = ({ name }: { name?: string }) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await sportService.getAll();
      setSports(data);
    } catch (error: any) {
      console.error("Error al cargar deportes:", error);
      toastr.error(error.message || "Error al cargar los deportes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (sport: Sport) => {
    setEditingId(sport._id);
    setFormData({ name: sport.name });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toastr.warning("El nombre del deporte es requerido");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Actualizar
        const updated = await sportService.update(editingId, {
          name: formData.name,
        });
        setSports(sports.map((s) => (s._id === editingId ? updated : s)));
        toastr.success("Deporte actualizado correctamente");
      } else {
        // Crear
        const created = await sportService.create({
          name: formData.name,
        });
        setSports([...sports, created]);
        toastr.success("Deporte creado correctamente");
      }

      handleCloseModal();
    } catch (error: any) {
      console.error("Error al guardar deporte:", error);
      toastr.error(error.message || "Error al guardar el deporte");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sportId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este deporte?")) {
      return;
    }

    try {
      setLoading(true);
      await sportService.delete(sportId);
      setSports(sports.filter((s) => s._id !== sportId));
      toastr.success("Deporte eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar deporte:", error);
      toastr.error(error.message || "Error al eliminar el deporte");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (sportId: string) => {
    try {
      setLoading(true);
      const restored = await sportService.restore(sportId);
      setSports(sports.map((s) => (s._id === sportId ? restored : s)));
      toastr.success("Deporte reactivado correctamente");
    } catch (error: any) {
      console.error("Error al reactivar deporte:", error);
      toastr.error(error.message || "Error al reactivar el deporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavHeader
        name={name}
        pageCreate="Crear Deporte"
        onCreateClick={handleOpenCreate}
      />

      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Gestión de Deportes</h5>
              </div>
              <div className="ibox-content">
                {loading ? (
                  <div className="text-center">
                    <p>Cargando deportes...</p>
                  </div>
                ) : sports.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">
                      No hay deportes registrados aún. Crea uno nuevo para
                      comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sports.map((sport) => (
                          <tr key={sport._id}>
                            <td>
                              <strong>{sport.name}</strong>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  sport.active
                                    ? "badge-success"
                                    : "badge-danger"
                                }`}
                              >
                                {sport.active ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleOpenEdit(sport)}
                                title="Editar"
                              >
                                <i className="fa fa-edit"></i> Editar
                              </button>{" "}
                              {sport.active ? (
                                <button
                                  className="btn btn-danger btn-xs"
                                  onClick={() => handleDelete(sport._id)}
                                  title="Eliminar"
                                >
                                  <i className="fa fa-trash"></i> Eliminar
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success btn-xs"
                                  onClick={() => handleRestore(sport._id)}
                                  title="Reactivar"
                                >
                                  <i className="fa fa-refresh"></i>
                                </button>
                              )}
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

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={handleCloseModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingId ? "Editar Deporte" : "Crear Deporte"}
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
                  <label>Nombre del Deporte *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Tenis, Fútbol, Baloncesto"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-xs btn-default"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
