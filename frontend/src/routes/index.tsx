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
  Profile,
  DashboardAthlete,
} from "../pages";
import { Groups } from "../pages/groups/components/Groups";
import { GroupsNew } from "../pages/groups/components/GroupsNew";
import { GroupEdit } from "../pages/groups/components/GroupEdit";

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
      path: "/clubs/:id/groups/edit/:groupId",
      element: <GroupsNew name="Clubs" sub="Grupos" sub1="Editar" />,
    },
    {
      path: "/",
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
      path: "/clubs/:id/groups",
      element: <Groups name="Clubs" sub="Grupos" />,
    },
    {
      path: "/clubs/:id/groups/create",
      element: <GroupsNew name="Clubs" sub="Grupos" sub1="Crear" />,
    },
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
      path: "/clubs/:id/groups/edit/:groupId",
      element: <GroupsNew name="Clubs" sub="Grupos" sub1="Editar" />,
    },
    {
      path: "/",
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
      path: "/clubs/edit/:id",
      element: <ClubEdit name="Clubs" sub="editar" />,
    },
    { path: "/clubs/create", element: <ClubNew name="Clubs" sub="Crear" /> },
    {
      path: "/clubs/:clubId/groups",
      element: <Groups name="Clubs" sub="Grupos" />,
    },
    {
      path: "/clubs/:clubId/groups/create",
      element: <GroupsNew name="Clubs" sub="Groups" sub1="Crear" />,
    },
    {
      path: "/clubs/:clubId/groups/:groupId",
      element: <GroupEdit name="Clubs" sub="Groups" sub1="Editar" />,
    },
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
      path: "/",
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
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardAthlete />,
    },
    { path: "/profile", label: "Perfil", element: <Profile name="Perfil" /> },
  ],
  parent: [
    {
      path: "/",
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
