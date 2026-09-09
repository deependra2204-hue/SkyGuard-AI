import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { T, STATUS_META } from "../../constants/theme";

const srLabel = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" };
const fieldLabel = { fontSize: 11.5, fontWeight: 600, color: T.textMuted, marginBottom: 5 };
const selectStyle = {
  width: "100%",
  padding: "7px 8px",
  fontSize: 13,
  border: `1px solid ${T.border}`,
  borderRadius: 5,
  background: T.white,
  color: T.text,
};

export default function Sidebar({ filters, setFilters, stateOptions, resultCount }) {
  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const reset = () => setFilters({ query: "", state: "all", status: "all" });

  return (
    <aside
      style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.white, padding: 16 }}
      aria-label="Station filters"
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: T.textFaint, letterSpacing: 0.5, marginBottom: 10 }}>
        FILTER STATIONS
      </div>

      <label htmlFor="station-search" style={srLabel}>
        Search station, district or station ID
      </label>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={15} style={{ position: "absolute", left: 9, top: 9, color: T.textFaint }} />
        <input
          id="station-search"
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          placeholder="Search station, district or ID"
          style={{
            width: "100%",
            padding: "8px 10px 8px 30px",
            fontSize: 13,
            border: `1px solid ${T.border}`,
            borderRadius: 5,
            outline: "none",
            color: T.text,
          }}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={fieldLabel}>Quick Filters</div>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {["all", "healthy", "warning", "anomaly", "offline"].map((s) => (
            <button
              key={s}
              onClick={() => update("status", s)}
              style={{
                fontSize: 11.5,
                padding: "5px 10px",
                borderRadius: 14,
                cursor: "pointer",
                border: `1px solid ${filters.status === s ? T.blue : T.border}`,
                background: filters.status === s ? T.blueFaint : T.white,
                color: filters.status === s ? T.blue : T.textMuted,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {s === "all" ? "All Stations" : STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor="state-filter" style={fieldLabel}>
          State
        </label>
        <select
          id="state-filter"
          value={filters.state}
          onChange={(e) => update("state", e.target.value)}
          style={selectStyle}
        >
          <option value="all">All States</option>
          {stateOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={fieldLabel}>Sensor Parameter</div>
        <select style={selectStyle} defaultValue="all">
          <option value="all">All Parameters</option>
          <option>Temperature</option>
          <option>Pressure</option>
          <option>Humidity</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={fieldLabel}>Time Range</div>
        <select style={selectStyle} defaultValue="24h">
          <option value="1h">Last 1 hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>

      <button
        onClick={reset}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          padding: "8px",
          fontSize: 12.5,
          fontWeight: 600,
          border: `1px solid ${T.border}`,
          borderRadius: 5,
          background: T.offwhite,
          color: T.textMuted,
          cursor: "pointer",
        }}
      >
        <RotateCcw size={13} /> Reset Filters
      </button>

      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: T.textFaint,
          borderTop: `1px solid ${T.border}`,
          paddingTop: 12,
        }}
      >
        Showing <strong style={{ color: T.text }}>{resultCount}</strong> of stations matching current filters.
      </div>
    </aside>
  );
}
