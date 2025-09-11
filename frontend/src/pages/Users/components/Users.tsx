import type { User, UsersPageProps } from "../interfaces";
import { UserTable } from ".";
import { PopUpMessage, NavHeader } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  setLimit,
  setPage,
  type AppDispatch,
  type RootState,
} from "../../../store";
import { useEffect } from "react";
import { fetchUsers } from "../../../store/usersThunks";
import { PaginationList } from "../../../components/PaginationList";

export const Users = ({ name: nameTitle }: UsersPageProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );
  const filter = useSelector((state: RootState) => state.filters);

  const { page, limit, name } = filter;
  const userList = users.data as User[];

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, name }));
  }, [dispatch, page, limit, name]);

  const handleLimitChange = (level: number) => {
    dispatch(setLimit(level));
    dispatch(setPage(1));
  };

  return (
    <>
      <NavHeader name={nameTitle} pageCreate="Nuevo usuario" />
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
                        limit === level ? "active" : ""
                      }`}
                      onClick={() => handleLimitChange(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ibox-content">
                {status === "loading" && (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                {status === "succeeded" && (
                  <>
                    <UserTable users={userList} />
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
