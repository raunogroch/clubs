import { type ReactNode } from "react";
import { Footer, SideNav, TopNav } from "../layouts";

interface AthleteParentNavigationProps {
  children: ReactNode;
}

/**
 * Layout simplificado para atletas y padres
 * Este layout no incluye el SideNav (menú lateral)
 * Solo muestra TopNav y el contenido principal
 */
export const AthleteParentNavigation = ({
  children,
}: AthleteParentNavigationProps) => {
  return (
    <div id="wrapper">
      <SideNav />
      <div id="page-wrapper" className="gray-bg dashbard-1">
        <TopNav />
        {children}
        <Footer />
      </div>
    </div>
  );
};
