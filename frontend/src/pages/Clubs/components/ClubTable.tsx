import { Link } from "react-router-dom";
import type { Club } from "../types/clubTypes";

interface ClubsTableProps {
  clubs: Club[];
  onDelete: (id: string) => Promise<void>;
}

export const ClubTable = ({ clubs, onDelete }: ClubsTableProps) => {
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
          {clubs.map((club, index) => (
            <tr key={club._id}>
              <td className="align-middle text-center">{index + 1}</td>
              <td className="align-middle">{club.name}</td>
              <td className="align-middle">
                {club.schedule.startTime} - {club.schedule.endTime}
              </td>
              <td className="align-middle">{club.discipline.name}</td>
              <td className="align-middle">{club.place}</td>
              <td className="align-middle">{club.coaches}</td>
              <td className="align-middle">{club.athletes}</td>
              <td className="text-center">
                <Link
                  to={`/clubs/edit/${club._id}`}
                  className="btn btn-primary btn-outline m-1"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  onClick={() => handleDelete(club._id!)}
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
