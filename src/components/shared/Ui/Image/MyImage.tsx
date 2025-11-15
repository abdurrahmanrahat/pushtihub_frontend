import Image, { StaticImageData } from "next/image";

type TMyImageProps = {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
};

const MyImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
}: TMyImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
    />
  );
};

export default MyImage;
