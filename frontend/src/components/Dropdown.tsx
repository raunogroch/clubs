import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  children: React.ReactNode;
  options: Array<{
    label: string;
    icon?: string;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

const Dropdown: React.FC<DropdownProps> = ({ children, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span onClick={() => setOpen((v) => !v)} style={{ cursor: "pointer" }}>
        {children}
      </span>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 100,
            minWidth: 120,
          }}
        >
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!opt.disabled) {
                  opt.onClick();
                  setOpen(false);
                }
              }}
              disabled={opt.disabled}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "8px 12px",
                background: "none",
                border: "none",
                cursor: opt.disabled ? "not-allowed" : "pointer",
                color: opt.disabled ? "#aaa" : "#333",
                fontSize: 14,
                textAlign: "left",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseOver={(e) => {
                if (!opt.disabled) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#f5f5f5";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#262626";
                }
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
                (e.currentTarget as HTMLButtonElement).style.color =
                  opt.disabled ? "#aaa" : "#333";
              }}
            >
              {opt.icon && (
                <i className={`fa ${opt.icon}`} style={{ marginRight: 8 }} />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
