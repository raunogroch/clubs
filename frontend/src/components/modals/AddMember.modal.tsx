/**
 * Modal para Agregar Miembros (Coach o Atleta)
 *
 * Componente presentacional que maneja la UI del formulario de búsqueda/creación.
 */

import React from "react";
import type {
  User,
  MemberType,
  CreateUserData,
} from "../../features/groups/types";
import { Image } from "../../components";

interface AddMemberModalProps {
  isOpen: boolean;
  memberType: MemberType | null;
  searchCi: string;
  searchResult: User | null;
  showCreateUserForm: boolean;
  createUserData: CreateUserData;
  loading: boolean;
  onClose: () => void;
  onSearchCiChange: (value: string) => void;
  onSearch: () => void;
  onAddMember: () => void;
  onCreateUser: () => void;
  onCreateUserDataChange: (field: keyof CreateUserData, value: string) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
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

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Agregar {memberTypeLabel}</h4>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            {/* Búsqueda de usuario */}
            <div className="form-group">
              <label htmlFor="search-ci">Buscar por Carnet</label>
              <div className="input-group">
                <input
                  id="search-ci"
                  type="text"
                  className="form-control"
                  value={searchCi}
                  placeholder="ingresa el numero de carnet..."
                  onChange={(e) => onSearchCiChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onSearch();
                    }
                  }}
                  disabled={loading}
                />
                <span className="input-group-btn">
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
            </div>

            {/* Usuario encontrado */}
            {searchResult && (
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  marginBottom: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "stretch",
                  }}
                >
                  {/* Imagen del atleta - ocupa altura total */}
                  <div style={{ flexShrink: 0 }}>
                    {searchResult.images?.medium ? (
                      <Image
                        src={searchResult.images.medium}
                        alt={`${searchResult.name} ${searchResult.lastname}`}
                        style={{
                          width: "100px",
                          height: "100%",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "2px solid #3498db",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100px",
                          height: "100%",
                          borderRadius: "8px",
                          backgroundColor: "#e8e8e8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px solid #ccc",
                          minHeight: "120px",
                        }}
                      >
                        <i
                          className="fa fa-user"
                          style={{ fontSize: "40px", color: "#999" }}
                        ></i>
                      </div>
                    )}
                  </div>

                  {/* Información del atleta */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: "4px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Nombres:</strong> {searchResult.name || "-"}
                    </p>
                    <p
                      style={{
                        margin: "4px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Apellidos:</strong> {searchResult.lastname || "-"}
                    </p>
                    <p
                      style={{
                        margin: "4px 0",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      <strong>Carnet:</strong> {searchResult.ci || "-"}
                    </p>
                    {searchResult.phone && (
                      <p
                        style={{
                          margin: "4px 0",
                          color: "#666",
                          fontSize: "13px",
                        }}
                      >
                        <strong>Teléfono:</strong> {searchResult.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Formulario para crear nuevo usuario */}
            {showCreateUserForm && !searchResult && (
              <div className="alert alert-warning">
                <h5>Crear nuevo {memberTypeLabel}</h5>

                <div className="form-group">
                  <label htmlFor="create-user-name">Nombre *</label>
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
                  <label htmlFor="create-user-lastname">Apellido *</label>
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
                  <label htmlFor="create-user-ci">Carnet (CI) *</label>
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
                  <div className="alert alert-info">
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
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            {searchResult && (
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={onAddMember}
                disabled={loading}
              >
                Agregar
              </button>
            )}

            {showCreateUserForm && !searchResult && (
              <button
                type="button"
                className="btn btn-xs btn-success"
                onClick={onCreateUser}
                disabled={loading}
              >
                Crear y Agregar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
