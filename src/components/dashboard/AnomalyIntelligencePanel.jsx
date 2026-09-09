import React from "react";
import { Activity } from "lucide-react";
import Badge from "../common/Badge";
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

export default function AnomalyIntelligencePanel({ stations, onSelect, onAcknowledge, acknowledged }) {
  const flagged = stations
    .filter((s) => s.status === "anomaly" || s.status === "warning")
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  return (
    <div
      style={{
        width: 320,
        flexShrink: 0,
        borderLeft: `1px solid ${T.border}`,
        background: T.white,
        display: "flex",
        flexDirection: "column",
      }}
      aria-label="AI anomaly intelligence"
    >
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <Activity size={15} color={T.blue} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text, letterSpacing: 0.3 }}>
            AI ANOMALY INTELLIGENCE
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: T.textFaint, marginTop: 2 }}>
          Latest detections, ranked by confidence
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "10px 12px" }}>
        {flagged.length === 0 && (
          <div style={{ fontSize: 12.5, color: T.textFaint, padding: 20, textAlign: "center" }}>
            No active anomalies. Network is nominal.
          </div>
        )}
        {flagged.map((s) => {
          const meta = STATUS_META[s.status] || STATUS_META.healthy;
          const at = ANOMALY_TYPES[s.anomalyType] || ANOMALY_TYPES.spike;
          const AtIcon = at.icon;
          const isAck = acknowledged.has(s.id);
          return (
            <div
              key={s.id}
              style={{
                border: `1px solid ${T.border}`,
                borderLeft: `3px solid ${meta.color}`,
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                opacity: isAck ? 0.55 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <Badge color={meta.color} bg={meta.bg}>
                  {s.status === "anomaly" ? "CRITICAL" : "WARNING"}
                </Badge>
                <span style={{ fontSize: 11, color: T.textFaint }}>
                  {s.confidence ? `${Math.round(s.confidence * 100)}%` : "—"}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 6 }}>{s.id}</div>
              <div style={{ fontSize: 11.5, color: T.textMuted }}>{s.state}</div>
              <div className="flex items-center" style={{ gap: 5, marginTop: 5, fontSize: 12, color: T.textMuted }}>
                <AtIcon size={13} /> {at.label}
              </div>
              <div style={{ fontSize: 11, color: T.textFaint, marginTop: 4 }}>Detected {s.lastObservation}</div>
              <div className="flex" style={{ gap: 6, marginTop: 8 }}>
                <button onClick={() => onSelect(s.id)} style={smallBtn(T.blue)}>
                  View Station
                </button>
                <button onClick={() => onSelect(s.id)} style={smallBtnOutline}>
                  History
                </button>
                <button onClick={() => onAcknowledge(s.id)} style={smallBtnOutline} disabled={isAck}>
                  {isAck ? "Acked" : "Ack"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
