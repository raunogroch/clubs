// Login.tsx
import { useEffect, useState } from "react";
import { Input, PopUpMessage } from "../components";
import { useNavigate } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { loginThunk, loginByCiThunk } from "../store/authThunk";

interface FormData {
  username: string;
  password: string;
}

interface CarnetFormData {
  ci: string;
  role: "athlete" | "parent";
}

type UserType = "athlete" | "parent" | "other" | null;

export const Login = () => {
  useBodyClass();
  const [userType, setUserType] = useState<UserType>("athlete");
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [carnetFormData, setCarnetFormData] = useState<CarnetFormData>({
    ci: "",
    role: "athlete",
  });
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const status = useSelector((state: RootState) => state.auth.status);
  const error = useSelector((state: RootState) => state.auth.error);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCarnetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarnetFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginThunk(formData));
  };

  const handleCarnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginByCiThunk(carnetFormData));
  };

  const handleBack = () => {
    setUserType((prev) => (prev === "athlete" ? "other" : "athlete"));
    setFormData({ username: "", password: "" });
    setCarnetFormData({ ci: "", role: "athlete" });
  };

  const handleRoleChange = (role: "athlete" | "parent") => {
    setCarnetFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const toggleLabel =
    userType === "athlete" ? "Usuarios" : "deportistas / tutores";

  return (
    <div className="middle-box text-center loginscreen animated fadeInDown">
      <div>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        <PopUpMessage />
        <div>
          <h1 className="logo-name">CS</h1>
        </div>
        <h3>
          Bienvenidos a <br />
          SISTEMA DE CLUBES
        </h3>

        {/* Selector de tipo de usuario */}
        {userType === null ? (
          <>
            <p>Selecciona el tipo de usuario</p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                type="button"
                className="btn btn-primary block full-width"
                onClick={() => setUserType("athlete")}
              >
                Deportista / Tutor
              </button>
              <button
                type="button"
                className="btn btn-primary block full-width"
                onClick={() => setUserType("other")}
              >
                Usuarios
              </button>
            </div>
          </>
        ) : null}

        {/* Formulario de Carnet (para deportistas) */}
        {userType === "athlete" && (
          <>
            <p>Ingresa tu número de carnet</p>
            <form className="m-t" role="form" onSubmit={handleCarnetSubmit}>
              <div className="form-group">
                <Input
                  type="text"
                  name="ci"
                  className="form-control"
                  placeholder="Número de carnet (CI)"
                  required
                  value={carnetFormData.ci}
                  onChange={handleCarnetChange}
                />
              </div>

              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <p style={{ marginBottom: "10px", fontWeight: 500 }}>
                  ¿Qué tipo de usuario eres?
                </p>
                <div style={{ display: "flex", gap: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="athlete"
                      checked={carnetFormData.role === "athlete"}
                      onChange={() => handleRoleChange("athlete")}
                      style={{ marginRight: "8px", cursor: "pointer" }}
                    />
                    <span>Soy Deportista</span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="parent"
                      checked={carnetFormData.role === "parent"}
                      onChange={() => handleRoleChange("parent")}
                      style={{ marginRight: "8px", cursor: "pointer" }}
                    />
                    <span>Soy Tutor</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary block full-width m-b"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Ingresando ..." : "Ingresar"}
              </button>
            </form>
            <button
              type="button"
              className="btn btn-secondary block full-width"
              onClick={handleBack}
            >
              {toggleLabel}
            </button>
          </>
        )}

        {/* Formulario de Usuario y Contraseña (para otros) */}
        {userType === "other" && (
          <>
            <p>Ingresa tus credenciales</p>
            <form className="m-t" role="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <Input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Usuario"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <Input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Contraseña"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary block full-width m-b"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Ingresando ..." : "Ingresar"}
              </button>
            </form>
            <button
              type="button"
              className="btn btn-secondary block full-width"
              onClick={handleBack}
            >
              {toggleLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
