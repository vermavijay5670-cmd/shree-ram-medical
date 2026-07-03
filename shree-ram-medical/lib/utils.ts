import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function discountPercent(mrp: number, price: number) {
  return Math.round((1 - price / mrp) * 100);
}
