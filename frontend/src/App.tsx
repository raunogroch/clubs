// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { AuthContext } from "./auth/AuthContext";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Login, NotFound } from "./layouts";
import { roleRoutes } from "./routes";

export const App = () => {
  const AppRoutes = () => {
    const { user } = useContext(AuthContext);
    const role = user?.role || "";
    const allowedRoutes = roleRoutes[role] || [];

    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        {allowedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute allowedRoles={[role]}>{element}</PrivateRoute>
            }
          />
        ))}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};
