import React, { useRef } from "react";
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
  image?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ image }) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    console.log(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <Cropper
      src={image}
      style={{ height: 400, width: 400 }}
      initialAspectRatio={1}
      guides={false}
      crop={onCrop}
      ref={cropperRef}
    />
  );
};
