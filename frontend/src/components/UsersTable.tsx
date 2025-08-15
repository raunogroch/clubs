import { useMemo } from "react";
import type { User } from "../interfaces/userInterface";
import { calcularEdad } from "../scripts/ageCalculate";
import { Link } from "react-router-dom";
import { RoleBadge } from "./RoleBadge";
import { CustomMessage } from "./CustomMessage";

const confirmDelete = (userId: string) => {
  if (
    window.confirm(`¿Estás seguro de eliminar este usuario con id ${userId}?`)
  ) {
    //alert(`Se eliminara el id: ${userId}`);
  }
};

export const UsersTable = ({ users }: { users: User[] }) => {
  const filteredUsers = useMemo(
    () => users.filter((user) => !user.roles.includes("superadmin")),
    [users]
  );

  if (filteredUsers.length === 0) {
    return <div className="alert alert-info">No hay usuarios registrados</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Edad</th>
            <th className="text-center">Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="align-middle">{user.ci}</td>
              <td className="align-middle">{user.name}</td>
              <td className="align-middle">{user.lastname}</td>
              <td className="align-middle">
                {calcularEdad(user.birth_date)} Años
              </td>
              <td className="align-middle text-center">
                {user.roles.map((rol, i) => (
                  <RoleBadge key={`${user._id}-role-${i}`} role={rol} />
                ))}
              </td>
              <td className="align-middle text-center">
                <Link
                  to={`/users/edit/${user._id}`}
                  className="btn btn-primary btn-rounded btn-outline mx-1"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  className="btn btn-danger btn-rounded btn-outline mx-1"
                  onClick={() => confirmDelete(user._id)}
                >
                  <i className="fa fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
