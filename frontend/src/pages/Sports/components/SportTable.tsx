import { Link } from "react-router-dom";
import type { Sport } from "../interfaces/sportTypes";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";
import { deleteSport } from "../../../store/sportsThunks";
import type { AppDispatch } from "../../../store";

interface SportTableProps {
  sports: Sport[];
}

export const SportTable = ({ sports }: SportTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta disciplina?")) {
      dispatch(deleteSport(id)).unwrap();
      dispatch(
        setMessage({
          message: "Disciplina eliminada exitosamente",
          type: "success",
        })
      );
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th>Disciplina</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sports.map((sport, index) => (
            <tr key={sport._id}>
              <td className="align-middle text-center">{index + 1}</td>
              <td className="align-middle">{sport.name}</td>
              <td className="text-center">
                <Link
                  to={`/sports/edit/${sport._id}`}
                  className="text-success m-2"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <Link
                  to={"#"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(sport._id!);
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
