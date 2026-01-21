/**
 * Página de Grupos
 *
 * Permite a los administradores del club:
 * - Ver todos los grupos del club
 * - Crear nuevos grupos
 * - Actualizar grupos existentes
 * - Eliminar grupos
 * - Gestionar miembros de grupos
 *
 * Solo accesible por administradores de la asignación del club
 */

import { useState, useEffect } from "react";
import toastr from "toastr";
import type { Group, CreateGroupRequest } from "../services/groups.service";
import groupsService from "../services/groups.service";
import clubsService from "../services/clubs.service";
import { sportService } from "../services/sportService";
import userService from "../services/userService";

interface Sport {
  _id: string;
  name: string;
  active: boolean;
}

interface User {
  _id: string;
  name: string;
  lastname: string;
  username: string;
  role: string;
  ci?: string;
}

export const Groups = ({
  clubId,
  onBack,
}: {
  clubId: string;
  onBack: () => void;
}) => {
  // Estado
  const [groups, setGroups] = useState<Group[]>([]);
  const [clubName, setClubName] = useState<string>("");
  const [_, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [memberType, setMemberType] = useState<"coach" | "athlete" | null>(
    null,
  );
  const [searchCi, setSearchCi] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [createUserData, setCreateUserData] = useState({
    name: "",
    lastname: "",
    ci: "",
    username: "",
    email: "",
  });

  // Formulario
  const [formData, setFormData] = useState<CreateGroupRequest>({
    name: "",
    description: "",
    club_id: clubId,
  });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [clubId]);

  // Cargar grupos y nombre del club
  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsData, clubData, sportsData] = await Promise.all([
        groupsService.getByClub(clubId),
        clubsService.getById(clubId),
        sportService.getAll(),
      ]);
      setGroups(groupsData);
      setSports(sportsData || []);

      // Buscar el nombre del deporte en la lista de deportes
      const sport = sportsData?.find((s: Sport) => s._id === clubData.sport_id);
      setClubName(sport?.name || `Deporte ID: ${clubData.sport_id}`);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toastr.error(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      club_id: clubId,
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (group: Group) => {
    setEditingId(group._id);
    setFormData({
      name: group.name,
      description: group.description || "",
      club_id: clubId,
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
      club_id: clubId,
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

  // Guardar grupo (crear o actualizar)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toastr.warning("El nombre del grupo es requerido");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Actualizar
        const updated = await groupsService.update(editingId, {
          name: formData.name,
          description: formData.description,
        });
        setGroups(groups.map((g) => (g._id === editingId ? updated : g)));
        toastr.success("Grupo actualizado correctamente");
      } else {
        // Crear
        const created = await groupsService.create(formData);
        setGroups([...groups, created]);
        toastr.success("Grupo creado correctamente");
      }

      handleCloseModal();
    } catch (error: any) {
      console.error("Error al guardar grupo:", error);
      toastr.error(error.message || "Error al guardar el grupo");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar grupo
  const handleDelete = async (groupId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
      return;
    }

    try {
      setLoading(true);
      await groupsService.delete(groupId);
      setGroups(groups.filter((g) => g._id !== groupId));
      toastr.success("Grupo eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar grupo:", error);
      toastr.error(error.message || "Error al eliminar el grupo");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para agregar miembro
  const handleOpenAddMember = (groupId: string, type: "coach" | "athlete") => {
    setSelectedGroupId(groupId);
    setMemberType(type);
    setSearchCi("");
    setSearchResult(null);
    setShowCreateUserForm(false);
    setCreateUserData({
      name: "",
      lastname: "",
      ci: "",
      username: "",
      email: "",
    });
    setShowAddMemberModal(true);
  };

  // Cerrar modal de agregar miembro
  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
    setSelectedGroupId(null);
    setMemberType(null);
    setSearchCi("");
    setSearchResult(null);
    setShowCreateUserForm(false);
    setCreateUserData({
      name: "",
      lastname: "",
      ci: "",
      username: "",
      email: "",
    });
  };

  // Buscar usuario por CI
  const handleSearchByCi = async () => {
    if (!searchCi.trim()) {
      toastr.warning("Ingresa un carnet (CI) válido");
      return;
    }

    if (!memberType) {
      toastr.warning("Selecciona el tipo de usuario (Coach o Atleta)");
      return;
    }

    try {
      setSearchLoading(true);
      setShowCreateUserForm(false);
      // Buscar por CI y rol específico (coach o athlete)
      const response = await userService.findUserByCiAndRole(
        searchCi,
        memberType,
      );

      if (response.code === 200 && response.data) {
        // Verificar que el rol coincida con el tipo de miembro buscado
        if (response.data.role === memberType) {
          setSearchResult(response.data);
        } else {
          // El usuario existe pero tiene un rol diferente
          toastr.warning(
            `El usuario encontrado es ${response.data.role}, pero se busca un ${memberType}`,
          );
          setSearchResult(null);
          // Mostrar formulario para crear un nuevo usuario del rol correcto
          setShowCreateUserForm(true);
          setCreateUserData({
            name: "",
            lastname: "",
            ci: searchCi,
            username: "",
            email: "",
          });
        }
      } else {
        toastr.info(
          `${memberType === "coach" ? "Entrenador" : "Deportista"} no encontrado. Puedes crear uno.`,
        );
        setSearchResult(null);
        // Mostrar formulario para crear un nuevo usuario
        setShowCreateUserForm(true);
        setCreateUserData({
          name: "",
          lastname: "",
          ci: searchCi,
          username: "",
          email: "",
        });
      }
    } catch (error: any) {
      console.error("Error al buscar usuario:", error);
      // Si hay error, permitir crear uno nuevo
      setSearchResult(null);
      setShowCreateUserForm(true);
      setCreateUserData({
        name: "",
        lastname: "",
        ci: searchCi,
        username: "",
        email: "",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Agregar miembro al grupo
  const handleAddMember = async () => {
    if (!selectedGroupId || !searchResult) {
      toastr.warning("Selecciona un usuario primero");
      return;
    }

    try {
      setSearchLoading(true);
      await groupsService.addMember(selectedGroupId, searchResult._id);

      // Actualizar el grupo en la lista
      const updatedGroups = await groupsService.getByClub(clubId);
      setGroups(updatedGroups);

      toastr.success(
        `${memberType === "coach" ? "Entrenador" : "Deportista"} agregado correctamente`,
      );
      handleCloseAddMemberModal();
    } catch (error: any) {
      console.error("Error al agregar miembro:", error);
      toastr.error(error.message || "Error al agregar el miembro");
    } finally {
      setSearchLoading(false);
    }
  };

  // Crear nuevo usuario (Coach o Athlete)
  const handleCreateUser = async () => {
    if (!createUserData.name.trim()) {
      toastr.warning("El nombre es requerido");
      return;
    }
    if (!createUserData.lastname.trim()) {
      toastr.warning("El apellido es requerido");
      return;
    }
    if (!createUserData.username.trim()) {
      toastr.warning("El usuario es requerido");
      return;
    }
    if (!createUserData.email.trim()) {
      toastr.warning("El email es requerido");
      return;
    }

    try {
      setSearchLoading(true);
      const newUser = await userService.createAthlete({
        name: createUserData.name,
        lastname: createUserData.lastname,
        ci: createUserData.ci,
        username: createUserData.username,
        email: createUserData.email,
        role: memberType,
      });

      if (newUser.code === 201 || newUser.code === 200) {
        setSearchResult(newUser.data);
        setShowCreateUserForm(false);
        toastr.success(
          `${memberType === "coach" ? "Entrenador" : "Deportista"} creado correctamente`,
        );
      } else {
        toastr.error("Error al crear el usuario");
      }
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      toastr.error(error.message || "Error al crear el usuario");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChangeCreateUserData = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setCreateUserData({
      ...createUserData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>
                  Grupos del club de{" "}
                  <span className="font-bold">{clubName}</span>
                </h5>
                <div className="ibox-tools">
                  <button
                    className="btn btn-default btn-sm"
                    onClick={onBack}
                    title="Volver a clubs"
                  >
                    <i className="fa fa-arrow-left"></i> Volver
                  </button>{" "}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleOpenCreate}
                    disabled={loading}
                  >
                    <i className="fa fa-plus"></i> Crear Grupo
                  </button>
                </div>
              </div>
              <div className="ibox-content">
                {loading ? (
                  <div className="text-center">
                    <p>Cargando grupos...</p>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">
                      No hay grupos creados en este club. Crea uno nuevo para
                      comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Gestion de coaches</th>
                          <th>Gestion de atletas</th>
                          <th>Horarios</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map((group) => (
                          <tr key={group._id}>
                            <td>
                              <strong>{group.name}</strong>
                            </td>
                            <td>{group.description || "-"}</td>
                            <td>
                              <button
                                className="btn btn-success btn-xs"
                                onClick={() =>
                                  handleOpenAddMember(group._id, "coach")
                                }
                                title="Agregar Entrenador"
                              >
                                <i className="fa fa-user-tie"></i> Coaches
                              </button>{" "}
                            </td>
                            <td>
                              <button
                                className="btn btn-info btn-xs"
                                onClick={() =>
                                  handleOpenAddMember(group._id, "athlete")
                                }
                                title="Agregar Deportista"
                              >
                                <i className="fa fa-person-running"></i> Atletas
                              </button>{" "}
                            </td>
                            <td>
                              {new Date(group.createdAt).toLocaleDateString(
                                "es-ES",
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleOpenEdit(group)}
                                title="Editar"
                              >
                                <i className="fa fa-edit"></i> Editar
                              </button>{" "}
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => handleDelete(group._id)}
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
                  {editingId ? "Editar Grupo" : "Crear Grupo"}
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
                  <label>Nombre del Grupo *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Grupo A"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Ej: Descripción del grupo"
                    rows={3}
                  ></textarea>
                </div>
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

      {/* Modal para agregar miembro (Coach o Athlete) */}
      {showAddMemberModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={handleCloseAddMemberModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Agregar {memberType === "coach" ? "Entrenador" : "Deportista"}
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseAddMemberModal}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Buscar por Carnet (CI)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={searchCi}
                      onChange={(e) => setSearchCi(e.target.value)}
                      placeholder="Ingresa el carnet (CI)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearchByCi();
                        }
                      }}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearchByCi}
                        disabled={searchLoading || !searchCi.trim()}
                      >
                        <i className="fa fa-search"></i> Buscar
                      </button>
                    </span>
                  </div>
                </div>

                {searchResult && (
                  <div className="alert alert-info">
                    <h5>Usuario encontrado:</h5>
                    <p>
                      <strong>Nombre:</strong> {searchResult.name}{" "}
                      {searchResult.lastname}
                    </p>
                    <p>
                      <strong>Usuario:</strong> {searchResult.username}
                    </p>
                    <p>
                      <strong>Rol:</strong> {searchResult.role}
                    </p>
                  </div>
                )}

                {showCreateUserForm && !searchResult && (
                  <div className="alert alert-warning">
                    <h5>
                      Crear nuevo{" "}
                      {memberType === "coach" ? "Entrenador" : "Deportista"}
                    </h5>
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={createUserData.name}
                        onChange={handleChangeCreateUserData}
                        placeholder="Ej: Juan"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={createUserData.lastname}
                        onChange={handleChangeCreateUserData}
                        placeholder="Ej: García"
                      />
                    </div>
                    <div className="form-group">
                      <label>Carnet (CI)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ci"
                        value={createUserData.ci}
                        onChange={handleChangeCreateUserData}
                        placeholder="Carnet"
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Usuario *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={createUserData.username}
                        onChange={handleChangeCreateUserData}
                        placeholder="Ej: juan.garcia"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={createUserData.email}
                        onChange={handleChangeCreateUserData}
                        placeholder="Ej: juan.garcia@example.com"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={handleCloseAddMemberModal}
                >
                  Cancelar
                </button>
                {searchResult && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddMember}
                    disabled={searchLoading}
                  >
                    Agregar
                  </button>
                )}
                {showCreateUserForm && !searchResult && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleCreateUser}
                    disabled={searchLoading}
                  >
                    Crear y Agregar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
