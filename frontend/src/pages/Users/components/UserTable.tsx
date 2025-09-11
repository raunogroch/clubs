import { Link } from "react-router-dom";
import type { User } from "../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import type { RootState } from "../../../store";

interface UsersTableProps {
  users: User[];
  onDelete?: (id: string) => Promise<void>;
}

export const UserTable = ({ users, onDelete }: UsersTableProps) => {
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.filters);
  const { page, limit } = filter;

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

  const getSequentialNumber = (index: number) => {
    return (page - 1) * limit + index + 1;
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th>Roles</th>
            <th>Cedula de Identidad</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="text-center">{getSequentialNumber(index)}</td>
              <td className="text-center align-middle">
                <div className="text-success text-left">
                  {user.role === "athlete" && "Deportista"}
                  {user.role === "parent" && "Responsable"}
                  {user.role === "coach" && "Entrenador"}
                  {user.role === "admin" && "Administrador"}
                  {user.role === "superadmin" && "Super Administrador"}
                </div>
              </td>

              <td className="align-middle">{user.ci}</td>
              <td className="align-middle">{user.name}</td>
              <td className="align-middle">{user.lastname}</td>
              <td className="align-middle">{user.email}</td>

              <td className="text-center align-middle">
                <Link
                  to={`/users/edit/${user._id}`}
                  className="text-success m-2"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(user._id!);
                  }}
                  className="text-danger m-2"
                >
                  <i className="fa fa-trash"></i> Eliminar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
