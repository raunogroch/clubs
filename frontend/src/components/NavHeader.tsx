import { Link, useLocation } from "react-router-dom";

interface NavHeaderProps {
  name?: string;
  sub?: string;
  pageCreate?: string;
}

export const NavHeader = ({ name: page, sub, pageCreate }: NavHeaderProps) => {
  const pageTitle = page || "Principal";
  const isPrincipalPage = pageTitle === "Principal";
  const location = useLocation();
  const isMainRoute = location.pathname.split("/").filter(Boolean).length === 1;

  return (
    <>
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-lg-4">
          <h2>{pageTitle}</h2>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {isPrincipalPage ? "Principal" : <Link to="/">Principal</Link>}
            </li>
            {!isPrincipalPage && (
              <li className="breadcrumb-item active">
                {sub ? (
                  <Link to={"/" + location.pathname.split("/")[1]}>
                    {pageTitle}
                  </Link>
                ) : (
                  <strong>{pageTitle}</strong>
                )}
              </li>
            )}

            {sub && (
              <li className="breadcrumb-item active">
                <strong>{sub}</strong>
              </li>
            )}
          </ol>
        </div>
        {isMainRoute && (
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
    </>
  );
};
