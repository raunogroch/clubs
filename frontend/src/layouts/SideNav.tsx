import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image } from "../components/Image";
import { Role } from "../interfaces";
import { roleRoutes } from "../routes";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../store/authSlice";
import type { RootState } from "../store";

export const SideNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    dispatch(logoutAction());
    navigate("/login", { replace: true });
  };

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
