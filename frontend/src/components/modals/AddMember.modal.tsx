import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button, Image } from "../../components";

export const AddMemberModal = ({
  isOpen,
  memberType,
  searchCi,
  searchResult,
  showCreateUserForm,
  createUserData,
  loading,
  onClose,
  onSearchCiChange,
  onSearch,
  onAddMember,
  onCreateUser,
  onCreateUserDataChange,
}) => {
  if (!isOpen) return null;
  const memberTypeLabel = memberType === "coach" ? "Entrenador" : "Deportista";

  // Prevent closing the modal with the Escape key: only close via explicit buttons
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen]);

  const modalContent = (
    <div
      className="modal inmodal"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 99999,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          pointerEvents: "auto",
          width: "90vw",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <div className="modal-content animated bounceInRight">
          <div className="modal-header">
            <i className="fa fa-user-plus modal-icon"></i>
            <h4 className="modal-title">Agregar {memberTypeLabel}</h4>
            <small className="font-bold">Búsqueda rápida de usuarios</small>
            <Button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              &times;
            </Button>
          </div>

          <div className="modal-body">
            {/* Búsqueda de usuario */}
            <div className="form-group">
              <label htmlFor="search-ci">
                <i className="fa fa-search"></i> Buscar por Carnet
              </label>
              <div className="input-group">
                <input
                  id="search-ci"
                  type="text"
                  className="form-control"
                  value={searchCi}
                  placeholder="ingresa el número de carnet..."
                  onChange={(e) => onSearchCiChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onSearch();
                    }
                  }}
                  disabled={loading}
                />
                <span className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={onSearch}
                    disabled={loading || !searchCi.trim()}
                  >
                    <i className="fa fa-search"></i> Buscar
                  </button>
                </span>
              </div>
              <small className="form-text text-muted">
                Ingresa el carnet del {memberTypeLabel.toLowerCase()} que deseas
                agregar
              </small>
            </div>

            {/* Usuario encontrado */}
            {searchResult && (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <h5 style={{ marginBottom: "12px" }}>
                    <i className="fa fa-check-circle text-success"></i> Usuario
                    Encontrado
                  </h5>
                  <div
                    className="contact-box center-version"
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ padding: "16px" }}>
                      {/* Imagen del usuario */}
                      {searchResult.images?.medium ? (
                        <Image
                          src={searchResult.images.medium}
                          alt={`${searchResult.name} ${searchResult.lastname}`}
                          className="rounded-circle"
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            border: "3px solid #5c6cfa",
                            marginBottom: "12px",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle"
                          style={{
                            width: "90px",
                            height: "90px",
                            margin: "0 auto 12px",
                            backgroundColor: "#e8e8e8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "3px solid #5c6cfa",
                          }}
                        >
                          <i
                            className="fa fa-user"
                            style={{ fontSize: "40px", color: "#999" }}
                          ></i>
                        </div>
                      )}

                      {/* Nombre completo */}
                      <h3 className="m-b-xs" style={{ marginBottom: "8px" }}>
                        <strong>
                          {searchResult.name} {searchResult.lastname}
                        </strong>
                      </h3>

                      {/* Información en formato direcciones */}
                      <address style={{ margin: "12px 0", fontSize: "13px" }}>
                        <strong>
                          {memberType === "coach" ? "Entrenador" : "Deportista"}
                        </strong>
                        <br />
                        <strong>CI:</strong> {searchResult.ci || "-"}
                        {searchResult.phone && (
                          <>
                            <br />
                            <strong>Teléfono:</strong> {searchResult.phone}
                          </>
                        )}
                      </address>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Formulario para crear nuevo usuario */}
            {showCreateUserForm && !searchResult && (
              <>
                <div
                  className="alert alert-warning alert-with-icon"
                  data-notify="container"
                >
                  <span
                    data-notify="icon"
                    className="fa fa-exclamation-triangle"
                  ></span>
                  <span data-notify="message">
                    <strong>Usuario no encontrado.</strong> Crea un nuevo{" "}
                    {memberTypeLabel.toLowerCase()} completando el formulario
                    abajo.
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "#f9f9fa",
                    padding: "16px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                  }}
                >
                  <h5
                    style={{
                      marginBottom: "12px",
                      marginTop: 0,
                      color: "#333",
                    }}
                  >
                    <i className="fa fa-plus-circle text-info"></i> Crear{" "}
                    {memberTypeLabel}
                  </h5>

                  <div className="form-group">
                    <label htmlFor="create-user-name">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      id="create-user-name"
                      type="text"
                      className="form-control"
                      value={createUserData.name}
                      onChange={(e) =>
                        onCreateUserDataChange("name", e.target.value)
                      }
                      placeholder="Ej: Juan"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="create-user-lastname">
                      Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      id="create-user-lastname"
                      type="text"
                      className="form-control"
                      value={createUserData.lastname}
                      onChange={(e) =>
                        onCreateUserDataChange("lastname", e.target.value)
                      }
                      placeholder="Ej: García"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="create-user-ci">
                      Carnet (CI) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="create-user-ci"
                      type="text"
                      className="form-control"
                      value={createUserData.ci}
                      onChange={(e) =>
                        onCreateUserDataChange("ci", e.target.value)
                      }
                      placeholder="Ingresa el carnet"
                      disabled={loading}
                    />
                  </div>

                  {memberType === "coach" && (
                    <div className="alert alert-info alert-sm">
                      <i className="fa fa-info-circle"></i>
                      <small>
                        <strong>Nota:</strong> El usuario se generará
                        automáticamente como la primera palabra del nombre y la
                        primera palabra del apellido, separadas por un punto, en
                        minúsculas y sin acentos (ej: "juan.garcia"). La
                        contraseña será el carnet (CI).
                      </small>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="white"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            {searchResult && (
              <Button
                type="button"
                variant="primary"
                onClick={onAddMember}
                disabled={loading}
                icon="fa-user-plus"
              >
                Agregar {memberTypeLabel}
              </Button>
            )}

            {showCreateUserForm && !searchResult && (
              <Button
                type="button"
                variant="success"
                onClick={onCreateUser}
                disabled={loading}
                icon="fa-plus"
              >
                Crear y Agregar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
