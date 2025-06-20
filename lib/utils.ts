import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cnClasses(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export const minutesToDays = (minutes: number) => minutes / (60 * 24);