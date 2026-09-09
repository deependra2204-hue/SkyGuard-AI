import React from "react";
import { ListChecks, CheckCircle2, XCircle } from "lucide-react";
import StatusDot from "../common/StatusDot";
import { rng } from "../../utils/mockData";
import { T } from "../../constants/theme";

export default function EventValidation({ station, neighbors = [] }) {
  if (!station || station.status !== "anomaly") return null;
  const genuine = station.anomalySource === "genuine_weather";
  const checks = genuine
    ? [
        "Multiple nearby stations show similar changes",
        "Pressure trend consistent across the region",
        "Temperature trend consistent across the region",
        "Humidity response consistent with rainfall onset",
      ]
    : [
        "Only this station shows the change",
        "Other sensor parameters remain unchanged",
        "Pattern inconsistent with surrounding stations",
        "No corroborating signal within 100 km radius",
      ];

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16 }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
        <ListChecks size={16} color={T.blue} />
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>EVENT VALIDATION</span>
      </div>
      <div className="flex" style={{ gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {checks.map((c) => (
              <li key={c} className="flex items-start" style={{ gap: 8, fontSize: 12.5, color: T.textMuted, marginBottom: 7 }}>
                {genuine ? (
                  <CheckCircle2 size={14} color={T.green} style={{ marginTop: 1, flexShrink: 0 }} />
                ) : (
                  <XCircle size={14} color={T.red} style={{ marginTop: 1, flexShrink: 0 }} />
                )}
                {c}
              </li>
            ))}
          </ul>
          <div
            style={{
              marginTop: 4,
              padding: "8px 12px",
              borderRadius: 5,
              fontWeight: 700,
              fontSize: 12.5,
              background: genuine ? T.greenBg : T.redBg,
              color: genuine ? T.green : T.red,
              display: "inline-block",
            }}
          >
            RESULT: {genuine ? "Likely genuine weather event" : "Likely sensor fault"}
          </div>
        </div>
        <div style={{ flex: "1 1 200px", fontSize: 12, color: T.textMuted }}>
          <div style={{ fontWeight: 600, color: T.text, marginBottom: 6 }}>Nearby stations compared</div>
          {neighbors.map((n) => (
            <div key={n.id} className="flex items-center justify-between" style={{ padding: "4px 0", borderBottom: `1px solid ${T.border}` }}>
              <span>{n.id}</span>
              <span className="flex items-center" style={{ gap: 4 }}>
                <StatusDot status={genuine ? (rng() > 0.4 ? "warning" : "healthy") : "healthy"} size={6} />
                {genuine ? "Correlated change" : "No change"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
