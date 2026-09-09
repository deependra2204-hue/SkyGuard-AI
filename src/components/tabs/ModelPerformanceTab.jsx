import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip
} from "recharts";
import { Info } from "lucide-react";
import { T } from "../../constants/theme";

export default function ModelPerformanceTab() {
  const kpis = [
    { label: "Precision", value: "94.2%" },
    { label: "Recall", value: "91.6%" },
    { label: "False Positive Rate", value: "0.14%" },
    { label: "F1 Score", value: "92.9%" },
  ];

  const breakdown = [
    { label: "Normal Readings", value: 8600, color: T.green },
    { label: "Injected Faults", value: 214, color: T.saffron },
    { label: "Correctly Detected", value: 196, color: T.blue },
    { label: "False Positives", value: 12, color: T.amber },
    { label: "Missed Anomalies", value: 18, color: T.red },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>Model Performance</h1>
      <p style={{ fontSize: 12.5, color: T.textMuted, margin: "4px 0 6px" }}>
        Isolation Forest anomaly-detection model evaluated on temperature, pressure and humidity streams.
      </p>
      <div
        style={{
          fontSize: 11.5,
          color: T.amber,
          background: T.amberBg,
          border: `1px solid ${T.amber}33`,
          borderRadius: 5,
          padding: "8px 12px",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 16,
        }}
      >
        <Info size={13} /> Performance metrics shown are based on the prototype evaluation dataset.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              background: T.white,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: T.navy }}>{k.value}</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Evaluation Breakdown</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={breakdown} layout="vertical" margin={{ left: 30, right: 20 }}>
            <CartesianGrid stroke="#EEF1F4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10.5, fill: T.textFaint }} axisLine={{ stroke: T.border }} tickLine={false} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 11.5, fill: T.textMuted }} width={140} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={{ fontSize: 11.5, borderRadius: 6, border: `1px solid ${T.border}` }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill={T.blue} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
