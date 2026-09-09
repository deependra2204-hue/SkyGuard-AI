import React from "react";
import CountUp from "../common/CountUp";
import { T } from "../../constants/theme";

export default function InfoBar({ stats, reduceMotion, lastSync }) {
  const items = [
    { label: "Total Stations", value: stats.total, color: T.text },
    { label: "Healthy", value: stats.healthy, color: T.green },
    { label: "Warnings", value: stats.warning, color: T.amber },
    { label: "Anomalies", value: stats.anomaly, color: T.red },
    { label: "Offline", value: stats.offline, color: T.grey },
  ];

  return (
    <div style={{ background: T.white, borderBottom: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between" style={{ padding: "10px 24px", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textFaint, letterSpacing: 0.6 }}>
            AUTOMATIC WEATHER STATION NETWORK
          </div>
          <div style={{ fontSize: 13.5, color: T.textMuted }}>
            Real-time sensor quality monitoring across India
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 26, flexWrap: "wrap" }}>
          {items.map((it) => (
            <div key={it.label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: it.color, fontVariantNumeric: "tabular-nums" }}>
                <CountUp value={it.value} reduceMotion={reduceMotion} />
              </div>
              <div style={{ fontSize: 11, color: T.textFaint }}>{it.label}</div>
            </div>
          ))}
          <div style={{ textAlign: "right", borderLeft: `1px solid ${T.border}`, paddingLeft: 20 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>
              {lastSync} IST
            </div>
            <div style={{ fontSize: 11, color: T.textFaint }}>Last Sync</div>
          </div>
        </div>
      </div>
    </div>
  );
}
