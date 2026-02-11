import React from "react";
import { createPortal } from "react-dom";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClass = (size?: string) => {
  switch (size) {
    case "sm":
      return "modal-sm";
    case "lg":
      return "modal-lg";
    default:
      return "";
  }
};

export const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
  footer,
}) => {
  if (!isOpen) return null;

  const modal = (
    <div
      className="modal inmodal"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 99999,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        className={`modal-dialog ${sizeClass(size)}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          pointerEvents: "auto",
          width: "90vw",
          maxWidth: size === "lg" ? 900 : 600,
          margin: "auto",
        }}
      >
        <div
          className="modal-content animated bounceInRight"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {title && <h4 className="modal-title">{title}</h4>}
            {subtitle && <small className="font-bold">{subtitle}</small>}
          </div>

          <div
            className="modal-body"
            style={{ flex: 1, overflowY: "auto", position: "relative" }}
          >
            {children}
          </div>

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default GenericModal;
