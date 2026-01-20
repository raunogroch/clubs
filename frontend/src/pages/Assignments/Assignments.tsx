/**
 * Página de Asignaciones
 *
 * Permite al superadmin:
 * - Ver todas las asignaciones de módulos a administradores
 * - Crear nuevas asignaciones
 * - Actualizar asignaciones existentes
 * - Eliminar asignaciones
 *
 * Solo accesible por superadministrador
 */

import { useState, useEffect } from "react";
import toastr from "toastr";

import type {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "../../services/assignments.service";
import assignmentsService from "../../services/assignments.service";
import userService from "../../services/userService";
import { NavHeader } from "../../components";

interface User {
  _id: string;
  name?: string;
  lastname?: string;
  username: string;
  role: string;
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filteredAdmins, setFilteredAdmins] = useState<User[]>([]);

  // Formulario
  const [formData, setFormData] = useState({
    module_name: "",
    assigned_admins: [] as string[],
  });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Cargar asignaciones y usuarios
  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, usersData] = await Promise.all([
        assignmentsService.getAll(),
        userService.getAdmins(),
      ]);
      setAssignments(assignmentsData);
      setUsers(usersData.data || []);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toastr.error(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre completo del usuario por ID
  const getUserName = (userId: string): string => {
    const user = users.find((u) => u._id === userId);
    if (!user) return "Desconocido";

    const fullName = [user.name, user.lastname].filter(Boolean).join(" ");

    return fullName.trim() || user.username || "Desconocido";
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      module_name: "",
      assigned_admins: [],
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (assignment: Assignment) => {
    setEditingId(assignment._id);
    setFormData({
      module_name: assignment.module_name,
      assigned_admins: assignment.assigned_admins,
    });
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      module_name: "",
      assigned_admins: [],
    });
  };

  // Cambiar nombre del módulo
  const handleModuleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      module_name: e.target.value,
    });
  };

  // Agregar admin a la selección
  const handleAddAdmin = (adminId: string) => {
    if (!formData.assigned_admins.includes(adminId)) {
      setFormData({
        ...formData,
        assigned_admins: [...formData.assigned_admins, adminId],
      });
    }
  };

  // Eliminar admin de la selección
  const handleRemoveAdmin = (adminId: string) => {
    setFormData({
      ...formData,
      assigned_admins: formData.assigned_admins.filter((id) => id !== adminId),
    });
  };

  // Filtrar admins que no están asignados
  const handleFilterAdmins = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFilteredAdmins([]);
    } else {
      const filtered = users.filter(
        (user) =>
          user.role === "admin" &&
          !formData.assigned_admins.includes(user._id) &&
          (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())),
      );
      setFilteredAdmins(filtered);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.module_name.trim()) {
      toastr.warning("El nombre del módulo es requerido");
      return;
    }

    if (formData.assigned_admins.length === 0) {
      toastr.warning("Debes asignar al menos un administrador");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const updateData: UpdateAssignmentRequest = {
          module_name: formData.module_name,
          assigned_admins: formData.assigned_admins,
        };
        await assignmentsService.update(editingId, updateData);
        toastr.success("Asignación actualizada correctamente");
      } else {
        const createData: CreateAssignmentRequest = {
          module_name: formData.module_name,
          assigned_admins: formData.assigned_admins,
        };
        await assignmentsService.create(createData);
        toastr.success("Asignación creada correctamente");
      }

      handleCloseModal();
      loadData();
    } catch (error: any) {
      toastr.error(error.message || "Error al guardar la asignación");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar asignación
  const handleDelete = async (id: string) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar esta asignación?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await assignmentsService.delete(id);
      toastr.success("Asignación eliminada correctamente");
      loadData();
    } catch (error: any) {
      toastr.error(error.message || "Error al eliminar la asignación");
    } finally {
      setLoading(false);
    }
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="wrapper wrapper-content">
        <div className="text-center p-5">
          <p className="text-muted">Cargando asignaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavHeader
        name="Asignaciones de Módulos"
        pageCreate="Crear"
        onCreateClick={handleOpenCreate}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="ibox float-e-margins">
          <div className="ibox-content">
            {assignments.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Módulo</th>
                      <th>Administradores Asignados</th>
                      <th>Estado</th>
                      <th style={{ textAlign: "center" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr
                        key={assignment._id}
                        style={{ verticalAlign: "middle" }}
                      >
                        <td style={{ verticalAlign: "middle" }}>
                          {assignment.module_name}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "5px",
                            }}
                          >
                            {assignment.assigned_admins.map((adminId) => (
                              <span
                                key={adminId}
                                className="label label-primary"
                                style={{
                                  borderRadius: "20px",
                                  padding: "4px 10px",
                                  fontSize: "11px",
                                }}
                              >
                                {getUserName(adminId)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <span
                            className={`label ${
                              assignment.is_active
                                ? "label-primary"
                                : "label-danger"
                            }`}
                          >
                            {assignment.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-xs btn-success mx-1"
                            onClick={() => handleOpenEdit(assignment)}
                            title="Editar"
                          >
                            <i className="fa fa-pencil"></i> Editar
                          </button>
                          <button
                            className="btn btn-xs btn-danger mx-1"
                            onClick={() => handleDelete(assignment._id)}
                            title="Eliminar"
                          >
                            <i className="fa fa-trash"></i> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info m-t-20">
                <p style={{ marginBottom: "15px" }}>
                  No hay asignaciones creadas
                </p>
                <button className="btn btn-primary" onClick={handleOpenCreate}>
                  Crear primera asignación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingId ? "Editar Asignación" : "Crear Nueva Asignación"}
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  style={{ position: "absolute", right: "15px", top: "10px" }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Nombre del módulo */}
                  <div className="form-group">
                    <label htmlFor="module_name">Nombre del Módulo *</label>
                    <input
                      id="module_name"
                      type="text"
                      className="form-control"
                      placeholder="Ej: Reporte de Atletas"
                      value={formData.module_name}
                      onChange={handleModuleNameChange}
                      required
                    />
                  </div>

                  {/* Selección de administradores */}
                  <div className="form-group">
                    <label>Administradores Asignados *</label>

                    {/* Búsqueda de admins */}
                    <div style={{ position: "relative", marginBottom: "15px" }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar administrador..."
                        onChange={(e) => handleFilterAdmins(e.target.value)}
                      />
                      {filteredAdmins.length > 0 && (
                        <ul
                          className="list-group"
                          style={{
                            position: "absolute",
                            width: "100%",
                            top: "100%",
                            left: 0,
                            zIndex: 1001,
                            marginTop: "0",
                          }}
                        >
                          {filteredAdmins.map((admin) => (
                            <li
                              key={admin._id}
                              className="list-group-item"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleAddAdmin(admin._id)}
                            >
                              {getUserName(admin._id)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Administradores seleccionados */}
                    <div
                      style={{
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #e5e6e7",
                        borderRadius: "2px",
                        padding: "10px",
                        minHeight: "50px",
                      }}
                    >
                      {formData.assigned_admins.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {formData.assigned_admins.map((adminId) => (
                            <span
                              key={adminId}
                              className="label label-primary"
                              style={{
                                borderRadius: "3px",
                                padding: "5px 10px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span>{getUserName(adminId)}</span>
                              <button
                                type="button"
                                className="close"
                                style={{
                                  marginLeft: "0",
                                  color: "inherit",
                                  fontSize: "16px",
                                }}
                                onClick={() => handleRemoveAdmin(adminId)}
                              >
                                <span>&times;</span>
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p
                          className="text-muted"
                          style={{ margin: 0, textAlign: "center" }}
                        >
                          No hay administradores asignados
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-end",
                      borderTop: "1px solid #e7eaec",
                      paddingTop: "15px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {editingId ? "Actualizar" : "Crear"} Asignación
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Assignments };
