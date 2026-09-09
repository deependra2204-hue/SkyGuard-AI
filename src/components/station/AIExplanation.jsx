import React from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { explainAnomaly } from "../../utils/mockData";
import { T } from "../../constants/theme";

export default function AIExplanation({ station, reduceMotion }) {
  const ex = explainAnomaly(station);
  const steps = ["Observed", "Pattern Analysis", "Cross-Sensor Validation", "AI Detection", "Explanation", "Recommended Action"];

  if (!ex) {
    return (
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 16, background: T.greenBg, textAlign: "center" }}>
        <CheckCircle2 size={20} color={T.green} style={{ marginBottom: 4 }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: T.green }}>No anomaly detected for this station</div>
        <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 2 }}>All sensor readings are within expected bounds.</div>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: T.redBg, borderRadius: "6px 6px 0 0" }}>
        <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 8 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <ShieldAlert size={16} color={T.red} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.red }}>WHY WAS THIS FLAGGED?</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.red }}>
            Anomaly Score: {station.confidence?.toFixed(2)}
          </div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.55 }}>{ex.headline}</div>
        <div style={{ marginTop: 12, fontSize: 12.5 }}>
          <strong style={{ color: T.text }}>Why this matters: </strong>
          <span style={{ color: T.textMuted }}>{ex.matters}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 12.5 }}>
          <strong style={{ color: T.text }}>Likely cause: </strong>
          <span style={{ color: T.textMuted }}>{ex.cause}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 12.5 }}>
          <strong style={{ color: T.text }}>Recommended action: </strong>
          <span style={{ color: T.textMuted }}>{ex.action}</span>
        </div>

        <div style={{ marginTop: 18, display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 92,
                  opacity: reduceMotion ? 1 : 0,
                  animation: reduceMotion ? "none" : "sg-fadein 0.4s ease forwards",
                  animationDelay: reduceMotion ? "0s" : `${i * 0.15}s`,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: T.blueFaint,
                    border: `1.5px solid ${T.blue}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.blue,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 10.5, color: T.textMuted, textAlign: "center", marginTop: 5 }}>{step}</div>
              </div>
              {i < steps.length - 1 && <div style={{ height: 1.5, flex: 1, background: T.border, minWidth: 14, marginTop: -14 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
