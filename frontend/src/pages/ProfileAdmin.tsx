/**
 * Página de Perfil de Administrador
 *
 * Muestra la información del perfil del usuario autenticado:
 * - Foto de perfil (datos reales del backend)
 * - Información personal (nombre, apellido, CI, teléfono)
 * - Información de cuenta (username, rol)
 * - Opción para cambiar contraseña solamente
 */

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Image, NavHeader } from "../components";
import toastr from "toastr";
import { userService } from "../services/userService";

export const ProfileAdmin = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUserProfile();
  }, [user?.code]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      if (!user?.code) {
        setProfileData(user);
        setLoading(false);
        return;
      }

      const response = await userService.getUserById(user.code);
      if (response?.data) {
        setProfileData(response.data);
      } else {
        setProfileData(user);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfileData(user);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

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
        <NavHeader name="Mi Perfil" />
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
        <NavHeader name="Mi Perfil" />
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
        <NavHeader name="Mi Perfil" />
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
      <NavHeader name="Mi Perfil" />
      <div className="wrapper wrapper-content">
        <div className="row justify-content-center">
          <div className="col-md-6 col-md-offset-3">
            {/* Card Principal */}
            <div className="ibox">
              <div
                className="ibox-title"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                <h5 style={{ color: "white", marginBottom: 0 }}>
                  <i className="fa fa-user-circle"></i> Mi Perfil
                </h5>
              </div>

              <div className="ibox-content">
                <div className="text-center" style={{ paddingTop: "20px" }}>
                  {/* Foto de Perfil */}
                  <div
                    style={{
                      marginBottom: "30px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        margin: "0 auto 20px",
                        overflow: "hidden",
                        border: "4px solid #667eea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0f0f0",
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
                            color: "#667eea",
                          }}
                        ></i>
                      )}
                    </div>

                    {/* Nombre y Rol */}
                    <h3 style={{ marginBottom: "5px" }}>
                      {displayUser?.name} {displayUser?.lastname}
                    </h3>
                    <p
                      style={{
                        color: "#667eea",
                        fontWeight: "bold",
                        marginBottom: "20px",
                      }}
                    >
                      <i className="fa fa-shield"></i> {displayUser?.role}
                    </p>
                  </div>

                  <hr />

                  {/* Información Personal */}
                  <div
                    style={{
                      textAlign: "left",
                      marginTop: "20px",
                    }}
                  >
                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-sm-4">
                        <strong>
                          <i
                            className="fa fa-id-card"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Cédula:
                        </strong>
                      </div>
                      <div className="col-sm-8">
                        <span>{displayUser?.ci || "-"}</span>
                      </div>
                    </div>

                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-sm-4">
                        <strong>
                          <i
                            className="fa fa-phone"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Teléfono:
                        </strong>
                      </div>
                      <div className="col-sm-8">
                        <span>{displayUser?.phone || "-"}</span>
                      </div>
                    </div>

                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-sm-4">
                        <strong>
                          <i
                            className="fa fa-user"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Usuario:
                        </strong>
                      </div>
                      <div className="col-sm-8">
                        <span>
                          <code>{displayUser?.username || "-"}</code>
                        </span>
                      </div>
                    </div>

                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-sm-4">
                        <strong>
                          <i
                            className="fa fa-toggle-on"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Estado:
                        </strong>
                      </div>
                      <div className="col-sm-8">
                        <span className="label label-success">
                          {displayUser?.active ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-4">
                        <strong>
                          <i
                            className="fa fa-calendar"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Registro:
                        </strong>
                      </div>
                      <div className="col-sm-8">
                        <span>
                          {displayUser?.createdAt
                            ? new Date(
                                displayUser.createdAt,
                              ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ marginTop: "30px" }} />

                  {/* Botones de Acción */}
                  <div
                    style={{
                      textAlign: "center",
                      paddingTop: "20px",
                    }}
                  >
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <i className="fa fa-key"></i> Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar Perfil - REMOVIDO */}

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  <i className="fa fa-key"></i> Cambiar Contraseña
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

                <div
                  className="alert alert-info"
                  style={{ marginTop: "15px", marginBottom: "0" }}
                >
                  <i className="fa fa-info-circle"></i> La contraseña debe tener
                  al menos 6 caracteres
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
