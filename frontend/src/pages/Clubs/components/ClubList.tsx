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

  console.log(clubs);
  return (
    <div className="row">
      {clubs.map((club: Club) => (
        <div className="col-lg-4">
          <div className="widget-head-color-box navy-bg p-lg text-center">
            <div className="m-b-md">
              <h2 className="font-bold no-margins">{club.name}</h2>
              <small>{club.sport.name}</small>
            </div>
            {club.image ? (
              <Image
                src={club.image}
                className="rounded-circle circle-border m-b-md"
                alt="profile"
                width={100}
              />
            ) : (
              <div className="rounded-circle circle-border m-b-md">
                Sin foto
              </div>
            )}
            <div>
              <span> Atletas activos</span>
            </div>
          </div>
          <div className="widget-text-box">
            <h4 className="media-heading">{club.place}</h4>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
              className="m-b-sm"
            >
              {club.description}
            </div>

            <div className="d-flex justify-content-between">
              <Link
                to={`/clubs/${club._id}/groups`}
                className="btn btn-xs btn-success"
              >
                <i className="fa fa-eye"></i> Ver
              </Link>
              <Link
                to={`/clubs/edit/${club._id}`}
                className="btn btn-xs btn-white"
              >
                <i className="fa fa-edit"></i> Editar
              </Link>
              <Link
                to={"#"}
                className="btn btn-xs btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(club._id);
                }}
              >
                <i className="fa fa-trash"></i> Eliminar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
