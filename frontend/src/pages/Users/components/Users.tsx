import type { UsersPageProps } from "../interfaces";
import { UserTable } from ".";
import { PopUpMessage, NavHeader } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { useEffect } from "react";
import { fetchFilteredUsers } from "../../../store/filterThunks";
import { setQuery } from "../../../store/querySlice";
import { PaginationList } from "../../../components/PaginationList";
export const Users = ({ name }: UsersPageProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector((state: any) => state.filters.users);
  const loading = useSelector((state: any) => state.loading?.users?.loading);
  const error = useSelector((state: any) => state.loading?.users?.error);
  const filter = useSelector((state: any) => state.queries.filter);

  useEffect(() => {
    dispatch(fetchFilteredUsers(filter));
  }, [dispatch, filter]);

  const handleLimitChange = (limit: number) => {
    dispatch(setQuery({ module: "filter", filter: { ...filter, limit } }));
  };

  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo usuario" />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox">
              <div className="ibox-title d-flex justify-content-between">
                <h5>Lista de Usuarios</h5>
                <div className="btn-group">
                  {[5, 10, 20].map((level) => (
                    <button
                      className={`btn btn-white ${
                        filter.limit === level ? "active" : ""
                      }`}
                      onClick={() => handleLimitChange(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ibox-content">
                {loading && (
                  <div style={{ margin: 16 }}>Cargando usuarios...</div>
                )}
                {error && (
                  <div style={{ margin: 16, color: "red" }}>Error: {error}</div>
                )}
                {!loading && !error && (
                  <>
                    <UserTable users={users.data || []} />
                    <PaginationList filter={users} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
