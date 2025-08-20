//ScheduleSelector.tsx
interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
}

interface ScheduleSelectorProps {
  selectedScheduleId: string;
  onScheduleChange: (scheduleId: string) => void;
  schedules?: Schedule[];
}

export const ScheduleClubSelector = ({
  selectedScheduleId,
  onScheduleChange,
  schedules = [],
}: ScheduleSelectorProps) => {
  return (
    <div className="form-group row">
      <label htmlFor="schedule" className="col-sm-2 col-form-label">
        Horario
      </label>
      <div className="col-sm-10">
        <select
          id="schedule"
          className="form-control"
          value={selectedScheduleId}
          onChange={(e) => onScheduleChange(e.target.value)}
        >
          <option value="">Seleccione un horario</option>
          {schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {`${schedule.startTime} - ${schedule.endTime}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
