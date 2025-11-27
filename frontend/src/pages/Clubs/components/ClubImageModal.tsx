import React, { useEffect, useState } from "react";
import { ImageCropperWithInput } from "../../../components";
import type { Club } from "../interfaces";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { updateClub } from "../../../store/clubsThunks";
import toastr from "toastr";

interface Props {
  open: boolean;
  club: Club | null;
  onClose: () => void;
}

export const ClubImageModal: React.FC<Props> = ({ open, club, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [imageData, setImageData] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!club) return;
    // If club has an images.small path, use it as value (string url)
    setImageData((club.images && club.images.small) || "");
  }, [club]);

  if (!open || !club) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: any = { ...club };
      // Backend expects "image" raw data to be sent to process it
      if (imageData && imageData.startsWith("data:")) {
        payload.image = imageData;
      } else {
        // No change or we selected a url - keep images as-is
        // No need to send anything if no data URI
        delete payload.image;
      }

      const result: any = await dispatch(updateClub(payload)).unwrap();
      if (result && result.imageProcessingSkipped) {
        toastr.warning(
          "Logo no pudo procesarse. Se guardó el club sin actualizar la imagen."
        );
      } else {
        toastr.success("Logo actualizado");
      }
      onClose();
    } catch (error: any) {
      // unwrap will return the rejected payload from the thunk (error.response?.data)
      if (error && typeof error === "object" && error.message) {
        toastr.error(error.message as string);
      } else if (typeof error === "string") {
        toastr.error(error);
      } else {
        toastr.error("Error al actualizar la imagen");
      }
    } finally {
      setSaving(false);
    }
  };

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
          <h4>Actualizar logo - {club.name}</h4>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            ✖
          </button>
        </div>

        <div>
          <ImageCropperWithInput
            value={
              imageData.startsWith("data:")
                ? imageData
                : club.images?.small || ""
            }
            onChange={(e) => setImageData(e.target.value)}
          />
        </div>

        <div className="mt-3 d-flex justify-content-end gap-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubImageModal;
