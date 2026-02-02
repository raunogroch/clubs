import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";

export const ScheduleCoach = ({ name }: pageParamProps) => {
  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        Aqui va el calendario de entrenadores
      </div>
    </>
  );
};
