import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, PrivateRoute } from "./auth";
import { Login, NotFound } from "./pages";
import { roleRoutes } from "./routes";
import { useSelector } from "react-redux";

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

const AppRoutes = () => {
  const isAuthenticated = useSelector((state: any) => state.auth);
  const { user } = isAuthenticated;
  const role = user?.role || "";
  const allowedRoutes = roleRoutes[role] || [];

  return (
    <>
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
    </>
  );
};
