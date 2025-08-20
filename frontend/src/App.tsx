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
import { Clubs, Dashboard, Profile, UserEdit, UserNew, Users } from "./pages";
import { ClubEdit } from "./pages/Clubs/ClubEdit";
import { ClubNew } from "./pages/Clubs/ClubNew";
import { Schedule } from "./pages/Schedule/Schedule";
import { Sports } from "./pages/Sports/Sports";
import { SportNew } from "./pages/Sports/SportNew";
import { SportEdit } from "./pages/Sports/SportEdit";

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
            path="/clubs/edit/:id"
            element={
              <PrivateRoute>
                <ClubEdit name="Clubs" sub="new" />
              </PrivateRoute>
            }
          />
          <Route
            path="/clubs/create"
            element={
              <PrivateRoute>
                <ClubNew name="Clubs" sub="Crear" />
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
            path="/sports"
            element={
              <PrivateRoute>
                <Sports name="Disciplinas" />
              </PrivateRoute>
            }
          />
          <Route
            path="/sports/create"
            element={
              <PrivateRoute>
                <SportNew name="Registros" sub="Crear" />
              </PrivateRoute>
            }
          />

          <Route
            path="/sports/edit/:id"
            element={
              <PrivateRoute>
                <SportEdit name="Registros" sub="Actualizar" />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <PrivateRoute>
                <Schedule name="Horarios" />
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
          <Route
            path="/users/edit/:id"
            element={
              <PrivateRoute>
                <UserEdit name="Registros" sub="Actualizar" />
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
