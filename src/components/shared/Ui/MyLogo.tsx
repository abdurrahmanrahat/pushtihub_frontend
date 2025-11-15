"use client";

import { ThemeContext } from "@/contexts/ThemeContext";
import { IMAGES } from "@/image-data";
import Image from "next/image";
import { useContext } from "react";

const MyLogo = ({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Image
      src={theme === "light" ? IMAGES.shared.Logo : IMAGES.shared.LogoWhite}
      alt="Logo"
      width={width}
      height={height}
      className={`object-cover ${className}`}
    />
  );
};

export default MyLogo;
