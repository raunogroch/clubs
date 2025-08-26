interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Image = ({ src, alt = "", className, style }: ImageProps) => {
  return <img src={src} alt={alt} className={className} style={style} />;
};
