import React, { useRef, useState } from "react";
import Cropper, { type ReactCropperElement } from "react-cropper";
import { Image } from "./Image";
import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
  image?: string;
  onCropChange?: (cropped: string) => void;
}

interface PreviewImageProps {
  src: string;
  alt?: string;
}

const PreviewImage: React.FC<PreviewImageProps> = ({
  src,
  alt = "Previsualización",
}) => (
  <div className="mb-3">
    <Image
      src={src}
      alt={alt}
      style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "50%" }}
    />
  </div>
);

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropChange,
}) => {
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const cropped = cropper
        .getCroppedCanvas({ width: 100, height: 100 })
        .toDataURL();
      setCroppedImage(cropped);
      if (onCropChange) onCropChange(cropped);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between w-100"
      style={{ minHeight: 400 }}
    >
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-middle" }}>
        {croppedImage && (
          <div>
            <div className="text-center mb-1">Previsualizacion final</div>
            <PreviewImage src={croppedImage} />
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <Cropper
          src={image}
          style={{ height: 400, width: 400, marginBottom: "1em" }}
          aspectRatio={1}
          guides={true}
          crop={handleCrop}
          ref={cropperRef}
        />
      </div>
    </div>
  );
};
