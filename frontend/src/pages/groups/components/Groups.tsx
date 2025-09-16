import { useEffect } from "react";
import { Image, PopUpMessage } from "../../../components";
import { NavHeader } from "../../../components/NavHeader";
import type { pageParamProps } from "../../../interfaces/pageParamProps";
import { useDispatch, useSelector } from "react-redux";

import { fetchGroups } from "../../../store/groupsThunks";
import { Link, useParams } from "react-router-dom";
import type { AppDispatch } from "../../../store/store";
import type { Group } from "../interface/group.Interface";

export const Groups = ({ name, sub }: pageParamProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, error, status } = useSelector((state: any) => state.groups);
  const { clubId } = useParams();

  console.log({ groups, error, status });

  useEffect(() => {
    dispatch(fetchGroups({ clubId })).unwrap();
  }, [dispatch]);
  return (
    <>
      <NavHeader name={name} sub={sub} isAllow pageCreate="Nuevo grupo" />
      <PopUpMessage />
      {status === "succeeded" && (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox">
            <div className="ibox-title">
              <h5>Todos los grupos asignados</h5>
            </div>
            <div className="ibox-content">
              <div className="project-list">
                <table className="table table-hover">
                  <tbody>
                    {groups.map((group: Group, index: number) => (
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
                          {group.athletes.map((a: any, i: number) => (
                            <a key={i} href="">
                              <Image
                                alt="image"
                                className="rounded-circle"
                                src={a.image}
                              />
                            </a>
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
