import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { Schedule } from "../types/scheduleTypes";
import { setMessage } from "../../../store/messageSlice";
import type { AppDispatch } from "../../../store/store";
import { deleteSchedule } from "../../../store/scheduleThunks";

interface ScheduleTableProps {
  schedules: Schedule[];
}

export const ScheduleTable = ({ schedules }: ScheduleTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este horario?")) {
      await dispatch(deleteSchedule(id)).unwrap();
      dispatch(
        setMessage({
          message: "Horario eliminado exitosamente",
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
            <th>Entrada</th>
            <th>Salida</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule: Schedule, index) => (
            <tr key={schedule._id}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="align-middle">{schedule.startTime} Hrs</td>
              <td className="align-middle">{schedule.endTime} Hrs</td>
              <td className="text-center">
                <Link
                  to={`/schedules/edit/${schedule._id}`}
                  className="text-success m-2"
                >
                  <i className="fa fa-edit"></i> Editar
                </Link>
                <Link
                  to={"#"}
                  onClick={() => handleDelete(schedule._id!)}
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
