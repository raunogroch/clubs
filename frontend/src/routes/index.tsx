import type { JSX } from "react";
import {
  Dashboard,
  Assignments,
  Clubs,
  Admins,
  Assistants,
  Coaches,
  CoachesSuperadmin,
  Athletes,
  AthletesAdmin,
  Sports,
  ProfileAdmin,
  DashboardAdmin,
  MonthlyPayments,
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
      path: "/users",
      icon: "fa-users",
      label: "Users",
      children: [
        {
          path: "/users/admins",
          label: "Admins",
          element: <Admins />,
        },
        {
          path: "/users/assistants",
          label: "Secretarios",
          element: <Assistants />,
        },
        {
          path: "/users/coaches",
          label: "Entrenadores",
          element: <CoachesSuperadmin />,
        },
        { path: "/users/athletes", label: "Atletas", element: <Athletes /> },
      ],
    },
    {
      path: "/assignments",
      icon: "fa-list",
      label: "Asignaciones",
      element: <Assignments />,
    },
  ],
  admin: [
    {
      path: "/profile",
      element: <ProfileAdmin />,
    },
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardAdmin />,
    },
    {
      path: "/clubs",
      icon: "fa-object-group",
      label: "Clubs",
      element: <Clubs />,
    },
    {
      path: "/mensualidad",
      icon: "fa-money",
      label: "Mensualidad",
      element: <MonthlyPayments />,
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
        {
          path: "/users/athletes",
          label: "Atletas",
          element: <AthletesAdmin />,
        },
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
    {
      path: "/users",
      icon: "fa-users",
      label: "Users",
      children: [
        {
          path: "/users/admins",
          label: "Admins",
          element: <Admins />,
        },
        {
          path: "/users/assistants",
          label: "Secretarios",
          element: <Assistants />,
        },
        { path: "/users/coaches", label: "Entrenadores", element: <Coaches /> },
        { path: "/users/athletes", label: "Atletas", element: <Athletes /> },
      ],
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
