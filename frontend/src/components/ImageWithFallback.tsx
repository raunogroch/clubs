import React, { useState } from "react";
import { Image } from "./Image";

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageWithFallback = ({
  src,
  className,
  alt,
  style,
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <>
      {!isLoaded && !hasError && <p>Cargando...</p>}
      {hasError ? (
        <Image
          src="no-image.jpg"
          alt="no-image"
          className={className}
          style={style}
          local
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
          style={style}
        />
      )}
    </>
  );
};
