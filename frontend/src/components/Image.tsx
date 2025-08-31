interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}
const backendUri = import.meta.env.VITE_BACKEND_URI;
export const Image = ({ src, alt = "", className, style }: ImageProps) => {
  return (
    <img
      src={`${backendUri}${src}`}
      alt={alt}
      className={className}
      style={style}
    />
  );
};
