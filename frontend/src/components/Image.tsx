export const Image = ({
  src,
  alt,
  ...props
}: {
  src: string;
  alt?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt={alt || "Image"} {...props} />
);
