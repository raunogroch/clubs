import { Link, useLocation } from "react-router-dom";
import { NavHeader, LoadingIndicator, ErrorMessage } from "../../components";
import type { UsersPageProps } from "./types/userTypes";
import { useUsers } from "./hooks/useUsers";
import { UserTable } from "../../components";

export const Users = ({ name }: UsersPageProps) => {
  const { users, loading, error, deleteUser } = useUsers();
  const location = useLocation();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <NavHeader name={name} />

      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Lista de Usuarios</h5>
                <div className="ibox-tools">
                  <Link
                    to="/users/create"
                    className="btn btn-rounded btn-outline"
                  >
                    <i className="fa fa-plus"></i> Nuevo Usuario
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <UserTable users={users} onDelete={deleteUser} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
