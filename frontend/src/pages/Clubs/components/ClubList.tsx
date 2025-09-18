import { useDispatch } from "react-redux";
import { Image } from "../../../components";
import type { Club } from "../interfaces/clubTypes";
import type { AppDispatch } from "../../../store/store";
import { deleteClub } from "../../../store/clubsThunks";
import { setMessage } from "../../../store/messageSlice";
import { Link } from "react-router-dom";

interface ClubProps {
  clubs: Club[];
}
export const ClubList = ({ clubs }: ClubProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      dispatch(deleteClub(id)).unwrap();
      dispatch(
        setMessage({ message: "Club eliminado exitosamente", type: "warning" })
      );
    }
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
                <a href="project_detail.html">{club.name}</a>
                <br />
                <small>
                  Creado:{" "}
                  {new Date(club.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </small>
              </td>
              <td className="project-people">
                Grupos: {club.groups?.length || 0}
              </td>
              <td className="project-people">
                Deportistas: {club.uniqueAthletesCount}
              </td>
              <td className="project-actions align-middle">
                <Link
                  to={`/clubs/${club._id}/groups`}
                  className=" text-primary mx-2"
                >
                  <i className="fa fa-eye"></i> Ver
                </Link>
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
