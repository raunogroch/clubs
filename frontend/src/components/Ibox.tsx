import React, { useState, type ReactNode } from "react";

interface IboxProps {
  /** Title shown in the header. Can be text or JSX. */
  title: ReactNode;
  /** Extra tools to render to the right of the title (e.g. buttons). */
  tools?: ReactNode;
  /** Should the box start collapsed? */
  defaultCollapsed?: boolean;
  /** Optional handler invoked when collapse state changes. */
  onCollapseChange?: (collapsed: boolean) => void;
  children: ReactNode;
}

/**
 * `Ibox` mimics the original HTML theme container used throughout the
 * application.  The legacy templates relied on jQuery/Bootstrap scripts to
 * toggle a `.collapsed` class and switch the chevron icon; those scripts are
 * not loaded by the React SPA, so this component provides equivalent behavior
 * with simple state.  Use it anywhere you previously wrapped content in
 * `<div class="ibox">`.
 */
export const Ibox: React.FC<IboxProps> = ({
  title,
  tools,
  defaultCollapsed = false,
  onCollapseChange,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      onCollapseChange?.(next);
      return next;
    });
  };

  const className = `ibox${collapsed ? " collapsed" : ""}`;

  return (
    <div className={className}>
      <div className="ibox-title">
        {typeof title === "string" ? <h5>{title}</h5> : title}
        <div className="ibox-tools">
          {tools}
          <a
            className="collapse-link"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            <i className="fa fa-chevron-up"></i>
          </a>
        </div>
      </div>
      <div className="ibox-content">{children}</div>
    </div>
  );
};

export default Ibox;
