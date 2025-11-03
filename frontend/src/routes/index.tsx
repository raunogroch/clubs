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
  DashboardAthlete,
  ProfileAthlete,
  ProfileAdmin,
  ProfileSuperAdmin,
} from "../pages";
import { Groups } from "../pages/groups/components/Groups";
import ClubAssignAssistants from "../pages/Clubs/components/ClubAssignAssistants";
import { GroupsNew } from "../pages/groups/components/GroupsNew";
import { GroupEdit } from "../pages/groups/components/GroupEdit";
import { AthleteEdit, Athletes } from "../pages/Athletes";
import { CoachEdit, Coaches } from "../pages/Coaches/components";
import { DashboardCoach } from "../pages/dashboardCoaches/DashboardCoach";
import { AdminEdit, Admins } from "../pages/Admins";
import { SuperadminEdit, Superadmins } from "../pages/SuperAdmins";
import { RegisterPayment } from "../pages";
import { Assistants } from "../pages/Assistants";
import { Parents } from "../pages/Parents";
import { DashboardAssistant } from "../pages/dashboardAssistants/DashboardAssistant";
import { GroupAthletes } from "../pages/groups/components/GroupAthletes";
import { GroupCoaches } from "../pages/groups/components/GroupCoaches";

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
      path: "/profile",
      label: "Perfil",
      element: <ProfileSuperAdmin name="Perfil" />,
    },
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <Dashboard />,
    },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Clubs",
      element: <Clubs name="Clubs" create edit delete />,
    },
    {
      path: "/clubs/:id/assign-assistants",
      element: <ClubAssignAssistants />,
    },
    {
      path: "/clubs/edit/:id",
      element: <ClubEdit name="Clubs" sub="editar" />,
    },
    { path: "/clubs/create", element: <ClubNew name="Clubs" sub="Crear" /> },
    {
      path: "/clubs/:clubId/groups",
      element: (
        <Groups
          name="Clubs"
          sub="Grupos"
          create
          edit
          delete
          registerAthlete
          registerCoach
        />
      ),
    },
    {
      path: "/clubs/:clubId/groups/register-athlete/:groupId",
      element: <GroupAthletes name="Clubs" sub="Registro" />,
    },
    {
      path: "/clubs/:clubId/groups/register-coach/:groupId",
      element: <GroupCoaches name="Clubs" sub="Registro" />,
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
      path: "/clubs/:id/assign-assistants",
      element: <ClubAssignAssistants />,
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
          path: "/users/create",
          icon: "fa-user-plus",
          label: "Crear usuario",
          element: <UserNew name="Registros" sub="Crear" />,
        },
        {
          path: "/users/superadmin",
          icon: "fa-users",
          label: "Super admins",
          element: <Superadmins name="Super" edit remove delete />,
        },
        {
          path: "/users/admin",
          icon: "fa-users",
          label: "Administradores",
          element: <Admins name="Administradores" />,
        },
        {
          path: "/users/coach",
          icon: "fa-users",
          label: "Entrenadores",
          element: <Coaches name="Entrenadores" />,
        },
        {
          path: "/users/parent",
          icon: "fa-users",
          label: "Tutores",
          element: <Parents name="Tutores" />,
        },
        {
          path: "/users/athlete",
          icon: "fa-users",
          label: "Deportistas",
          element: <Athletes name="Deportistas" />,
        },
      ],
    },
    {
      path: "/users/superadmin/edit/:id",
      element: <SuperadminEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/users/admin/edit/:id",
      element: <AdminEdit name="Registros" sub="Actualizar" />,
    },

    // coaches

    {
      path: "/users/coach/edit/:id",
      element: <CoachEdit name="Registros" sub="Actualizar" />,
    },

    // athletes

    {
      path: "/users/athlete/edit/:id",
      element: <AthleteEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/payments/register",
      icon: "fa-credit-card",
      label: "Mensualidades",
      element: <RegisterPayment />,
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
      element: <Clubs name="Clubs" create edit delete />,
    },
    {
      path: "/clubs/:id/assign-assistants",
      element: <ClubAssignAssistants />,
    },
    {
      path: "/clubs/edit/:id",
      element: <ClubEdit name="Clubs" sub="editar" />,
    },
    { path: "/clubs/create", element: <ClubNew name="Clubs" sub="Crear" /> },
    {
      path: "/clubs/:clubId/groups",
      element: (
        <Groups
          name="Clubs"
          sub="Grupos"
          create
          edit
          delete
          registerAthlete
          registerCoach
        />
      ),
    },
    {
      path: "/clubs/:clubId/groups/register-athlete/:groupId",
      element: <GroupAthletes name="Clubs" sub="Registro" />,
    },
    {
      path: "/clubs/:clubId/groups/register-coach/:groupId",
      element: <GroupCoaches name="Clubs" sub="Registro" />,
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
          path: "/users/create",
          icon: "fa-user-plus",
          label: "Crear usuario",
          element: <UserNew name="Registros" sub="Crear" />,
        },
        {
          path: "/users/admin",
          icon: "fa-user-circle-o",
          label: "Administradores",
          element: <Admins name="Administradores" />,
        },
        {
          path: "/users/assistant",
          icon: "fa-user-circle-o",
          label: "Asistentes",
          element: <Assistants name="Asistentes" />,
        },
        {
          path: "/users/coach",
          icon: "fa-user-circle-o",
          label: "Entrenadores",
          element: <Coaches name="Entrenadores" />,
        },
        {
          path: "/users/parent",
          icon: "fa-user-circle-o",
          label: "Tutores",
          element: <Parents name="Tutores" edit delete />,
        },
        {
          path: "/users/athlete",
          icon: "fa-user-circle-o",
          label: "Deportistas",
          element: <Athletes name="Deportistas" />,
        },
      ],
    },
    {
      path: "/users/general/edit/:id",
      element: <UserEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/users/admin/edit/:id",
      element: <AdminEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/users/coach/edit/:id",
      element: <CoachEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/users/athlete/edit/:id",
      element: <AthleteEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/payments/register",
      icon: "fa-credit-card",
      label: "Mensualidades",
      element: <RegisterPayment />,
    },
  ],
  assistant: [
    {
      path: "/",
      icon: "fa-home",
      label: "Principal",
      element: <DashboardAssistant />,
    },
    {
      path: "/users",
      icon: "fa-user-circle",
      label: "Usuarios",
      children: [
        {
          path: "/users/create",
          icon: "fa-user-plus",
          label: "Crear",
          element: <UserNew name="Registros" sub="Crear" />,
        },
        {
          path: "/users/parent",
          icon: "fa-user-circle-o",
          label: "Apoderados",
          element: <Parents name="Tutores" edit delete />,
        },
        {
          path: "/users/athlete",
          icon: "fa-user-circle-o",
          label: "Deportistas",
          element: <Athletes name="Deportistas" edit />,
        },
      ],
    },
    {
      path: "/users/coach/edit/:id",
      element: <CoachEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/users/athlete/edit/:id",
      element: <AthleteEdit name="Registros" sub="Actualizar" />,
    },
    {
      path: "/clubs",
      icon: "fa-diamond",
      label: "Asignaciones",
      element: <Clubs name="Clubs" />,
    },
    {
      path: "/clubs/:clubId/groups",
      element: <Groups name="Clubs" sub="Grupos" registerAthlete />,
    },
    {
      path: "/clubs/:clubId/groups/register-athlete/:groupId",
      element: <GroupAthletes name="Clubs" sub="Registro" />,
    },
    {
      path: "/payments/register",
      icon: "fa-credit-card",
      label: "Mensualidades",
      element: <RegisterPayment />,
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
