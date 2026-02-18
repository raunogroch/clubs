import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Image } from "../components";
import { ImageEditModal } from "../components/modals";
import toastr from "toastr";
import { userService } from "../services/userService";
import { MemberRole } from "../features/groups/types";

export const ProfileCoach = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setLoading(false);
      loadUserProfile();
    }
  }, [user?.code]);

  const loadUserProfile = async () => {
    try {
      if (!user?.code) {
        return;
      }

      const response = await userService.getUserById(user.code);
      if (response?.data) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  /**
   * Abre el modal de edición de imagen de perfil
   */
  const handleOpenImageEdit = useCallback(() => {
    setUploadedImageBase64("");
    setShowImageModal(true);
  }, []);

  /**
   * Cierra el modal de edición de imagen
   */
  const handleCloseImageModal = useCallback(() => {
    setShowImageModal(false);
    setUploadedImageBase64("");
  }, []);

  /**
   * Maneja el cambio de archivo de imagen
   */
  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        toastr.error("Por favor selecciona un archivo de imagen");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastr.error("La imagen debe ser menor a 5MB");
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImageBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toastr.error("Error al leer la imagen");
      }
    },
    [],
  );

  /**
   * Maneja el envío del formulario de imagen de perfil
   */
  const handleImageSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadedImageBase64) return;

      try {
        setUploading(true);
        const response = await userService.uploadCoachImage({
          userId: user?.code || user?._id,
          imageBase64: uploadedImageBase64,
          role: user?.role,
        });

        if (response?.code === 200 || response?.code === 201) {
          toastr.success("Foto de perfil cargada exitosamente");
          handleCloseImageModal();
          await loadUserProfile();
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Error al cargar la foto de perfil";
        toastr.error(errorMessage);
      } finally {
        setUploading(false);
      }
    },
    [uploadedImageBase64, handleCloseImageModal],
  );

  const handleChangePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toastr.warning("Todos los campos son requeridos");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toastr.warning("Las contraseñas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toastr.warning("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      const response = await userService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );

      if (response?.data?.message) {
        toastr.success(response.data.message);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordModal(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al cambiar la contraseña";
      toastr.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-danger">No autenticado</h3>
            <p>Por favor inicia sesión para ver tu perfil</p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-warning">
              <i className="fa fa-spinner fa-spin"></i> Cargando perfil...
            </h3>
          </div>
        </div>
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-danger">Error</h3>
            <p>No se pudo cargar tu perfil. Por favor intenta nuevamente.</p>
          </div>
        </div>
      </>
    );
  }

  // Mostrar datos del usuario desde Redux
  const displayUser = profileData;

  return (
    <>
      <div className="wrapper wrapper-content">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="ibox">
              <div className="ibox-title">
                <h5>
                  <i className="fa fa-user-circle"></i> Mi Perfil
                </h5>
              </div>

              <div className="ibox-content">
                <div className="text-center m-t-md">
                  <div className="m-b-lg">
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        margin: "0 auto 20px",
                        overflow: "hidden",
                        border: "3px solid #d4d4d4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        position: "relative",
                      }}
                    >
                      {displayUser?.images?.medium ? (
                        <Image
                          src={displayUser.images.medium}
                          alt={displayUser?.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i
                          className="fa fa-user-circle"
                          style={{
                            fontSize: "80px",
                            color: "#b3b3b3",
                          }}
                        ></i>
                      )}
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleOpenImageEdit}
                        disabled={uploading}
                        style={{ cursor: uploading ? "not-allowed" : "pointer" }}
                      >
                        <i className="fa fa-camera m-r-xs"></i>
                        Cambiar Foto
                      </button>
                    </div>

                    <h3 className="m-b-xs">
                      {displayUser?.name} {displayUser?.lastname}
                    </h3>
                    <p className="text-muted m-b-md">
                      <i className="fa fa-shield m-r-xs"></i>
                      <span className="font-bold">
                        {MemberRole[displayUser?.role]}
                      </span>
                    </p>
                  </div>

                  <hr />

                  <div className="text-left m-t-md">
                    <div
                      style={{
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        <i className="fa fa-id-card m-r-xs"></i>Carnet
                      </label>
                      <div
                        style={{
                          flex: 1,
                          borderBottom: "1px dotted #999",
                          marginBottom: "2px",
                        }}
                      ></div>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {displayUser?.ci || "-"}
                      </span>
                    </div>

                    <div
                      style={{
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        <i className="fa fa-phone m-r-xs"></i>Teléfono
                      </label>
                      <div
                        style={{
                          flex: 1,
                          borderBottom: "1px dotted #999",
                          marginBottom: "2px",
                        }}
                      ></div>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {displayUser?.phone || "-"}
                      </span>
                    </div>

                    <div
                      style={{
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        <i className="fa fa-user m-r-xs"></i>Usuario
                      </label>
                      <div
                        style={{
                          flex: 1,
                          borderBottom: "1px dotted #999",
                          marginBottom: "2px",
                        }}
                      ></div>
                      <span style={{ whiteSpace: "nowrap" }}>
                        <code>{displayUser?.username || "-"}</code>
                      </span>
                    </div>

                    <div
                      style={{
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        <i className="fa fa-toggle-on m-r-xs"></i>Estado
                      </label>
                      <div
                        style={{
                          flex: 1,
                          borderBottom: "1px dotted #999",
                          marginBottom: "2px",
                        }}
                      ></div>
                      <span
                        className="label label-success"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {displayUser?.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div
                      style={{
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        <i className="fa fa-calendar m-r-xs"></i>Registro
                      </label>
                      <div
                        style={{
                          flex: 1,
                          borderBottom: "1px dotted #999",
                          marginBottom: "2px",
                        }}
                      ></div>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {displayUser?.createdAt
                          ? new Date(displayUser.createdAt).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <hr className="m-t-lg m-b-lg" />

                  <div className="text-center m-b-lg">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <i className="fa fa-key m-r-xs"></i>Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar Foto de Perfil */}
      <ImageEditModal
        showModal={showImageModal}
        loading={uploading}
        uploadedImageBase64={uploadedImageBase64}
        onClose={handleCloseImageModal}
        onFileChange={handleImageFileChange}
        onSubmit={handleImageSubmit}
      />

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <i className="fa fa-key m-r-xs"></i>Cambiar Contraseña
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowPasswordModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Contraseña Actual *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div className="form-group">
                  <label>Nueva Contraseña *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Ingresa tu nueva contraseña"
                  />
                </div>

                <div className="form-group">
                  <label>Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>

                <div className="alert alert-info m-t-md m-b-none">
                  <i className="fa fa-info-circle m-r-xs"></i>La contraseña debe
                  tener al menos 6 caracteres
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-xs btn-default"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-primary"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
