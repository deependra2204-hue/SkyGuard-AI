import React from "react";
import { Radio, Globe, Contrast, HelpCircle } from "lucide-react";
import Badge from "../common/Badge";
import StatusDot from "../common/StatusDot";
import { T } from "../../constants/theme";

const navBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: T.white,
  fontSize: 12.5,
  padding: "6px 10px",
  borderRadius: 5,
  cursor: "pointer",
};

export default function Header({
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  reduceMotion,
  setReduceMotion,
  now
}) {
  return (
    <header style={{ background: T.navy, color: T.white, borderBottom: `3px solid ${T.saffron}` }}>
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          background: T.white,
          color: T.navy,
          padding: "10px 16px",
          zIndex: 100,
          fontWeight: 600,
        }}
        onFocus={(e) => { e.target.style.left = "8px"; e.target.style.top = "8px"; }}
        onBlur={(e) => { e.target.style.left = "-9999px"; }}
      >
        Skip to main content
      </a>
      <div className="flex items-center justify-between" style={{ padding: "12px 24px", flexWrap: "wrap", gap: 12 }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 6,
              background: T.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            aria-hidden="true"
          >
            <Radio size={22} color={T.white} />
          </div>
          <div>
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.3 }}>SkyGuard AI</span>
              <Badge color={T.saffron} bg="rgba(200,114,44,0.18)" style={{ border: "1px solid rgba(200,114,44,0.5)" }}>
                PROTOTYPE · SIH 2026
              </Badge>
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
              AI-Powered AWS Data Quality &amp; Anomaly Monitoring
            </div>
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 22, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12.5 }}>
            <div style={{ color: "rgba(255,255,255,0.65)" }}>Live System Status</div>
            <div className="flex items-center" style={{ gap: 6, fontWeight: 600 }}>
              <StatusDot status="healthy" pulse={!reduceMotion} /> Operational
            </div>
          </div>
          <div style={{ fontSize: 12.5 }}>
            <div style={{ color: "rgba(255,255,255,0.65)" }}>Last Updated</div>
            <div style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{now} IST</div>
          </div>
          <button style={navBtnStyle} aria-label="Switch language">
            <Globe size={15} /> EN | हिन्दी
          </button>

          <div className="flex items-center" style={{ gap: 4 }} role="group" aria-label="Text size">
            {["A-", "A", "A+"].map((label, i) => {
              const targetScale = 0.92 + i * 0.1;
              const isSelected = Math.abs(fontScale - targetScale) < 0.01;
              return (
                <button
                  key={label}
                  onClick={() => setFontScale(targetScale)}
                  style={{
                    ...navBtnStyle,
                    padding: "5px 9px",
                    border: isSelected ? `1px solid ${T.saffron}` : navBtnStyle.border,
                  }}
                  aria-pressed={isSelected}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button
            style={{ ...navBtnStyle, border: highContrast ? `1px solid ${T.saffron}` : navBtnStyle.border }}
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
          >
            <Contrast size={15} /> High Contrast
          </button>
          <button
            style={{ ...navBtnStyle, border: reduceMotion ? `1px solid ${T.saffron}` : navBtnStyle.border }}
            onClick={() => setReduceMotion((v) => !v)}
            aria-pressed={reduceMotion}
          >
            Reduce Motion
          </button>
          <button style={navBtnStyle}>
            <HelpCircle size={15} /> Help
          </button>
        </div>
      </div>
    </header>
  );
}
