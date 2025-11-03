import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { deleteUser, restoreUser, softDeleteUser } from "../store/usersThunks";
import type { User } from "../interfaces";

interface Props {
  users: User[];
  showRole?: boolean;
  allowRestore?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowRemove?: boolean;
}

const Roles = {
  athlete: "Atleta",
  parent: "Responsable",
  coach: "Entrenador",
  assistant: "Asistente",
  admin: "Administrador",
  superadmin: "Super Administrador",
};

export const GenericUserTable = ({
  users,
  showRole = true,
  allowRestore = false,
  allowEdit = true,
  allowDelete = false,
  allowRemove = false,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const filter = useSelector((state: RootState) => state.filters);
  const { page, limit } = filter;

  const handleDelete = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡No podrás recuperar este usuario!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteUser(id)).unwrap();
        swal("Eliminado!", "El usuario ha sido eliminado.", "success");
      }
    });
  };

  const handleRestore = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡El usuario será reactivado!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, reactivar!"],
      dangerMode: true,
    }).then((willRestore) => {
      if (willRestore) {
        dispatch(restoreUser(id)).unwrap();
        swal("Restaurado!", "El usuario ha sido reactivado.", "success");
      }
    });
  };

  const handleRemove = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡El usuario se quitara de la lista!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar!"],
      dangerMode: true,
    }).then((willRemove) => {
      if (willRemove) {
        dispatch(softDeleteUser(id)).unwrap();
        swal("Eliminado!", "El usuario ha quitado de la lista.", "success");
      }
    });
  };

  const getSequentialNumber = (index: number) => (page - 1) * limit + index + 1;
  const location = window.location.pathname.split("/")[2];

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            {showRole && <th>Roles</th>}
            <th>Cedula de Identidad</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="text-center">{getSequentialNumber(index)}</td>
              {showRole && (
                <td className="text-center align-middle">
                  <div className="text-success text-left">
                    {Roles[user.role]}
                  </div>
                </td>
              )}
              <td className="align-middle">{user.ci}</td>
              <td className="align-middle">{user.name}</td>
              <td className="align-middle">{user.lastname}</td>
              <td className="text-center align-middle">
                {user.active ? (
                  <>
                    {allowEdit && (
                      <Link
                        to={`/users/${location}/edit/${user._id}`}
                        className="text-success m-2"
                      >
                        <i className="fa fa-edit"></i> Editar
                      </Link>
                    )}
                    {allowRemove && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(user._id!);
                        }}
                        className="text-warning m-2"
                      >
                        <i className="fa fa-trash-o"></i> Remover
                      </Link>
                    )}
                    {allowDelete && (
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
                    )}
                  </>
                ) : allowRestore ? (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(user._id!);
                    }}
                    className="text-warning m-2"
                  >
                    <i className="fa fa-reply"></i> Restaurar
                  </Link>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericUserTable;
