"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingDown } from "lucide-react";
import { ForecastPoint } from "../types/finance";

interface BurnDownChartProps {
  data: ForecastPoint[];
  savingsGoal: number;
}

export const BurnDownChart: React.FC<BurnDownChartProps> = ({ data, savingsGoal }) => {
  return (
    <section aria-label="30-Day Financial Trajectory Forecast" className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            30-Day Burn-Down & Survival Trajectory
          </h2>
          <p className="text-xs text-slate-400">Real-time dynamic balance forecast vs target buffer (₹{savingsGoal}).</p>
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
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
  );
};