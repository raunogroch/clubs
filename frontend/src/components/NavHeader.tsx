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
  button?: buttonProps;
}

function getUserSection(pathname: string) {
  if (pathname.includes("general")) return "/general";
  if (pathname.includes("coaches")) return "/coaches";
  if (pathname.includes("athletes")) return "/athletes";
  return "";
}

export const NavHeader = ({ name, sub, sub1, button }: NavHeaderProps) => {
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

          {button?.url ? (
            <Link to={button.url} className="btn btn-default">
              <i className={`fa ${button.icon || "fa-arrow-left"}`}></i>{" "}
              {button.label || "Volver"}
            </Link>
          ) : button?.onClick ? (
            <button className="btn btn-primary" onClick={button.onClick}>
              <i className={`fa ${button.icon || "fa-plus"}`}></i>{" "}
              {button.label || "Crear"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
