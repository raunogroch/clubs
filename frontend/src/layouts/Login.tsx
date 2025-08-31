// Login.tsx
import { useContext, useEffect, useState } from "react";
import { Input } from "../components";
import { authService } from "../services/authService";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";

interface FormData {
  username: string;
  password: string;
}

export const Login = () => {
  useBodyClass();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useContext(AuthContext);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await authService.login(formData);
      login(data.authorization, data.user);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Invalid username or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="middle-box text-center loginscreen animated fadeInDown">
      <div>
        <div>
          <h1 className="logo-name">CS</h1>
        </div>
        <h3>Bienvenidos a {`<Codersoft />`}</h3>
        <p>Este sistema es una aplicacion para gestion de clubes deportivos</p>
        <p>Ingresa. Para tomar accion.</p>

        {error && <div className="alert alert-danger">{error}</div>}

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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando ..." : "Ingresar"}
          </button>
        </form>

        <p className="m-t">
          <small>
            software de gestion de clubes &copy; 2024 &nbsp;
            {`<Codersoft />`}
          </small>
        </p>
      </div>
    </div>
  );
};
