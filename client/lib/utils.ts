import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind styling utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Live Backend Connection
// Replace any local localhost:10000 references with this:
export const API_BASE_URL = "https://server-main-h3qo.onrender.com/api";
