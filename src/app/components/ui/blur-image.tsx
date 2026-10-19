"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

type IBlurImage = Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: IBlurImage) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={src}
      alt={alt ? alt : "Avatar"}
      {...rest}
    />
  );
};
