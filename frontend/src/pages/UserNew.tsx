import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const UserNew = ({ name, sub }: pageParamProps) => {
  return (
    <>
      <NavHeader name={name} sub={sub} />
    </>
  );
};
