"use client";

import React from "react";
import { Award, ShieldAlert, Zap, Flame } from "lucide-react";

interface SurvivalBadgesProps {
  currentDay: number;
  healthScore: number;
  balance: number;
  emergencyLocked: boolean;
}

export const SurvivalBadges: React.FC<SurvivalBadgesProps> = ({
  currentDay,
  healthScore,
  balance,
  emergencyLocked,
}) => {
  const badges = [
    {
      id: "b1",
      title: "First Decade",
      desc: "Survive past Day 10",
      active: currentDay >= 10,
      icon: Flame,
    },
    {
      id: "b2",
      title: "Iron Discipline",
      desc: "Health Score >= 65",
      active: healthScore >= 65,
      icon: Award,
    },
    {
      id: "b3",
      title: "Crisis Commander",
      desc: "Crisis Lockdown Engaged",
      active: emergencyLocked,
      icon: ShieldAlert,
    },
    {
      id: "b4",
      title: "Solvency Master",
      desc: "Hold >₹3,000 on Day 20+",
      active: currentDay >= 20 && balance >= 3000,
      icon: Zap,
    },
  ];

  return (
    <section aria-label="Survival Milestone Badges" className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          Milestone Achievements ({badges.filter(b => b.active).length}/4 Unlocked)
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-2.5 rounded-lg border transition ${
                b.active
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-500 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${b.active ? "text-emerald-400" : "text-slate-600"}`} />
                <span className="text-xs font-bold">{b.title}</span>
              </div>
              <p className="text-[10px] mt-1 text-slate-400">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};