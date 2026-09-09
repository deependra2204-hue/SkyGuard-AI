import React from "react";
import { T } from "../../constants/theme";

export default function Footer() {
  return (
    <footer style={{ background: T.navy, color: "rgba(255,255,255,0.8)", padding: "24px", marginTop: 20, fontSize: 12 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 18 }}>
        <div>
          <div style={{ fontWeight: 700, color: T.white, marginBottom: 8 }}>SkyGuard AI</div>
          <p style={{ color: "rgba(255,255,255,0.55)", margin: 0 }}>
            Prototype developed for Smart India Hackathon. Not an official Government of India platform.
          </p>
        </div>
        {[
          { h: "About", items: ["System Overview", "Data & Methodology", "About SkyGuard AI"] },
          { h: "Trust", items: ["Accessibility", "Privacy", "Security", "Terms / Disclaimer"] },
          { h: "Support", items: ["Contact", "Help"] },
        ].map((col) => (
          <div key={col.h}>
            <div style={{ fontWeight: 700, color: T.white, marginBottom: 8 }}>{col.h}</div>
            {col.items.map((it) => (
              <div key={it} style={{ color: "rgba(255,255,255,0.6)", marginBottom: 5 }}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1200,
          margin: "18px auto 0",
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)",
          fontSize: 11,
        }}
      >
        Prototype demonstration using simulated AWS observations. Governance Meteorological Operations — neutral placeholder identity, no official affiliation implied.
        If real government/IMD data is later integrated, its use will be subject to applicable Government of India data-sharing, licensing, security and access policies.
      </div>
    </footer>
  );
}
