import { Link } from "react-router-dom";
import type { User } from "../interfaces";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import { ImageWithFallback } from "../../../components";

interface UsersTableProps {
  users: User[];
  onDelete?: (id: string) => Promise<void>;
}

export const UserTable = ({ users, onDelete }: UsersTableProps) => {
  const dispatch = useDispatch();
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      await onDelete(id);
      dispatch(
        setMessage({
          message: "Usuario eliminado exitosamente",
          type: "warning",
        })
      );
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">Rol</th>
            <th className="text-center">Foto</th>
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
              <td className="text-center align-middle text-uppercase">
                <div className="btn btn-info btn-rounded btn-outline btn-sm">
                  {user.role === "athlete" && "Deportista"}
                  {user.role === "parent" && "Responsable"}
                  {user.role === "coach" && "Entrenador"}
                  {user.role === "admin" && "Administrador"}
                  {user.role === "superadmin" && "Super Administrador"}
                </div>
              </td>
              <td className="align-middle text-center">
                {user.image ? (
                  <ImageWithFallback
                    src={user.image}
                    alt={user.name}
                    style={{ width: "50px" }}
                  />
                ) : (
                  "Sin Foto"
                )}
              </td>
              <td className="align-middle">{user.ci}</td>
              <td className="align-middle">{user.name}</td>
              <td className="align-middle">{user.lastname}</td>
              <td className="align-middle">{user.email}</td>

              <td className="text-center align-middle">
                <Link
                  to={`/users/edit/${user._id}`}
                  className="btn btn-primary btn-outline m-1"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  onClick={() => handleDelete(user._id!)}
                  className="btn btn btn-danger btn-outline m-1"
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
