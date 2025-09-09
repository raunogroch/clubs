import { Link } from "react-router-dom";
import type { Sport } from "../interfaces/sportTypes";
import { useDispatch } from "react-redux";
import { setMessage } from "../../../store/messageSlice";

interface SportTableProps {
  sports: Sport[];
  onDelete: (id: string) => Promise<void>;
}

export const SportTable = ({ sports, onDelete }: SportTableProps) => {
  const dispatch = useDispatch();
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta disciplina?")) {
      await onDelete(id);
      dispatch(
        setMessage({
          message: "Disciplina eliminada exitosamente",
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
