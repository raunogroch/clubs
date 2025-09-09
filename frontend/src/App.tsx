// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext, PrivateRoute } from "./auth";
import { Login, NotFound } from "./pages";
import { roleRoutes } from "./routes";
import { useSelector } from "react-redux";
import { Spinner } from "./components"; // Ajusta la ruta si es necesario
import type { RootState } from "./store/store";

export const App = () => {
  const loading = useSelector((state: RootState) => state.loading.global);

  const AppRoutes = () => {
    const { user } = useContext(AuthContext);
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

  return (
    <Router>
      <AuthProvider>
        {loading && <Spinner />}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};
