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
import { useAuth } from "../../../hooks";

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
  const { userRole } = useAuth();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  // Only coaches, assistants, admins and superadmins can manage clubs
  const canManageClubs =
    userRole &&
    ["coach", "assistant", "admin", "superadmin"].includes(userRole);
  const canEditClub = edit && canManageClubs;
  const canRemoveClub = canRemove && canManageClubs;
  const canDeleteClub = canDelete && canManageClubs;

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
      <div className="row">
        {clubs.map((club: Club, index: number) => (
          <div className="col-lg-4 col-md-6" key={index}>
            <div
              className={`widget-head-color-box ${
                club.active ? "navy" : "red"
              }-bg p-lg text-center`}
            >
              <div className="m-b-md">
                <h2 className="font-bold no-margins">{club.name}</h2>
              </div>
              {club.images ? (
                <div
                  onClick={() => {
                    if (!canEditClub) return;
                    setSelectedClub(club);
                    setImageModalOpen(true);
                  }}
                  style={{
                    cursor: canEditClub ? "pointer" : "default",
                    display: "inline-block",
                  }}
                  aria-hidden={!canEditClub}
                >
                  <Image
                    src={club.images.small}
                    alt={club.name}
                    className="rounded-circle circle-border m-b-md"
                  />
                </div>
              ) : (
                <div
                  className="btn btn-outline-secondary btn-rounded"
                  onClick={() => {
                    if (!canEditClub) return;
                    setSelectedClub(club);
                    setImageModalOpen(true);
                  }}
                  style={{
                    width: 96,
                    height: 96,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    opacity: canEditClub ? 1 : 0.6,
                    cursor: canEditClub ? "pointer" : "not-allowed",
                  }}
                >
                  sin logo
                </div>
              )}
              <div>
                <span>
                  {Array.isArray(club.groups)
                    ? club.groups.filter((g: any) => g.active).length
                    : 0}{" "}
                  Grupos
                </span>
                | <span>{club.uniqueAthletesCount ?? 0} atletas</span> |
                <span>{club.monthly_pay ?? "-"} Bs mensualidad</span>
              </div>
            </div>
            <div className="widget-text-box">
              <h4 className="media-heading">Reseña</h4>
              <p>{club.description}</p>
              <hr />
              <div
                className="text-center"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {!club.active ? (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore(club._id!);
                    }}
                    className="btn btn-xs btn-outline-warning m-1 d-flex d-md-inline-flex justify-content-center align-items-center w-100"
                    style={{ minWidth: 110 }}
                  >
                    <i className="fa fa-undo" />
                    <span className="ms-2">Restaurar</span>
                  </Link>
                ) : (
                  <>
                    {canEditClub && (
                      <Link
                        to={`/clubs/edit/${club._id}`}
                        className="btn btn-xs btn-outline-secondary"
                        style={{ minWidth: 110 }}
                      >
                        <i className="fa fa-edit"></i>Editar
                      </Link>
                    )}
                    <Link
                      to={`/clubs/${club._id}/groups`}
                      className="btn btn-xs btn-outline-primary"
                      style={{ minWidth: 110 }}
                    >
                      <i className="fa fa-eye"></i>Grupos
                    </Link>
                    {canRemoveClub && (
                      <button
                        className="btn btn-xs btn-outline-danger"
                        onClick={() => handleRemove(club._id)}
                        style={{ minWidth: 110 }}
                      >
                        <i className="fa fa-trash-o"></i>Remover
                      </button>
                    )}
                    {canDeleteClub && (
                      <button
                        className="btn btn-xs btn-danger"
                        onClick={() => handleDelete(club._id)}
                        style={{ minWidth: 110 }}
                      >
                        <i className="fa fa-trash"></i>Eliminar
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
