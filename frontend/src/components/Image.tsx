const backendUri = import.meta.env.VITE_IMAGE_PROCESSOR_API;

interface ImageProp {
  src: string;
  alt: string;
  local?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Image = ({
  src,
  alt,
  local = false,
  className,
  style,
  ...props
}: ImageProp) => {
  return (
    <img
      src={local ? src : backendUri + src}
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
};
