import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateUUID = (): string => uuidv4();
export const generateJoinCode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
export const getCurrentTimestamp = (): string => new Date().toISOString();
