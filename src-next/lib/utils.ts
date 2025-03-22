import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values using clsx and twMerge
 * Safely handles conditional and dynamic classes
 * Optimized for Tailwind v4 compatibility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
