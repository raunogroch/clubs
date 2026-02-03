/**
 * Componente raíz de la aplicación (App)
 *
 * Responsabilidades:
 * - Configurar React Router para navegación
 * - Proporcionar contexto de autenticación
 * - Renderizar rutas públicas y privadas
 * - Configurar notificaciones (toastr)
 *
 * Estructura:
 * App (componente raíz)
 *   ↓
 * Router (BrowserRouter)
 *   ↓
 * AuthProvider (contexto de autenticación)
 *   ↓
 * Routes (rutas según rol del usuario)
 */

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
import toastr from "toastr";
import "toastr/build/toastr.min.css";

/**
 * Configurar las opciones globales de las notificaciones (toastr)
 * Estas opciones se aplican a todos los toasts que se muestren en la app
 */
toastr.options = {
  closeButton: true, // Mostrar botón para cerrar la notificación
  progressBar: true, // Mostrar barra de progreso
  positionClass: "toast-top-right", // Posición en la pantalla
  timeOut: 3000, // Cerrar automáticamente después de 3 segundos
};

/**
 * Componente principal de la aplicación
 * Configura React Router y AuthProvider
 */
export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

/**
 * Componente que maneja todas las rutas de la aplicación
 *
 * Lógica:
 * 1. Obtiene el usuario y rol del estado global (Redux)
 * 2. Busca las rutas permitidas para ese rol
 * 3. Renderiza rutas públicas (login) y privadas (protegidas)
 * 4. Maneja redirecciones según el estado de autenticación
 */
const AppRoutes = () => {
  // Obtener estado de autenticación desde Redux
  const isAuthenticated = useSelector((state: any) => state.auth);
  const { user } = isAuthenticated;
  const role = user?.role || "";

  // Obtener las rutas permitidas para el rol del usuario actual
  const allowedRoutes = roleRoutes[role] || [];

  /**
   * Extraer rutas hijas (subrutas)
   * Algunas rutas tienen rutas hijas anidadas
   * Ejemplo: /admin tiene /admin/users, /admin/settings
   */
  const childRoutes = allowedRoutes
    .filter((route) => route.children)
    .flatMap((route) => route.children);

  /**
   * Separar rutas dinámicas (con parámetros) de rutas estáticas
   */
  const staticRoutes = allowedRoutes.filter(
    (route) => !route.path.includes(":"),
  );
  const dynamicRoutes = allowedRoutes.filter((route) =>
    route.path.includes(":"),
  );
  const staticChildRoutes = childRoutes.filter(
    (route) => !route.path.includes(":"),
  );
  const dynamicChildRoutes = childRoutes.filter((route) =>
    route.path.includes(":"),
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/404" element={<NotFound />} />

      {/* Rutas estáticas */}
      {staticRoutes.map(({ path, element }) =>
        element ? (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute allowedRoles={[role]}>{element}</PrivateRoute>
            }
          />
        ) : null,
      )}

      {/* Rutas dinámicas */}
      {dynamicRoutes.map(({ path, element }) =>
        element ? (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute allowedRoles={[role]}>{element}</PrivateRoute>
            }
          />
        ) : null,
      )}

      {/* Rutas hijas estáticas */}
      {staticChildRoutes.map(({ path, element }) =>
        element ? (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute allowedRoles={[role]}>{element}</PrivateRoute>
            }
          />
        ) : null,
      )}

      {/* Rutas hijas dinámicas */}
      {dynamicChildRoutes.map(({ path, element }) =>
        element ? (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute allowedRoles={[role]}>{element}</PrivateRoute>
            }
          />
        ) : null,
      )}

      <Route
        path="/"
        element={
          user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
