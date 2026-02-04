import React from "react";

interface CredentialsModalProps {
  showModal: boolean;
  credentials: {
    username: string;
    password: string;
    name: string;
  } | null;
  onClose: () => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  showModal,
  credentials,
  onClose,
}) => {
  if (!showModal || !credentials) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 style={{ marginTop: 0, marginBottom: "16px", color: "#2c3e50" }}>
          ✓ Atleta Creado Exitosamente
        </h4>
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#555", marginBottom: "12px" }}>
            <strong>Atleta:</strong> {credentials.name}
          </p>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <p style={{ margin: "0 0 8px 0", color: "#666" }}>
              <strong>Username:</strong>{" "}
              <code
                style={{
                  backgroundColor: "#e8e8e8",
                  padding: "2px 6px",
                  borderRadius: "3px",
                }}
              >
                {credentials.username}
              </code>
            </p>
            <p style={{ margin: 0, color: "#666" }}>
              <strong>Password:</strong>{" "}
              <code
                style={{
                  backgroundColor: "#e8e8e8",
                  padding: "2px 6px",
                  borderRadius: "3px",
                }}
              >
                {credentials.password}
              </code>
            </p>
          </div>
        </div>
        <div
          style={{
            marginBottom: "20px",
            fontSize: "13px",
            color: "#856404",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            padding: "12px",
          }}
        >
          <strong>⚠️ Importante:</strong> Comparta estas credenciales de forma
          segura. El atleta debe cambiar su contraseña en el primer acceso.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
