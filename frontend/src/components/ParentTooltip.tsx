import React, { useState } from "react";
import { userService } from "../services/userService";

interface ParentTooltipProps {
  parentId: string;
  children: React.ReactNode;
}

export const ParentTooltip: React.FC<ParentTooltipProps> = ({
  parentId,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [parentData, setParentData] = useState<any>(null);

  const loadParentData = async () => {
    if (parentData) return;

    try {
      const response = await userService.getUserById(parentId);
      setParentData(response.data || response);
    } catch (error) {
      console.error("Error loading parent data:", error);
    }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => {
        loadParentData();
        setIsVisible(true);
      }}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && parentData && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            padding: "0",
            marginBottom: "12px",
            minWidth: "280px",
            zIndex: 1000,
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            fontSize: "13px",
            overflow: "hidden",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Header with gradient */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "14px 16px",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>
              <i className="fa fa-user"></i>
            </span>
            <span>Información del Tutor</span>
          </div>

          {/* Content area */}
          <div style={{ padding: "14px 16px" }}>
            <div
              style={{
                marginBottom: "12px",
                fontWeight: "700",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              {parentData.name} {parentData.lastname}
            </div>

            {parentData.ci && (
              <div
                style={{
                  marginBottom: "10px",
                  color: "#555",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#667eea" }}>
                  <i className="fa fa-id-card"></i>
                </span>
                <span>
                  <strong style={{ color: "#2c3e50" }}>{parentData.ci}</strong>
                </span>
              </div>
            )}

            {parentData.phone && (
              <div
                style={{
                  marginBottom: "12px",
                  color: "#555",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#667eea" }}>
                  <i className="fa fa-phone"></i>
                </span>
                <span>
                  <strong style={{ color: "#2c3e50" }}>
                    {parentData.phone}
                  </strong>{" "}
                </span>
              </div>
            )}

            {/* Footer badge */}
            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #f0f0f0",
                color: "#667eea",
                fontSize: "12px",
                fontWeight: "600",
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              ✓ Tutor Verificado
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
