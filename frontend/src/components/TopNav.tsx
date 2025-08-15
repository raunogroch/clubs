import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { SmoothlyMenu } from "../scripts/inspiniaScripts";

export const TopNav = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    document.body.classList.toggle("mini-navbar");
    SmoothlyMenu();
  };

  return (
    <div className="row border-bottom">
      <nav
        className="navbar navbar-static-top"
        role="navigation"
        style={{ marginBottom: "0px" }}
      >
        <div className="navbar-header">
          <Link
            className="navbar-minimalize minimalize-styl-2 btn btn-primary"
            to={"#"}
            onClick={(e) => handleClick(e)}
          >
            <i className="fa fa-bars"></i>{" "}
          </Link>
        </div>
        <ul className="nav navbar-top-links navbar-right">
          <li style={{ padding: "20px" }}>
            <span className="m-r-sm text-muted welcome-message">
              BIENVENIDO AL SISTEMA DE CLUBES
            </span>
          </li>

          <li>
            <Link to={"#"} onClick={handleLogout}>
              <i className="fa fa-sign-out"></i> Cerrar Sesion
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
