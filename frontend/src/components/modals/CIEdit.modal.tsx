import React from "react";

interface CIModalProps {
  showModal: boolean;
  loading: boolean;
  uploadedCIBase64: string;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CIEditModal: React.FC<CIModalProps> = ({
  showModal,
  loading,
  uploadedCIBase64,
  onClose,
  onFileChange,
  onSubmit,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,.5)",
        animation: "fadeIn 0.3s ease-in-out",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          margin: 0,
          maxWidth: "480px",
          width: "90%",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #e8e8e8",
              backgroundColor: "#fafafa",
            }}
          >
            <h5
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Cargar (Carnet de Identidad)
            </h5>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#999",
                transition: "color 0.2s",
                padding: "4px 8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#333")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "24px" }}>
            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Selecciona un PDF del Carnet
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onFileChange}
                  style={{
                    display: "block",
                    padding: "8px",
                    border: "1px solid #d0d0d0",
                    borderRadius: "4px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {uploadedCIBase64 && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "12px",
                    backgroundColor: "#e8f5e9",
                    border: "1px solid #4caf50",
                    borderRadius: "4px",
                    color: "#2e7d32",
                  }}
                >
                  ✓ Archivo cargado correctamente
                </div>
              )}

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "6px",
                    border: "1px solid #d0d0d0",
                    backgroundColor: "white",
                    color: "#333",
                    fontWeight: "500",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !uploadedCIBase64}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: loading ? "#ccc" : "#3498db",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "14px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "#2980b9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "#3498db";
                    }
                  }}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
