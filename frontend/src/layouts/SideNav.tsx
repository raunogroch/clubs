import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Image } from "../components";
import { Role, type User } from "../interfaces";
import { roleRoutes } from "../routes";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/store";
import styles from "./SideNav.module.css";

export const SideNav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await dispatch(logoutAction());
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const role = user?.role || "";
  // Obtener menú base del rol actual
  const baseMenuItems = roleRoutes[role] || [];

  // Estado para controlar qué menus están abiertos (expandidos)
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>(
    {},
  );

  // Verificar si el admin tiene assignment_id asignado
  // El campo assignment_id viene del usuario cuando inicia sesión
  const hasAssignment = React.useMemo(() => {
    if (role === "admin") {
      // El admin necesita tener un assignment_id no nulo
      const assignmentId = (user as any)?.assignment_id;
      return assignmentId && assignmentId !== null && assignmentId !== undefined && assignmentId !== '';
    }
    // Superadmin y otros roles siempre tienen acceso
    return true;
  }, [role, (user as any)?.assignment_id]);

  // Filtrar el menú: si es admin sin assignment_id, mostrar solo dashboard
  const menuItems = React.useMemo(() => {
    if (role === "admin" && !hasAssignment) {
      return baseMenuItems.filter((item) => item.path === "/");
    }
    return baseMenuItems;
  }, [role, hasAssignment, baseMenuItems]);

  // Sincronizar menus abiertos cuando cambia la ruta o los items del menú
  React.useEffect(() => {
    const syncOpenMenus = (
      items: Array<(typeof menuItems)[0]>,
      parentKey = "",
      acc: { [key: string]: boolean } = {},
    ) => {
      items.forEach((item) => {
        const key = parentKey + item.path;
        const children = (item as any).children as
          | Array<(typeof menuItems)[0]>
          | undefined;
        if (children && children.length > 0) {
          const isAnyChildActive = children.some((child) =>
            isActive(child.path),
          );
          acc[key] = isAnyChildActive;
          syncOpenMenus(children, key, acc);
        }
      });
      return acc;
    };
    setOpenMenus(syncOpenMenus(menuItems));
  }, [location.pathname, menuItems]);

  const handleMenuClick = (
    key: string,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /**
   * Renderiza los items del menú de forma recursiva.
   * - Si un item tiene children (submenus), renderiza como un menú padre expandible
   * - Si no tiene children, renderiza como un enlace directo
   *
   * @param items - Array de items del menú
   * @param parentKey - Clave del padre (para identificar submenus anidados)
   */
  function renderMenuItems(
    items: Array<(typeof menuItems)[0]>,
    parentKey = "",
  ) {
    return items
      .filter((item) => item.icon || item.children || item.label)
      .map((item) => {
        const key = parentKey + item.path;
        const children = item.children as
          | Array<(typeof menuItems)[0]>
          | undefined;
        const isAnyChildActive = children?.some((child) =>
          isActive(child.path),
        );

        if (children && children.length > 0) {
          return (
            <li
              key={key}
              className={openMenus[key] || isAnyChildActive ? "active" : ""}
            >
              <a href="#" onClick={(e) => handleMenuClick(key, e)}>
                {item.icon && <i className={`fa ${item.icon}`}></i>}{" "}
                <span className="nav-label">{item.label}</span>
                <span className="fa arrow"></span>
              </a>
              <ul
                className={`nav nav-second-level collapse${
                  openMenus[key] || isAnyChildActive ? " in" : ""
                }`}
              >
                {renderMenuItems(children, key)}
              </ul>
            </li>
          );
        }
        return (
          <li key={key} className={isActive(item.path) ? "active" : ""}>
            <Link to={item.path}>
              {item.icon && <i className={`fa ${item.icon}`}></i>}{" "}
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        );
      });
  }

  return (
    <nav className="navbar-default navbar-static-side" role="navigation">
      <div className="sidebar-collapse">
        <ul className="nav metismenu" id="side-menu">
          <li className="nav-header">
            <div className="dropdown profile-element">
              {(user as User)?.images?.small ? (
                <Image
                  src={(user as any)?.images?.small}
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
                    ? `${(user as any).name} ${(user as any).lastname}`
                    : "Superadministrador"}
                </span>
                <span className="text-muted text-xs block">
                  {Role[(user as any)?.role]} <b className="caret"></b>
                </span>
              </Link>
              <ul className="dropdown-menu animated fadeInRight m-t-xs">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Perfil de usuario
                  </Link>
                </li>
                <li className="dropdown-divider"></li>
                <li>
                  <Link className="dropdown-item" to="/" onClick={handleLogout}>
                    Cerrar Sesión
                  </Link>
                </li>
              </ul>
            </div>
            <div className="logo-element">CS</div>
          </li>
          {renderMenuItems(menuItems)}
          <li className={styles.logoutButtonSidenav}>
            <Link
              className="dropdown-item text-center"
              to="/"
              onClick={handleLogout}
            >
              <i className="fa fa-power-off" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;
