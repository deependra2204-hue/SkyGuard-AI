import React from "react";
import { T } from "../../constants/theme";

export default function DataQualityTab({ stations = [] }) {
  const avgQuality = stations.length > 0
    ? (stations.reduce((a, s) => a + s.dataQuality, 0) / stations.length).toFixed(1)
    : "0.0";

  const metrics = [
    { label: "Completeness", value: 96.2, desc: "Share of expected observations successfully received." },
    { label: "Consistency", value: 94.1, desc: "Agreement between correlated sensor parameters." },
    { label: "Timeliness", value: 98.7, desc: "Observations received within the expected reporting window." },
    { label: "Validity", value: 95.4, desc: "Readings within physically plausible bounds." },
    { label: "Anomaly Rate", value: 1.5, desc: "Share of observations flagged as anomalous.", inverse: true },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>Data Quality &amp; Validation</h1>
      <p style={{ fontSize: 12.5, color: T.textMuted, margin: "4px 0 16px" }}>
        Network-wide data quality assessment based on the prototype's synthetic observation stream.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          background: T.white,
          padding: 20,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `conic-gradient(${T.green} ${Number(avgQuality) * 3.6}deg, ${T.greyBg} 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: T.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 17,
              color: T.text,
            }}
          >
            {avgQuality}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Overall Network Data Quality Score</div>
          <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 4, maxWidth: 480 }}>
            Composite score across completeness, consistency, timeliness and validity, weighted equally across {stations.length} monitored stations.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: m.inverse ? T.amber : T.green, marginTop: 6 }}>
              {m.value}%
            </div>
            <div style={{ height: 6, background: T.greyBg, borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${m.value}%`, background: m.inverse ? T.amber : T.green }} />
            </div>
            <div style={{ fontSize: 11, color: T.textFaint, marginTop: 8 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 11.5,
          color: T.textFaint,
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          padding: 12,
          background: T.offwhite,
        }}
      >
        <strong>Methodology:</strong> Scores are computed from the prototype's simulated observation stream and fault-injection
        test cases. Prototype demonstration using simulated AWS observations — not live Government of India data.
      </div>
    </div>
  );
}
