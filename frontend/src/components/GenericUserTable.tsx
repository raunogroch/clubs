import { Link } from "react-router-dom";
import { Image } from ".";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { deleteUser, restoreUser, softDeleteUser } from "../store/usersThunks";
import type { User } from "../interfaces";
import ImageUploadModal from "./ImageUploadModal";
import { updateUser } from "../store/usersThunks";

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
  showRole,
  allowRestore,
  allowEdit,
  allowDelete,
  allowRemove,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const location = window.location.pathname.split("/")[2];

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">Foto</th>
            {showRole && <th>Roles</th>}
            <th>Carnet</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="text-center align-middle">
                {user.images ? (
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <div
                      style={{
                        cursor: allowEdit ? "pointer" : "default",
                        display: "inline-block",
                      }}
                      onClick={() => {
                        if (!allowEdit) return;
                        setSelectedUser(user);
                        setImageModalOpen(true);
                      }}
                    >
                      <Image
                        src={user.images.small}
                        alt={user.username || user.name}
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </div>
                    <button
                      className="btn btn-xs btn-rounded btn-danger"
                      style={{ position: "absolute", right: -8, bottom: -8 }}
                      onClick={() => {
                        if (!allowEdit) return;
                        setSelectedUser(user);
                        setImageModalOpen(true);
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-primary"
                    disabled={!allowEdit}
                    onClick={() => {
                      if (!allowEdit) return;
                      setSelectedUser(user);
                      setImageModalOpen(true);
                    }}
                  >
                    sin imagen
                  </button>
                )}
              </td>

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
                  // Contenedor responsive: columna en < md, fila en >= md
                  <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                    {allowEdit && (
                      <Link
                        to={`/users/${location}/edit/${user._id}`}
                        className="text-success m-1 d-flex d-md-inline-flex justify-content-center justify-content-md-center align-items-center w-100"
                      >
                        <i className="fa fa-edit" />
                        <span className="d-none d-md-inline ms-2">Editar</span>
                      </Link>
                    )}

                    {allowRemove && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(user._id!);
                        }}
                        className="text-warning m-1 d-flex d-md-inline-flex justify-content-center justify-content-md-center align-items-center w-100"
                      >
                        <i className="fa fa-trash-o" />
                        <span className="d-none d-md-inline ms-2">Remover</span>
                      </Link>
                    )}

                    {allowDelete && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(user._id!);
                        }}
                        className="text-danger m-1 d-flex d-md-inline-flex justify-content-center justify-content-md-center align-items-center w-100"
                      >
                        <i className="fa fa-trash" />
                        <span className="d-none d-md-inline ms-2">
                          Eliminar
                        </span>
                      </Link>
                    )}
                  </div>
                ) : allowRestore ? (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(user._id!);
                    }}
                    className="text-warning m-1 d-flex d-md-inline-flex justify-content-center justify-content-md-center align-items-center w-100"
                  >
                    <i className="fa fa-reply" />
                    <span className="d-none d-md-inline ms-2">Restaurar</span>
                  </Link>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ImageUploadModal
        open={imageModalOpen}
        title="Actualizar imagen"
        entityName={selectedUser?.name}
        currentImage={selectedUser?.images?.small || ""}
        onClose={() => {
          setImageModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={async (imageBase64?: string) => {
          if (!selectedUser) return null;
          const payload: any = { ...selectedUser };
          // Solo enviar la imagen si el usuario la cambió voluntariamente
          if (imageBase64 && imageBase64.startsWith("data:")) {
            payload.image = imageBase64;
          } else {
            delete payload.image;
          }
          // Nunca enviar ni modificar la contraseña desde el modal de imagen
          if (payload.password !== undefined) {
            delete payload.password;
          }
          const res: any = await dispatch(updateUser(payload)).unwrap();
          return res;
        }}
      />
    </div>
  );
};
