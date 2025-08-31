import type { JSX } from "react";
import {
  ClubEdit,
  ClubNew,
  Clubs,
  Dashboard,
  Schedule,
  ScheduleEdit,
  ScheduleNew,
  SportEdit,
  SportNew,
  Sports,
  UserEdit,
  UserNew,
  Users,
} from "../pages";
import { Profile } from "../pages/Profile/components/Profile";

export type MenuRoute = {
  path: string;
  icon?: string;
  label?: string;
  element?: JSX.Element;
};

export type RoleRoutes = Record<string, MenuRoute[]>;

export const roleRoutes: RoleRoutes = {
  superadmin: [
    {
      path: "/dashboard/*",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    { path: "/profile", label: "Perfil", element: <Profile name="Perfil" /> },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Clubs",
      element: <Clubs name="Clubs" />,
    },
    { path: "/clubs/edit/:id", element: <ClubEdit name="Clubs" sub="new" /> },
    { path: "/clubs/create", element: <ClubNew name="Clubs" sub="Crear" /> },
    {
      path: "/sports",
      icon: "fa-soccer-ball-o",
      label: "Disciplina",
      element: <Sports name="Disciplinas" />,
    },
    {
      path: "/sports/create",
      element: <SportNew name="Registros" sub="Crear" />,
    },
    {
      path: "/sports/edit/:id",
      element: <SportEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/schedules",
      icon: "fa-clock-o",
      label: "Horarios",
      element: <Schedule name="Horarios" />,
    },
    {
      path: "/schedules/create",
      element: <ScheduleNew name="Horarios" sub="Crear" />,
    },
    {
      path: "/schedules/edit/:id",
      element: <ScheduleEdit name="Horarios" sub="Actualizar" />,
    },
    {
      path: "/users",
      icon: "fa-file",
      label: "Registros",
      element: <Users name="Registros" />,
    },
    {
      path: "/users/create",
      element: <UserNew name="Registros" sub="Crear" />,
    },
    {
      path: "/users/edit/:id",
      element: <UserEdit name="Registros" sub="Actualizar" />,
    },
  ],
  admin: [
    {
      path: "/dashboard/*",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    { path: "/profile", label: "Perfil", element: <Profile name="Perfil" /> },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Clubs",
      element: <Clubs name="Clubs" />,
    },
    { path: "/clubs/edit/:id", element: <ClubEdit name="Clubs" sub="new" /> },
    { path: "/clubs/create", element: <ClubNew name="Clubs" sub="Crear" /> },
    {
      path: "/sports",
      icon: "fa-soccer-ball-o",
      label: "Disciplina",
      element: <Sports name="Disciplinas" />,
    },
    {
      path: "/sports/create",
      element: <SportNew name="Registros" sub="Crear" />,
    },
    {
      path: "/sports/edit/:id",
      element: <SportEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/schedules",
      icon: "fa-clock-o",
      label: "Horarios",
      element: <Schedule name="Horarios" />,
    },
    {
      path: "/schedules/create",
      element: <ScheduleNew name="Horarios" sub="Crear" />,
    },
    {
      path: "/schedules/edit/:id",
      element: <ScheduleEdit name="Horarios" sub="Actualizar" />,
    },
    {
      path: "/users",
      icon: "fa-file",
      label: "Registros",
      element: <Users name="Registros" />,
    },
    {
      path: "/users/create",
      element: <UserNew name="Registros" sub="Crear" />,
    },
    {
      path: "/users/edit/:id",
      element: <UserEdit name="Registros" sub="Actualizar" />,
    },
  ],
  coach: [
    {
      path: "/dashboard/*",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    { path: "/profile", label: "Perfil", element: <Profile name="Perfil" /> },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Clubs",
      element: <Clubs name="Clubs" />,
    },
    {
      path: "/sports",
      icon: "fa-soccer-ball-o",
      label: "Disciplina",
      element: <Sports name="Disciplinas" />,
    },
    {
      path: "/schedules",
      icon: "fa-clock-o",
      label: "Horarios",
      element: <Schedule name="Horarios" />,
    },
  ],
  athlete: [
    {
      path: "/dashboard/*",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    { path: "/profile", label: "Perfil", element: <Profile name="Perfil" /> },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Clubs",
      element: <Clubs name="Clubs" />,
    },
    {
      path: "/sports",
      icon: "fa-soccer-ball-o",
      label: "Disciplina",
      element: <Sports name="Disciplinas" />,
    },
    {
      path: "/schedules",
      icon: "fa-clock-o",
      label: "Horarios",
      element: <Schedule name="Horarios" />,
    },
  ],
  parent: [
    {
      path: "/dashboard/*",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    { path: "/profile", label: "Perfil", element: <Profile name="Perfil" /> },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Clubs",
      element: <Clubs name="Clubs" />,
    },
    {
      path: "/sports",
      icon: "fa-soccer-ball-o",
      label: "Disciplina",
      element: <Sports name="Disciplinas" />,
    },
    {
      path: "/schedules",
      icon: "fa-clock-o",
      label: "Horarios",
      element: <Schedule name="Horarios" />,
    },
  ],
};
