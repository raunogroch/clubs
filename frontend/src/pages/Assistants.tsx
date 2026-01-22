import { useEffect } from "react";
import { NavHeader } from "../components";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { fetchUsersByRole } from "../store/usersThunk";

export const Assistants = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUsersByRole("assistant"));
  }, [dispatch]);

  return (
    <div>
      <NavHeader name="Asistentes" />
      <div className="wrapper wrapper-content">
        <div className="middle-box text-center animated fadeInRightBig">
          <div style={{ padding: "40px 20px" }}>
            <i
              className="fa fa-wrench"
              style={{
                fontSize: "48px",
                color: "#f0ad4e",
                marginBottom: "20px",
                display: "block",
              }}
            ></i>
            <h2 style={{ marginBottom: "15px", color: "#333" }}>
              Página en Construcción
            </h2>
            <p
              style={{ color: "#666", marginBottom: "30px", fontSize: "16px" }}
            >
              Esta sección está siendo mejorada. Pronto estará disponible.
            </p>
            <a href="/dashboard" className="btn btn-primary">
              <i className="fa fa-arrow-left"></i> Volver al Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
