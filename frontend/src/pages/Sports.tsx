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
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchAllSports,
  createSport,
  updateSport,
  deleteSport,
  restoreSport,
} from "../store/sportsThunk";
import { NavHeader } from "../components";
import type { Sport } from "../services/sportService";

export const Sports = ({ name }: { name?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: sports, status: sportsStatus } = useSelector(
    (state: RootState) => state.sports,
  );
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  // Cargar datos al montar
  useEffect(() => {
    dispatch(fetchAllSports());
  }, [dispatch]);

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

    if (editingId) {
      // Actualizar
      await dispatch(
        updateSport({ id: editingId, sport: { name: formData.name } }),
      );
    } else {
      // Crear
      await dispatch(createSport({ name: formData.name }));
    }

    handleCloseModal();
  };

  const handleDelete = async (sportId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este deporte?")) {
      return;
    }

    await dispatch(deleteSport(sportId));
  };

  const handleRestore = async (sportId: string) => {
    await dispatch(restoreSport(sportId));
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
                {sportsStatus === "loading" ? (
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
                                onClick={() => handleOpenEdit(sport as any)}
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
                  disabled={sportsStatus === "loading"}
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
