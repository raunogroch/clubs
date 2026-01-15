import type { User } from "../interfaces";
import { NavHeader, Spinner } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, setPage, type AppDispatch, type RootState } from "../store";
import { useEffect } from "react";
import { fetchUsers } from "../store/usersThunks";
import { PaginationList } from "../components/PaginationList";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const UserListGeneric = ({
  name: nameTitle,
  role,
  TableComponent,
  edit,
  restore: res,
  remove: canRemove,
  delete: canDelete,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );
  const filter = useSelector((state: RootState) => state.filters);
  const { page, limit, name } = filter;
  const userList = users.data as User[];

  // Define role-based access control
  const roleAccessMap: Record<string, string[]> = {
    athlete: ["admin", "superadmin"], // Athletes can only be viewed by admins
    parent: ["admin", "superadmin"], // Parents can only be viewed by admins
    coach: ["coach", "assistant", "admin", "superadmin"], // Coaches can view each other and assistants can view them
    assistant: ["admin", "superadmin"], // Assistants only viewed by admins
    admin: ["admin", "superadmin"], // Admins only viewed by admins/superadmins
    superadmin: ["superadmin"], // Only superadmins can view other superadmins
    users: ["admin", "superadmin"], // Users list only for admins
  };

  const userRole = currentUser?.role;
  const allowedRoles = roleAccessMap[role] || [];
  const hasAccess = userRole && allowedRoles.includes(userRole);

  useEffect(() => {
    if (hasAccess) {
      dispatch(fetchUsers({ page, limit, name, ...(role ? { role } : {}) }));
    }
  }, [dispatch, page, limit, name, role, hasAccess]);

  const handleLimitChange = (level: number) => {
    dispatch(setLimit(level));
    dispatch(setPage(1));
  };

  if (error) toastr.error(error);

  // Check if user has access to this section
  if (!hasAccess) {
    return (
      <>
        <NavHeader name={nameTitle} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold">Acceso denegado</h3>
            <div className="error-desc">
              No tienes permisos para ver esta sección. Solo usuarios con rol{" "}
              {allowedRoles.join(", ")} pueden acceder.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader name={nameTitle} />
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
                  <TableComponent
                    users={userList}
                    edit={edit}
                    restore={res}
                    remove={canRemove}
                    delete={canDelete}
                    userRole={role}
                  />
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
