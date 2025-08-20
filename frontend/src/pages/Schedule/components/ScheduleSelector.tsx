interface UserRoleSelectorProps {
  startTime: string;
  endTime: string;
  onScheduleChange: (schedule: { startTime: string; endTime: string }) => void;
}

export const ScheduleSelector = ({
  startTime,
  endTime,
  onScheduleChange,
}: UserRoleSelectorProps) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Horario</label>
      <div className="col-sm-5">
        <input
          type="time"
          className="form-control"
          value={startTime}
          onChange={(e) =>
            onScheduleChange({ startTime: e.target.value, endTime })
          }
        />
      </div>
      <div className="col-sm-5">
        <input
          type="time"
          className="form-control"
          value={endTime}
          onChange={(e) =>
            onScheduleChange({ startTime, endTime: e.target.value })
          }
        />
      </div>
    </div>
  );
};
