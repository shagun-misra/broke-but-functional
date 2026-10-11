export type ExpenseCategory = "Essential" | "Lifestyle" | "Emergency" | "Subscription";

export interface Transaction {
  id: string;
  day: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
}

export interface Subscription {
  id: string;
  title: string;
  cost: number;
  active: boolean;
}

export interface RiskStatus {
  label: string;
  color: string;
  description: string;
}

export interface ForecastPoint {
  day: string;
  balance: number;
}

export interface SurvivalBadge {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  iconName: string;
}