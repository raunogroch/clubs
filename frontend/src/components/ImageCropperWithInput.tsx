import { useCallback, useRef, useState } from "react";
import type { ReactCropperElement } from "react-cropper";
import { Cropper } from "react-cropper";
import { Input, Image } from ".";
import "cropperjs/dist/cropper.min.css";

// Input de archivo reutilizable para seleccionar imágenes
const CropperImageInput = ({
  error,
  onImageSelect,
}: {
  error?: string;
  onImageSelect: (file: File) => void;
}) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageSelect(file);
    },
    [onImageSelect]
  );
  return (
    <div>
      <Input
        type="file"
        id="cropper-image"
        name="image"
        accept="image/*"
        className={`form-control${error ? " is-invalid" : ""}`}
        onChange={handleFileChange}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

// Componente principal para recortar y previsualizar imágenes
export const ImageCropperWithInput = ({
  value,
  onChange,
  name = "image",
}: {
  value: string;
  onChange: (e: { target: { name: string; value: any } }) => void;
  name?: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(value || "");
  const [error, setError] = useState<string>("");
  const [croppedPreview, setCroppedPreview] = useState<string>("");
  const cropperRef = useRef<ReactCropperElement>(null);

  // Determina si el valor es una URL (imagen recuperada) o base64 (nueva imagen)
  const isUrl = value && !value.startsWith("data:");

  // Maneja la selección de un archivo de imagen.
  const handleImageSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Por favor, selecciona un archivo de imagen válido");
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = e.target?.result as string;
        setSelectedImage(img);
        onChange({ target: { name, value: img } });
      };
      reader.readAsDataURL(file);
    },
    [onChange, name]
  );

  const handleCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    if (canvas) {
      const preview = canvas.toDataURL();
      setCroppedPreview(preview);
      onChange({ target: { name, value: preview } });
    }
  }, [onChange, name]);

  const handleCropMove = useCallback(() => {
    if ((handleCropMove as any).timeout) {
      clearTimeout((handleCropMove as any).timeout);
    }
    (handleCropMove as any).timeout = setTimeout(() => {
      handleCrop();
    }, 300);
  }, [handleCrop]);

  const handleReset = useCallback(() => {
    setSelectedImage("");
    setCroppedPreview("");
    onChange({ target: { name, value: "" } });
  }, [onChange, name]);

  // Renderizado condicional según el estado de la imagen
  if (isUrl) {
    return (
      <div className="image-cropper-container text-center">
        <h3>Foto de perfil</h3>
        <Image
          src={`http://localhost:3000/${value.replace(/^\/+/, "")}`}
          alt="Imagen recuperada"
          style={{ width: "auto", height: "200px" }}
        />
        <div className="mt-3">
          <button
            className="btn btn-outline-danger btn-rounded"
            onClick={handleReset}
          >
            Cambiar imagen
          </button>
        </div>
      </div>
    );
  }

  if (!selectedImage) {
    return (
      <CropperImageInput error={error} onImageSelect={handleImageSelect} />
    );
  }

  return (
    <div className="image-cropper-container text-center">
      <div className="d-flex justify-content-around flex-wrap gap-4">
        <div className="cropped-preview text-center" style={{ width: 220 }}>
          <h3>Previsualización</h3>
          {croppedPreview ? (
            <Image
              src={croppedPreview}
              alt="Previsualización recorte"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "1px solid #ddd",
              }}
            />
          ) : (
            <div
              className="bg-light border rounded"
              style={{
                width: "200px",
                height: "200px",
                display: "inline-block",
              }}
            ></div>
          )}
        </div>
        <div className="cropper-editor text-center" style={{ width: 220 }}>
          <h3>Editor de recorte</h3>
          <Cropper
            style={{ width: "100%", height: 200 }}
            src={selectedImage}
            aspectRatio={1}
            guides={true}
            crop={handleCropMove}
            cropend={handleCrop}
            ref={cropperRef}
            viewMode={0}
            background={false}
            responsive={true}
            autoCropArea={0.8}
            movable={true}
            zoomable={false}
          />
        </div>
      </div>
      <div className="mt-3">
        <button
          className="btn btn-outline-danger btn-rounded"
          onClick={handleReset}
        >
          Cambiar imagen
        </button>
      </div>
    </div>
  );
};
