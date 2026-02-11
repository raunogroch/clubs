export const Button = ({
  type = "button" as const,
  variant = "primary",
  className,
  disabled = false,
  onClick,
  icon,
  children,
  hidden = false,
  title,
  form,
}: {
  type?: "button" | "submit" | "reset";
  variant?: string;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: string;
  children?: React.ReactNode;
  hidden?: boolean;
  title?: string;
  form?: string;
}) => {
  if (hidden) return null;
  const classes: string[] = ["btn"];
  // If caller already provides a btn- class, don't add variant
  if (!className || !/\bbtn-/.test(className)) {
    classes.push(`btn-${variant}`);
  }
  if (className) classes.push(className);

  return (
    <button
      type={type}
      className={classes.join(" ")}
      onClick={onClick}
      disabled={disabled}
      {...(title ? { title } : {})}
      {...(form ? { form } : {})}
    >
      {icon && (
        <i className={`fa ${icon}`} style={{ marginRight: children ? 8 : 0 }} />
      )}

      {children}
    </button>
  );
};
