import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getAuthenticatedUserId(headers: Headers): Promise<string | null> {
  return headers.get('x-user-id');
}
