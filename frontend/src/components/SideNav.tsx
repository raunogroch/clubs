import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image } from "./Image";
import { Role } from "../interfaces";
import { roleRoutes } from "../routes";

export const SideNav = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Función para verificar si la ruta actual coincide
  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const role = user?.role || "";
  const menuItems = roleRoutes[role] || [];

  return (
    <nav className="navbar-default navbar-static-side" role="navigation">
      <div className="sidebar-collapse">
        <ul className="nav metismenu" id="side-menu">
          <li className="nav-header">
            <div className="dropdown profile-element">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="image"
                  className="rounded-circle"
                  style={{ width: 48, height: 48 }}
                />
              ) : (
                "Sin Imagen"
              )}
              <Link data-toggle="dropdown" className="dropdown-toggle" to="#">
                <span className="block m-t-xs font-bold">
                  {user
                    ? `${user.name} ${user.lastname}`
                    : "Superadministrador"}
                </span>
                <span className="text-muted text-xs block">
                  {Role[user.role]} <b className="caret"></b>
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
            <div className="logo-element">CS</div>
          </li>
          {menuItems.map(
            ({ path, icon, label }) =>
              icon && (
                <li key={path} className={isActive(path) ? "active" : ""}>
                  <Link to={path}>
                    <i className={`fa ${icon}`}></i>{" "}
                    <span className="nav-label">{label}</span>
                  </Link>
                </li>
              )
          )}
        </ul>
      </div>
    </nav>
  );
};
