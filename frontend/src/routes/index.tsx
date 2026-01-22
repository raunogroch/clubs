import type { JSX } from "react";
import {
  Dashboard,
  Assignments,
  Clubs,
  Assistants,
  Coaches,
  Sports,
} from "../pages";

export type MenuRoute = {
  path: string;
  icon?: string;
  label?: string;
  element?: JSX.Element;
  children?: MenuRoute[];
};

export type RoleRoutes = Record<string, MenuRoute[]>;

export const roleRoutes: RoleRoutes = {
  superadmin: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    {
      path: "/sports",
      icon: "fa-trophy",
      label: "Deportes",
      element: <Sports />,
    },
    {
      path: "/assignments",
      icon: "fa-list-check",
      label: "Asignaciones",
      element: <Assignments />,
    },
  ],
  admin: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    {
      path: "/sports",
      icon: "fa-trophy",
      label: "Deportes",
      element: <Sports />,
    },
    {
      path: "/clubs",
      icon: "fa-object-group",
      label: "Clubs",
      element: <Clubs />,
    },
    {
      path: "/users",
      icon: "fa-users",
      label: "Users",
      children: [
        {
          path: "/users/assistants",
          label: "Secretarios",
          element: <Assistants />,
        },
        { path: "/users/coaches", label: "Entrenadores", element: <Coaches /> },
      ],
    },
  ],
  assistant: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
  ],
  coach: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
  ],
  athlete: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
  ],
  parent: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
  ],
};
