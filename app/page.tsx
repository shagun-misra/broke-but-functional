"use client";

import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Calendar, 
  RefreshCcw, 
  ShieldCheck, 
  Zap, 
  PlusCircle, 
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  PiggyBank,
  PauseCircle,
  PlayCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface Transaction {
  id: string;
  day: number;
  title: string;
  amount: number;
  category: "Essential" | "Lifestyle" | "Emergency" | "Subscription";
}

interface Subscription {
  id: string;
  title: string;
  cost: number;
  active: boolean;
}

const INITIAL_BUDGET = 10000;
const TOTAL_DAYS = 30;

const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub-1", title: "Spotify + Cloud Storage", cost: 299, active: true },
  { id: "sub-2", title: "OTT Streaming Pass", cost: 499, active: true },
  { id: "sub-3", title: "Campus Gym Membership", cost: 600, active: true },
];

const SURPRISE_EVENTS = [
  { title: "Phone screen cracked! Instant repair fee", amount: -1500, category: "Emergency" as const },
  { title: "Friend repaid old hostel split bill", amount: 650, category: "Lifestyle" as const },
  { title: "Semester textbook resell payout", amount: 450, category: "Lifestyle" as const },
  { title: "Impulse midnight food delivery splurge", amount: -420, category: "Lifestyle" as const },
  { title: "Emergency medicine & consultation", amount: -750, category: "Emergency" as const },
  { title: "Unexpected auto rickshaw surge pricing", amount: -280, category: "Essential" as const },
];

