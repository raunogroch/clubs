import React, { useState } from "react";

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const backendUri = import.meta.env.VITE_BACKEND_URI;
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
      {!isLoaded && !hasError && (
        <p>Cargando...</p> // O un spinner
      )}
      {hasError ? (
        <img
          src="no-image.jpg"
          alt="no-image"
          className={className}
          style={style}
        /> // O un mensaje de error
      ) : (
        <img
          src={`${backendUri}${src}`}
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
