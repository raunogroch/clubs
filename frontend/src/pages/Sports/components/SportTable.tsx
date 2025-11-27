import { Link } from "react-router-dom";
import type { Sport } from "../interfaces/sportTypes";
import { useDispatch } from "react-redux";
import { deleteSport, restoreSport } from "../../../store/sportsThunks";
import type { AppDispatch } from "../../../store";

interface SportTableProps {
  sports: Sport[];
}

export const SportTable = ({ sports }: SportTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡No podrás recuperar este deporte!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar!"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await dispatch(deleteSport(id)).unwrap();
          swal("Eliminado!", "El deporte ha sido eliminado.", "success");
        } catch (error: any) {
          swal("Error!", error || "No se pudo eliminar el deporte.", "error");
        }
      }
    });
  };

  const handleRestore = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡La disciplina será reactivado!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, reactivar!"],
      dangerMode: true,
    }).then((willRestore) => {
      if (willRestore) {
        dispatch(restoreSport(id)).unwrap();
        swal("Restaurado!", "La disciplina ha sido reactivado.", "success");
      }
    });
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
                {sport.active ? (
                  <>
                    <Link
                      to={`/sports/edit/${sport._id}`}
                      className="text-success m-2"
                    >
                      <i className="fa fa-edit"></i> Editar
                    </Link>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(sport._id!);
                      }}
                      className="text-danger m-2"
                    >
                      <i className="fa fa-trash"></i> Eliminar
                    </Link>
                  </>
                ) : (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(sport._id!);
                    }}
                    className="text-warning m-2"
                  >
                    <i className="fa fa-new"></i> Restaurar
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
