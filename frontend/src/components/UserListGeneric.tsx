import type { User, UsersPageProps } from "../pages/Users/interfaces";
import { PopUpMessage, NavHeader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, setPage, type AppDispatch, type RootState } from "../store";
import { useEffect } from "react";
import { fetchUsers } from "../store/usersThunks";
import { PaginationList } from "../components/PaginationList";

interface UserListGenericProps extends UsersPageProps {
  role?: string;
  TableComponent: React.ComponentType<{ users: User[] }>;
  pageCreateLabel?: string;
}

export const UserListGeneric = ({
  name: nameTitle,
  role,
  TableComponent,
  pageCreateLabel = "Nuevo usuario",
}: UserListGenericProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );
  const filter = useSelector((state: RootState) => state.filters);
  const { page, limit, name } = filter;
  const userList = users.data as User[];

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, name, ...(role ? { role } : {}) }));
  }, [dispatch, page, limit, name, role]);

  const handleLimitChange = (level: number) => {
    dispatch(setLimit(level));
    dispatch(setPage(1));
  };

  return (
    <>
      <NavHeader name={nameTitle} pageCreate={pageCreateLabel} />
      <PopUpMessage />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox">
              <div className="ibox-title d-flex justify-content-between">
                <h5>Lista</h5>
                <div className="btn-group">
                  {[5, 10, 15].map((level, index) => (
                    <button
                      key={index}
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
                {status === "succeeded" && <TableComponent users={userList} />}
                {status === "loading" && <div>Cargando...</div>}
                {status === "failed" && <div>Error: {error}</div>}
                <PaginationList filter={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
