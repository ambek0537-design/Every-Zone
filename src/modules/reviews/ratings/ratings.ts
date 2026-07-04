export const RATING_SCALE = {
  1: { score: 1, labelEn: "Very Poor", labelAm: "በጣም ደካማ" },
  2: { score: 2, labelEn: "Poor", labelAm: "ደካማ" },
  3: { score: 3, labelEn: "Average", labelAm: "መካከለኛ" },
  4: { score: 4, labelEn: "Good", labelAm: "ጥሩ" },
  5: { score: 5, labelEn: "Excellent", labelAm: "በጣም ጥሩ" }
} as const;

export function getRatingLabel(score: number, lang: "en" | "am" = "en"): string {
  const rounded = Math.min(5, Math.max(1, Math.round(score))) as 1 | 2 | 3 | 4 | 5;
  const rating = RATING_SCALE[rounded];
  return lang === "am" ? rating.labelAm : rating.labelEn;
}
