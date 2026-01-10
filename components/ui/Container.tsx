import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export function Container({
  className,
  size = "lg",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-8", {
        "max-w-2xl": size === "sm",
        "max-w-4xl": size === "md",
        "max-w-7xl": size === "lg",
        "max-w-full": size === "xl",
      }, className)}
      {...props}
    />
  );
}
