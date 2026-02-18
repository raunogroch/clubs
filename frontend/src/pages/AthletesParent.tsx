import { useEffect, useState } from "react";
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
  const { myAthletes, loadingMyAthletes, error } = useSelector(
    (state: RootState) => state.athletes,
  );

  // Modal state
  const [selectedAthlete, setSelectedAthlete] = useState<any | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCIModal, setShowCIModal] = useState(false);

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
    await dispatch(
      uploadAthleteImage({
        userId: selectedAthlete._id,
        imageBase64,
        role: "athlete",
      }),
    );
    handleCloseImageModal();
    dispatch(fetchMyAthletes());
  };

  const handleSaveCI = async (pdfBase64: string) => {
    if (!selectedAthlete?._id) return;
    await dispatch(
      uploadAthleteCI({
        userId: selectedAthlete._id,
        pdfBase64,
        role: "athlete",
      }),
    );
    handleCloseCIModal();
    dispatch(fetchMyAthletes());
  };

  return (
    <div>
      <NavHeader name="Mis Atletas" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-content">
            {loadingMyAthletes ? (
              <div className="text-center">
                <p>Cargando atletas...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <p>{error}</p>
              </div>
            ) : myAthletes.length === 0 ? (
              <div className="alert alert-info">
                <p>No tienes atletas registrados.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="align-middle">Foto</th>
                      <th className="align-middle">Nombre</th>
                      <th className="align-middle">Cédula</th>
                      <th className="align-middle">Edad</th>
                      <th className="align-middle">Género</th>
                      <th className="align-middle">Estado</th>
                      <th className="align-middle text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAthletes.map((athlete) => (
                      <tr key={athlete._id}>
                        <td className="align-middle">
                          {athlete.images.small ? (
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
                                margin: "0 auto 12px",
                                backgroundColor: "#e8e8e8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i
                                className="fa fa-user"
                                style={{ fontSize: "40px", color: "#999" }}
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
                        <td className="align-middle ">
                          {/* Foto de perfil */}
                          <div className="row justify-content-around d-flex">
                            {athlete.images && athlete.images.small ? (
                              <span title="Foto de perfil cargada">
                                <i
                                  className="fa fa-check-circle"
                                  style={{
                                    color: "green",
                                  }}
                                />
                                &nbsp; Foto de perfil
                              </span>
                            ) : (
                              <button
                                className="btn btn-primary mr-2"
                                onClick={() => handleOpenImageModal(athlete)}
                              >
                                Foto de perfil
                              </button>
                            )}

                            {/* CI en PDF */}
                            {athlete.documentPath &&
                            athlete.documentPath !== "" ? (
                              <span title="Carnet cargado">
                                <i
                                  className="fa fa-check-circle"
                                  style={{ color: "green" }}
                                />
                                &nbsp; Cédula de identidad
                              </span>
                            ) : (
                              <button
                                className="btn btn-info"
                                onClick={() => handleOpenCIModal(athlete)}
                              >
                                Cargar CI (PDF)
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
        saveLabel="Guardar"
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
        saveLabel="Guardar"
      />
    </div>
  );
};
