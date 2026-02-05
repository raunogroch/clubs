import React, { useCallback } from "react";
import { downloadPDF } from "../../utils/athleteUtils";

interface PDFPreviewModalProps {
  showModal: boolean;
  pdfPath: string;
  fileName: string;
  onClose: () => void;
}

const BUTTON_STYLE = {
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: 500 as const,
};

const CLOSE_BUTTON_STYLE = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#999",
  padding: "0",
};

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  showModal,
  pdfPath,
  fileName,
  onClose,
}) => {
  const handleDownload = useCallback(async () => {
    try {
      await downloadPDF(pdfPath, fileName);
      onClose();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert(
        `Error al descargar: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    }
  }, [pdfPath, fileName, onClose]);

  if (!showModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5 style={{ margin: 0, color: "#333" }}>Previsualizar PDF</h5>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            style={CLOSE_BUTTON_STYLE}
          >
            ×
          </button>
        </div>

        <iframe
          src={pdfPath}
          style={{
            width: "100%",
            height: "500px",
            border: "none",
          }}
          title="PDF Preview"
        />

        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              ...BUTTON_STYLE,
              border: "1px solid #d0d0d0",
              backgroundColor: "white",
              color: "#333",
            }}
          >
            Cerrar
          </button>
          <button
            onClick={handleDownload}
            style={{
              ...BUTTON_STYLE,
              border: "none",
              backgroundColor: "#3498db",
              color: "white",
            }}
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};
