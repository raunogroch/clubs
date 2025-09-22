import { useEffect } from "react";
import {
  ImageWithFallback,
  PopUpMessage,
  Spinner,
  StaticMessage,
} from "../../../components";
import { NavHeader } from "../../../components/NavHeader";
import type { pageParamProps } from "../../../interfaces/pageParamProps";
import { useDispatch, useSelector } from "react-redux";

import { fetchGroups } from "../../../store/groupsThunks";
import { Link, useParams } from "react-router-dom";
import type { AppDispatch } from "../../../store/store";
import type { IGroup } from "../interface/group.Interface";

export const Groups = ({ name, sub }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, error, status } = useSelector((state: any) => state.groups);
  const { clubId } = useParams();

  useEffect(() => {
    dispatch(fetchGroups({ clubId })).unwrap();
  }, [dispatch]);
  return (
    <>
      <NavHeader name={name} sub={sub} pageCreate="Nuevo grupo" />
      <PopUpMessage />
      {error && <StaticMessage type="danger" message={error} />}
      {status === "loading" && <Spinner />}
      {status === "succeeded" && groups.length === 0 ? (
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">No existen grupos</h3>
            <div className="error-desc">
              Actualmente no tienes grupos creados. Puedes crear uno nuevo para
              empezar a organizar y gestionar tu información.
              <br />
              <Link
                to={`/clubs/${clubId}/groups/create`}
                className="btn btn-primary m-t"
              >
                Crear nuevo grupo
              </Link>
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
                    {groups.map((group: IGroup, index: number) => (
                      <tr key={index}>
                        <td className="project-status">
                          <span className="label label-primary">
                            {group.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="project-title">
                          <a href="project_detail.html">{group.name}</a>
                          <br />
                          <small>Created 14.08.2014</small>
                        </td>
                        <td className="project-people">
                          {group.athletes.map((a: any, index: number) => (
                            <ImageWithFallback
                              key={index}
                              alt="image"
                              className="rounded-circle"
                              src={a.image}
                              style={{ marginRight: "5px" }}
                            />
                          ))}
                        </td>
                        <td className="project-actions">
                          <Link
                            to={`/clubs/${clubId}/groups/${group._id}`}
                            className="btn btn-white btn-sm"
                          >
                            <i className="fa fa-pencil"></i> Edit
                          </Link>
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
