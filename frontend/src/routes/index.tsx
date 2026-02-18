import type { JSX } from "react";
import {
  Dashboard,
  Assignments,
  Clubs,
  ClubGroups,
  GroupDetail,
  Admins,
  Assistants,
  Coaches,
  CoachesSuperadmin,
  Athletes,
  AthletesAdmin,
  AthletesParent,
  Sports,
  ProfileAdmin,
  DashboardAdmin,
  MonthlyPayments,
  ProfileCoach,
  DashboardCoach,
  ScheduleCoach,
  SchedulesAdmin,
  DashboardAthlete,
  DashboardParent,
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
      path: "/schedules",
      icon: "fa-calendar",
      label: "Horarios",
      element: <SchedulesAdmin />,
    },
    {
      path: "/clubs",
      icon: "fa-object-group",
      label: "Clubs",
      element: <Clubs />,
    },
    {
      path: "/clubs/:club_id/groups",
      element: <ClubGroups />,
    },
    {
      path: "/clubs/:club_id/groups/:id_subgrupo/group",
      element: <GroupDetail />,
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
    {
      path: "/mensualidad",
      icon: "fa-money",
      label: "Pagos",
      element: <MonthlyPayments />,
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
      path: "/profile",
      element: <ProfileCoach />,
    },
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardCoach />,
    },
    {
      path: "/schedule",
      icon: "fa-schedule",
      label: "Hoararios",
      element: <ScheduleCoach />,
    },
  ],
  athlete: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardAthlete />,
    },
    {
      path: "/profile",
      icon: "fa-user",
      label: "Mi Perfil",
      element: <ProfileAdmin />,
    },
  ],
  parent: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardParent />,
    },
    {
      path: "/athletes",
      icon: "fa-users",
      label: "Atletas",
      element: <AthletesParent />,
    },
    {
      path: "/schedules",
      icon: "fa-calendar",
      label: "Horarios",
      element: <DashboardParent />, // vista de lista de horarios asociados al padre
    },
    {
      path: "/profile",
      icon: "fa-user",
      label: "Mi Perfil",
      element: <ProfileAdmin />,
    },
  ],
};
