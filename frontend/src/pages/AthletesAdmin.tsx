import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { NavHeader } from "../components";
import { createUser, updateUser } from "../store/usersThunk";
import {
  fetchAthletes,
  fetchParentsByCISearch,
  fetchAllParents,
  uploadAthleteImage,
  uploadAthleteCI,
  fetchAthleteParent,
} from "../store/athletesThunk";
import { clearSearchedParent } from "../store/athletesSlice";
import { AthletesTable } from "./athletes-admin/components/AthletesTable";
import { AthleteFormModal } from "../components/modals/AthleteForm.modal";
import { ImageEditModal } from "../components/modals/ImageEdit.modal";
import { CIEditModal } from "../components/modals/CIEdit.modal";
import { PDFPreviewModal } from "../components/modals/PDFPreview.modal";
import { CredentialsModal } from "../components/modals/Credentials.modal";
import {
  calculateAge,
  generateUsername,
  generatePassword,
  FORM_INITIAL_STATE,
  PARENT_INITIAL_STATE,
} from "../utils/athleteUtils";
import { validateAthlete } from "../utils/athleteValidation";

export const AthletesAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Only select what's needed for rendering
  const athletes = useSelector((state: RootState) => state.athletes.athletes);
  const loading = useSelector((state: RootState) => state.athletes.loading);
  const searchingParent = useSelector(
    (state: RootState) => state.athletes.searchingParent,
  );
  const uploadingImage = useSelector(
    (state: RootState) => state.athletes.uploadingImage,
  );
  const uploadingCI = useSelector(
    (state: RootState) => state.athletes.uploadingCI,
  );

  // These are only used in effects, get them separately to avoid cascading re-renders
  const athleteParent = useSelector(
    (state: RootState) => state.athletes.athleteParent,
  );
  const loadingParent = useSelector(
    (state: RootState) => state.athletes.loadingParent,
  );

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCIModal, setShowCIModal] = useState(false);
  const [showPDFPreviewModal, setShowPDFPreviewModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Form states
  const [form, setForm] = useState<any>(FORM_INITIAL_STATE);
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  // Image edit states
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");

  // CI edit states
  const [editingCI, setEditingCI] = useState<any | null>(null);
  const [uploadedCIBase64, setUploadedCIBase64] = useState<string>("");

  // Parent search states
  const [parentCISearch, setParentCISearch] = useState<string>("");
  const [parentNotFound, setParentNotFound] = useState(false);

  // PDF preview states
  const [pdfPreviewPath, setPDFPreviewPath] = useState<string>("");
  const [pdfPreviewFileName, setPDFPreviewFileName] = useState<string>("");

  // Credentials states
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
    name: string;
  } | null>(null);

  // Load athletes on mount
  useEffect(() => {
    dispatch(fetchAthletes());
  }, [dispatch]);

  // Update form when athleteParent data loads
  useEffect(() => {
    if (athleteParent && editing && editing.parent_id) {
      setForm((prev) => ({
        ...prev,
        parent: {
          name: athleteParent.name || "",
          lastname: athleteParent.lastname || "",
          ci: athleteParent.ci || "",
          phone: athleteParent.phone || "",
        },
      }));
      setParentCISearch(athleteParent.ci || "");
    }
  }, [athleteParent, editing]);

  // Clear searchedParent when parentCISearch changes
  useEffect(() => {
    if (parentCISearch === "") {
      dispatch(clearSearchedParent());
    }
  }, [parentCISearch, dispatch]);

  // Handle parent search
  const handleParentSearch = useCallback(
    async (ci: string) => {
      if (!ci.trim()) {
        setParentNotFound(false);
        // Clear parent data when CI is cleared
        setForm((prev) => ({
          ...prev,
          parent: {
            name: "",
            lastname: "",
            ci: "",
            phone: "",
          },
        }));
        return;
      }
      try {
        // Use the result from unwrap() directly instead of waiting for Redux state
        const foundParent = await dispatch(fetchParentsByCISearch(ci)).unwrap();

        if (foundParent) {
          setForm((prev) => ({
            ...prev,
            parent: {
              name: foundParent.name || "",
              lastname: foundParent.lastname || "",
              ci: foundParent.ci || "",
              phone: foundParent.phone || "",
            },
          }));
          setParentNotFound(false);
        } else {
          setParentNotFound(true);
          // Clear name, lastname, phone but keep CI for user to manually complete
          setForm((prev) => ({
            ...prev,
            parent: {
              name: "",
              lastname: "",
              ci: ci,
              phone: "",
            },
          }));
        }
      } catch (err) {
        setParentNotFound(true);
        // Clear fields on error too
        setForm((prev) => ({
          ...prev,
          parent: {
            name: "",
            lastname: "",
            ci: ci,
            phone: "",
          },
        }));
      }
    },
    [dispatch],
  );

  // Open edit modal
  const handleOpenEdit = useCallback(
    (athlete: any) => {
      setEditing(athlete);

      // Load parent data asynchronously without blocking modal open
      if (athlete.parent_id) {
        dispatch(fetchAthleteParent(athlete.parent_id)).catch(() => {
          console.error("Error al cargar datos del parent");
        });
      }

      setForm({
        name: athlete.name || "",
        lastname: athlete.lastname || "",
        username: athlete.username || "",
        ci: athlete.ci || "",
        phone: athlete.phone || "",
        gender: athlete.gender || "",
        birth_date: athlete.birth_date ? athlete.birth_date.split("T")[0] : "",
        active: typeof athlete.active === "boolean" ? athlete.active : true,
        images: {
          small: (athlete.images && athlete.images.small) || "",
          medium: (athlete.images && athlete.images.medium) || "",
          large: (athlete.images && athlete.images.large) || "",
        },
        documentPath: athlete.documentPath || "",
        createdAt: athlete.createdAt || "",
        parent: PARENT_INITIAL_STATE,
      });
      setFormError(null);
      setParentCISearch("");
      setParentNotFound(false);
      setShowModal(true);
    },
    [dispatch],
  );

  // Close modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setForm(FORM_INITIAL_STATE);
    setFormError(null);
    setParentCISearch("");
    setParentNotFound(false);
    setEditing(null);
    dispatch(clearSearchedParent());
  }, [dispatch]);

  // Image operations
  const handleOpenImageEdit = useCallback((athlete: any) => {
    setEditingImage(athlete);
    setUploadedImageBase64("");
    setShowImageModal(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setShowImageModal(false);
    setEditingImage(null);
    setUploadedImageBase64("");
  }, []);

  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImageBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleImageSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadedImageBase64 || !editingImage) return;

      try {
        await dispatch(
          uploadAthleteImage({
            userId: editingImage._id,
            imageBase64: uploadedImageBase64,
            role: "athlete",
          }),
        ).unwrap();
        handleCloseImageModal();
      } catch (err: any) {
        alert(err?.message || "Error al actualizar imagen");
      }
    },
    [dispatch, uploadedImageBase64, editingImage, handleCloseImageModal],
  );

  // CI operations
  const handleOpenCIEdit = useCallback((athlete: any) => {
    setEditingCI(athlete);
    setUploadedCIBase64("");
    setShowCIModal(true);
  }, []);

  const handleCloseCIModal = useCallback(() => {
    setShowCIModal(false);
    setEditingCI(null);
    setUploadedCIBase64("");
  }, []);

  const handleCIFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedCIBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Por favor selecciona un archivo PDF válido");
      }
    },
    [],
  );

  const handleCISubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadedCIBase64 || !editingCI) return;

      try {
        await dispatch(
          uploadAthleteCI({
            userId: editingCI._id,
            pdfBase64: uploadedCIBase64,
            role: "athlete",
          }),
        ).unwrap();
        handleCloseCIModal();
      } catch (err: any) {
        alert(err?.message || "Error al actualizar CI");
      }
    },
    [dispatch, uploadedCIBase64, editingCI, handleCloseCIModal],
  );

  // PDF preview operations
  const handleOpenPDFPreview = useCallback(
    (pdfPath: string, fileName: string) => {
      let absoluteUrl = pdfPath;
      if (!pdfPath.startsWith("http")) {
        const filesProcessorApi =
          import.meta.env.VITE_FILES_PROCESSOR_API || "http://localhost:4001";
        absoluteUrl = `${filesProcessorApi}${pdfPath}`;
      }
      setPDFPreviewPath(absoluteUrl);
      setPDFPreviewFileName(fileName);
      setShowPDFPreviewModal(true);
    },
    [],
  );

  const handleClosePDFPreview = useCallback(() => {
    setShowPDFPreviewModal(false);
    setPDFPreviewPath("");
    setPDFPreviewFileName("");
  }, []);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validation = validateAthlete(form);
      if (validation) {
        setFormError(validation.message);
        return;
      }

      setFormError(null);
      try {
        const { parent, ...payload } = form;
        const age = calculateAge(form.birth_date);
        let generatedUsername = form.username;
        if (!editing) {
          generatedUsername = generateUsername(form.name, form.lastname);
        }
        const generatedPassword = generatePassword();

        // Handle parent operations
        let parentId = editing?.parent_id || null;
        if (age < 18) {
          const parentPayload = {
            name: parent.name,
            lastname: parent.lastname,
            ci: parent.ci,
            phone: parent.phone,
            role: "parent",
          };

          try {
            // First, fetch all parents to check if exists
            const allParentsResponse =
              await dispatch(fetchAllParents()).unwrap();
            const parentsList = Array.isArray(allParentsResponse)
              ? allParentsResponse
              : (allParentsResponse as any).data || [];

            const existingParent = parentsList.find(
              (p: any) => p.ci?.toLowerCase() === parent.ci.toLowerCase(),
            );

            if (existingParent) {
              // Parent exists in database - use their existing ID
              parentId = existingParent._id;

              // Update parent data if it's assigned to this athlete
              if (parentId && editing?.parent_id === parentId) {
                await dispatch(
                  updateUser({ id: parentId, user: parentPayload }),
                ).unwrap();
              }
            } else {
              // Parent doesn't exist, create new one
              const createResponse = await dispatch(
                createUser({ role: "parent", user: parentPayload }),
              ).unwrap();
              parentId = createResponse.data?._id || createResponse._id;
            }
          } catch (err) {
            console.error("Error handling parent:", err);
            throw err; // Re-throw to show error to user
          }
        }

        // Save athlete
        const payloadToSend: any = {
          ...payload,
          username: generatedUsername,
          password: generatedPassword,
          role: "athlete",
          ...(age < 18 && parentId && { parent_id: parentId }),
          ...(age >= 18 && { parent_id: null }),
        };

        if (editing) {
          await dispatch(
            updateUser({ id: editing._id, user: payloadToSend }),
          ).unwrap();

          handleCloseModal();
        } else {
          await dispatch(
            createUser({ role: "athlete", user: payloadToSend }),
          ).unwrap();
          setGeneratedCredentials({
            username: generatedUsername,
            password: generatedPassword,
            name: `${form.name} ${form.lastname}`,
          });
          setShowCredentialsModal(true);
          await dispatch(fetchAthletes());
          handleCloseModal();
        }
      } catch (err: any) {
        setFormError(err?.message || "Error inesperado");
      }
    },
    [form, editing, dispatch, handleCloseModal],
  );

  const handleFormChange = useCallback((updates: any) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleClosCredentialsModal = useCallback(() => {
    setShowCredentialsModal(false);
    setGeneratedCredentials(null);
  }, []);

  // Memoize table props to prevent unnecessary re-renders
  const tableProps = useMemo(
    () => ({
      athletes,
      loading,
      onEditClick: handleOpenEdit,
      onImageEditClick: handleOpenImageEdit,
      onCIEditClick: handleOpenCIEdit,
      onPDFPreviewClick: handleOpenPDFPreview,
    }),
    [
      athletes,
      loading,
      handleOpenEdit,
      handleOpenImageEdit,
      handleOpenCIEdit,
      handleOpenPDFPreview,
    ],
  );

  return (
    <div>
      <NavHeader name="Atletas del Club" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-content">
            <AthletesTable {...tableProps} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AthleteFormModal
        showModal={showModal}
        editing={editing}
        form={form}
        formError={formError}
        parentCISearch={parentCISearch}
        searchingParent={searchingParent}
        loadingParent={loadingParent}
        parentNotFound={parentNotFound}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onParentCISearchChange={setParentCISearch}
        onSubmit={handleSubmit}
        onParentSearch={handleParentSearch}
      />

      <ImageEditModal
        showModal={showImageModal}
        loading={uploadingImage}
        uploadedImageBase64={uploadedImageBase64}
        onClose={handleCloseImageModal}
        onFileChange={handleImageFileChange}
        onSubmit={handleImageSubmit}
      />

      <CIEditModal
        showModal={showCIModal}
        loading={uploadingCI}
        uploadedCIBase64={uploadedCIBase64}
        onClose={handleCloseCIModal}
        onFileChange={handleCIFileChange}
        onSubmit={handleCISubmit}
      />

      <PDFPreviewModal
        showModal={showPDFPreviewModal}
        pdfPath={pdfPreviewPath}
        fileName={pdfPreviewFileName}
        onClose={handleClosePDFPreview}
      />

      <CredentialsModal
        showModal={showCredentialsModal}
        credentials={generatedCredentials}
        onClose={handleClosCredentialsModal}
      />
    </div>
  );
};
