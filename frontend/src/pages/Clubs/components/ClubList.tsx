import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Image } from "../../../components";
import { deleteClub, restoreClub } from "../../../store/clubsThunks";
import type { AppDispatch } from "../../../store/store";
import type { Club } from "../interfaces";

interface ClubProps {
  clubs: Club[];
  edit?: boolean;
  delete?: boolean;
}

export const ClubList = ({ clubs, edit, delete: canDelete }: ClubProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (id?: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡No podrás recuperar este club!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteClub(id)).unwrap();
        swal("Eliminado!", "El club ha sido eliminado.", "success");
      }
    });
  };

  const handleRestore = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡El club será reactivado!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, reactivar!"],
      dangerMode: true,
    }).then((willRestore) => {
      if (willRestore) {
        dispatch(restoreClub(id)).unwrap();
        swal("Restaurado!", "El club ha sido reactivado.", "success");
      }
    });
  };

  return (
    <div className="project-list">
      <table className="table table-hover">
        <tbody>
          {clubs.map((club: Club, index: number) => (
            <tr key={index}>
              <td className="project-status text-center align-middle">
                {club.images ? (
                  <Image
                    src={club.images.small}
                    alt={club.name}
                    style={{ width: "50px", borderRadius: "50%" }}
                  />
                ) : (
                  "sin logo"
                )}
              </td>
              <td className="project-title text-center align-middle">
                {club.name.toUpperCase()}
              </td>
              <td className="project-people text-center align-middle">
                Grupos activos: &nbsp;
                {Array.isArray(club.groups)
                  ? club.groups.filter((g: any) => g.active).length
                  : 0}
              </td>
              <td className="project-people text-center align-middle">
                Deportistas: &nbsp;{club.uniqueAthletesCount}
              </td>

              <td className="project-payment text-center align-middle">
                Mensualidad: &nbsp;{club.monthly_pay} Bs
              </td>
              <td className="project-actions text-center align-middle">
                {club.active ? (
                  <>
                    {edit && (
                      <Link
                        to={`/clubs/edit/${club._id}`}
                        className="text-success m-2"
                      >
                        <i className="fa fa-edit"></i> Editar
                      </Link>
                    )}
                    {canDelete && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(club._id!);
                        }}
                        className="text-danger m-2"
                      >
                        <i className="fa fa-trash"></i> Eliminar
                      </Link>
                    )}
                    <Link
                      to={`/clubs/${club._id}/groups`}
                      className="text-primary m-2"
                    >
                      <i className="fa fa-eye"></i> Grupos
                    </Link>
                    {edit && (
                      <Link
                        to={`/clubs/${club._id}/assign-assistants`}
                        className="text-info m-2"
                      >
                        <i className="fa fa-user-plus"></i> Entrenadores
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(club._id!);
                    }}
                    className="text-warning m-2"
                  >
                    <i className="fa fa-new"></i> Restaurar
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
