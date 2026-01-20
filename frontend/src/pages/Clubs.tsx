/**
 * Página de Clubs
 *
 * Permite a los administradores con assignments asignados:
 * - Ver todos los clubs de sus assignments
 * - Crear nuevos clubs
 * - Actualizar clubs existentes
 * - Eliminar clubs
 * - Gestionar miembros de clubs
 *
 * Solo accesible por administradores con assignments asignados
 */

import { useState, useEffect } from "react";
import toastr from "toastr";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import type { Club, CreateClubRequest } from "../services/clubs.service";
import clubsService from "../services/clubs.service";
import assignmentsService from "../services/assignments.service";
import { NavHeader } from "../components";

interface Assignment {
  _id: string;
  module_name: string;
  assigned_admins: string[];
  assigned_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const Clubs = ({ name }: { name?: string }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Estado
  const [clubs, setClubs] = useState<Club[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulario
  const [formData, setFormData] = useState<CreateClubRequest>({
    name: "",
    description: "",
    location: "",
    assignment_id: "",
  });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Cargar clubs y asignaciones
  const loadData = async () => {
    try {
      setLoading(true);
      const [clubsData, assignmentsData] = await Promise.all([
        clubsService.getAll(),
        assignmentsService.getMyAssignments(),
      ]);
      setClubs(clubsData);
      setAssignments(assignmentsData);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toastr.error(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre de asignación por ID
  const getAssignmentName = (assignmentId: string): string => {
    const assignment = assignments.find((a) => a._id === assignmentId);
    return assignment?.module_name || "Desconocida";
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      location: "",
      assignment_id: assignments[0]?._id || "",
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (club: Club) => {
    setEditingId(club._id);
    setFormData({
      name: club.name,
      description: club.description || "",
      location: club.location || "",
      assignment_id: club.assignment_id,
    });
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      location: "",
      assignment_id: assignments[0]?._id || "",
    });
  };

  // Cambiar campo del formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Guardar club (crear o actualizar)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toastr.warning("El nombre del club es requerido");
      return;
    }

    if (!formData.assignment_id) {
      toastr.warning("Debes seleccionar una asignación");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Actualizar
        const updated = await clubsService.update(editingId, {
          name: formData.name,
          description: formData.description,
          location: formData.location,
        });
        setClubs(clubs.map((c) => (c._id === editingId ? updated : c)));
        toastr.success("Club actualizado correctamente");
      } else {
        // Crear
        const created = await clubsService.create(formData);
        setClubs([...clubs, created]);
        toastr.success("Club creado correctamente");
      }

      handleCloseModal();
    } catch (error: any) {
      console.error("Error al guardar club:", error);
      toastr.error(error.message || "Error al guardar el club");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar club
  const handleDelete = async (clubId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este club?")) {
      return;
    }

    try {
      setLoading(true);
      await clubsService.delete(clubId);
      setClubs(clubs.filter((c) => c._id !== clubId));
      toastr.success("Club eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar club:", error);
      toastr.error(error.message || "Error al eliminar el club");
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario tiene asignaciones
  const hasAssignments =
    user?.role === "admin" &&
    Array.isArray((user as any)?.assignments) &&
    (user as any).assignments.length > 0;

  // Si es admin sin asignaciones, mostrar mensaje
  if (user?.role === "admin" && !hasAssignments) {
    return (
      <>
        <NavHeader name={name} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-warning">⚠️ Sin Asignación</h3>
            <div className="error-desc">
              <p>
                Aún no has sido asignado a ningún módulo. Por favor, ponte en
                contacto con el superadministrador para que te asigne a los
                módulos correspondientes.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Gestión de Clubs</h5>
                <div className="ibox-tools">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleOpenCreate}
                    disabled={loading || assignments.length === 0}
                  >
                    <i className="fa fa-plus"></i> Crear Club
                  </button>
                </div>
              </div>
              <div className="ibox-content">
                {loading ? (
                  <div className="text-center">
                    <p>Cargando clubs...</p>
                  </div>
                ) : clubs.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">
                      No hay clubs creados aún. Crea uno nuevo para comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Ubicación</th>
                          <th>Asignación</th>
                          <th>Miembros</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clubs.map((club) => (
                          <tr key={club._id}>
                            <td>
                              <strong>{club.name}</strong>
                            </td>
                            <td>{club.description || "-"}</td>
                            <td>{club.location || "-"}</td>
                            <td>{getAssignmentName(club.assignment_id)}</td>
                            <td>
                              <span className="badge badge-primary">
                                {club.members.length}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleOpenEdit(club)}
                                title="Editar"
                              >
                                <i className="fa fa-edit"></i>
                              </button>{" "}
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => handleDelete(club._id)}
                                title="Eliminar"
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
                  {editingId ? "Editar Club" : "Crear Club"}
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
                  <label>Nombre del Club *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Club de Tenis"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Descripción del club"
                    rows={3}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    placeholder="Ej: Cancha 1"
                  />
                </div>

                {!editingId && (
                  <div className="form-group">
                    <label>Asignación *</label>
                    <select
                      className="form-control"
                      name="assignment_id"
                      value={formData.assignment_id}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una asignación</option>
                      {assignments.map((assignment) => (
                        <option key={assignment._id} value={assignment._id}>
                          {assignment.module_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
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
