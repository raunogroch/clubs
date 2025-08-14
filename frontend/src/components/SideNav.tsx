import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Image } from "./Image";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const SideNav = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Función para verificar si la ruta actual coincide
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar-default navbar-static-side" role="navigation">
      <div className="sidebar-collapse">
        <ul className="nav metismenu" id="side-menu">
          <li className="nav-header">
            <div className="dropdown profile-element">
              <Image
                src="../public/assets/img/profile_small.jpg"
                alt="image"
                className="rounded-circle"
              />
              <Link data-toggle="dropdown" className="dropdown-toggle" to="#">
                <span className="block m-t-xs font-bold">David Williams</span>
                <span className="text-muted text-xs block">
                  Art Director <b className="caret"></b>
                </span>
              </Link>
              <ul className="dropdown-menu animated fadeInRight m-t-xs">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="contacts.html">
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="mailbox.html">
                    Mailbox
                  </Link>
                </li>
                <li className="dropdown-divider"></li>
                <li>
                  <Link className="dropdown-item" to="#" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            <div className="logo-element">IN+</div>
          </li>
          <li className={isActive("/dashboard") ? "active" : ""}>
            <Link to="/dashboard">
              <i className="fa fa-home"></i>{" "}
              <span className="nav-label">Principal</span>
            </Link>
          </li>
          <li className={isActive("/clubs") ? "active" : ""}>
            <Link to="/clubs">
              <i className="fa fa-diamond"></i>{" "}
              <span className="nav-label">Clubs</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
