import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import type { ReactCropperElement } from "react-cropper";
import { Cropper } from "react-cropper";
import { Input } from ".";

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}

interface CropperImageInputProps {
  error: string;
  onImageSelect: (file: File) => void;
}

interface CropCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperWithInputProps {
  handleChange: (coordinates: CropCoordinates | null) => void;
}

export const ImageCropperWithInput = ({
  handleChange,
}: ImageCropperWithInputProps) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [cropCoordinates, setCropCoordinates] =
    useState<CropCoordinates | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  // Call handleChange whenever cropCoordinates changes
  useEffect(() => {
    handleChange(cropCoordinates);
  }, [cropCoordinates, handleChange]);

  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const data = cropper.getData(true);
    setCropCoordinates({
      x: Math.round(data.x),
      y: Math.round(data.y),
      width: Math.round(data.width),
      height: Math.round(data.height),
    });
  }, []);

  const handleCropMove = useCallback(() => {
    // Usamos un debounce básico para evitar demasiadas actualizaciones durante el movimiento
    if ((handleCropMove as any).timeout) {
      clearTimeout((handleCropMove as any).timeout);
    }

    (handleCropMove as any).timeout = setTimeout(() => {
      handleCrop();
    }, 100);
  }, [handleCrop]);

  const handleReset = useCallback(() => {
    setSelectedImage("");
    setCropCoordinates(null);
  }, []);

  const cropInfo = useMemo(() => {
    if (!cropCoordinates) return null;

    return (
      <div className="crop-info mt-3 p-3 bg-light rounded">
        <h6>Coordenadas de Recorte:</h6>
        <pre className="mb-0">{JSON.stringify(cropCoordinates, null, 2)}</pre>
      </div>
    );
  }, [cropCoordinates]);

  return (
    <div className="image-cropper-container">
      {!selectedImage && (
        <CropperImageInput error={error} onImageSelect={handleImageSelect} />
      )}

      {selectedImage && (
        <div className="cropper-section">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            <div className="cropper-editor">
              <Cropper
                src={selectedImage}
                style={{
                  height: 300,
                  width: 300,
                  maxWidth: "100%",
                }}
                aspectRatio={1}
                guides={true}
                crop={handleCropMove}
                cropend={handleCrop}
                ref={cropperRef}
                viewMode={1}
                background={false}
                responsive={true}
                autoCropArea={0.8}
                movable={true}
                zoomable={false}
              />
            </div>
          </div>

          {cropInfo}

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-secondary" onClick={handleReset}>
              Cambiar imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CropperImageInput = ({
  error,
  onImageSelect,
}: CropperImageInputProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageSelect(file);
    },
    [onImageSelect]
  );

  return (
    <Input
      type="file"
      id="cropper-image"
      name="image"
      accept="image/*"
      className={`form-control${error ? " is-invalid" : ""}`}
      onChange={handleFileChange}
    />
  );
};
