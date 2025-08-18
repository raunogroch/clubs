import { Link } from "react-router-dom";
import type { User } from "../types/userTypes";

interface UsersTableProps {
  users: User[];
  onDelete: (id: string) => Promise<void>;
}

export const UserTable = ({ users, onDelete }: UsersTableProps) => {
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      console.log(id);
      await onDelete(id);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{`${user.name} ${user.lastname}`}</td>
              <td>{user.email}</td>
              <td>
                {user.role === "athlete" && "Deportista"}
                {user.role === "parent" && "Responsable"}
                {user.role === "coach" && "Entrenador"}
                {user.role === "admin" && "Administrador"}
                {user.role === "superadmin" && "Super Administrador"}
              </td>
              <td>
                <Link
                  to={`/users/edit/${user._id}`}
                  className="btn btn-info btn-sm mr-1"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(user._id!)}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
