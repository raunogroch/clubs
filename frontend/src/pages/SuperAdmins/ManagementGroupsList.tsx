import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { managementGroupsService } from "../../services/management-groups.service";
import type { ManagementGroup } from "../../services/management-groups.service";
import { NavHeader, Spinner } from "../../components";
import { PaginationList } from "../../components/PaginationList";
import { useAuth } from "../../hooks";
import { setLimit, setPage } from "../../store";
import type { AppDispatch, RootState } from "../../store";

interface ManagementGroupsListProps {
  name?: string;
  sub?: string;
  edit?: boolean;
  delete?: boolean;
  restore?: boolean;
}

export const ManagementGroupsList = ({
  name = "Grupos",
  sub = "Gestión General",
  edit = true,
  delete: canDelete = true,
  restore: canRestore = true,
}: ManagementGroupsListProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useAuth();

  const [groups, setGroups] = useState<ManagementGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ManagementGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const filter = useSelector((state: RootState) => state.filters);
  const { limit, page } = filter;

  useEffect(() => {
    fetchGroups();
  }, [showDeleted, page, limit]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = showDeleted
        ? await managementGroupsService.getAllIncludingDeleted()
        : await managementGroupsService.getAll();
      setGroups(data);
      filterGroups(data, searchTerm);
      setError(null);
    } catch (err) {
      setError("Error cargando grupos");
      toastr.error("Error al cargar los grupos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = (data: ManagementGroup[], term: string) => {
    const filtered = data.filter(
      (group) =>
        group.name.toLowerCase().includes(term.toLowerCase()) ||
        group.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterGroups(groups, term);
    dispatch(setPage(1));
  };

  const handleDelete = (id: string) => {
    swal({
      title: "¿Estás seguro?",
      text: "¡El grupo será desactivado!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, desactivar!"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await managementGroupsService.delete(id);
          toastr.success("Grupo desactivado correctamente");
          fetchGroups();
        } catch (err) {
          toastr.error("Error al desactivar el grupo");
          console.error(err);
        }
      }
    });
  };

  const handleRestore = (id: string) => {
    swal({
      title: "¿Estás seguro?",
      text: "¡El grupo será reactivado!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, reactivar!"],
      dangerMode: true,
    }).then(async (willRestore) => {
      if (willRestore) {
        try {
          await managementGroupsService.restore(id);
          toastr.success("Grupo reactivado correctamente");
          fetchGroups();
        } catch (err) {
          toastr.error("Error al reactivar el grupo");
          console.error(err);
        }
      }
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/groups/edit/${id}`);
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
    dispatch(setPage(1));
  };

  const canManageGroups = role === "superadmin";

  if (!canManageGroups) {
    return (
      <>
        <NavHeader name={name} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">Acceso denegado</h3>
            <div className="error-desc">
              No tienes permisos para acceder a esta sección. Solo superadmins
              pueden gestionar grupos.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader name={name} />
      {loading && <Spinner />}

      {!loading && error && (
        <div className="wrapper wrapper-content">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      {!loading && filteredGroups.length === 0 && !error && (
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">No hay grupos disponibles</h3>
            <div className="error-desc">
              {showDeleted
                ? "No hay grupos con los criterios de búsqueda."
                : "Crea tu primer grupo haciendo clic en el botón de abajo."}
            </div>
            {!showDeleted && (
              <button
                className="btn btn-primary m-t-md"
                onClick={() => navigate("/admin/groups/create")}
              >
                <i className="fa fa-plus"></i> Crear Grupo
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && filteredGroups.length > 0 && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-12">
              <div className="ibox">
                <div className="ibox-title d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1">
                    <h5>{sub}</h5>
                  </div>
                  <div className="btn-group mr-2">
                    {[5, 10, 15].map((level) => (
                      <button
                        key={level}
                        className={`btn btn-white ${
                          limit === level ? "active" : ""
                        }`}
                        onClick={() => handleLimitChange(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/groups/create")}
                  >
                    <i className="fa fa-plus"></i> Nuevo
                  </button>
                </div>

                <div className="ibox-content">
                  <div className="row m-b-md">
                    <div className="col-sm-6">
                      <input
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="checkbox-inline">
                        <input
                          type="checkbox"
                          checked={showDeleted}
                          onChange={(e) => setShowDeleted(e.target.checked)}
                        />
                        <span className="ml-2">Mostrar inactivos</span>
                      </label>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th className="text-center">Administrador</th>
                          <th className="text-center">Estado</th>
                          {canManageGroups && (
                            <th className="text-center">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGroups
                          .slice((page - 1) * limit, page * limit)
                          .map((group) => (
                            <tr
                              key={group._id}
                              className={!group.active ? "table-danger" : ""}
                            >
                              <td className="align-middle">
                                <strong>{group.name}</strong>
                              </td>
                              <td className="align-middle text-center">
                                {group.administrator &&
                                typeof group.administrator === "object" ? (
                                  <span className="badge badge-success">
                                    {group.administrator.name}{" "}
                                    {group.administrator.lastname}
                                  </span>
                                ) : (
                                  <span className="badge badge-secondary">
                                    Sin asignar
                                  </span>
                                )}
                              </td>
                              <td className="align-middle text-center">
                                {group.active ? (
                                  <span className="label label-primary">
                                    Activo
                                  </span>
                                ) : (
                                  <span className="label label-danger">
                                    Inactivo
                                  </span>
                                )}
                              </td>
                              {canManageGroups && (
                                <td className="align-middle text-center">
                                  <div
                                    className="btn-group btn-group-sm"
                                    role="group"
                                  >
                                    {edit && group.active && (
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleEdit(group._id)}
                                        title="Editar"
                                      >
                                        <i className="fa fa-edit"></i>
                                      </button>
                                    )}
                                    {canDelete && group.active && (
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(group._id)}
                                        title="Desactivar"
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    )}
                                    {canRestore && !group.active && (
                                      <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => handleRestore(group._id)}
                                        title="Reactivar"
                                      >
                                        <i className="fa fa-undo"></i>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <PaginationList
                    filter={{ ...filter, total: filteredGroups.length }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
