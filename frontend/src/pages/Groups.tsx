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

// Estilos inline para la sección
const styles = `
  .section-box {
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fafafa;
    margin-bottom: 10px;
  }
  
  .section-box h5 {
    margin-top: 0;
    margin-bottom: 12px;
    color: #333;
    font-weight: 600;
  }
  
  .members-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .members-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .mb-3 {
    margin-bottom: 20px;
  }
  
  .ml-2 {
    margin-left: 8px;
  }
  
  .mt-3 {
    margin-top: 15px;
  }
  
  .badge {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .badge-info {
    background-color: #17a2b8;
    color: white;
  }
  
  .badge-primary {
    background-color: #007bff;
    color: white;
  }
`;

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
  });
  const [memberDetails, setMemberDetails] = useState<
    Record<
      string,
      { name: string; lastname: string; role: string; ci?: string }
    >
  >({});

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

      // Cargar detalles de todos los miembros
      await loadMembersDetails(groupsData);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      toastr.error(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar detalles de los miembros
  const loadMembersDetails = async (groupsData: Group[]) => {
    try {
      const details: Record<
        string,
        { name: string; lastname: string; role: string; ci?: string }
      > = {};

      // Procesar todos los grupos y extraer miembros
      groupsData.forEach((g) => {
        // Procesar athletes
        (g.athletes || []).forEach((athlete: any) => {
          if (typeof athlete === "object" && athlete?._id) {
            // Ya viene poblado desde el backend
            details[athlete._id] = {
              name: athlete.name || "",
              lastname: athlete.lastname || "",
              role: athlete.role || "athlete",
              ci: athlete.ci || "",
            };
          }
        });

        // Procesar coaches
        (g.coaches || []).forEach((coach: any) => {
          if (typeof coach === "object" && coach?._id) {
            // Ya viene poblado desde el backend
            details[coach._id] = {
              name: coach.name || "",
              lastname: coach.lastname || "",
              role: coach.role || "coach",
              ci: coach.ci || "",
            };
          }
        });

        // Procesar legacy members
        (g.members || []).forEach((member: any) => {
          if (typeof member === "object" && member?._id) {
            details[member._id] = {
              name: member.name || "",
              lastname: member.lastname || "",
              role: member.role || "unknown",
              ci: member.ci || "",
            };
          }
        });
      });

      // Si ya tenemos detalles del populate, usar esos
      if (Object.keys(details).length > 0) {
        setMemberDetails(details);
        return;
      }

      // Si no vinieron populados, hacer llamada a la API
      const allMemberIds = Array.from(
        new Set(
          groupsData.flatMap((g) => [
            ...(g.athletes || []),
            ...(g.coaches || []),
            ...(g.members || []),
          ]),
        ),
      );

      if (allMemberIds.length === 0) {
        setMemberDetails({});
        return;
      }

      const response = await userService.getUsersById(allMemberIds);

      if (
        response.code === 200 &&
        response.data &&
        Array.isArray(response.data)
      ) {
        response.data.forEach((user: any) => {
          if (user._id) {
            details[user._id] = {
              name: user.name || "",
              lastname: user.lastname || "",
              role: user.role || "unknown",
              ci: user.ci || "",
            };
          }
        });
        setMemberDetails(details);
      } else {
        console.warn("No se pudieron cargar los detalles de los miembros");
        setMemberDetails(Object.keys(details).length > 0 ? details : {});
      }
    } catch (error: any) {
      console.error("Error al cargar detalles de miembros:", error);
      setMemberDetails({});
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
      let updatedGroup: Group | undefined;

      // Usar el endpoint específico según el tipo de miembro
      if (memberType === "coach") {
        updatedGroup = await groupsService.addCoach(
          selectedGroupId,
          searchResult._id,
        );
      } else if (memberType === "athlete") {
        updatedGroup = await groupsService.addAthlete(
          selectedGroupId,
          searchResult._id,
        );
      }

      // Actualizar el grupo específico en la lista
      if (updatedGroup) {
        setGroups((prevGroups) =>
          prevGroups.map((g) =>
            g._id === selectedGroupId ? updatedGroup! : g,
          ),
        );

        // Actualizar member details con el nuevo miembro
        const details: Record<
          string,
          { name: string; lastname: string; role: string; ci?: string }
        > = {};

        // Procesar athletes (pueden ser objetos o IDs)
        (updatedGroup.athletes || []).forEach((athlete: any) => {
          if (typeof athlete === "object" && athlete?._id) {
            details[athlete._id] = {
              name: athlete.name || "",
              lastname: athlete.lastname || "",
              role: athlete.role || "athlete",
              ci: athlete.ci || "",
            };
          }
        });

        // Procesar coaches (pueden ser objetos o IDs)
        (updatedGroup.coaches || []).forEach((coach: any) => {
          if (typeof coach === "object" && coach?._id) {
            details[coach._id] = {
              name: coach.name || "",
              lastname: coach.lastname || "",
              role: coach.role || "coach",
              ci: coach.ci || "",
            };
          }
        });

        // Si vinieron populados, usar esos datos directamente
        if (Object.keys(details).length > 0) {
          setMemberDetails((prev) => ({ ...prev, ...details }));
        } else {
          // Si no vinieron populados, hacer una llamada a la API
          const allMemberIds = Array.from(
            new Set([
              ...(updatedGroup.athletes || []),
              ...(updatedGroup.coaches || []),
            ]),
          );

          if (allMemberIds.length > 0) {
            const response = await userService.getUsersById(allMemberIds);
            if (
              response.code === 200 &&
              response.data &&
              Array.isArray(response.data)
            ) {
              const apiDetails: Record<
                string,
                { name: string; lastname: string; role: string; ci?: string }
              > = {};
              response.data.forEach((user: any) => {
                if (user._id) {
                  apiDetails[user._id] = {
                    name: user.name || "",
                    lastname: user.lastname || "",
                    role: user.role || "unknown",
                    ci: user.ci || "",
                  };
                }
              });
              setMemberDetails((prev) => ({ ...prev, ...apiDetails }));
            }
          }
        }
      } else {
        // Si no hay respuesta, recargar como fallback
        const updatedGroups = await groupsService.getByClub(clubId);
        setGroups(updatedGroups);
        await loadMembersDetails(updatedGroups);
      }

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

    try {
      setSearchLoading(true);
      const newUser = await userService.createAthlete({
        name: createUserData.name,
        lastname: createUserData.lastname,
        ci: createUserData.ci,
        username: createUserData.username,
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

  // Obtener miembros de un grupo filtrados por rol
  const getMembersByRole = (group: Group, role: "coach" | "athlete") => {
    const memberIds =
      role === "coach" ? group.coaches || [] : group.athletes || [];

    if (!memberIds || memberIds.length === 0) {
      return [];
    }

    return memberIds
      .map((member: any) => {
        // Si es un objeto (populado desde el backend), retorna el _id
        // Si es un string (ID), retorna tal cual
        if (typeof member === "object" && member?._id) {
          return member._id;
        }
        return member;
      })
      .filter((memberId: string) => {
        const member = memberDetails[memberId];
        if (!member) {
          console.debug(`Miembro ${memberId} no encontrado en memberDetails`);
          return false;
        }
        return true;
      });
  };

  return (
    <>
      <style>{styles}</style>
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
                  <div>
                    {groups.map((group) => (
                      <div key={group._id} className="panel panel-default mb-3">
                        <div
                          className="panel-heading"
                          style={{ backgroundColor: "#f5f5f5" }}
                        >
                          <div className="row">
                            <div className="col-md-8">
                              <h4 style={{ margin: "0" }}>
                                <strong>{group.name}</strong>
                              </h4>
                              <small className="text-muted">
                                {group.description || "Sin descripción"}
                              </small>
                            </div>
                            <div className="col-md-4 text-right">
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
                            </div>
                          </div>
                        </div>
                        <div className="panel-body">
                          <div className="row">
                            {/* Coaches Section */}
                            <div className="col-md-6">
                              <div className="section-box">
                                <h5>
                                  <i className="fa fa-user-tie"></i>{" "}
                                  Entrenadores
                                  <span className="badge badge-info ml-2">
                                    {(group.coaches || []).length}
                                  </span>
                                </h5>
                                <button
                                  className="btn btn-success btn-sm btn-block"
                                  onClick={() =>
                                    handleOpenAddMember(group._id, "coach")
                                  }
                                  title="Agregar Entrenador"
                                >
                                  <i className="fa fa-plus"></i> Agregar Coach
                                </button>
                                <div className="members-list">
                                  {(group.coaches || []).length === 0 ? (
                                    <p className="text-muted">
                                      <em>Sin entrenadores asignados</em>
                                    </p>
                                  ) : (
                                    <ul
                                      className="list-group"
                                      style={{ marginBottom: "10px" }}
                                    >
                                      {getMembersByRole(group, "coach").map(
                                        (memberId) => {
                                          const member =
                                            memberDetails[memberId];
                                          return (
                                            <li
                                              key={memberId}
                                              className="list-group-item"
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "8px 12px",
                                                borderRadius: "3px",
                                                marginBottom: "5px",
                                                backgroundColor: "#f9f9f9",
                                                border: "1px solid #ddd",
                                              }}
                                            >
                                              <span>
                                                <strong>
                                                  {member
                                                    ? `${member.ci || "S/N"} - ${member.lastname} ${member.name}`
                                                    : "Desconocido"}
                                                </strong>
                                              </span>
                                              <button
                                                className="btn btn-danger btn-xs"
                                                onClick={() => {
                                                  // TODO: Implementar remover coach
                                                }}
                                                title="Remover"
                                              >
                                                <i className="fa fa-trash"></i>
                                              </button>
                                            </li>
                                          );
                                        },
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Athletes Section */}
                            <div className="col-md-6">
                              <div className="section-box">
                                <h5>
                                  <i className="fa fa-person-running"></i>{" "}
                                  Deportistas
                                  <span className="badge badge-primary ml-2">
                                    {(group.athletes || []).length}
                                  </span>
                                </h5>
                                <button
                                  className="btn btn-info btn-sm btn-block"
                                  onClick={() =>
                                    handleOpenAddMember(group._id, "athlete")
                                  }
                                  title="Agregar Deportista"
                                >
                                  <i className="fa fa-plus"></i> Agregar Atleta
                                </button>
                                <div className="members-list">
                                  {(group.athletes || []).length === 0 ? (
                                    <p className="text-muted">
                                      <em>Sin deportistas asignados</em>
                                    </p>
                                  ) : (
                                    <ul
                                      className="list-group"
                                      style={{ marginBottom: "10px" }}
                                    >
                                      {getMembersByRole(group, "athlete").map(
                                        (memberId) => {
                                          const member =
                                            memberDetails[memberId];
                                          return (
                                            <li
                                              key={memberId}
                                              className="list-group-item"
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "8px 12px",
                                                borderRadius: "3px",
                                                marginBottom: "5px",
                                                backgroundColor: "#f0f7ff",
                                                border: "1px solid #b3d9ff",
                                              }}
                                            >
                                              <span>
                                                <strong>
                                                  {member
                                                    ? `${member.ci || "S/N"} - ${member.lastname} ${member.name}`
                                                    : "Desconocido"}
                                                </strong>
                                              </span>
                                              <button
                                                className="btn btn-danger btn-xs"
                                                onClick={() => {
                                                  // TODO: Implementar remover athlete
                                                }}
                                                title="Remover"
                                              >
                                                <i className="fa fa-trash"></i>
                                              </button>
                                            </li>
                                          );
                                        },
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <small className="text-muted">
                                Creado:{" "}
                                {new Date(group.createdAt).toLocaleDateString(
                                  "es-ES",
                                )}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
