import React, { useState, useMemo } from "react";
import { Search, FileDown, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import StatusDot from "../common/StatusDot";
import Badge from "../common/Badge";
import { T, STATUS_META } from "../../constants/theme";

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

const tdStyle = { padding: "9px 12px", color: T.text, whiteSpace: "nowrap" };
const srLabel = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" };

export default function TableTab({ stations, onSelect, setActiveTab }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = stations.filter(
      (s) =>
        s.id.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.state.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [stations, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: "id", label: "Station ID" },
    { key: "state", label: "State" },
    { key: "temperature", label: "Temp (°C)" },
    { key: "pressure", label: "Pressure (hPa)" },
    { key: "humidity", label: "Humidity (%)" },
    { key: "lastObservation", label: "Last Update" },
    { key: "status", label: "Health" },
  ];

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    const header = "Station ID,Location,State,Temperature,Pressure,Humidity,Last Update,Health,Anomaly\n";
    const rows = filtered
      .map((s) =>
        [
          s.id,
          s.name,
          s.state,
          s.temperature.toFixed(1),
          s.pressure.toFixed(1),
          s.humidity.toFixed(1),
          s.lastObservation,
          s.status,
          s.anomalyType || "",
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skyguard_station_registry.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>Station Registry</h1>
          <p style={{ fontSize: 12.5, color: T.textMuted, margin: "4px 0 0" }}>
            Full list of automatic weather stations with current readings.
          </p>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 8, top: 8 }} color={T.textFaint} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search stations…"
              style={{ padding: "7px 10px 7px 28px", fontSize: 12.5, border: `1px solid ${T.border}`, borderRadius: 5, width: 200 }}
            />
          </div>
          <button
            onClick={exportCSV}
            style={{ ...smallBtn(T.blue), padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}
          >
            <FileDown size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden", background: T.white }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <caption style={srLabel}>Automatic weather station registry with live readings</caption>
            <thead>
              <tr style={{ background: T.offwhite, borderBottom: `1px solid ${T.border}` }}>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    onClick={() => toggleSort(c.key)}
                    style={{
                      textAlign: "left",
                      padding: "9px 12px",
                      fontWeight: 700,
                      color: T.textMuted,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span className="flex items-center" style={{ gap: 4 }}>
                      {c.label}
                      {sortKey === c.key && (
                        <ChevronDown size={12} style={{ transform: sortDir === "asc" ? "rotate(180deg)" : "none" }} />
                      )}
                    </span>
                  </th>
                ))}
                <th scope="col" style={{ padding: "9px 12px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => {
                const meta = STATUS_META[s.status] || STATUS_META.healthy;
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={tdStyle}>
                      <strong>{s.id}</strong>
                    </td>
                    <td style={tdStyle}>{s.state}</td>
                    <td style={tdStyle}>{s.temperature.toFixed(1)}</td>
                    <td style={tdStyle}>{s.pressure.toFixed(1)}</td>
                    <td style={tdStyle}>{s.humidity.toFixed(1)}</td>
                    <td style={tdStyle}>{s.lastObservation}</td>
                    <td style={tdStyle}>
                      <Badge color={meta.color} bg={meta.bg}>
                        <StatusDot status={s.status} size={6} /> {meta.label}
                      </Badge>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={smallBtnOutline}
                        onClick={() => {
                          onSelect(s.id);
                          setActiveTab("dashboard");
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="flex items-center justify-between"
          style={{ padding: 12, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.textMuted }}
        >
          <span>
            Page {page} of {totalPages} · {filtered.length} stations
          </span>
          <div className="flex" style={{ gap: 6 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={smallBtnOutline}
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={smallBtnOutline}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
