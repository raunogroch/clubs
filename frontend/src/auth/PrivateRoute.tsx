import { Navigate, useLocation } from "react-router-dom";
import { Navigation } from "../pages/Navigation";
import { AthleteParentNavigation } from "../pages/AthleteParentNavigation";
import { useSelector } from "react-redux";

interface PrivateRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const authenticated = useSelector((state: any) => state.auth);
  const { user, isAuthenticated } = authenticated;

  const location = useLocation();

  if (isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  // Validar que admins tengan un assignment_id asignado
  // Si es admin sin assignment_id, solo permitir dashboard (/) y perfil (/profile)
  if (
    user?.role === "admin" &&
    !user?.assignment_id &&
    location.pathname !== "/" &&
    location.pathname !== "/profile"
  ) {
    return <Navigate to="/" replace />;
  }

  // Usar layout diferente para atletas y padres
  const isAthleteOrParent = user?.role === "athlete" || user?.role === "parent";
  const NavigationComponent = isAthleteOrParent
    ? AthleteParentNavigation
    : Navigation;

  return (
    <div className="app-container">
      <NavigationComponent>
        <main className="content">{children}</main>
      </NavigationComponent>
    </div>
  );
};
