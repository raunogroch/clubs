import type { JSX } from "react";
import {
  ClubEdit,
  ClubNew,
  Clubs,
  Dashboard,
  SportEdit,
  SportNew,
  Sports,
  UserEdit,
  UserNew,
  Users,
  DashboardAthlete,
  ProfileAthlete,
  ProfileAdmin,
  ProfileCoach,
} from "../pages";
import { Groups } from "../pages/groups/components/Groups";
import { GroupsNew } from "../pages/groups/components/GroupsNew";
import { GroupEdit } from "../pages/groups/components/GroupEdit";
import { AthleteEdit, AthleteNew, Athletes } from "../pages/Athletes";
import { CoachEdit, Coaches, CoachNew } from "../pages/Coaches/components";
import { DashboardCoach } from "../pages/dashboardCoaches/DashboardCoach";

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
      path: "/clubs/:id/groups/edit/:groupId",
      element: <GroupsNew name="Clubs" sub="Grupos" sub1="Editar" />,
    },
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    {
      path: "/profile",
      label: "Perfil",
      element: <ProfileAthlete name="Perfil" />,
    },
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
      path: "/users",
      icon: "fa-users",
      label: "Usuarios",
      children: [
        {
          path: "/users/general",
          icon: "fa-list",
          label: "General",
          element: <ProfileAdmin name="Registros" />,
        },
        {
          path: "/users/coaches",
          icon: "fa-list",
          label: "Entrenadores",
          element: <ProfileCoach name="Registros" />,
        },
        {
          path: "/users/athletes",
          icon: "fa-list",
          label: "Deportistas",
          element: <ProfileAthlete name="Registros" />,
        },
        {
          path: "/users",
          icon: "fa-list",
          label: "Registros",
          element: <Users name="Registros" />,
        },
      ],
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
    {
      path: "/profile",
      label: "Perfil",
      element: <ProfileAdmin name="Perfil" />,
    },
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
      path: "/users",
      icon: "fa-user-circle",
      label: "Gestion de usuarios",
      children: [
        {
          path: "/users/general",
          icon: "fa-users",
          label: "General",
          element: <Users name="Todos los registros" />,
        },
        {
          path: "/users/coaches",
          icon: "fa-vcard-o",
          label: "Entrenadores",
          element: <Coaches name="Entrenadores" />,
        },
        {
          path: "/users/athletes",
          icon: "fa-vcard-o",
          label: "Deportistas",
          element: <Athletes name="Deportistas" />,
        },
      ],
    },
    {
      path: "/users/general/create",
      element: <UserNew name="Registros" sub="Crear" />,
    },
    {
      path: "/users/general/edit/:id",
      element: <UserEdit name="Registros" sub="Actualizar" />,
    },

    // coaches

    {
      path: "/users/coaches/create",
      element: <CoachNew name="Registros" sub="Crear" />,
    },
    {
      path: "/users/coaches/edit/:id",
      element: <CoachEdit name="Registros" sub="Actualizar" />,
    },

    // athletes

    {
      path: "/users/athletes/create",
      element: <AthleteNew name="Registros" sub="Crear" />,
    },
    {
      path: "/users/athletes/edit/:id",
      element: <AthleteEdit name="Registros" sub="Actualizar" />,
    },
  ],
  coach: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardCoach />,
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
      label: "Perfil",
      element: <ProfileAthlete name="Perfil" />,
    },
  ],
  parent: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    {
      path: "/profile",
      label: "Perfil",
      element: <ProfileAthlete name="Perfil" />,
    },
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
  ],
};
