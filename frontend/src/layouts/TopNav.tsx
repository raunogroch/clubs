import { Link, useLocation, useNavigate } from "react-router-dom";
import { SmoothlyMenu } from "../scripts/coder-softScripts";
import { Input } from "../components";
import { useDispatch } from "react-redux";
import { type AppDispatch, setName, setPage } from "../store";
import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { logoutThunk } from "../store/authThunk";

// Constantes para rutas y mensajes
const SEARCH_PATHS: string[] = [
  "/users/general",
  "/users/coaches",
  "/users/athletes",
];
const WELCOME_MESSAGE = "BIENVENIDO AL SISTEMA DE CLUBES";

export const TopNav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Memoizar cálculo de rutas
  const isSearchVisible = SEARCH_PATHS.includes(location.pathname);

  // Memoizar valor debounced
  const debouncedSearch = useDebounce(search, 300);

  // Efecto optimizado para búsqueda
  useEffect(() => {
    if (isSearchVisible) {
      dispatch(setName(debouncedSearch));
      dispatch(setPage(1));
    }
  }, [debouncedSearch, dispatch, isSearchVisible]);

  // Logout sencillo y eficiente, con buenas prácticas
  const handleLogout = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      try {
        await dispatch(logoutThunk()).unwrap();
        navigate("/login", { replace: true });
      } catch {
        // Si falla, redirige igual para evitar quedarse en estado inconsistente
        navigate("/login", { replace: true });
      }
    },
    [dispatch, navigate]
  );

  // Manejo de toggle menú memoizado
  const handleMenuToggle = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      document.body.classList.toggle("mini-navbar");
      SmoothlyMenu();
    },
    []
  );

  // Manejo de búsqueda memoizado
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  return (
    <div className="row border-bottom">
      <nav
        className="navbar navbar-static-top"
        role="navigation"
        style={{ marginBottom: 0 }}
      >
        <div className="navbar-header">
          <Link
            className="navbar-minimalize minimalize-styl-2 btn btn-primary"
            to="#"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <i className="fa fa-bars" aria-hidden="true" />
          </Link>

          {isSearchVisible && (
            <div role="search" className="navbar-form-custom">
              <div className="form-group">
                <Input
                  type="text"
                  placeholder="Buscar en la lista..."
                  className="form-control"
                  name="top-search"
                  id="top-search"
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Search users"
                />
              </div>
            </div>
          )}
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <li className="welcome-message">
            <span className="m-r-sm text-muted">{WELCOME_MESSAGE}</span>
          </li>

          <li>
            <Link to="/" onClick={handleLogout} aria-label="Logout">
              <i className="fa fa-sign-out" aria-hidden="true" />
              <span className="logout-text">Cerrar Sesión</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
