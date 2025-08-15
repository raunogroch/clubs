import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const Dashboard = ({ name }: pageParamProps) => {
  return (
    <>
      <NavHeader name={name} />
    </>
  );
};
