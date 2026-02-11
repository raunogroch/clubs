import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import toastr from "toastr";

export const useClubsData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState<{ clubs: any[] } | null>(
    null,
  );
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Sports
  const [sports, setSports] = useState<any[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);

  // Modal states
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

  // Logo modal
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoModalClubId, setLogoModalClubId] = useState<string | null>(null);
  const [logoCurrentImage, setLogoCurrentImage] = useState<string | undefined>(
    undefined,
  );

  // Form data
  const [formData, setFormData] = useState<CreateClubRequest>({
    name: "",
    sport_id: "",
    location: "",
    assignment_id: "",
  });

  // Load data on mount
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

  // Derived data
  const clubs = dashboardData?.clubs || [];
  const clubsStatus = dashboardLoading ? "loading" : "idle";

  // Handlers
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
      // Update selected club in levels modal if open
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

  const handleOpenLevels = useCallback(
    (clubId: string) => {
      const clubData = clubs.find((c) => c._id === clubId);
      if (clubData) {
        setSelectedClubForLevels(clubData);
      }
      setShowLevelsModal(true);
    },
    [clubs],
  );

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

  const handleOpenLogo = useCallback((id: string, current?: string) => {
    setLogoModalClubId(id);
    setLogoCurrentImage(current);
    setLogoModalOpen(true);
  }, []);

  const handleCloseLogo = useCallback(() => {
    setLogoModalOpen(false);
    setLogoModalClubId(null);
    setLogoCurrentImage(undefined);
  }, []);

  return {
    // Data
    clubs,
    sports,
    dashboardLoading,
    sportsLoading,
    clubsStatus,
    formData,
    editingId,
    clubLevels,

    // Modal states
    showModal,
    showLevelsModal,
    selectedClubForLevels,
    logoModalOpen,
    logoModalClubId,
    logoCurrentImage,

    // Handlers
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
  };
};
