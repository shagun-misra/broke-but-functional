"use client";

import React from "react";
import { Trophy, Skull, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";

interface EndSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  finalBalance: number;
  savingsGoal: number;
  currentDay: number;
  totalDays: number;
  healthScore: number;
}

export const EndSimulationModal: React.FC<EndSimulationModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  finalBalance,
  savingsGoal,
  currentDay,
  totalDays,
  healthScore,
}) => {
  if (!isOpen) return null;

  const isSurvived = finalBalance > 0 && currentDay >= totalDays;
  const isGoalMet = finalBalance >= savingsGoal;

  const getGrade = () => {
    if (!isSurvived) return { letter: "F", label: "Insolvent", color: "text-rose-500 border-rose-500/30 bg-rose-500/10" };
    if (finalBalance >= 3000 && healthScore >= 75) return { letter: "A+", label: "Financial Prodigy", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    if (finalBalance >= savingsGoal) return { letter: "A", label: "Goal Achiever", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    if (finalBalance >= 500) return { letter: "B", label: "Close Survival", color: "text-sky-400 border-sky-500/30 bg-sky-500/10" };
    return { letter: "C", label: "Barely Breathing", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
  };

  const grade = getGrade();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl">
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isSurvived ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"}`}>
            {isSurvived ? (
              <Trophy className="w-8 h-8 text-emerald-400" />
            ) : (
              <Skull className="w-8 h-8 text-rose-400" />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            {isSurvived ? "Month Survived!" : "Budget Depleted"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSurvived
              ? `You navigated all ${totalDays} days on your initial ₹10,000 budget.`
              : `Your runway hit zero on Day ${currentDay}.`}
          </p>
        </div>

        <div className={`inline-block px-5 py-2 rounded-xl border ${grade.color}`}>
          <span className="text-2xl font-black tracking-wide block">{grade.letter}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider">{grade.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Final Cash</span>
            <p className={`text-base font-bold mt-0.5 ${finalBalance <= 0 ? "text-rose-400" : "text-emerald-400"}`}>
              ₹{finalBalance.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Buffer</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isGoalMet ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">Protected</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-400">Breached</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Review Simulation
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Start Again
          </button>
        </div>
      </div>
    </div>
  );
};