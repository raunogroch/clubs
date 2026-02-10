import { Link, useLocation } from "react-router-dom";

interface buttonProps {
  label?: string;
  icon?: string;
  url?: string;
  onClick?: () => void;
}

interface NavHeaderProps {
  name?: string;
  sub?: string;
  sub1?: string;
  pageCreate?: string;
  onCreateClick?: () => void;
  // Back button (optional)
  backButton?: buttonProps;
  // Primary action button (optional)
  primaryButton?: buttonProps;
  // legacy single button prop for backward compatibility
  button?: buttonProps;
}

function getUserSection(pathname: string) {
  if (pathname.includes("general")) return "/general";
  if (pathname.includes("coaches")) return "/coaches";
  if (pathname.includes("athletes")) return "/athletes";
  return "";
}

export const NavHeader = ({
  name,
  sub,
  sub1,
  backButton,
  primaryButton,
  button,
  pageCreate,
  onCreateClick,
}: NavHeaderProps) => {
  const pageTitle = name || "Principal";
  const isPrincipalPage = pageTitle === "Principal";
  const location = useLocation();

  const breadcrumbItems: { label: string; to?: string }[] = [];
  breadcrumbItems.push({
    label: "Principal",
    to: isPrincipalPage ? undefined : "/",
  });
  if (name && !isPrincipalPage) {
    breadcrumbItems.push({
      label: name,
      to: sub
        ? `/${location.pathname.split("/")[1]}${getUserSection(
            location.pathname,
          )}`
        : undefined,
    });
  }
  if (sub) {
    breadcrumbItems.push({
      label: sub,
      to: sub1 ? location.pathname.replace(/\/[^/]+$/, "") : undefined,
    });
  }
  if (sub1) {
    breadcrumbItems.push({ label: sub1 });
  }

  const breadcrumbs = breadcrumbItems.map((item, idx) => {
    const isLast = idx === breadcrumbItems.length - 1;
    return (
      <li
        className={`breadcrumb-item${isLast ? " active" : ""}`}
        key={item.label + idx}
      >
        {isLast || !item.to ? (
          <strong>{item.label}</strong>
        ) : (
          <Link to={item.to}>{item.label}</Link>
        )}
      </li>
    );
  });

  return (
    <div className="row wrapper border-bottom white-bg page-heading">
      <div className="col-12">
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ minHeight: "60px" }}
        >
          <div>
            <h2 className="mb-0">{pageTitle}</h2>
            <ol className="breadcrumb mt-2">{breadcrumbs}</ol>
          </div>
          <div>
            {/* Render backButton (leftmost of the right-side controls) */}
            {backButton || (button && button.url) ? (
              backButton?.url || button?.url ? (
                <Link
                  to={(backButton && backButton.url) || button?.url || ""}
                  className="btn btn-default"
                  style={{ marginRight: "8px" }}
                >
                  <i
                    className={`fa ${(backButton && backButton.icon) || (button && button.icon) || "fa-arrow-left"}`}
                  ></i>{" "}
                  {(backButton && backButton.label) ||
                    (button && button.label) ||
                    "Volver"}
                </Link>
              ) : (
                <button
                  className="btn btn-default"
                  style={{ marginRight: "8px" }}
                  onClick={
                    (backButton && backButton.onClick) || button?.onClick
                  }
                >
                  <i
                    className={`fa ${(backButton && backButton.icon) || (button && button.icon) || "fa-arrow-left"}`}
                  ></i>{" "}
                  {(backButton && backButton.label) ||
                    (button && button.label) ||
                    "Volver"}
                </button>
              )
            ) : null}

            {/* Render primary action button (create/save style) */}
            {primaryButton ? (
              primaryButton.url ? (
                <Link to={primaryButton.url} className="btn btn-primary">
                  <i className={`fa ${primaryButton.icon || "fa-plus"}`}></i>{" "}
                  {primaryButton.label || "Crear"}
                </Link>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={primaryButton.onClick}
                >
                  <i className={`fa ${primaryButton.icon || "fa-plus"}`}></i>{" "}
                  {primaryButton.label || "Crear"}
                </button>
              )
            ) : // Fallback to legacy single `button` prop but render as primary
            button?.onClick ? (
              <button className="btn btn-primary" onClick={button.onClick}>
                <i className={`fa ${button.icon || "fa-plus"}`}></i>{" "}
                {button.label || "Crear"}
              </button>
            ) : // Older pages may provide `pageCreate` and `onCreateClick` props
            pageCreate ? (
              <button className="btn btn-primary" onClick={onCreateClick}>
                <i className={`fa fa-plus`}></i> {pageCreate}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
