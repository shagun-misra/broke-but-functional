"use client";

import React from "react";
import { PieChart, Home, Coffee, RefreshCcw, AlertOctagon } from "lucide-react";
import { Transaction } from "../types/finance";

interface CategoryBreakdownProps {
  transactions: Transaction[];
  totalBudget: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions, totalBudget }) => {
  const expenseTransactions = transactions.filter((t) => t.amount < 0);
  const totalSpent = expenseTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const categories = [
    { key: "Essential", label: "Essentials & Living", icon: Home, color: "bg-sky-500", text: "text-sky-400" },
    { key: "Lifestyle", label: "Lifestyle & Food", icon: Coffee, color: "bg-amber-500", text: "text-amber-400" },
    { key: "Subscription", label: "Recurring Subs", icon: RefreshCcw, color: "bg-purple-500", text: "text-purple-400" },
    { key: "Emergency", label: "Surprise Shocks", icon: AlertOctagon, color: "bg-rose-500", text: "text-rose-400" },
  ] as const;

  const categoryTotals = categories.map((cat) => {
    const amount = expenseTransactions
      .filter((t) => t.category === cat.key)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const percentageOfSpend = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    const percentageOfBudget = Math.round((amount / totalBudget) * 100);
    return { ...cat, amount, percentageOfSpend, percentageOfBudget };
  });

  return (
    <section aria-label="Visual Category Breakdown" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            Budget Burn by Category
          </h2>
          <p className="text-xs text-slate-400">Total debit volume: ₹{totalSpent.toLocaleString()} of ₹{totalBudget.toLocaleString()}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">
          {totalSpent > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% Used` : "0% Used"}
        </span>
      </div>

      <div className="w-full bg-slate-950 h-3 rounded-full flex overflow-hidden border border-slate-800">
        {categoryTotals.map((cat) =>
          cat.percentageOfSpend > 0 ? (
            <div
              key={cat.key}
              className={`${cat.color} transition-all duration-500`}
              style={{ width: `${cat.percentageOfSpend}%` }}
              title={`${cat.label}: ₹${cat.amount} (${cat.percentageOfSpend}%)`}
            />
          ) : null
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {categoryTotals.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${cat.text}`} />
                <span className="text-[11px] font-semibold text-slate-300">{cat.key}</span>
              </div>
              <p className="text-sm font-extrabold text-white">₹{cat.amount.toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">{cat.percentageOfSpend}% of spend</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};