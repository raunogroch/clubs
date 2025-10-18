import type { User, UsersPageProps } from "../interfaces";
import { NavHeader, Spinner } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, setPage, type AppDispatch, type RootState } from "../store";
import { useEffect } from "react";
import { fetchUsers } from "../store/usersThunks";
import { PaginationList } from "../components/PaginationList";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

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

  if (error) toastr.error(error);

  return (
    <>
      <NavHeader name={nameTitle} pageCreate={pageCreateLabel} />
      {status === "loading" && <Spinner />}
      {status === "succeeded" && userList.length === 0 && (
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">No hay usuarios para mostrar</h3>
            <div className="error-desc">
              Actualmente no tienes informacion en esta seccion.
            </div>
          </div>
        </div>
      )}
      {status === "succeeded" && userList.length > 0 && (
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
                  <TableComponent users={userList} />
                  <PaginationList filter={users} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
