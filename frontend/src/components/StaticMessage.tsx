export const StaticMessage = ({
  message,
  type = "info",
}: {
  message: string;
  type?: "info" | "success" | "warning" | "danger";
}) => {
  const typeClass = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    danger: "alert-danger",
  }[type];

  return (
    <div className={`alert ${typeClass}`} role="alert">
      {message}
    </div>
  );
};
