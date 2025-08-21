interface Schedule {
  _id: string;
  startTime: string;
  endTime: string;
}

interface ScheduleSelectorProps {
  selectedScheduleId: string;
  onScheduleChange: (scheduleId: string) => void;
  errors: string;
  schedules?: Schedule[];
}

export const ScheduleClubSelector = ({
  selectedScheduleId,
  onScheduleChange,
  errors,
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
          className={`form-control${errors ? " is-invalid" : ""}`}
          value={selectedScheduleId}
          onChange={(e) => onScheduleChange(e.target.value)}
        >
          <option value="">Seleccione un horario</option>
          {schedules.map((schedule) => (
            <option key={schedule._id} value={schedule._id}>
              {`${schedule.startTime} - ${schedule.endTime}`}
            </option>
          ))}
        </select>
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};
