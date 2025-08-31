import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Navigation } from "../layouts/Navigation";

interface PrivateRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Si el usuario no tiene el rol permitido, redirige al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-container">
      <Navigation>
        <main className="content">{children}</main>
      </Navigation>
    </div>
  );
};
