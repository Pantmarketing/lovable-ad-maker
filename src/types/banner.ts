export type BannerSize = "300x250" | "320x50" | "728x90" | "300x600" | "160x600" | "970x250" | string;

export interface PlannerInput {
  nicho: string;
  proposta: string;
  tom: string; // ex.: "direto", "amigável", "premium"
  tamanhos: BannerSize[];
  paletaPreferida?: { primary?: string; secondary?: string; bg?: string };
  clickTag: string;
}

export interface PlannerOutput {
  copy: { headline: string; sub?: string; cta: string };
  palette: { primary: string; secondary: string; bg: string; contrast_ok: boolean };
  sizes_overrides: Record<BannerSize, { hide_sub?: boolean; headline_max_chars?: number; cta_compact?: boolean }>;
  policy_notes: string[];
  clickTag: string;
}

export interface PolicyOutput {
  approved: boolean;
  flags: string[];
  suggestions: Partial<PlannerOutput["copy"]>;
}

export interface BuildInput {
  width: number;
  height: number;
  headline: string;
  sub?: string;
  cta: string;
  palette: { primary: string; secondary: string; bg: string };
  clickTag: string;
  overrides?: { hide_sub?: boolean; cta_compact?: boolean };
}

export const STANDARD_BANNER_SIZES: { size: BannerSize; name: string; category: string }[] = [
  { size: "300x250", name: "Medium Rectangle", category: "Popular" },
  { size: "728x90", name: "Leaderboard", category: "Popular" },
  { size: "320x50", name: "Mobile Banner", category: "Mobile" },
  { size: "300x600", name: "Half Page", category: "Sidebar" },
  { size: "160x600", name: "Wide Skyscraper", category: "Sidebar" },
  { size: "970x250", name: "Billboard", category: "Large Format" },
];

export const TONE_OPTIONS = [
  { value: "direto", label: "Direto", description: "Tom objetivo e claro" },
  { value: "amigável", label: "Amigável", description: "Tom casual e próximo" },
  { value: "premium", label: "Premium", description: "Tom sofisticado e elegante" },
  { value: "urgente", label: "Urgente", description: "Tom de scarcidade e ação" },
  { value: "educativo", label: "Educativo", description: "Tom informativo e útil" },
];

export const COLOR_PRESETS = [
  { name: "Tecnologia", primary: "#6366f1", secondary: "#8b5cf6", bg: "#f8fafc" },
  { name: "Saúde", primary: "#10b981", secondary: "#06b6d4", bg: "#f0fdf4" },
  { name: "Finanças", primary: "#3b82f6", secondary: "#1d4ed8", bg: "#eff6ff" },
  { name: "E-commerce", primary: "#f59e0b", secondary: "#ef4444", bg: "#fffbeb" },
  { name: "Educação", primary: "#8b5cf6", secondary: "#ec4899", bg: "#faf5ff" },
  { name: "Alimentação", primary: "#ef4444", secondary: "#f97316", bg: "#fef2f2" },
];