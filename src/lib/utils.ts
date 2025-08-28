import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge tailwind classes intelligently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get a readable text color (#111 or #fff) for a given background.
 * Simple luminance check is enough for our banner previews.
 */
export function getContrastColor(hex: string): string {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111" : "#fff";
}

// Character limits for automatic fitting
const HEADLINE_LIMITS: Record<string, number> = {
  "300x250": 36,
  "320x50": 18,
  "728x90": 28,
};

/**
 * Ensure headline fits allowed length; reduces font size up to -3px
 * and truncates if still too long. Returns adjusted text and font delta.
 */
export function autoFitHeadline(size: string, text: string): {
  text: string;
  adjust: number;
} {
  const limit = HEADLINE_LIMITS[size];
  let adjust = 0;
  let final = text;

  if (limit && final.length > limit) {
    while (final.length > limit && adjust > -3) {
      adjust -= 1;
    }
    if (final.length > limit) {
      final = final.slice(0, limit);
    }
  }

  return { text: final, adjust };
}

/**
 * Simple helper to limit sub text length using same algorithm.
 */
export function autoFitSub(size: string, text: string): string {
  const limit = HEADLINE_LIMITS[size] ? Math.round(HEADLINE_LIMITS[size] * 0.8) : text.length;
  if (text.length > limit) {
    return text.slice(0, limit);
  }
  return text;
}

