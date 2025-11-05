import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchGroups, deleteGroup } from "../../../store/groupsThunks";
import swal from "sweetalert";
import { NavHeader } from "../../../components/NavHeader";
import { Image, Spinner } from "../../../components";
import type { AppDispatch } from "../../../store/store";
import type { IGroup } from "../interface/groupTypes";
import type { pageParamProps } from "../../../interfaces/pageParamProps";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

interface GroupsProps extends pageParamProps {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  registerAthlete?: boolean;
  registerCoach?: boolean;
}

export const Groups = ({
  name,
  sub,
  create,
  edit,
  delete: canDelete,
  registerAthlete,
  registerCoach,
}: GroupsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, error, status } = useSelector((state: any) => state.groups);
  const { clubId } = useParams();

  useEffect(() => {
    if (clubId) dispatch(fetchGroups({ clubId })).unwrap();
  }, [dispatch, clubId]);

  const handleDelete = async (e, groupId?: string) => {
    e.preventDefault();
    if (!groupId || !clubId) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡No podrás recuperar este grupo!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteGroup({ clubId, groupId })).unwrap();
        swal("Eliminado!", "El grupo ha sido eliminado.", "success");
      }
    });
  };

  const sortedGroups = [...groups].sort((a, b) => a.name.localeCompare(b.name));

  if (error) toastr.error(error);

  return (
    <>
      <NavHeader
        name={name}
        sub={sub}
        pageCreate={create ? "Nuevo grupo" : undefined}
      />
      {status === "loading" && <Spinner />}
      {status === "succeeded" && sortedGroups.length === 0 ? (
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">No existen grupos</h3>
            <div className="error-desc">
              Actualmente no tienes grupos creados. Puedes crear uno nuevo para
              empezar a organizar y gestionar tu información.
              <br />
              {create && (
                <Link
                  to={`/clubs/${clubId}/groups/create`}
                  className="btn btn-primary m-t"
                >
                  Crear nuevo grupo
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox">
            <div className="ibox-title">
              <h5>Todos los grupos asignados</h5>
            </div>
            <div className="ibox-content">
              <div className="project-list">
                <table className="table table-hover">
                  <tbody>
                    {sortedGroups.map((group: IGroup, index: number) => (
                      <tr key={index}>
                        <td className="project-status">
                          <span
                            className={`label label-${
                              group.active ? "primary" : "danger"
                            }`}
                          >
                            {group.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="project-title">
                          <a href="project_detail.html">{group.name}</a>
                          <br />
                          <small>Created 14.08.2014</small>
                        </td>
                        <td className="project-people">
                          {group.athletes.map((a: any, idx: number) =>
                            a.images?.small ? (
                              <Image
                                key={idx}
                                alt="image"
                                className="rounded-circle"
                                src={a.images.small}
                                style={{ marginRight: "5px" }}
                              />
                            ) : (
                              "sin imagen"
                            )
                          )}
                        </td>
                        <td className="project-actions">
                          {edit && (
                            <Link
                              to={`/clubs/${clubId}/groups/${group._id}`}
                              className="text-warning m-r-sm"
                            >
                              <i className="fa fa-pencil"></i> Edit
                            </Link>
                          )}
                          {canDelete && group.active && (
                            <Link
                              to="#"
                              className="text-danger  m-r-sm"
                              onClick={() => handleDelete(group._id)}
                            >
                              <i className="fa fa-trash"></i> Eliminar
                            </Link>
                          )}
                          {registerAthlete && group.active && (
                            <Link
                              to={`/clubs/${clubId}/groups/register-athlete/${group._id}`}
                              className="text-primary m-r-sm"
                            >
                              <i className="fa fa-list"></i> Atletas
                            </Link>
                          )}
                          {registerCoach && group.active && (
                            <Link
                              to={`/clubs/${clubId}/groups/register-coach/${group._id}`}
                              className="text-success m-r-sm"
                            >
                              <i className="fa fa-list"></i> Entrenadores
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
