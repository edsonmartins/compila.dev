import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
}

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6",
        {
          "bg-white dark:bg-dark-card": variant === "default",
          "border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-card": variant === "bordered",
          "border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-card shadow-sm": variant === "elevated",
        },
        className
      )}
      {...props}
    />
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-neutral-dark dark:text-dark-muted", className)} {...props} />
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("pt-4", className)} {...props} />;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn("flex items-center pt-4", className)} {...props} />;
}
