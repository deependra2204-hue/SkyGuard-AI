import React from "react";
import { Zap, PauseCircle, TrendingUp, WifiOff, CloudRain } from "lucide-react";
import { T } from "../../constants/theme";

export default function SimulationPanel({ selectedStation, onInject, injecting }) {
  const faults = [
    { id: "spike", label: "Inject Spike Fault", icon: Zap },
    { id: "stuck", label: "Inject Stuck Sensor", icon: PauseCircle },
    { id: "drift", label: "Inject Drift Fault", icon: TrendingUp },
    { id: "dropout", label: "Simulate Data Dropout", icon: WifiOff },
    { id: "extreme_weather", label: "Simulate Extreme Weather", icon: CloudRain },
  ];

  return (
    <div style={{ border: `1.5px dashed ${T.saffron}`, borderRadius: 6, background: T.saffronBg, padding: 16 }}>
      <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <Zap size={16} color={T.saffron} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>DEMO / SIMULATION MODE</span>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.saffron }}>
          Simulation Mode — no real AWS data is modified
        </span>
      </div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>
        {selectedStation ? (
          <>Faults will be injected into <strong style={{ color: T.text }}>{selectedStation.id}</strong>.</>
        ) : (
          "Select a station on the map, or a healthy station will be chosen automatically."
        )}
      </div>
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {faults.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => onInject(f.id)}
              disabled={injecting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 12px",
                borderRadius: 5,
                border: `1px solid ${T.saffron}`,
                background: T.white,
                color: T.saffron,
                cursor: injecting ? "not-allowed" : "pointer",
                opacity: injecting ? 0.6 : 1,
              }}
            >
              <Icon size={14} /> {f.label}
            </button>
          );
        })}
      </div>
      {injecting && (
        <div className="flex items-center" style={{ gap: 8, marginTop: 12, fontSize: 12, color: T.textMuted }}>
          <span
            style={{
              width: 14,
              height: 14,
              border: `2px solid ${T.saffron}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "sg-spin 0.7s linear infinite",
            }}
          />
          Running AI detection pipeline…
        </div>
      )}
    </div>
  );
}
