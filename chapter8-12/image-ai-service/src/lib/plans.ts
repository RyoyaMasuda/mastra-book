import { haiku, sonnet } from "./bedrock";
export const PLANS = {
  free: { label: "Free", monthlyTokenLimit: 10000 },
  pro: { label: "Pro", monthlyTokenLimit: 500000 },
} as const;

export const PLAN_MODELS = {
  free: haiku,
  pro: sonnet,
} as const;

export const PLAN_IMAGE_MODELS = {
  free: "stability.stable-image-core-v1:1",
  pro: "stability.stable-image-ultra-v1:1",
} as const;

export type Plan = keyof typeof PLANS;

export function getMonthlyTokenLimit(plan: Plan): number {
  return PLANS[plan].monthlyTokenLimit;
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
