/**
 * Página de Clubs
 * Permite a administradores con assignments: ver, crear, actualizar y eliminar clubs
 */

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { UserAdmin } from "../interfaces/user";
import { NavHeader } from "../components";
import ClubsList from "../components/ClubsList";
import ImageUploadModal from "../components/modals/ImageUpload.modal";
import clubsService from "../services/clubs.service";
import { ClubFormModal } from "../components/modals/ClubForm.modal";
import { GroupLevelsModal } from "../components/modals/GroupLevels.modal";
import { useNavigate } from "react-router-dom";
import OverlayLoader from "../components/Loader/OverlayLoader";
import { useClubsData } from "../customHooks/useClubsData";

export const Clubs = ({ name }: { name?: string }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    clubs,
    sports,
    dashboardLoading,
    sportsLoading,
    clubsStatus,
    formData,
    editingId,
    clubLevels,
    showModal,
    showLevelsModal,
    selectedClubForLevels,
    logoModalOpen,
    logoModalClubId,
    logoCurrentImage,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleChange,
    handleSave,
    handleDelete,
    handleOpenLevels,
    handleOpenLogo,
    handleCloseLogo,
    reloadDashboard,
    setShowLevelsModal,
    setSelectedClubForLevels,
  } = useClubsData();

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
                onUpdateLogo={handleOpenLogo}
                onCreateClub={handleOpenCreate}
                isLoading={dashboardLoading}
              />
            </div>
          )}
        </div>
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
        onClose={handleCloseLogo}
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
