import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import toastr from "toastr";

// Configurar el worker de PDF desde el servidor local
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface Props {
  open: boolean;
  title?: string;
  entityName?: string;
  onClose: () => void;
  onSave: (pdfBase64: string) => Promise<any>;
  saveLabel?: string;
}

/**
 * Modal para Cargar Carnet de Identidad
 *
 * Componente presentacional que maneja la carga y previsualización de documentos PDF.
 * Usa la estructura estándar de modales de la aplicación.
 */

export const CIUploadModal: React.FC<Props> = ({
  open,
  title = "Cargar Carnet de Identidad",
  entityName = "",
  onClose,
  onSave,
  saveLabel = "Guardar",
}) => {
  const [uploadedPDFBase64, setUploadedPDFBase64] = useState<string>("");
  const [uploadedPDFBlob, setUploadedPDFBlob] = useState<Blob | null>(null);
  const [saving, setSaving] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: any) => {
    console.error("Error loading PDF:", error);
    toastr.error("Error al cargar el PDF. Intenta con otro archivo.");
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

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea PDF
    if (file.type !== "application/pdf") {
      toastr.error("Por favor selecciona un archivo PDF válido");
      return;
    }

    // Guardar el blob y convertir a base64 para guardar
    setUploadedPDFBlob(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUploadedPDFBase64(result);
    };
    reader.onerror = () => {
      toastr.error("Error al leer el archivo");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!uploadedPDFBase64) {
      toastr.error("Por favor selecciona un archivo PDF");
      return;
    }

    try {
      setSaving(true);
      await onSave(uploadedPDFBase64);
      toastr.success("CI cargado exitosamente");
      setUploadedPDFBase64("");
      setUploadedPDFBlob(null);
      setNumPages(0);
      setZoomLevel(1);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    } catch (error: any) {
      if (error && error.message) toastr.error(error.message);
      else if (typeof error === "string") toastr.error(error);
      else toastr.error("Error al cargar el CI");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUploadedPDFBase64("");
    setUploadedPDFBlob(null);
    setNumPages(0);
    setZoomLevel(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleChangeFile = () => {
    setUploadedPDFBase64("");
    setUploadedPDFBlob(null);
    setNumPages(0);
    setZoomLevel(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="modal inmodal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={handleCancel}
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
            <i className="fa fa-id-card modal-icon"></i>
            <h4 className="modal-title">
              {title} {entityName ? `- ${entityName}` : ""}
            </h4>
            <small className="font-bold">
              {uploadedPDFBase64
                ? "Previsualización del documento"
                : "Selecciona un documento PDF"}
            </small>
            <button
              type="button"
              className="close"
              onClick={handleCancel}
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>

          <div
            className="modal-body"
            style={{ flex: 1, overflowY: "auto", minHeight: 0 }}
          >
            {/* Input para seleccionar archivo PDF */}
            {!uploadedPDFBase64 && (
              <div className="form-group">
                <div className="custom-file">
                  <input
                    id="ci-file"
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={saving}
                    className="custom-file-input"
                  />
                  <label htmlFor="ci-file" className="custom-file-label">
                    Selecciona un PDF del Carnet
                  </label>
                </div>
                <small className="form-text text-muted">
                  Solo se aceptan archivos PDF
                </small>
              </div>
            )}

            {/* Controles de zoom */}
            {uploadedPDFBase64 && (
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
            )}

            {/* Previsualización del PDF */}
            {uploadedPDFBase64 && (
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
                    file={uploadedPDFBlob}
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
            )}

            {/* Información de carga exitosa */}
            {uploadedPDFBase64 && (
              <div
                className="alert alert-success mt-3"
                style={{ marginBottom: 0 }}
              >
                <i className="fa fa-check-circle"></i> Archivo cargado
                correctamente
              </div>
            )}
          </div>

          <div className="modal-footer">
            {uploadedPDFBase64 && (
              <button
                type="button"
                className="btn btn-xs btn-warning"
                onClick={handleChangeFile}
                disabled={saving}
                aria-label="Cambiar archivo"
              >
                <i className="fa fa-edit"></i> Cambiar archivo
              </button>
            )}
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={handleCancel}
              disabled={saving}
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            {uploadedPDFBase64 && (
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={handleSave}
                disabled={saving}
                aria-label={`${saving ? "Guardando..." : saveLabel}`}
              >
                {saving ? "Guardando..." : saveLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CIUploadModal;
