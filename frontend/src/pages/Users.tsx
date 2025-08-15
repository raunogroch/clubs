// Users.tsx
import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUsers.ts";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { NavHeader } from "../components/NavHeader.tsx";
import { UsersTable } from "../components/UsersTable.tsx";
import { LoadingIndicator } from "../components/LoadingIndicator.tsx";

interface UsersPageProps {
  name: string;
}

export const Users = ({ name }: UsersPageProps) => {
  const { users, loading, error } = useUsers();

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
                <h5>Basic Table</h5>
                <div className="ibox-tools">
                  <Link
                    to="/users/create"
                    className="btn btn-primary text-danger"
                  >
                    <i className="fa fa-plus"></i> Nuevo Usuario
                  </Link>
                </div>
              </div>
              <div className="ibox-content">
                <UsersTable users={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
