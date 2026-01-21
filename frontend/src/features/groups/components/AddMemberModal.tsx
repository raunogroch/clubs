/**
 * Modal para Agregar Miembros (Coach o Atleta)
 *
 * Componente presentacional que maneja la UI del formulario de búsqueda/creación.
 */

import React from "react";
import type { User, MemberType, CreateUserData } from "../types";

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
              <label htmlFor="search-ci">Buscar por Carnet (CI)</label>
              <div className="input-group">
                <input
                  id="search-ci"
                  type="text"
                  className="form-control"
                  value={searchCi}
                  onChange={(e) => onSearchCiChange(e.target.value)}
                  placeholder="Ingresa el carnet (CI)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onSearch();
                    }
                  }}
                  disabled={loading}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-xs btn-primary"
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
              <div className="alert alert-info">
                <h5>Usuario encontrado:</h5>
                <p>
                  <strong>Nombre:</strong> {searchResult.name}{" "}
                  {searchResult.lastname}
                </p>
                <p>
                  <strong>Usuario:</strong> {searchResult.username}
                </p>
                <p>
                  <strong>Rol:</strong> {searchResult.role}
                </p>
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
                  <label htmlFor="create-user-ci">Carnet (CI)</label>
                  <input
                    id="create-user-ci"
                    type="text"
                    className="form-control"
                    value={createUserData.ci}
                    disabled
                    placeholder="Carnet"
                  />
                </div>

                {memberType === "coach" && (
                  <div className="form-group">
                    <label htmlFor="create-user-username">Usuario *</label>
                    <input
                      id="create-user-username"
                      type="text"
                      className="form-control"
                      value={createUserData.username}
                      onChange={(e) =>
                        onCreateUserDataChange("username", e.target.value)
                      }
                      placeholder="Ej: juan.garcia"
                      disabled={loading}
                    />
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
