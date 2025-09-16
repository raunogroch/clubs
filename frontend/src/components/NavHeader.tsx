import { Link, useLocation } from "react-router-dom";
import { isListPage } from "../routes/routeMatch";

interface NavHeaderProps {
  name?: string;
  sub?: string;
  sub1?: string;
  isAllow?: boolean;
  pageCreate?: string;
}

export const NavHeader = ({
  name,
  sub,
  sub1,
  isAllow = false,
  pageCreate,
}: NavHeaderProps) => {
  const pageTitle = name || "Principal";
  const isPrincipalPage = pageTitle === "Principal";
  const location = useLocation();

  // Utility: show create button only on allowed list pages, not on create/edit
  const isCreateOrEdit = /\/(create|editar)(\/|$)/.test(location.pathname);
  const allowedPatterns = [
    /^\/clubs\/[^/]+\/groups$/, // /clubs/:id/groups
    /^\/sports$/, // /sports
    // Agrega más patrones aquí
  ];
  const isAllowedListPage = isListPage(location.pathname, allowedPatterns);
  const isMainRoute = location.pathname.split("/").filter(Boolean).length === 1;
  const showCreateButton =
    isAllow && (isMainRoute || isAllowedListPage) && !isCreateOrEdit;

  // Breadcrumbs dinámicos: todos menos el último son links
  const breadcrumbItems: { label: string; to?: string }[] = [];
  breadcrumbItems.push({
    label: "Principal",
    to: isPrincipalPage ? undefined : "/",
  });
  if (name && !isPrincipalPage) {
    breadcrumbItems.push({
      label: name,
      to: sub ? `/${location.pathname.split("/")[1]}` : undefined,
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
      <div className="col-lg-4">
        <h2>{pageTitle}</h2>
        <ol className="breadcrumb">{breadcrumbs}</ol>
      </div>
      {showCreateButton && (
        <div className="col-sm-8">
          <div className="title-action">
            <Link
              to={`${location.pathname}/create`}
              className="btn btn-primary"
            >
              <i className="fa fa-plus"></i> {pageCreate}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
