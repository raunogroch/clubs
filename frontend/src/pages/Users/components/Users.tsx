import { Link } from "react-router-dom";
import type { UsersPageProps } from "../interfaces";
import { UserTable } from ".";
import { useUsers } from "../hooks";
import { PopUpMessage, LoadingIndicator, NavHeader } from "../../../components";

export const Users = ({ name }: UsersPageProps) => {
  const { users, loading, deleteUser } = useUsers();

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <NavHeader name={name} />
      <PopUpMessage />
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
