import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const FILES_PROCESSOR_API = import.meta.env.VITE_FILES_PROCESSOR_API;

// Configurar el worker de PDF desde el servidor local
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PDFPreviewModalProps {
  showModal: boolean;
  pdfPath: string;
  fileName: string;
  onClose: () => void;
}

/**
 * Modal para Previsualizar PDF
 *
 * Componente presentacional que muestra una previsualización de documentos PDF
 * con opción de descarga. Usa la estructura estándar de modales de la aplicación.
 */

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  showModal,
  pdfPath,
  fileName,
  onClose,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: any) => {
    console.error("Error loading PDF:", error);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  if (!showModal) return null;

  const fullPdfUrl = `${FILES_PROCESSOR_API}${pdfPath}`;

  return (
    <div
      className="modal inmodal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <div
          className="modal-content animated bounceInRight"
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
          }}
        >
          <div className="modal-header">
            <i className="fa fa-eye modal-icon"></i>
            <h4 className="modal-title">{fileName || "Previsualizar PDF"}</h4>
            <small className="font-bold">Previsualización del documento</small>
          </div>

          <div
            className="modal-body"
            style={{ flex: 1, overflowY: "auto", minHeight: 0 }}
          >
            {/* Controles de zoom */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className="btn btn-xs btn-default"
                onClick={handleZoomOut}
                title="Alejar (Zoom Out)"
                disabled={zoomLevel <= 0.5}
              >
                <i className="fa fa-minus"></i> Alejar
              </button>
              <button
                type="button"
                className="btn btn-xs btn-default"
                onClick={handleResetZoom}
                title="Reiniciar zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                className="btn btn-xs btn-default"
                onClick={handleZoomIn}
                title="Acercar (Zoom In)"
                disabled={zoomLevel >= 2}
              >
                <i className="fa fa-plus"></i> Acercar
              </button>
            </div>

            {/* Contenedor de previsualización del PDF */}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px",
                backgroundColor: "#f9f9f9",
                minHeight: "400px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Document
                  file={fullPdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading="Cargando PDF..."
                  error={null}
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={700 * zoomLevel}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </Document>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
              aria-label="Cerrar"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
