import { useEffect, useState, useMemo } from "react";
import { NavHeader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchMyAthletes,
  uploadAthleteImage,
  uploadAthleteCI,
} from "../store/athletesThunk";
import { Image } from "../components/Image";
import ImageUploadModal from "../components/modals/ImageUpload.modal";
import CIUploadModal from "../components/modals/CIUpload.modal";

export const AthletesParent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myAthletes, loadingMyAthletes, uploadingImage, uploadingCI, error } =
    useSelector((state: RootState) => state.athletes);

  // Modal state
  const [selectedAthlete, setSelectedAthlete] = useState<any | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCIModal, setShowCIModal] = useState(false);

  // Estadísticas memoizadas
  const stats = useMemo(() => {
    return {
      total: myAthletes.length,
      active: myAthletes.filter((a) => a.active).length,
      withPhoto: myAthletes.filter((a) => a.images?.small).length,
      withCI: myAthletes.filter((a) => a.documentPath).length,
    };
  }, [myAthletes]);

  useEffect(() => {
    dispatch(fetchMyAthletes());
  }, [dispatch]);

  const calculateAge = (birthDate: string | Date) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < new Date(birth).getDate())
    ) {
      age--;
    }
    return age;
  };

  const getGenderLabel = (gender?: string) => {
    if (gender === "male") return "Masculino";
    if (gender === "female") return "Femenino";
    return "N/A";
  };

  // Handlers for modals
  const handleOpenImageModal = (athlete: any) => {
    setSelectedAthlete(athlete);
    setShowImageModal(true);
  };
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedAthlete(null);
  };

  const handleOpenCIModal = (athlete: any) => {
    setSelectedAthlete(athlete);
    setShowCIModal(true);
  };
  const handleCloseCIModal = () => {
    setShowCIModal(false);
    setSelectedAthlete(null);
  };

  // Handlers conectados a Redux
  const handleSaveImage = async (imageBase64?: string) => {
    if (!selectedAthlete?._id || !imageBase64) return;
    const result = await dispatch(
      uploadAthleteImage({
        userId: selectedAthlete._id,
        imageBase64,
        role: "athlete",
      }),
    );
    if (result.payload) {
      handleCloseImageModal();
    }
  };

  const handleSaveCI = async (pdfBase64: string) => {
    if (!selectedAthlete?._id) return;
    const result = await dispatch(
      uploadAthleteCI({
        userId: selectedAthlete._id,
        pdfBase64,
        role: "athlete",
      }),
    );
    if (result.payload) {
      handleCloseCIModal();
    }
  };

  return (
    <div>
      <NavHeader name="Mis Atletas" />
      <div className="wrapper wrapper-content">
        {myAthletes.length > 0 && !loadingMyAthletes && !error && (
          <div className="row mb-3">
            <div className="col-sm-3">
              <div className="ibox">
                <div className="ibox-content text-center">
                  <h4>
                    <strong>{stats.total}</strong>
                  </h4>
                  <p className="text-muted">Total de atletas</p>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="ibox">
                <div className="ibox-content text-center">
                  <h4>
                    <strong style={{ color: "green" }}>{stats.active}</strong>
                  </h4>
                  <p className="text-muted">Activos</p>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="ibox">
                <div className="ibox-content text-center">
                  <h4>
                    <strong style={{ color: "blue" }}>{stats.withPhoto}</strong>
                  </h4>
                  <p className="text-muted">Con foto</p>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="ibox">
                <div className="ibox-content text-center">
                  <h4>
                    <strong style={{ color: "purple" }}>{stats.withCI}</strong>
                  </h4>
                  <p className="text-muted">Con cédula</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ibox">
          <div className="ibox-content">
            {loadingMyAthletes ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Cargando...</span>
                </div>
                <p className="mt-2">Cargando atletas...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger alert-dismissible fade show">
                <button
                  type="button"
                  className="close"
                  onClick={() => dispatch(fetchMyAthletes())}
                >
                  <span>&times;</span>
                </button>
                <h5 className="alert-heading">Error</h5>
                <p>{error}</p>
              </div>
            ) : myAthletes.length === 0 ? (
              <div className="alert alert-info">
                <h5 className="alert-heading">Sin atletas registrados</h5>
                <p>
                  No tienes atletas asignados. Una vez que se te asignen
                  atletas, aparecerán en esta lista.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="align-middle" style={{ width: "60px" }}>
                        Foto
                      </th>
                      <th className="align-middle">Nombre</th>
                      <th className="align-middle">Cédula</th>
                      <th className="align-middle" style={{ width: "60px" }}>
                        Edad
                      </th>
                      <th className="align-middle" style={{ width: "90px" }}>
                        Género
                      </th>
                      <th className="align-middle" style={{ width: "80px" }}>
                        Estado
                      </th>
                      <th className="align-middle text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAthletes.map((athlete) => (
                      <tr key={athlete._id}>
                        <td className="align-middle">
                          {athlete.images?.small ? (
                            <Image
                              src={athlete.images.small + `?t=${Date.now()}`}
                              alt={athlete.name}
                              className="rounded-circle"
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle"
                              style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: "#e8e8e8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i
                                className="fa fa-user"
                                style={{ fontSize: "24px", color: "#999" }}
                              ></i>
                            </div>
                          )}
                        </td>
                        <td className="align-middle">
                          <strong>
                            {athlete.name} {athlete.lastname}
                          </strong>
                        </td>
                        <td className="align-middle">{athlete.ci || "N/A"}</td>
                        <td className="align-middle">
                          {calculateAge(athlete.birth_date || "")}
                        </td>
                        <td className="align-middle">
                          {getGenderLabel(athlete.gender)}
                        </td>
                        <td className="align-middle">
                          {athlete.active ? (
                            <span className="badge badge-success">Activo</span>
                          ) : (
                            <span className="badge badge-danger">Inactivo</span>
                          )}
                        </td>
                        <td className="align-middle">
                          <div className="btn-group btn-group-sm">
                            {athlete.images?.small ? (
                              <span
                                className="btn btn-success btn-sm disabled"
                                title="Foto de perfil cargada"
                              >
                                <i className="fa fa-check"></i> Foto
                              </span>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenImageModal(athlete)}
                                disabled={uploadingImage}
                                title="Cargar foto de perfil"
                              >
                                <i className="fa fa-camera"></i> Foto
                              </button>
                            )}

                            {athlete.documentPath ? (
                              <span
                                className="btn btn-success btn-sm disabled"
                                title="Cédula cargada"
                              >
                                <i className="fa fa-check"></i> CI
                              </span>
                            ) : (
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleOpenCIModal(athlete)}
                                disabled={uploadingCI}
                                title="Cargar cédula de identidad"
                              >
                                <i className="fa fa-file-pdf-o"></i> CI
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para actualizar foto de perfil */}
      <ImageUploadModal
        open={showImageModal}
        entityName={
          selectedAthlete
            ? `${selectedAthlete.name} ${selectedAthlete.lastname}`
            : ""
        }
        currentImage={selectedAthlete?.image || ""}
        onClose={handleCloseImageModal}
        onSave={handleSaveImage}
        saveLabel={uploadingImage ? "Guardando..." : "Guardar"}
      />

      {/* Modal para cargar CI en PDF */}
      <CIUploadModal
        open={showCIModal}
        title="Cargar Carnet de Identidad"
        entityName={
          selectedAthlete
            ? `${selectedAthlete.name} ${selectedAthlete.lastname}`
            : ""
        }
        onClose={handleCloseCIModal}
        onSave={handleSaveCI}
        saveLabel={uploadingCI ? "Guardando..." : "Guardar"}
      />
    </div>
  );
};