export default function BrokeButFunctional() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [savingsGoal, setSavingsGoal] = useState<number>(1500);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DEFAULT_SUBSCRIPTIONS);
  const [notification, setNotification] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "tx-1", day: 1, title: "PG Accommodation Share", amount: -3500, category: "Essential" },
    { id: "tx-2", day: 1, title: "Monthly Metro Travel Card", amount: -800, category: "Essential" },
    { id: "tx-3", day: 1, title: "Initial Active Subscriptions", amount: -1398, category: "Subscription" },
  ]);

  // Simulator State
  const [simTitle, setSimTitle] = useState<string>("Weekend Cafe & Outing");
  const [simAmount, setSimAmount] = useState<number>(850);

  // Quick Direct Input State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickAmount, setQuickAmount] = useState("");
  const [inputError, setInputError] = useState("");

  // Subscriptions Total
  const activeSubscriptionCost = useMemo(() => {
    return subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0);
  }, [subscriptions]);

  // Financial Computations
  const totalExpenses = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount > 0 ? t.amount : 0), 0);
  }, [transactions]);

  const currentBalance = INITIAL_BUDGET - totalExpenses + totalIncome;
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);
  const dailyAllowance = Math.max(0, Math.floor(currentBalance / daysRemaining));

  // Simulated metrics
  const simBalance = currentBalance - (simAmount || 0);
  const simDailyAllowance = Math.max(0, Math.floor(simBalance / daysRemaining));
  const simDelta = dailyAllowance - simDailyAllowance;

  // Health Score (0 - 100)
  const healthScore = useMemo(() => {
    if (currentBalance <= 0) return 0;
    const daysFraction = daysRemaining / TOTAL_DAYS;
    const balanceFraction = currentBalance / INITIAL_BUDGET;
    const ratio = balanceFraction / (daysFraction || 0.05);
    return Math.min(100, Math.max(5, Math.round(ratio * 65)));
  }, [currentBalance, daysRemaining]);

  const riskAssessment = useMemo(() => {
    if (currentBalance < savingsGoal) return { label: "CRITICAL RISK", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    if (dailyAllowance < 140) return { label: "HIGH VULNERABILITY", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (dailyAllowance < 220) return { label: "MODERATE BUFFER", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
    return { label: "STABLE RUNWAY", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  }, [currentBalance, savingsGoal, dailyAllowance]);

  // Forecast Data Curve for Chart
  const forecastData = useMemo(() => {
    const points = [];
    const stepBurn = Math.max(1, dailyAllowance);
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      if (d < currentDay) {
        points.push({ day: `Day ${d}`, balance: Math.max(0, INITIAL_BUDGET - ((d / currentDay) * totalExpenses)) });
      } else if (d === currentDay) {
        points.push({ day: `Day ${d}`, balance: Math.max(0, currentBalance) });
      } else {
        const projected = Math.max(0, currentBalance - ((d - currentDay) * stepBurn));
        points.push({ day: `Day ${d}`, balance: projected });
      }
    }
    return points;
  }, [currentDay, currentBalance, totalExpenses, dailyAllowance]);

  // Actions
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAdvanceDay = () => {
    if (currentDay >= TOTAL_DAYS) return;
    const next = currentDay + 1;
    setCurrentDay(next);

    // 40% probability of surprise financial shock
    if (Math.random() < 0.40) {
      const shock = SURPRISE_EVENTS[Math.floor(Math.random() * SURPRISE_EVENTS.length)];
      setTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          day: next,
          title: shock.title,
          amount: shock.amount,
          category: shock.category,
        },
        ...prev
      ]);
      notify(`Surprise Event on Day ${next}: ${shock.title}`);
    }
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        const nextState = !sub.active;
        notify(`${nextState ? "Resumed" : "Paused"} ${sub.title} (₹${sub.cost})`);
        return { ...sub, active: nextState };
      }
      return sub;
    }));
  };

  const handleCommitDecision = () => {
    if (simAmount <= 0) return;
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        day: currentDay,
        title: simTitle.trim() || "Simulated Splurge",
        amount: -simAmount,
        category: "Lifestyle",
      },
      ...prev
    ]);
    notify(`Committed ₹${simAmount} expense to balance.`);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");
    const sanitizedTitle = quickTitle.trim().replace(/[<>]/g, "");
    const parsedAmt = parseFloat(quickAmount);

    if (!sanitizedTitle) {
      setInputError("Enter an expense title.");
      return;
    }
    if (isNaN(parsedAmt) || parsedAmt <= 0 || parsedAmt > 10000) {
      setInputError("Enter a valid amount between ₹1 and ₹10,000.");
      return;
    }

    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        day: currentDay,
        title: sanitizedTitle,
        amount: -parsedAmt,
        category: "Lifestyle",
      },
      ...prev
    ]);
    setQuickTitle("");
    setQuickAmount("");
    notify(`Logged ₹${parsedAmt} for ${sanitizedTitle}`);
  };

  const resetAll = () => {
    setCurrentDay(1);
    setSubscriptions(DEFAULT_SUBSCRIPTIONS);
    setTransactions([
      { id: "tx-1", day: 1, title: "PG Accommodation Share", amount: -3500, category: "Essential" },
      { id: "tx-2", day: 1, title: "Monthly Metro Travel Card", amount: -800, category: "Essential" },
      { id: "tx-3", day: 1, title: "Initial Active Subscriptions", amount: -1398, category: "Subscription" },
    ]);
    notify("Simulation reset to Day 1.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Global Toast */}
        {notification && (
          <div role="status" aria-live="polite" className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Gen-Z Financial Resilience Engine • 30 Days @ ₹10,000 Budget
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Broke But <span className="text-emerald-400">Functional</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              High-impact financial scenario simulator: test splurges, freeze recurring subscriptions, and safeguard your emergency threshold.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAll}
              aria-label="Reset simulation"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <RefreshCcw className="w-4 h-4" aria-hidden="true" /> Reset
            </button>
            <button
              onClick={handleAdvanceDay}
              disabled={currentDay >= TOTAL_DAYS || currentBalance <= 0}
              aria-label={`Advance to next day, currently day ${currentDay} of 30`}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" /> Advance Day ({currentDay}/{TOTAL_DAYS})
            </button>
          </div>
        </header>

        {/* Metrics Cards */}
        <section aria-label="Key Financial Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Remaining Balance</span>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${currentBalance < 1500 ? "text-rose-400" : "text-emerald-400"}`}>
              ₹{currentBalance.toLocaleString()}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden" role="progressbar" aria-valuenow={currentBalance} aria-valuemin={0} aria-valuemax={INITIAL_BUDGET}>
              <div 
                className={`h-full transition-all duration-500 ${currentBalance < 1500 ? "bg-rose-500" : "bg-emerald-500"}`} 
                style={{ width: `${Math.max(0, Math.min(100, (currentBalance / INITIAL_BUDGET) * 100))}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Daily Safe-To-Spend</span>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-sky-400">
              ₹{dailyAllowance} <span className="text-xs font-normal text-slate-500">/ day</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{daysRemaining} days remaining</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Financial Health Score</span>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-amber-400 flex items-center gap-2">
              {healthScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
              <ShieldCheck className="w-5 h-5 text-amber-400" aria-hidden="true" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Benchmark: 65+ considered safe</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Risk Assessment</span>
            <div className="mt-2">
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${riskAssessment.color}`}>
                {riskAssessment.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Dynamic risk classification</p>
          </div>
        </section>

        {/* 30-Day Trajectory Forecast Chart */}
        <section aria-label="30-Day Financial Trajectory Forecast" className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                30-Day Burn-Down & Survival Trajectory
              </h2>
              <p className="text-xs text-slate-400">Real-time projection against your ₹{savingsGoal} end-of-month target reserve.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Projected Runway
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <div className="w-3 h-0.5 bg-rose-500" /> Target Buffer (₹{savingsGoal})
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 10000]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", color: "#f8fafc" }} 
                  formatter={(val: any) => [`₹${Math.round(Number(val))}`, "Balance"]}
                />
                <ReferenceLine y={savingsGoal} stroke="#f43f5e" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#balanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">

            {/* WHAT-IF DECISION SIMULATOR */}
            <section aria-label="What-If Decision Simulator" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    "What-If" Decision Simulator
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Test any expenditure impact prior to debiting funds.</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md">
                  Sandbox
                </span>
              </div>

              <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <label htmlFor="sim-title" className="text-xs font-semibold text-slate-300 block mb-1">
                    Planned Expense Scenario
                  </label>
                  <input
                    id="sim-title"
                    type="text"
                    value={simTitle}
                    onChange={(e) => setSimTitle(e.target.value)}
                    placeholder="e.g., Concert ticket, weekend road trip"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <label htmlFor="sim-amount" className="font-semibold text-slate-300">
                      Simulated Expense Amount
                    </label>
                    <span className="font-extrabold text-sm text-emerald-400">₹{simAmount}</span>
                  </div>
                  <input
                    id="sim-amount"
                    type="range"
                    min="50"
                    max="3500"
                    step="50"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    aria-label="Simulated expense cost slider"
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>₹50</span>
                    <span>₹1,750</span>
                    <span>₹3,500</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Projected Balance</span>
                    <p className={`text-base font-bold mt-0.5 ${simBalance < savingsGoal ? "text-rose-400" : "text-slate-200"}`}>
                      ₹{simBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">New Safe Allowance</span>
                    <p className="text-base font-bold text-amber-400 mt-0.5">
                      ₹{simDailyAllowance} <span className="text-xs text-rose-400">(-₹{simDelta}/day)</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCommitDecision}
                  disabled={currentBalance - simAmount < 0}
                  aria-label="Commit simulated expense"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Commit Scenario To Live Ledger
                </button>
              </div>

              {/* Direct Expense Entry Form */}
              <form onSubmit={handleAddExpense} className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Direct Quick Expense</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="Description (e.g., Stationery, Chai)"
                    aria-label="Direct expense description"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    placeholder="₹ Amount"
                    aria-label="Direct expense amount"
                    className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    aria-label="Log direct expense"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" /> Add
                  </button>
                </div>
                {inputError && <p role="alert" className="text-xs text-rose-400">{inputError}</p>}
              </form>
            </section>

            {/* Recurring Commitments & Subscriptions Manager */}
            <section aria-label="Subscription Commitment Manager" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Recurring Commitments</h2>
                  <p className="text-xs text-slate-400">Pause active subscriptions to immediately increase your daily burn runway.</p>
                </div>
                <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                  Active: ₹{activeSubscriptionCost}/mo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{sub.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">₹{sub.cost}/mo</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSubscription(sub.id)}
                      aria-label={`${sub.active ? "Pause" : "Resume"} subscription for ${sub.title}`}
                      className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        sub.active 
                          ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                      }`}
                    >
                      {sub.active ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5" aria-hidden="true" /> Pause
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5" aria-hidden="true" /> Resume
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">

            {/* Savings Goal Reserve */}
            <section aria-label="End of Month Savings Goal" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  Target Savings Buffer
                </h2>
                <span className="text-xs font-extrabold text-emerald-400">₹{savingsGoal}</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="250"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                aria-label="Savings buffer slider"
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Safe Buffer: ₹{savingsGoal}</span>
                <span className={currentBalance >= savingsGoal ? "text-emerald-400" : "text-rose-400"}>
                  {currentBalance >= savingsGoal ? "Goal Protected" : "Buffer Breached"}
                </span>
              </div>
            </section>

            {/* Transaction Ledger */}
            <section aria-label="Interconnected Ledger" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white">Activity Ledger</h2>
                  <span className="text-xs text-slate-500">{transactions.length} records</span>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-slate-200">{tx.title}</p>
                        <span className="text-[10px] text-slate-500">Day {tx.day} • {tx.category}</span>
                      </div>
                      <span className={`font-bold ${tx.amount < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* End of Month Outlook */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">End-of-Month Outlook</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentBalance <= 0 
                    ? "Insolvency reached prior to Day 30. Survival status: Failed."
                    : currentDay === TOTAL_DAYS
                    ? "You successfully survived the entire 30 days within budget."
                    : `Current burn rate allows ~₹${dailyAllowance}/day across ${daysRemaining} days remaining.`}
                </p>
              </div>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
}