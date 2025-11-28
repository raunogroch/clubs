import React, { useEffect, useState } from "react";
import { ImageCropperWithInput } from ".";
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
  title = "Actualizar imagen",
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
          "La imagen no pudo procesarse. Se guardaron los cambios sin imagen."
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
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content card p-4"
        style={{ width: 760 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>
            {title} {entityName ? `- ${entityName}` : ""}
          </h4>
        </div>

        <div>
          <ImageCropperWithInput
            value={imageData || ""}
            onChange={(e) => setImageData(e.target.value)}
          />
        </div>

        <div className="mt-3 d-flex justify-content-end gap-3">
          <button className="btn btn-secondary mx-2" onClick={onClose}>
            {hasImage ? "Cancelar" : "Salir"}
          </button>
          {hasImage && (
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
