import { Link, useNavigate } from "react-router-dom";
import { SmoothlyMenu } from "../scripts/coder-softScripts";
import { Input } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, logout as logoutAction } from "../store";
import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce"; // <- nuestro hook

export const TopNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const isHere = location.pathname === "/users";

  const filter = useSelector((state: any) => state.queries.filter);

  // Hook de debounce
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // Se ejecuta solo cuando el usuario deja de escribir
    dispatch(
      setQuery({
        module: "filter",
        filter: { ...filter, name: debouncedSearch },
      })
    );
  }, [debouncedSearch]);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logoutAction());
    navigate("/login", { replace: true });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.body.classList.toggle("mini-navbar");
    SmoothlyMenu();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
            to="#"
            onClick={handleClick}
          >
            <i className="fa fa-bars"></i>
          </Link>

          {isHere && (
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
                />
              </div>
            </div>
          )}
        </div>
        <ul className="nav navbar-top-links navbar-right">
          <li style={{ padding: "20px" }}>
            <span className="m-r-sm text-muted welcome-message">
              BIENVENIDO AL SISTEMA DE CLUBES
            </span>
          </li>

          <li>
            <Link to="#" onClick={handleLogout}>
              <i className="fa fa-sign-out"></i> Cerrar Sesión
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
