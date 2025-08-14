import { Link } from "react-router-dom";

interface NavHeaderProps {
  name?: string;
}

export const NavHeader = ({ name: page }: NavHeaderProps) => {
  const pageTitle = page || "Principal";
  const isPrincipalPage = pageTitle === "Principal";

  return (
    <div className="row wrapper border-bottom white-bg page-heading">
      <div className="col-lg-10">
        <h2>{pageTitle}</h2>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            {isPrincipalPage ? (
              "Principal"
            ) : (
              <Link to="/dashboard">Principal</Link>
            )}
          </li>
          {!isPrincipalPage && (
            <li className="breadcrumb-item active">
              <strong>{pageTitle}</strong>
            </li>
          )}
        </ol>
      </div>
      <div className="col-lg-2"></div>
    </div>
  );
};
