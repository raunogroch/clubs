/**
 * ScheduleParent Page - Clean, organized component
 * Shows parent's children schedules in a calendar view
 */

import React from "react";
import { NavHeader } from "../components/NavHeader";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { ProCalendar } from "./schedule/components/ProCalendar";
import { useParentSchedules } from "./schedule/hooks/useParentSchedules";
import Ibox from "../components/Ibox";

export const ScheduleParent: React.FC<pageParamProps> = ({ name }) => {
  const { groups, loading, error } = useParentSchedules();

  return (
    <>
      <NavHeader name={name} />
      <div className="wrapper wrapper-content">
        <div className="px-0">
          {loading && (
            <div className="alert alert-info">
              <p>Cargando horarios...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && groups.length === 0 && (
            <div className="alert alert-warning">
              <p>No se encontraron horarios para tus atletas.</p>
            </div>
          )}

          {!loading && groups.length > 0 && (
            <Ibox title="Horario de tus atletas">
              <ProCalendar groups={groups} />
            </Ibox>
          )}
        </div>
      </div>
    </>
  );
};
