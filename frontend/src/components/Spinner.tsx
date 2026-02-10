import React from "react";
import "./Spinner.css";

type SpinnerVariant =
  | "rotating-plane"
  | "double-bounce"
  | "wave"
  | "wandering-cubes"
  | "pulse"
  | "chasing-dots"
  | "three-bounce"
  | "circle"
  | "cube-grid"
  | "fading-circle";

interface SpinnerProps {
  variant?: SpinnerVariant;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  variant = "wave",
  className = "",
}) => {
  const base = "sk-spinner sk-spinner-" + variant;

  const renderInner = () => {
    switch (variant) {
      case "rotating-plane":
        return <div className={base} />;
      case "double-bounce":
        return (
          <div className={base}>
            <div className="sk-double-bounce1" />
            <div className="sk-double-bounce2" />
          </div>
        );
      case "wave":
        return (
          <div className={base}>
            <div className="sk-rect1" />
            <div className="sk-rect2" />
            <div className="sk-rect3" />
            <div className="sk-rect4" />
            <div className="sk-rect5" />
          </div>
        );
      case "wandering-cubes":
        return (
          <div className={base}>
            <div className="sk-cube1" />
            <div className="sk-cube2" />
          </div>
        );
      case "pulse":
        return <div className={base} />;
      case "chasing-dots":
        return (
          <div className={base}>
            <div className="sk-dot1" />
            <div className="sk-dot2" />
          </div>
        );
      case "three-bounce":
        return (
          <div className={base}>
            <div className="sk-bounce1" />
            <div className="sk-bounce2" />
            <div className="sk-bounce3" />
          </div>
        );
      case "circle":
        return (
          <div className={base}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`sk-circle${i + 1} sk-circle`} />
            ))}
          </div>
        );
      case "cube-grid":
        return (
          <div className={base}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="sk-cube" />
            ))}
          </div>
        );
      case "fading-circle":
        return (
          <div className={base}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`sk-circle${i + 1} sk-circle`} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={`spiner-example ${className}`}>{renderInner()}</div>;
};

export default Spinner;
