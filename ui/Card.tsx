import React from "react";
import { cn } from "@/lib/utils"; // optional: for merging Tailwind classes easily

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 shadow-md dark:bg-gray-900 dark:border-gray-800",
        className
      )}
      {...props}
    />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      className={cn("p-2", className)}
      {...props}
    />
  );
}
