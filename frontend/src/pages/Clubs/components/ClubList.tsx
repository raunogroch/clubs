import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Image } from "../../../components";
import { deleteClub } from "../../../store/clubsThunks";
import type { AppDispatch } from "../../../store/store";
import type { Club } from "../interfaces/clubTypes";

interface ClubProps {
  clubs: Club[];
}

export const ClubList = ({ clubs }: ClubProps) => {
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

  return (
    <div className="project-list">
      <table className="table table-hover">
        <tbody>
          {clubs.map((club: Club, index: number) => (
            <tr key={index}>
              <td className="project-status">
                <Image
                  src={club.image}
                  alt={club.name}
                  style={{ width: "50px", borderRadius: "50%" }}
                />
              </td>
              <td className="project-title">
                <Link to={`/clubs/${club._id}/groups`}>
                  <i className="fa fa-eye"></i> &nbsp; {club.name}
                </Link>
                <br />
                <small>
                  Creado:&nbsp;
                  {new Date(club.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </small>
              </td>
              <td className="project-people">
                Grupos activos:
                {Array.isArray(club.groups)
                  ? club.groups.filter((g: any) => g.active).length
                  : 0}
              </td>
              <td className="project-people">
                Deportistas: {club.uniqueAthletesCount}
              </td>
              <td className="project-actions align-middle">
                <Link
                  to={`/clubs/edit/${club._id}`}
                  className=" text-success mx-2"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <Link
                  to={"#"}
                  className=" text-danger mx-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(club._id);
                  }}
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
