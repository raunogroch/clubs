import { useState } from "react";
import { Input } from "../components";
import { authService } from "../services/authService";

export const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      // Lógica de autenticación aquí
      await authService.login(formData);
      //console.log("Datos enviados:", formData);
      // await authService.login(formData);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="middle-box text-center loginscreen animated fadeInDown">
      <div>
        <div>
          <h1 className="logo-name">IN+</h1>
        </div>
        <h3>Welcome to IN+</h3>
        <p>
          Perfectly designed and precisely prepared admin theme with over 50
          pages with extra new web app views.
        </p>
        <p>Login in. To see it in action.</p>

        <form className="m-t" role="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
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
              placeholder="Password"
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
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <a href="#">
            <small>Forgot password?</small>
          </a>

          <p className="text-muted text-center">
            <small>Do not have an account?</small>
          </p>

          <a className="btn btn-sm btn-white btn-block" href="register.html">
            Create an account
          </a>
        </form>

        <p className="m-t">
          <small>
            Inspinia we app framework base on Bootstrap 3 &copy; 2014
          </small>
        </p>
      </div>
    </div>
  );
};
