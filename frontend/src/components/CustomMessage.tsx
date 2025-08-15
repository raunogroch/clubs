interface messageProps {
  message: string;
  kind: string;
}

export const CustomMessage = ({ message, kind }: messageProps) => {
  return <div className={`alert alert-${kind}`}>{message}</div>;
};
