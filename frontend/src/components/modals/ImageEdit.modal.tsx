import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageModalProps {
  showModal: boolean;
  loading: boolean;
  uploadedImageBase64: string;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ImageEditModal: React.FC<ImageModalProps> = ({
  showModal,
  loading,
  uploadedImageBase64,
  onClose,
  onFileChange,
  onSubmit,
}) => {
  const cropperRef = useRef<any>(null);

  if (!showModal) return null;

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
      >
        <div className="modal-content animated bounceInRight">
          <div className="modal-header">
            <i className="fa fa-image modal-icon"></i>
            <h4 className="modal-title">Actualizar Foto de Perfil</h4>
            <small className="font-bold">
              {uploadedImageBase64
                ? "Ajusta tu imagen"
                : "Selecciona una imagen para editar"}
            </small>
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
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <div className="custom-file">
                  <input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    disabled={loading}
                    className="custom-file-input"
                  />
                  <label htmlFor="image-file" className="custom-file-label">
                    Selecciona una imagen
                  </label>
                </div>
                <small className="form-text text-muted">
                  Formatos soportados: jpg, png, gif
                </small>
              </div>

              {uploadedImageBase64 && (
                <div className="form-group">
                  <label>Ajusta la imagen</label>
                  <Cropper
                    ref={cropperRef}
                    src={uploadedImageBase64}
                    responsive
                    autoCropArea={1}
                    aspectRatio={1}
                    viewMode={1}
                    style={{ maxHeight: "380px" }}
                  />
                </div>
              )}
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={onClose}
              disabled={loading}
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-xs btn-primary"
              disabled={loading || !uploadedImageBase64}
              onClick={onSubmit}
              aria-label={`${loading ? "Guardando..." : "Guardar"}`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
