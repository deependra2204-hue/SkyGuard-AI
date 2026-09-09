import React, { useState } from "react";
import Badge from "../common/Badge";
import { explainAnomaly } from "../../utils/mockData";
import { T, STATUS_META, ANOMALY_TYPES } from "../../constants/theme";

const smallBtn = (color) => ({
  fontSize: 11,
  fontWeight: 600,
  padding: "5px 9px",
  borderRadius: 4,
  border: "none",
  background: color,
  color: T.white,
  cursor: "pointer",
});

const smallBtnOutline = {
  fontSize: 11,
  fontWeight: 600,
  padding: "5px 9px",
  borderRadius: 4,
  border: `1px solid ${T.border}`,
  background: T.white,
  color: T.textMuted,
  cursor: "pointer",
};

export default function AlertCenterTab({ stations, acknowledged, onAcknowledge, onSelect, setActiveTab }) {
  const [filter, setFilter] = useState("all");

  const alerts = stations
    .filter((s) => s.status === "anomaly" || s.status === "warning")
    .map((s) => ({
      station: s,
      severity: s.status === "anomaly" ? "Critical" : "Warning",
      status: acknowledged.has(s.id) ? "Acknowledged" : "Open",
    }));

  const categories = ["all", "Critical", "Warning", "Acknowledged"];
  const filtered = alerts.filter((a) => filter === "all" || a.severity === filter || a.status === filter);

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>Alert Center</h1>
          <p style={{ fontSize: 12.5, color: T.textMuted, margin: "4px 0 0" }}>
            All active anomaly and warning alerts across the AWS network.
          </p>
        </div>
        <div className="flex" style={{ gap: 6 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                padding: "6px 11px",
                borderRadius: 14,
                cursor: "pointer",
                border: `1px solid ${filter === c ? T.blue : T.border}`,
                background: filter === c ? T.blueFaint : T.white,
                color: filter === c ? T.blue : T.textMuted,
              }}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: T.textFaint, border: `1px dashed ${T.border}`, borderRadius: 6 }}>
          No alerts match this filter.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(({ station: s, severity, status }) => {
          const meta = STATUS_META[s.status] || STATUS_META.healthy;
          const ex = explainAnomaly(s);
          return (
            <div
              key={s.id}
              style={{
                border: `1px solid ${T.border}`,
                borderLeft: `4px solid ${meta.color}`,
                borderRadius: 6,
                background: T.white,
                padding: 14,
              }}
            >
              <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 8 }}>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <Badge color={meta.color} bg={meta.bg}>
                    {severity.toUpperCase()}
                  </Badge>
                  <span style={{ fontWeight: 700, color: T.text }}>{s.id}</span>
                  <span style={{ fontSize: 12, color: T.textMuted }}>
                    {s.state} · {ANOMALY_TYPES[s.anomalyType]?.label}
                  </span>
                </div>
                <span style={{ fontSize: 11.5, color: T.textFaint }}>{s.lastObservation}</span>
              </div>
              {ex && <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 8, lineHeight: 1.5 }}>{ex.headline}</div>}
              <div className="flex items-center justify-between" style={{ marginTop: 10, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11.5, color: status === "Acknowledged" ? T.green : T.textFaint, fontWeight: 600 }}>
                  Status: {status}
                </span>
                <div className="flex" style={{ gap: 6 }}>
                  <button
                    style={smallBtn(T.blue)}
                    onClick={() => {
                      onSelect(s.id);
                      setActiveTab("dashboard");
                    }}
                  >
                    View Station
                  </button>
                  <button
                    style={smallBtnOutline}
                    onClick={() => onAcknowledge(s.id)}
                    disabled={acknowledged.has(s.id)}
                  >
                    Acknowledge
                  </button>
                  <button style={smallBtnOutline} onClick={() => onAcknowledge(s.id, true)}>
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
