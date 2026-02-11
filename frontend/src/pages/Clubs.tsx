/**
 * Página de Clubs
 * Permite a administradores con assignments: ver, crear, actualizar y eliminar clubs
 */

import { useState, useCallback, useEffect } from "react";
import toastr from "toastr";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchClubsDashboardData,
  fetchClubById,
  createClub,
  updateClub,
  deleteClub,
} from "../store/clubsThunk";
import { fetchAllSports } from "../store/sportsThunk";
import type { Club, CreateClubRequest } from "../services/clubs.service";
import type { UserAdmin } from "../interfaces/user";
import { NavHeader } from "../components";
import ClubsList from "../components/ClubsList";
import ImageUploadModal from "../components/modals/ImageUpload.modal";
import clubsService from "../services/clubs.service";
import { ClubFormModal } from "../components/modals/ClubForm.modal";
// ClubsTable removed: rendering cards (profile widgets) inline instead
import { GroupLevelsModal } from "../components/modals/GroupLevels.modal";
import { useNavigate } from "react-router-dom";
import OverlayLoader from "../components/Loader/OverlayLoader";

export const Clubs = ({ name }: { name?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Estado local para datos del dashboard
  const [dashboardData, setDashboardData] = useState<{
    clubs: Array<{
      _id: string;
      name: string;
      location: string;
      athletes_added: number;
      coaches: number;
      levels?: Array<{
        _id?: string;
        position: number;
        name: string;
        description?: string;
      }>;
      images?:
        | {
            small?: string;
            medium?: string;
            large?: string;
            [key: string]: any;
          }
        | any;
    }>;
  } | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Estado para deportes
  const [sports, setSports] = useState<any[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);

  // Estado local optimizado
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [selectedClubForLevels, setSelectedClubForLevels] =
    useState<Club | null>(null);
  const [clubLevels, setClubLevels] = useState<Array<{
    _id?: string;
    position: number;
    name: string;
    description?: string;
  }> | null>(null);
  const [formData, setFormData] = useState<CreateClubRequest>({
    name: "",
    sport_id: "",
    location: "",
    assignment_id: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setDashboardLoading(true);
      setSportsLoading(true);

      const dashboardResult = await dispatch(fetchClubsDashboardData());
      if (dashboardResult.payload) {
        setDashboardData(dashboardResult.payload as any);
      }

      const sportsResult = await dispatch(fetchAllSports());
      if (sportsResult.payload) {
        setSports(sportsResult.payload as any);
      }

      setDashboardLoading(false);
      setSportsLoading(false);
    };
    loadData();
  }, [dispatch]);

  // Datos locales del dashboard o valores por defecto
  const clubs = (dashboardData?.clubs || []).map((club) => ({
    sport: "", // Set to empty string or map from another property if available
    ...club,
  }));
  const clubsStatus = dashboardLoading ? "loading" : "idle";

  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoModalClubId, setLogoModalClubId] = useState<string | null>(null);
  const [logoCurrentImage, setLogoCurrentImage] = useState<string | undefined>(
    undefined,
  );

  const handleOpenLevels = useCallback(
    (clubId: string) => {
      const clubData = clubs.find((c) => c._id === clubId);
      if (clubData) {
        setSelectedClubForLevels({
          _id: clubId,
          name: clubData.name || "",
          sport_id: "",
          location: clubData.location || "",
          assignment_id: "",
          created_by: "",
          members: [],
          levels: clubData.levels || [],
          createdAt: "",
          updatedAt: "",
        });
      }
      setShowLevelsModal(true);
    },
    [clubs],
  );

  // Funciones optimizadas
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      sport_id: "",
      location: "",
      assignment_id:
        user?.role === "admin" ? (user as UserAdmin).assignment_id || "" : "",
    });
  }, [user]);

  const handleOpenCreate = useCallback(() => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback(
    async (clubId: string) => {
      setEditingId(clubId);
      const result = await dispatch(fetchClubById(clubId));
      if (result.payload) {
        const club = result.payload as any;
        setFormData({
          name: club.name || "",
          sport_id: club.sport_id?._id || club.sport_id || "",
          location: club.location || "",
          assignment_id: club.assignment_id || "",
        });
        setClubLevels(club.levels || []);
      }
      setShowModal(true);
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingId(null);
    setClubLevels(null);
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

  const reloadDashboard = useCallback(async () => {
    const result = await dispatch(fetchClubsDashboardData());
    if (result.payload) {
      setDashboardData(result.payload as any);
      // Actualizar el club seleccionado en el modal de levels si está abierto
      if (showLevelsModal && selectedClubForLevels) {
        const updatedClubs = (result.payload as any).clubs || [];
        const updatedClub = updatedClubs.find(
          (c: any) => c._id === selectedClubForLevels._id,
        );
        if (updatedClub) {
          setSelectedClubForLevels(updatedClub);
        }
      }
    }
  }, [dispatch, showLevelsModal, selectedClubForLevels]);

  const handleDelete = useCallback(
    async (clubId: string) => {
      if (!window.confirm("¿Estás seguro de que deseas eliminar este club?")) {
        return;
      }
      await dispatch(deleteClub(clubId));
      await reloadDashboard();
    },
    [dispatch, reloadDashboard],
  );

  const handleSave = useCallback(async () => {
    if (!formData.sport_id.trim()) {
      toastr.warning("Debes seleccionar un deporte");
      return;
    }

    let result;
    if (editingId) {
      result = await dispatch(
        updateClub({
          id: editingId,
          club: {
            name: formData.name,
            sport_id: formData.sport_id,
            location: formData.location,
          },
        }),
      );
    } else {
      result = await dispatch(createClub(formData));
    }

    if (result.payload) {
      await reloadDashboard();
      handleCloseModal();
    }
  }, [editingId, formData, dispatch, handleCloseModal, reloadDashboard]);

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

  console.log("Dashboard data:", clubs); // Debug: Ver datos del dashboard en consola

  return (
    <>
      <NavHeader name="Clubs" />

      <div className="wrapper wrapper-content">
        {clubsStatus === "loading" ? (
          <div className="col-12 text-center">
            <OverlayLoader isLoading={true} message="Cargando clubs..." />
          </div>
        ) : (
          <div className="col-12">
            <ClubsList
              clubs={clubs as any}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onOpenLevels={handleOpenLevels}
              onOpenGroups={(id: string) => navigate(`/clubs/${id}/groups`)}
              onUpdateLogo={(id: string, current?: string) => {
                setLogoModalClubId(id);
                setLogoCurrentImage(current);
                setLogoModalOpen(true);
              }}
              onCreateClub={handleOpenCreate}
              isLoading={dashboardLoading}
            />
          </div>
        )}
      </div>

      <ClubFormModal
        isOpen={showModal}
        isLoading={clubsStatus === "loading" || sportsLoading}
        isEditing={!!editingId}
        formData={formData}
        sports={sports}
        levels={clubLevels || []}
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
        initialLevels={selectedClubForLevels?.levels || []}
        onLevelUpdated={reloadDashboard}
        onClose={() => {
          setShowLevelsModal(false);
          setSelectedClubForLevels(null);
        }}
      />

      <ImageUploadModal
        open={logoModalOpen}
        title="Actualizar logo del club"
        currentImage={logoCurrentImage}
        entityName={logoModalClubId || ""}
        onClose={() => {
          setLogoModalOpen(false);
          setLogoModalClubId(null);
          setLogoCurrentImage(undefined);
        }}
        onSave={async (imageBase64?: string) => {
          if (!logoModalClubId) return Promise.reject("No club selected");
          const result = await clubsService.updateLogo(
            logoModalClubId,
            imageBase64,
          );
          await reloadDashboard();
          return result;
        }}
        saveLabel="Guardar logo"
      />
    </>
  );
};
