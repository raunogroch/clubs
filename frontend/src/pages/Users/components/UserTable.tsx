import { Link } from "react-router-dom";
import type { User } from "../types/userTypes";

interface UsersTableProps {
  users: User[];
  onDelete: (id: string) => Promise<void>;
}

export const UserTable = ({ users, onDelete }: UsersTableProps) => {
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">Rol</th>
            <th>Cedula de Identidad</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="text-center text-uppercase">
                <div className="btn btn-info btn-rounded btn-outline btn-sm">
                  {user.role === "athlete" && "Deportista"}
                  {user.role === "parent" && "Responsable"}
                  {user.role === "coach" && "Entrenador"}
                  {user.role === "admin" && "Administrador"}
                  {user.role === "superadmin" && "Super Administrador"}
                </div>
              </td>
              <td>{user.ci}</td>
              <td>{user.name}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>

              <td className="text-center">
                <Link
                  to={`/users/edit/${user._id}`}
                  className="btn btn-primary btn-outline mx-1"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  onClick={() => handleDelete(user._id!)}
                  className="btn btn btn-danger btn-outline mx-1"
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
