import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Image } from "../../../components";
import ImageUploadModal from "../../../components/ImageUploadModal";
import {
  deleteClub,
  restoreClub,
  softDeleteClub,
  updateClub,
} from "../../../store/clubsThunks";
import type { AppDispatch } from "../../../store/store";
import type { Club } from "../interfaces";

interface ClubProps {
  clubs: Club[];
  edit?: boolean;
  delete?: boolean;
  remove?: boolean;
}

export const ClubList = ({
  clubs,
  edit,
  remove: canRemove,
  delete: canDelete,
}: ClubProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleRemove = async (id?: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡El club será desactivado y no estará disponible!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, desactivar!"],
      dangerMode: true,
    }).then((willRemove) => {
      if (willRemove) {
        dispatch(softDeleteClub(id)).unwrap();
        swal("Desactivado!", "El club ha sido desactivado.", "success");
      }
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡El club será eliminado permanentemente de la base de datos!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, eliminar!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteClub(id)).unwrap();
        swal(
          "Eliminado!",
          "El club ha sido eliminado permanentemente.",
          "success"
        );
      }
    });
  };

  const handleRestore = async (id: string) => {
    if (!id) return;
    swal({
      title: "¿Estás seguro?",
      text: "¡El club será reactivado!",
      icon: "warning",
      buttons: ["Cancelar", "Sí, reactivar!"],
      dangerMode: true,
    }).then((willRestore) => {
      if (willRestore) {
        dispatch(restoreClub(id)).unwrap();
        swal("Restaurado!", "El club ha sido reactivado.", "success");
      }
    });
  };

  return (
    <div className="project-list">
      <table className="table table-hover">
        <tbody>
          {clubs.map((club: Club, index: number) => (
            <tr key={index}>
              <td className="project-status text-center align-middle">
                {club.images ? (
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <div
                      onClick={() => {
                        if (!edit) return;
                        setSelectedClub(club);
                        setImageModalOpen(true);
                      }}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <Image
                        src={club.images.small}
                        alt={club.name}
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    </div>
                    <button
                      className="btn btn-xs btn-rounded btn-danger"
                      style={{ position: "absolute", right: -8, bottom: -8 }}
                      onClick={() => {
                        if (!edit) return;
                        setSelectedClub(club);
                        setImageModalOpen(true);
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </div>
                ) : (
                  <span
                    className="btn btn-outline-danger btn-rounded"
                    onClick={() => {
                      if (!edit) return;
                      setSelectedClub(club);
                      setImageModalOpen(true);
                    }}
                    style={{
                      opacity: edit ? 1 : 0.6,
                      cursor: edit ? "pointer" : "not-allowed",
                    }}
                  >
                    sin logo
                  </span>
                )}
              </td>
              <td className="project-title text-center align-middle">
                {club.name.toUpperCase()}
              </td>
              <td className="project-people text-center align-middle">
                Grupos activos: &nbsp;
                {Array.isArray(club.groups)
                  ? club.groups.filter((g: any) => g.active).length
                  : 0}
              </td>
              <td className="project-people text-center align-middle">
                Deportistas: &nbsp;{club.uniqueAthletesCount}
              </td>

              <td className="project-payment text-center align-middle">
                Mensualidad: &nbsp;{club.monthly_pay} Bs
              </td>
              <td className="project-actions text-center align-middle">
                {club.active ? (
                  <>
                    {edit && (
                      <Link
                        to={`/clubs/edit/${club._id}`}
                        className="text-success m-2"
                      >
                        <i className="fa fa-edit"></i> Editar
                      </Link>
                    )}
                    {canRemove && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(club._id!);
                        }}
                        className="text-danger m-2"
                      >
                        <i className="fa fa-trash-o"></i> Remover
                      </Link>
                    )}
                    {canDelete && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(club._id!);
                        }}
                        className="text-danger m-2"
                      >
                        <i className="fa fa-trash"></i> Eliminar
                      </Link>
                    )}
                    <Link
                      to={`/clubs/${club._id}/groups`}
                      className="text-primary m-2"
                    >
                      <i className="fa fa-eye"></i> Grupos
                    </Link>
                  </>
                ) : (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(club._id!);
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

      <ImageUploadModal
        open={imageModalOpen}
        title="Actualizar logo"
        entityName={selectedClub?.name}
        currentImage={selectedClub?.images?.small || ""}
        onClose={() => {
          setImageModalOpen(false);
          setSelectedClub(null);
        }}
        onSave={async (imageBase64?: string) => {
          if (!selectedClub) return null;
          const payload: any = { ...selectedClub };
          if (imageBase64) payload.image = imageBase64;
          else delete payload.image;
          const res: any = await dispatch(updateClub(payload)).unwrap();
          return res;
        }}
      />
    </div>
  );
};

export default ClubList;
