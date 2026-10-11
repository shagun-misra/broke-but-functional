"use client";

import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Calendar, 
  RefreshCcw, 
  ShieldCheck, 
  Zap, 
  PlusCircle
} from "lucide-react";

interface Transaction {
  id: string;
  day: number;
  title: string;
  amount: number;
  category: "Essential" | "Lifestyle" | "Emergency" | "Subscription";
}

const INITIAL_BUDGET = 10000;
const TOTAL_DAYS = 30;

const SURPRISE_EVENTS = [
  { title: "Phone screen cracked!", amount: -1500, category: "Emergency" as const },
  { title: "Friend repaid old split bill", amount: 600, category: "Lifestyle" as const },
  { title: "Metro card auto-recharge", amount: -500, category: "Essential" as const },
  { title: "Campus fest pass", amount: -800, category: "Lifestyle" as const },
  { title: "Sold used textbook", amount: 450, category: "Lifestyle" as const },
  { title: "Impulse midnight food delivery", amount: -420, category: "Lifestyle" as const },
  { title: "Emergency medicine & checkup", amount: -750, category: "Emergency" as const },
];

export default function SurviveTheMonth() {
  const [currentDay, setCurrentDay] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", day: 1, title: "PG / Rent Contribution", amount: -3500, category: "Essential" },
    { id: "2", day: 1, title: "Monthly Transit Pass", amount: -800, category: "Essential" },
    { id: "3", day: 1, title: "Spotify + Cloud Storage", amount: -299, category: "Subscription" },
  ]);

  const [simAmount, setSimAmount] = useState<number>(1200);
  const [simTitle, setSimTitle] = useState<string>("Weekend Cafe Hangout");

  const [quickTitle, setQuickTitle] = useState("");
  const [quickAmount, setQuickAmount] = useState("");

  const totalSpent = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
  }, [transactions]);

  const totalGained = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount > 0 ? t.amount : 0), 0);
  }, [transactions]);

  const currentBalance = INITIAL_BUDGET - totalSpent + totalGained;
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);
  const dailyAllowance = Math.max(0, Math.floor(currentBalance / daysRemaining));

  const simBalance = currentBalance - (simAmount || 0);
  const simDailyAllowance = Math.max(0, Math.floor(simBalance / daysRemaining));
  const simDifference = dailyAllowance - simDailyAllowance;

  const healthScore = useMemo(() => {
    if (currentBalance <= 0) return 0;
    const expectedRemainingRatio = daysRemaining / TOTAL_DAYS;
    const actualRemainingRatio = currentBalance / INITIAL_BUDGET;
    const ratio = actualRemainingRatio / expectedRemainingRatio;
    return Math.min(100, Math.max(10, Math.round(ratio * 70)));
  }, [currentBalance, daysRemaining]);

  const riskLevel = 
    currentBalance < 1000 ? "CRITICAL" : 
    dailyAllowance < 150 ? "HIGH" : 
    dailyAllowance < 250 ? "MODERATE" : "STABLE";

  const handleAdvanceDay = () => {
    if (currentDay >= TOTAL_DAYS) return;
    const nextDay = currentDay + 1;
    setCurrentDay(nextDay);

    if (Math.random() < 0.45) {
      const randomEvent = SURPRISE_EVENTS[Math.floor(Math.random() * SURPRISE_EVENTS.length)];
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          day: nextDay,
          title: `[Event] ${randomEvent.title}`,
          amount: randomEvent.amount,
          category: randomEvent.category,
        },
        ...prev,
      ]);
    }
  };

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle || !quickAmount) return;
    const amt = parseFloat(quickAmount);
    if (isNaN(amt) || amt <= 0) return;

    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        day: currentDay,
        title: quickTitle,
        amount: -amt,
        category: "Lifestyle",
      },
      ...prev,
    ]);
    setQuickTitle("");
    setQuickAmount("");
  };

  const handleCommitSimulatedExpense = () => {
    if (simAmount <= 0) return;
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        day: currentDay,
        title: simTitle || "Simulated Decision",
        amount: -simAmount,
        category: "Lifestyle",
      },
      ...prev,
    ]);
  };

  const resetSimulation = () => {
    setCurrentDay(1);
    setTransactions([
      { id: "1", day: 1, title: "PG / Rent Contribution", amount: -3500, category: "Essential" },
      { id: "2", day: 1, title: "Monthly Transit Pass", amount: -800, category: "Essential" },
      { id: "3", day: 1, title: "Spotify + Cloud Storage", amount: -299, category: "Subscription" },
    ]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> ₹10,000 / 30-Day Financial Survival
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Broke But <span className="text-emerald-400">Functional</span>
            </h1>
            <p className="text-sm text-slate-400">
              Interactive financial simulation with predictive impact modeling.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={resetSimulation} 
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 hover:bg-slate-800 transition"
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleAdvanceDay}
              disabled={currentDay >= TOTAL_DAYS || currentBalance <= 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" /> Next Day (Day {currentDay}/30)
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Remaining Balance</span>
            <div className={`text-2xl font-bold mt-1 ${currentBalance < 1500 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{currentBalance.toLocaleString()}
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full ${currentBalance < 1500 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${Math.max(0, Math.min(100, (currentBalance / INITIAL_BUDGET) * 100))}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Daily Safe-To-Spend</span>
            <div className="text-2xl font-bold mt-1 text-sky-400">
              ₹{dailyAllowance} <span className="text-xs font-normal text-slate-400">/ day</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{daysRemaining} days left in month</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Financial Health Score</span>
            <div className="text-2xl font-bold mt-1 text-amber-400 flex items-center gap-2">
              {healthScore}/100
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Target benchmark: &gt;65</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Risk Level</span>
            <div className="text-2xl font-bold mt-1 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-sm ${
                riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Calculated from burn rate</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-amber-400" />
                "What-If" Decision Impact Simulator
              </h2>
              <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-full text-slate-400">Pre-Commit Sandbox</span>
            </div>

            <p className="text-xs text-slate-400">
              Test how a potential splurge affects your survival probability and daily budget before spending.
            </p>

            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div>
                <label className="text-xs font-semibold text-slate-300">Decision / Item Name</label>
                <input 
                  type="text" 
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Simulated Cost</span>
                  <span className="text-emerald-400 font-bold text-sm">₹{simAmount}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="4000" 
                  step="50"
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-xs text-slate-400">Simulated New Balance</span>
                  <p className={`text-lg font-bold ${simBalance < 1000 ? 'text-rose-400' : 'text-slate-200'}`}>
                    ₹{simBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-xs text-slate-400">New Daily Allowance</span>
                  <p className="text-lg font-bold text-amber-400">
                    ₹{simDailyAllowance} / day
                    <span className="text-xs text-rose-400 ml-1">(-₹{simDifference})</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={handleCommitSimulatedExpense}
                disabled={currentBalance - simAmount < 0}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide uppercase transition disabled:opacity-50"
              >
                Commit This Decision to Real Budget
              </button>
            </div>

            <form onSubmit={handleAddCustomExpense} className="pt-2 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">Record Quick Direct Expense</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Expense description (e.g., Momos, printout)"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <input 
                  type="number" 
                  placeholder="₹ Amount"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </form>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Interconnected Ledger</h2>
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-200">{tx.title}</p>
                      <span className="text-[10px] text-slate-500">Day {tx.day} • {tx.category}</span>
                    </div>
                    <span className={`font-bold ${tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Current Forecast</span>
              <p className="text-xs text-slate-300 mt-1">
                {currentBalance <= 0 
                  ? "❌ Bankrupt before Month End! Survival failed." 
                  : currentDay === TOTAL_DAYS 
                  ? "🎉 You survived the month within ₹10,000!" 
                  : `On track to finish Day 30 with ~₹${Math.max(0, currentBalance - (dailyAllowance * (TOTAL_DAYS - currentDay)))} remaining.`}
              </p>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}