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
                  <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                    <Link
                      to={`/sports/edit/${sport._id}`}
                      className="text-success m-1 d-flex d-md-inline-flex justify-content-center align-items-center w-100"
                    >
                      <i className="fa fa-edit" />
                      <span className="d-none d-md-inline ms-2">Editar</span>
                    </Link>

                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(sport._id!);
                      }}
                      className="text-danger m-1 d-flex d-md-inline-flex justify-content-center align-items-center w-100"
                    >
                      <i className="fa fa-trash" />
                      <span className="d-none d-md-inline ms-2">Eliminar</span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(sport._id!);
                    }}
                    className="text-warning m-1 d-flex d-md-inline-flex justify-content-center align-items-center w-100"
                  >
                    <i className="fa fa-new" />
                    <span className="d-none d-md-inline ms-2">Restaurar</span>
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
