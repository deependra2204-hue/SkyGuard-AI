import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Sparkline from "./Sparkline";
import { T } from "../../constants/theme";

export default function MetricCard({ icon: Icon, label, value, unit, prev, spark, color }) {
  const change = prev !== undefined && prev !== null ? ((value - prev) / (Math.abs(prev) || 1)) * 100 : null;

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 12, background: T.white }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 6, color: T.textMuted, fontSize: 12 }}>
          {Icon && <Icon size={14} color={color} />} {label}
        </div>
        {change !== null && (
          <span
            className="flex items-center"
            style={{
              gap: 2,
              fontSize: 11,
              color: change >= 0 ? T.green : T.red,
              fontWeight: 600,
            }}
          >
            {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginTop: 6 }}>
        {typeof value === "number" ? value.toFixed(1) : value}
        <span style={{ fontSize: 13, fontWeight: 500, color: T.textFaint }}> {unit}</span>
      </div>
      {spark && (
        <div style={{ marginTop: 6 }}>
          <Sparkline data={spark} color={color} />
        </div>
      )}
    </div>
  );
}
