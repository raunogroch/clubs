const backendUri = import.meta.env.VITE_BACKEND_URI;

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
}: ImageProp & React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src={local ? src : backendUri + src}
    alt={alt}
    className={className}
    style={style}
    {...props}
  />
);
