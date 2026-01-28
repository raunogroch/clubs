/**
 * Página de Clubs
 *
 * Permite a los administradores con assignments asignados:
 * - Ver todos los clubs de sus assignments
 * - Crear nuevos clubs
 * - Actualizar clubs existentes
 * - Eliminar clubs
 * - Gestionar grupos dentro de cada club
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
import { sportService } from "../services/sportService";
import groupsService from "../services/groups.service";
import { NavHeader } from "../components";
import { Groups } from "./Groups";

interface Assignment {
  _id: string;
  module_name: string;
  assigned_admins: string[];
  assigned_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Sport {
  _id: string;
  name: string;
  active: boolean;
}

export const Clubs = ({ name }: { name?: string }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Estado
  const [clubs, setClubs] = useState<Club[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [clubMembers, setClubMembers] = useState<
    Record<string, { athletes: number; coaches: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedClubForGroups, setSelectedClubForGroups] = useState<
    string | null
  >(null);

  // Formulario
  const [formData, setFormData] = useState<CreateClubRequest>({
    sport_id: "",
    description: "",
    location: "",
    assignment_id: "",
  });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Cargar clubs, asignaciones y deportes
  const loadData = async () => {
    try {
      setLoading(true);
      const [clubsData, assignmentsData, sportsData] = await Promise.all([
        clubsService.getAll(),
        assignmentsService.getMyAssignments(),
        sportService.getAll(),
      ]);
      setClubs(clubsData);
      setAssignments(assignmentsData);
      setSports(sportsData || []);

      // Cargar miembros (athletes y coaches) de cada club
      const membersData: Record<string, { athletes: number; coaches: number }> =
        {};
      for (const club of clubsData) {
        try {
          const groups = await groupsService.getByClub(club._id);
          const totalAthletes = groups.reduce(
            (sum, g) => sum + (g.athletes?.length || 0),
            0,
          );
          const totalCoaches = groups.reduce(
            (sum, g) => sum + (g.coaches?.length || 0),
            0,
          );
          membersData[club._id] = {
            athletes: totalAthletes,
            coaches: totalCoaches,
          };
        } catch (error) {
          console.error(`Error al cargar grupos del club ${club._id}:`, error);
          membersData[club._id] = { athletes: 0, coaches: 0 };
        }
      }
      setClubMembers(membersData);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toastr.error(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre del deporte por ID
  const getSportName = (sportId: string): string => {
    const sport = sports.find((s) => s._id === sportId);
    return sport?.name || `Deporte ID: ${sportId}`;
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      sport_id: "",
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
      sport_id: club.sport_id,
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
      sport_id: "",
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
    if (!formData.sport_id.trim()) {
      toastr.warning("Debes seleccionar un deporte");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Actualizar
        const updated = await clubsService.update(editingId, {
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

  // Verificar si el usuario tiene assignment_id
  const hasAssignment =
    user?.role === "admin"
      ? (user as any)?.assignment_id !== null &&
        (user as any)?.assignment_id !== undefined
      : true;

  // Si es admin sin assignment_id, mostrar mensaje
  if (user?.role === "admin" && !hasAssignment) {
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
      <NavHeader name={"Clubs"} />

      {/* Si hay un club seleccionado para gestionar grupos, mostrar ese componente */}
      {selectedClubForGroups ? (
        <Groups
          clubId={selectedClubForGroups}
          onBack={() => setSelectedClubForGroups(null)}
        />
      ) : (
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Gestión de Clubs</h5>
                  <div className="ibox-tools">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={handleOpenCreate}
                      disabled={loading}
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
                            <th style={{ verticalAlign: "middle" }}>
                              Disciplina
                            </th>
                            <th style={{ verticalAlign: "middle" }}>
                              Ubicación
                            </th>
                            <th style={{ verticalAlign: "middle" }}>Grupos</th>
                            <th style={{ verticalAlign: "middle" }}>
                              Deportistas
                            </th>
                            <th style={{ verticalAlign: "middle" }}>
                              Entrenadores
                            </th>
                            <th style={{ verticalAlign: "middle" }}>
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {clubs.map((club) => (
                            <tr key={club._id}>
                              <td style={{ verticalAlign: "middle" }}>
                                <strong>{getSportName(club.sport_id)}</strong>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                {club.location || "-"}
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <button
                                  className="btn btn-info btn-xs"
                                  onClick={() =>
                                    setSelectedClubForGroups(club._id)
                                  }
                                  title="Gestionar grupos"
                                >
                                  <i className="fa fa-sitemap"></i>{" "}
                                  &nbsp;Gestionar grupos
                                </button>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <span>
                                  Registrados ( &nbsp;
                                  {clubMembers[club._id]?.athletes || 0} &nbsp;)
                                </span>
                              </td>
                              <td style={{ verticalAlign: "middle" }}>
                                <span>
                                  Registrados ( &nbsp;
                                  {clubMembers[club._id]?.coaches || 0} &nbsp;)
                                </span>
                              </td>

                              <td style={{ verticalAlign: "middle" }}>
                                <button
                                  className="btn btn-primary btn-xs"
                                  onClick={() => handleOpenEdit(club)}
                                  title="Editar"
                                >
                                  <i className="fa fa-edit"></i> Editar
                                </button>{" "}
                                <button
                                  className="btn btn-danger btn-xs"
                                  onClick={() => handleDelete(club._id)}
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label>Deporte *</label>
                  <select
                    className="form-control"
                    name="sport_id"
                    value={formData.sport_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Selecciona un deporte --</option>
                    {sports.map((sport) => (
                      <option key={sport._id} value={sport._id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Ej: Club de tenis profesional"
                    rows={3}
                  />
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

                {/* Campo assignment_id se asigna automáticamente */}
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
