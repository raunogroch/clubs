import { Link } from "react-router-dom";
import type { Schedule } from "../types/scheduleTypes";

interface ScheduleTableProps {
  schedules: Schedule[];
  onDelete: (id: string) => Promise<void>;
}

export const ScheduleTable = ({ schedules, onDelete }: ScheduleTableProps) => {
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este horario?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Hora de inicio</th>
            <th className="text-center">Hora de culminacion</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule: Schedule, index) => (
            <tr key={schedule._id}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">
                {schedule.startTime} Hrs
              </td>
              <td className="text-center align-middle">
                {schedule.endTime} Hrs
              </td>
              <td className="text-center">
                <Link
                  to={`/schedules/edit/${schedule._id}`}
                  className="btn btn-primary btn-outline m-1"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <button
                  onClick={() => handleDelete(schedule._id!)}
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
