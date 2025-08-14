import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const Profile = ({ name }: pageParamProps) => {
  return <NavHeader name="Perfil de usuario" />;
};
