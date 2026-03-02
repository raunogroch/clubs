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
  // If `src` is an absolute URL already, don't prefix with backendUri.
  const isAbsolute = /^https?:\/\//i.test(src);
  const finalSrc = local || isAbsolute ? src : backendUri + src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
};
