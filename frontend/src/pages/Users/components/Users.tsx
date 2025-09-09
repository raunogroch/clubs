import type { UsersPageProps } from "../interfaces";
import { UserTable } from ".";
import { PopUpMessage, NavHeader } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { useEffect, useState } from "react";
import { fetchFilteredUsers } from "../../../store/filterThunks";
export const Users = ({ name }: UsersPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState({ page: 1, limit: 10, name: "" });
  useEffect(() => {
    dispatch(fetchFilteredUsers(filter));
  }, [dispatch, filter]);

  const users = useSelector((state: any) => state.filters.users);
  const loading = useSelector((state: any) => state.loading?.users?.loading);
  const error = useSelector((state: any) => state.loading?.users?.error);
  return (
    <>
      <NavHeader name={name} pageCreate="Nuevo usuario" />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de Usuarios</h5>
              </div>
              <div className="ibox-content">
                {loading && (
                  <div style={{ margin: 16 }}>Cargando usuarios...</div>
                )}
                {error && (
                  <div style={{ margin: 16, color: "red" }}>Error: {error}</div>
                )}
                {!loading && !error && <UserTable users={users.data || []} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
