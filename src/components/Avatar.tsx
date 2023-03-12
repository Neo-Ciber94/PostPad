import Image from "next/image";
import { PropsWithChildren } from "react";

export interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<PropsWithChildren<AvatarProps>> = ({
  children,
  ...props
}) => {
  const { src, alt, className = "", size = 36 } = props;

  return (
    <div
      className={`relative overflow-hidden rounded-full object-contain ${className}`}
      style={{
        height: size,
        width: size,
      }}
    >
      <Image src={src} alt={alt} fill sizes="100vw" />
    </div>
  );
};

export default Avatar;
