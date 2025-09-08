import { Link } from "react-router-dom";
import { Image } from "../../../components";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";

interface ClubFields {
  _id?: string;
  image?: string;
  name: string;
  schedule: {
    _id: string;
    startTime: string;
    endTime: string;
  };
  discipline: {
    _id: string;
    name: string;
  };
  place: string;
  coaches?: any[];
  athletes?: any[];
}

interface ClubsTableProps {
  clubs: ClubFields[];
  onDelete: (id: string) => Promise<void>;
}
export const ClubTable = ({ clubs, onDelete }: ClubsTableProps) => {
  const dispatch = useDispatch();
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      await onDelete(id);
      dispatch(
        setMessage({ message: "Club eliminado exitosamente", type: "warning" })
      );
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">Logo</th>
            <th>Nombre</th>
            <th>Horario</th>
            <th>Disciplina deportiva</th>
            <th>Lugar</th>
            <th>Entrenadores</th>
            <th>Deportistas</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map(
            ({
              _id,
              image,
              name,
              schedule,
              discipline,
              place,
              coaches,
              athletes,
            }) => (
              <tr key={_id}>
                <td className="text-center align-middle">
                  {image ? <Image src={image} alt={_id} /> : "Sin logo"}
                </td>
                <td className="align-middle">{name}</td>
                <td className="align-middle">
                  {`${schedule.startTime} Hrs - ${schedule.endTime} Hrs`}
                </td>
                <td className="align-middle">{discipline.name}</td>
                <td className="align-middle">{place}</td>
                <td className="align-middle">
                  {coaches?.length ?? 0} Asignado/s
                </td>
                <td className="align-middle">
                  {athletes?.length ?? 0} Asignado/s
                </td>
                <td className="text-center align-middle">
                  <Link
                    to={`/clubs/edit/${_id ?? ""}`}
                    className="btn btn-primary btn-outline m-1"
                  >
                    <i className="fa fa-edit"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="btn btn btn-danger btn-outline m-1"
                  >
                    <i className="fa fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
