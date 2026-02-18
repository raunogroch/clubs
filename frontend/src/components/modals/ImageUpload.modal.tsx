import React, { useEffect, useState } from "react";
import { ImageCropperWithInput } from "../ImageCropperWithInput";
import toastr from "toastr";

interface Props {
  open: boolean;
  title?: string;
  entityName?: string;
  currentImage?: string;
  onClose: () => void;
  onSave: (imageBase64?: string) => Promise<any>;
  saveLabel?: string;
}

export const ImageUploadModal: React.FC<Props> = ({
  open,
  entityName = "",
  currentImage,
  onClose,
  onSave,
  saveLabel = "Guardar",
}) => {
  const [imageData, setImageData] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setImageData(currentImage || "");
  }, [open, currentImage]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      const payloadImage =
        imageData && imageData.startsWith("data:") ? imageData : undefined;
      const result: any = await onSave(payloadImage);
      if (result && result.imageProcessingSkipped) {
        toastr.warning(
          "La imagen no pudo procesarse. Se guardaron los cambios sin imagen.",
        );
      } else {
        toastr.success("Imagen actualizada");
      }
      onClose();
    } catch (error: any) {
      if (error && error.message) toastr.error(error.message);
      else if (typeof error === "string") toastr.error(error);
      else toastr.error("Error al actualizar la imagen");
    } finally {
      setSaving(false);
    }
  };

  const hasImage = !!(imageData && imageData.startsWith("data:"));

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
            <h4 className="modal-title">{entityName ? `${entityName}` : ""}</h4>
            <small className="font-bold">Carga y ajusta tu imagen</small>
          </div>

          <div className="modal-body">
            <ImageCropperWithInput
              value={imageData || ""}
              onChange={(e) => setImageData(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              onClick={onClose}
              disabled={saving}
              aria-label="Cancelar"
            >
              {hasImage ? "Cancelar" : "Salir"}
            </button>
            {hasImage && (
              <button
                type="button"
                className="btn btn-primary"
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

export default ImageUploadModal;
