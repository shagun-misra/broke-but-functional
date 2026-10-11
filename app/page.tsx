"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  Sparkles, 
  Calendar, 
  RefreshCcw, 
  ShieldCheck, 
  Zap, 
  PlusCircle, 
  PiggyBank, 
  PauseCircle, 
  PlayCircle, 
  ShieldAlert, 
  Download, 
  CheckCircle2 
} from "lucide-react";

import { Transaction, Subscription } from "../types/finance";
import { 
  INITIAL_BUDGET, 
  TOTAL_DAYS, 
  DEFAULT_SUBSCRIPTIONS, 
  SURPRISE_EVENTS, 
  calculateHealthScore, 
  assessRiskLevel 
} from "../lib/simulation";
import { SurvivalBadges } from "../components/SurvivalBadges";

const BurnDownChart = dynamic(
  () => import("../components/BurnDownChart").then((mod) => mod.BurnDownChart),
  { ssr: false, loading: () => <div className="h-56 w-full bg-slate-900/60 rounded-xl animate-pulse" /> }
);

export default function BrokeButFunctional() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [savingsGoal, setSavingsGoal] = useState<number>(1500);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DEFAULT_SUBSCRIPTIONS);
  const [notification, setNotification] = useState<string | null>(null);
  const [crisisModeActive, setCrisisModeActive] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "tx-1", day: 1, title: "PG Accommodation Share", amount: -3500, category: "Essential" },
    { id: "tx-2", day: 1, title: "Monthly Metro Travel Card", amount: -800, category: "Essential" },
    { id: "tx-3", day: 1, title: "Recurring Active Subscriptions", amount: -1398, category: "Subscription" },
  ]);

  const [simTitle, setSimTitle] = useState<string>("Weekend Outing Splurge");
  const [simAmount, setSimAmount] = useState<number>(850);

  const [quickTitle, setQuickTitle] = useState("");
  const [quickAmount, setQuickAmount] = useState("");
  const [inputError, setInputError] = useState("");

  const activeSubscriptionCost = useMemo(() => {
    return subscriptions.filter(s => s.active).reduce((sum, s) => sum + s.cost, 0);
  }, [subscriptions]);

  const totalExpenses = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount > 0 ? t.amount : 0), 0);
  }, [transactions]);

  const currentBalance = INITIAL_BUDGET - totalExpenses + totalIncome;
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);
  const dailyAllowance = Math.max(0, Math.floor(currentBalance / daysRemaining));

  const simBalance = currentBalance - (simAmount || 0);
  const simDailyAllowance = Math.max(0, Math.floor(simBalance / daysRemaining));
  const simDelta = dailyAllowance - simDailyAllowance;

  const healthScore = useMemo(() => {
    return calculateHealthScore(currentBalance, daysRemaining);
  }, [currentBalance, daysRemaining]);

  const riskAssessment = useMemo(() => {
    return assessRiskLevel(currentBalance, savingsGoal, dailyAllowance);
  }, [currentBalance, savingsGoal, dailyAllowance]);

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

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleCrisisProtocol = () => {
    if (!crisisModeActive) {
      setSubscriptions(prev => prev.map(s => ({ ...s, active: false })));
      setCrisisModeActive(true);
      notify("CRISIS PROTOCOL ENGAGED: All recurring subscriptions paused to preserve runway.");
    } else {
      setSubscriptions(DEFAULT_SUBSCRIPTIONS);
      setCrisisModeActive(false);
      notify("CRISIS PROTOCOL DISENGAGED: Subscriptions restored to standard baseline.");
    }
  };

  const exportAuditLog = () => {
    const data = {
      simulationDate: new Date().toISOString(),
      currentDay,
      balance: currentBalance,
      healthScore,
      dailyAllowance,
      savingsGoal,
      activeSubscriptions: subscriptions.filter(s => s.active),
      transactions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-simulation-day-${currentDay}.json`;
    a.click();
    notify("Simulation ledger successfully exported as JSON.");
  };

  const handleAdvanceDay = () => {
    if (currentDay >= TOTAL_DAYS) return;
    const next = currentDay + 1;
    setCurrentDay(next);

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
        notify(`${nextState ? "Resumed" : "Paused"} ${sub.title}`);
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
    notify(`Committed ₹${simAmount} expense to ledger.`);
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
      setInputError("Enter an amount between ₹1 and ₹10,000.");
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
    notify(`Recorded ₹${parsedAmt} for ${sanitizedTitle}`);
  };

  const resetAll = () => {
    setCurrentDay(1);
    setCrisisModeActive(false);
    setSubscriptions(DEFAULT_SUBSCRIPTIONS);
    setTransactions([
      { id: "tx-1", day: 1, title: "PG Accommodation Share", amount: -3500, category: "Essential" },
      { id: "tx-2", day: 1, title: "Monthly Metro Travel Card", amount: -800, category: "Essential" },
      { id: "tx-3", day: 1, title: "Recurring Active Subscriptions", amount: -1398, category: "Subscription" },
    ]);
    notify("Simulation reset to Day 1.");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">

        {notification && (
          <div role="status" aria-live="polite" className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={toggleCrisisProtocol}
              aria-label="Toggle Emergency Crisis Lockdown"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition ${
                crisisModeActive 
                  ? "bg-rose-500 text-white border-rose-400 animate-pulse" 
                  : "bg-slate-900 hover:bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}
            >
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              {crisisModeActive ? "Crisis Lockdown: ON" : "Crisis Protocol"}
            </button>
            <button
              onClick={exportAuditLog}
              aria-label="Export Financial Audit Log as JSON"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> Export Log
            </button>
            <button
              onClick={resetAll}
              aria-label="Reset simulation"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <RefreshCcw className="w-4 h-4" aria-hidden="true" /> Reset
            </button>
            <button
              onClick={handleAdvanceDay}
              disabled={currentDay >= TOTAL_DAYS || currentBalance <= 0}
              aria-label={`Advance to next day, currently day ${currentDay} of 30`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" /> Advance Day ({currentDay}/{TOTAL_DAYS})
            </button>
          </div>
        </header>

        <SurvivalBadges 
          currentDay={currentDay} 
          healthScore={healthScore} 
          balance={currentBalance} 
          emergencyLocked={crisisModeActive} 
        />

        <section aria-label="Key Financial Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Remaining Balance</span>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${currentBalance < savingsGoal ? "text-rose-400" : "text-emerald-400"}`}>
              ₹{currentBalance.toLocaleString()}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden" role="progressbar" aria-valuenow={currentBalance} aria-valuemin={0} aria-valuemax={INITIAL_BUDGET}>
              <div 
                className={`h-full transition-all duration-500 ${currentBalance < savingsGoal ? "bg-rose-500" : "bg-emerald-500"}`} 
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
            <p className="text-xs text-slate-400 mt-2">Target benchmark: &gt;65</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Risk Assessment</span>
            <div className="mt-2">
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${riskAssessment.color}`}>
                {riskAssessment.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 truncate" title={riskAssessment.description}>{riskAssessment.description}</p>
          </div>
        </section>

        <BurnDownChart data={forecastData} savingsGoal={savingsGoal} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-7 space-y-6">

            <section aria-label="What-If Decision Simulator" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    "What-If" Decision Simulator
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Test expenditure impact before debiting actual funds.</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md">
                  Pre-Commit Sandbox
                </span>
              </div>

              <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <label htmlFor="sim-title" className="text-xs font-semibold text-slate-300 block mb-1">
                    Planned Scenario Title
                  </label>
                  <input
                    id="sim-title"
                    type="text"
                    value={simTitle}
                    onChange={(e) => setSimTitle(e.target.value)}
                    placeholder="e.g., Concert pass, cafe weekend hangout"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <label htmlFor="sim-amount" className="font-semibold text-slate-300">
                      Simulated Expense Cost
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
                    <span className="text-[11px] text-slate-400 block">Simulated Balance</span>
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
                  Commit This Decision to Real Budget
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Record Quick Direct Expense</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="Expense title (e.g., Momos, printout)"
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

            <section aria-label="Subscription Commitment Manager" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Subscription Commitments</h2>
                  <p className="text-xs text-slate-400">Pause active services to instantly increase your daily survival allowance.</p>
                </div>
                <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                  Active Total: ₹{activeSubscriptionCost}/mo
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

          <div className="lg:col-span-5 space-y-6">

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
                <span>Safe Threshold: ₹{savingsGoal}</span>
                <span className={currentBalance >= savingsGoal ? "text-emerald-400" : "text-rose-400"}>
                  {currentBalance >= savingsGoal ? "Goal Protected" : "Buffer Breached"}
                </span>
              </div>
            </section>

            <section aria-label="Interconnected Ledger" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white">Interconnected Ledger</h2>
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

              <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Current Forecast</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentBalance <= 0 
                    ? "Insolvency reached prior to Day 30. Survival status: Failed."
                    : currentDay === TOTAL_DAYS
                    ? "Congratulations! You completed the 30-day simulation within budget."
                    : `On track to finish Day 30 with ~₹${Math.max(0, currentBalance - (dailyAllowance * (daysRemaining - 1)))} remaining buffer.`}
                </p>
              </div>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
}