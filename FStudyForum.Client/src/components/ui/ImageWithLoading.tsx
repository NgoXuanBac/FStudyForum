import React, { FC } from "react";
import { Icons } from "../Icons";
import { cn } from "@/helpers/utils";

interface Props {
  src: string;
  alt?: string | undefined;
  className?: string;
}

const ImageWithLoading: FC<Props> = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(true);
    };
  }, [src]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn(className, isLoading ? "block" : "hidden")}
        loading="lazy"
      />
      <div
        className={cn(
          "w-full h-full animate-pulse bg-blue-gray-50",
          !isLoading ? "flex" : "hidden"
        )}
      >
        <Icons.picture className="h-10 w-10 text-gray-500 mx-auto my-auto" />
      </div>
    </>
  );
};

export default ImageWithLoading;
