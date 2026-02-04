/**
 * Página de Clubs
 * Permite a administradores con assignments: ver, crear, actualizar y eliminar clubs
 */

import { useState, useCallback, useEffect } from "react";
import toastr from "toastr";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchAllClubs,
  createClub,
  updateClub,
  deleteClub,
} from "../store/clubsThunk";
import { fetchMyAssignments } from "../store/assignmentsThunk";
import { fetchAllSports } from "../store/sportsThunk";
import type { Club, CreateClubRequest } from "../services/clubs.service";
import type { UserAdmin } from "../interfaces/user";
import { NavHeader } from "../components";
import { ClubFormModal } from "../components/ClubFormModal";
import { ClubsTable } from "../components/ClubsTable";
import { GroupLevelsModal } from "../features/groups/components";
import { useClubMembers } from "../hooks/useClubMembers";

export const Clubs = ({ name }: { name?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { items: clubs, status: clubsStatus } = useSelector(
    (state: RootState) => state.clubs,
  );
  const { items: assignments } = useSelector(
    (state: RootState) => state.assignments,
  );
  const { items: sports } = useSelector((state: RootState) => state.sports);
  const { clubMembers, loading: membersLoading } = useClubMembers();

  // Estado local optimizado
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [selectedClubForLevels, setSelectedClubForLevels] =
    useState<Club | null>(null);
  const [formData, setFormData] = useState<CreateClubRequest>({
    sport_id: "",
    location: "",
    assignment_id: "",
  });

  // Cargar datos del store
  useEffect(() => {
    dispatch(fetchAllClubs());
    dispatch(fetchMyAssignments());
    dispatch(fetchAllSports());
  }, [dispatch]);

  // Funciones optimizadas
  const getSportName = useCallback(
    (sportId: string) =>
      sports.find((s) => s._id === sportId)?.name || `Deporte ID: ${sportId}`,
    [sports],
  );

  const resetForm = useCallback(() => {
    setFormData({
      sport_id: "",
      location: "",
      assignment_id: assignments[0]?._id || "",
    });
  }, [assignments]);

  const handleOpenCreate = useCallback(() => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((club: Club) => {
    setEditingId(club._id);
    setFormData({
      sport_id: club.sport_id,
      location: club.location || "",
      assignment_id: club.assignment_id,
    });
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  }, [resetForm]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleDelete = useCallback(
    async (clubId: string) => {
      if (!window.confirm("¿Estás seguro de que deseas eliminar este club?")) {
        return;
      }
      await dispatch(deleteClub(clubId));
    },
    [dispatch],
  );

  const handleSave = useCallback(async () => {
    if (!formData.sport_id.trim()) {
      toastr.warning("Debes seleccionar un deporte");
      return;
    }

    if (editingId) {
      await dispatch(
        updateClub({ id: editingId, club: { location: formData.location } }),
      );
    } else {
      await dispatch(createClub(formData));
    }

    handleCloseModal();
  }, [editingId, formData, dispatch, handleCloseModal]);

  // Verificar si el usuario admin tiene assignment_id
  const hasAssignment =
    user?.role === "admin"
      ? (user as UserAdmin).assignment_id !== null &&
        (user as UserAdmin).assignment_id !== undefined
      : true;

  if (user?.role === "admin" && !hasAssignment) {
    return (
      <>
        <NavHeader name={name} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-warning">⚠️ Sin Asignación</h3>
            <div className="error-desc">
              <p>
                Aún no has sido asignado a ningún módulo. Por favor, ponte en
                contacto con el superadministrador.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader name="Clubs" />
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Gestión de Clubs</h5>
                <div className="ibox-tools">
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={handleOpenCreate}
                    disabled={clubsStatus === "loading"}
                  >
                    <i className="fa fa-plus"></i> Crear Club
                  </button>
                </div>
              </div>
              <div className="ibox-content">
                <ClubsTable
                  clubs={clubs}
                  clubMembers={clubMembers}
                  isLoading={clubsStatus === "loading" || membersLoading}
                  getSportName={getSportName}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onOpenLevels={(club) => {
                    setSelectedClubForLevels(club);
                    setShowLevelsModal(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClubFormModal
        isOpen={showModal}
        isLoading={clubsStatus === "loading"}
        isEditing={!!editingId}
        formData={formData}
        sports={sports}
        onClose={handleCloseModal}
        onSave={handleSave}
        onChange={handleChange}
      />

      <GroupLevelsModal
        isOpen={showLevelsModal}
        group={
          selectedClubForLevels
            ? {
                _id: "",
                name: "",
                club_id: selectedClubForLevels._id,
                coaches: [],
                created_by: "",
                createdAt: "",
                updatedAt: "",
              }
            : null
        }
        onClose={() => {
          setShowLevelsModal(false);
          setSelectedClubForLevels(null);
        }}
      />
    </>
  );
};
