// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Login, NotFound } from "./layouts";
import { Clubs, Dashboard, Profile, Users, UserNew } from "./pages";

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />

          {/* Rutas privadas */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <PrivateRoute>
                <Clubs name="Clubs" />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile name="Perfil" />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users name="Registros" />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <PrivateRoute>
                <UserNew name="Registros" sub="Crear" />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
