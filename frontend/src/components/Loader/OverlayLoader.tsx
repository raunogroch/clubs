import React from "react";

interface OverlayLoaderProps {
  isLoading: boolean;
  message?: string;
  zIndex?: number;
}

/**
 * Componente reutilizable de loader overlay
 * Se usa para mostrar feedback visual durante operaciones largas
 */
export const OverlayLoader: React.FC<OverlayLoaderProps> = ({
  isLoading,
  message = "Procesando...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="overlay-loader">
      <div
        className="overlay-loader-content text-primary"
        style={{ textAlign: "center" }}
      >
        <div className="overlay-loader-spinner">
          <span
            style={{ animation: "bounce 1.4s infinite ease-in-out both" }}
          />
        </div>
        <p className="overlay-loader-text">{message}</p>
      </div>
    </div>
  );
};

export default OverlayLoader;
