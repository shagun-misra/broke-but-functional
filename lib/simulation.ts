import { Subscription, RiskStatus } from "../types/finance";

export const INITIAL_BUDGET = 10000;
export const TOTAL_DAYS = 30;

export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub-1", title: "Spotify + Cloud Storage", cost: 299, active: true },
  { id: "sub-2", title: "OTT Streaming Pass", cost: 499, active: true },
  { id: "sub-3", title: "Campus Gym Membership", cost: 600, active: true },
];

export const SURPRISE_EVENTS = [
  { title: "Phone screen cracked! Urgent repair fee", amount: -1500, category: "Emergency" as const },
  { title: "Friend settled old hostel bill split", amount: 650, category: "Lifestyle" as const },
  { title: "Semester textbook resale cash payout", amount: 450, category: "Lifestyle" as const },
  { title: "Impulse midnight delivery food splurge", amount: -420, category: "Lifestyle" as const },
  { title: "Emergency medical prescription & clinic fee", amount: -750, category: "Emergency" as const },
  { title: "Late evening ride-hail dynamic surge pricing", amount: -280, category: "Essential" as const },
];

export function calculateHealthScore(balance: number, daysRemaining: number): number {
  if (balance <= 0) return 0;
  const daysFraction = daysRemaining / TOTAL_DAYS;
  const balanceFraction = balance / INITIAL_BUDGET;
  const ratio = balanceFraction / (daysFraction || 0.05);
  return Math.min(100, Math.max(5, Math.round(ratio * 65)));
}

export function assessRiskLevel(balance: number, savingsGoal: number, dailyAllowance: number): RiskStatus {
  if (balance < savingsGoal) {
    return {
      label: "CRITICAL BREACH",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      description: "Balance is below your designated end-of-month savings goal reserve."
    };
  }
  if (dailyAllowance < 140) {
    return {
      label: "HIGH VULNERABILITY",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      description: "Severe spending pressure: emergency expense could induce insolvency."
    };
  }
  if (dailyAllowance < 220) {
    return {
      label: "MODERATE BUFFER",
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      description: "Spend rate is acceptable but provides limited margin for luxury."
    };
  }
  return {
    label: "STABLE RUNWAY",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description: "Financially secure: daily pace easily clears target buffer."
  };
}