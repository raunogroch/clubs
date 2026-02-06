import React, { useCallback } from "react";
import { useSelector } from "react-redux";

import { calculateAge } from "../../../utils/athleteUtils";
import type { RootState } from "../../../store/store";

interface AthleteFormModalProps {
  showModal: boolean;
  editing: any | null;
  form: any;
  formError: string | null;
  parentCISearch: string;
  searchingParent: boolean;
  loadingParent: boolean;
  parentNotFound: boolean;
  onClose: () => void;
  onFormChange: (updates: any) => void;
  onParentCISearchChange: (ci: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onParentSearch: (ci: string) => void;
}

export const AthleteFormModal: React.FC<AthleteFormModalProps> = ({
  showModal,
  editing,
  form,
  formError,
  parentCISearch,
  searchingParent,
  loadingParent,
  parentNotFound,
  onClose,
  onFormChange,
  onParentCISearchChange,
  onSubmit,
  onParentSearch,
}) => {
  const { status } = useSelector((state: RootState) => state.users);
  const isLoading = status === "loading";

  const isMinor = form.birth_date && calculateAge(form.birth_date) < 18;

  const handleParentSearch = useCallback(
    async (ci: string) => {
      if (!ci.trim()) return;
      onParentSearch(ci);
    },
    [onParentSearch],
  );

  if (!showModal) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: isMinor ? "900px" : "500px",
          width: "90%",
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              {editing ? "Editar Atleta" : "Crear Atleta"}
            </h4>
            <button className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={onSubmit}>
              {/* Layout: Two columns for minors, single column for adults */}
              <div
                style={{
                  display: isMinor ? "grid" : "block",
                  gridTemplateColumns: isMinor ? "1fr 1fr" : undefined,
                  gap: isMinor ? "24px" : undefined,
                }}
              >
                {/* LEFT COLUMN: Athlete Data */}
                <div>
                  {isMinor && (
                    <h5
                      style={{
                        marginTop: 0,
                        marginBottom: "12px",
                        color: "#333",
                        opacity: 0,
                      }}
                    >
                      Datos del Atleta
                    </h5>
                  )}

                  {/* Name and Lastname */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Nombre</label>
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) => onFormChange({ name: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Apellido</label>
                      <input
                        className="form-control"
                        value={form.lastname}
                        onChange={(e) =>
                          onFormChange({ lastname: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* CI and Phone */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>CI</label>
                      <input
                        className="form-control"
                        value={form.ci}
                        onChange={(e) => onFormChange({ ci: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Teléfono</label>
                      <input
                        className="form-control"
                        value={form.phone}
                        onChange={(e) =>
                          onFormChange({ phone: e.target.value })
                        }
                        disabled={isMinor}
                        style={{
                          backgroundColor: isMinor ? "#f5f5f5" : "white",
                          cursor: isMinor ? "not-allowed" : "auto",
                        }}
                      />
                      {isMinor && (
                        <small
                          style={{
                            color: "#999",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          (menor de edad)
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Gender and Birth Date */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>
                        Género
                        {!form.gender && (
                          <span
                            title="Campo requerido"
                            style={{ color: "red", marginLeft: "4px" }}
                          >
                            <i className="fa fa-exclamation-triangle"></i>
                          </span>
                        )}
                      </label>
                      <select
                        className="form-control"
                        value={form.gender}
                        onChange={(e) =>
                          onFormChange({ gender: e.target.value })
                        }
                        style={
                          !form.gender
                            ? {
                                borderColor: "#ffcccc",
                                backgroundColor: "#fff5f5",
                              }
                            : {}
                        }
                      >
                        <option value="">Seleccionar...</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.birth_date}
                        onChange={(e) =>
                          onFormChange({ birth_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Parent Data (only for minors) */}
                {isMinor && (
                  <div
                    style={{
                      backgroundColor: "#f0f8ff",
                      border: "1px solid #90c8f5",
                      borderRadius: "4px",
                      padding: "16px",
                    }}
                  >
                    <h5
                      style={{
                        marginTop: 0,
                        marginBottom: "12px",
                        color: "#1565c0",
                      }}
                    >
                      Información del Tutor (Menor de Edad)
                    </h5>

                    {/* CI Search Section */}
                    <div
                      className="form-group"
                      style={{ marginBottom: "16px" }}
                    >
                      <label>
                        <strong>🔍 Buscar Tutor por CI</strong>
                      </label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          placeholder="Ingrese CI del tutor"
                          value={parentCISearch}
                          onChange={(e) =>
                            onParentCISearchChange(e.target.value)
                          }
                          onBlur={() =>
                            parentCISearch && handleParentSearch(parentCISearch)
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleParentSearch(parentCISearch)
                          }
                        />
                        <span className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => handleParentSearch(parentCISearch)}
                            disabled={searchingParent || !parentCISearch}
                          >
                            {searchingParent ? "Buscando..." : "Buscar"}
                          </button>
                        </span>
                      </div>
                      {parentNotFound && (
                        <div
                          style={{
                            color: "#ff9800",
                            fontSize: "12px",
                            marginTop: "6px",
                          }}
                        >
                          ⚠️ Tutor no registrado. Complete la información para
                          crear un nuevo tutor.
                        </div>
                      )}
                    </div>

                    {/* Parent Information Section */}
                    {searchingParent ||
                    (loadingParent && editing?.parent_id) ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "40px 16px",
                          color: "#1565c0",
                          fontSize: "14px",
                        }}
                      >
                        <i
                          className="fa fa-spinner fa-spin"
                          style={{ fontSize: "24px", marginBottom: "12px" }}
                        ></i>
                        <span>Cargando información del tutor...</span>
                      </div>
                    ) : (
                      <>
                        {/* Parent Name and Lastname */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Nombre del Tutor</label>
                            <input
                              className="form-control"
                              value={form.parent.name}
                              onChange={(e) =>
                                onFormChange({
                                  parent: {
                                    ...form.parent,
                                    name: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Apellido del Tutor</label>
                            <input
                              className="form-control"
                              value={form.parent.lastname}
                              onChange={(e) =>
                                onFormChange({
                                  parent: {
                                    ...form.parent,
                                    lastname: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Parent CI and Phone */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                          }}
                        >
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Carnet del Tutor</label>
                            <input
                              className="form-control"
                              value={form.parent.ci}
                              disabled
                              onChange={(e) => {
                                const ci = e.target.value;
                                onFormChange({
                                  parent: { ...form.parent, ci },
                                });
                                onParentCISearchChange(ci);
                              }}
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Teléfono del Tutor</label>
                            <input
                              className="form-control"
                              value={form.parent.phone}
                              onChange={(e) =>
                                onFormChange({
                                  parent: {
                                    ...form.parent,
                                    phone: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-xs btn-default"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-xs btn-primary"
                  disabled={isLoading}
                >
                  {editing ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
