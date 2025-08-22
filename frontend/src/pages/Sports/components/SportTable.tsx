import { Link } from "react-router-dom";
import type { Sport } from "../types/sportTypes";

interface SportTableProps {
  sports: Sport[];
  onDelete: (id: string) => Promise<void>;
}

export const SportTable = ({ sports, onDelete }: SportTableProps) => {
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">Indice</th>
            <th>Nombre de la disciplina</th>
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
                  className="btn btn-primary btn-outline m-1"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  onClick={() => handleDelete(sport._id!)}
                  className="btn btn btn-danger btn-outline m-1"
                >
                  <i className="fa fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
