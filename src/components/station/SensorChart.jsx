import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ReferenceArea, ReferenceDot, ResponsiveContainer
} from "recharts";
import { T } from "../../constants/theme";

export default function SensorChart({ title, data, unit, color, band }) {
  const anomalyPoint = data?.find((d) => d.anomalous);

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 12, background: T.white }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{title} — last 24 hours</span>
        <div className="flex items-center" style={{ gap: 10, fontSize: 10.5, color: T.textFaint }}>
          <span className="flex items-center" style={{ gap: 3 }}>
            <span style={{ width: 8, height: 8, background: "#D8E4EC", display: "inline-block", borderRadius: 2 }} />
            Normal range
          </span>
          <span className="flex items-center" style={{ gap: 3 }}>
            <span style={{ width: 8, height: 2, background: color, display: "inline-block" }} />
            Observed
          </span>
          {anomalyPoint && (
            <span className="flex items-center" style={{ gap: 3 }}>
              <span style={{ width: 8, height: 8, background: T.red, display: "inline-block", borderRadius: 4 }} />
              Anomalous
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#EEF1F4" vertical={false} />
          <XAxis dataKey="t" tick={{ fontSize: 9.5, fill: T.textFaint }} interval={3} axisLine={{ stroke: T.border }} tickLine={false} />
          <YAxis tick={{ fontSize: 9.5, fill: T.textFaint }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
          <ReferenceArea y1={band[0]} y2={band[1]} fill="#D8E4EC" fillOpacity={0.5} />
          <RTooltip
            contentStyle={{ fontSize: 11.5, borderRadius: 6, border: `1px solid ${T.border}` }}
            formatter={(v, _n, p) => [`${v} ${unit}${p.payload.anomalous ? " (anomaly)" : ""}`, "Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.8}
            dot={false}
            isAnimationActive={true}
            animationDuration={500}
          />
          {anomalyPoint && (
            <ReferenceDot x={anomalyPoint.t} y={anomalyPoint.value} r={5} fill={T.red} stroke="#fff" strokeWidth={1.5} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
