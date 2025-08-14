import { type ReactNode } from "react";
import { Footer, SideNav, TopNav } from ".";

interface NavigationProps {
  children: ReactNode;
}

export const Navigation = ({ children }: NavigationProps) => {
  return (
    <div id="wrapper">
      <SideNav />

      <div id="page-wrapper" className="gray-bg dashbard-1">
        <TopNav />
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
};
