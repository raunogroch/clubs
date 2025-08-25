import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Image } from "./Image";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Role } from "../interfaces/roleEnum";

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
  return (
    <nav className="navbar-default navbar-static-side" role="navigation">
      <div className="sidebar-collapse">
        <ul className="nav metismenu" id="side-menu">
          <li className="nav-header">
            <div className="dropdown profile-element">
              <Image
                src="/assets/img/profile_small.jpg"
                alt="image"
                className="rounded-circle"
              />
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
          <li className={isActive("/users") ? "active" : ""}>
            <Link to="/users">
              <i className="fa fa-file"></i>{" "}
              <span className="nav-label">Registros</span>
            </Link>
          </li>
          <li className={isActive("/schedules") ? "active" : ""}>
            <Link to="/schedules">
              <i className="fa fa-clock-o"></i>{" "}
              <span className="nav-label">Horarios</span>
            </Link>
          </li>
          <li className={isActive("/sports") ? "active" : ""}>
            <Link to="/sports">
              <i className="fa fa-soccer-ball-o"></i>{" "}
              <span className="nav-label">Disciplina</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
