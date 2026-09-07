import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ReferenceArea, ReferenceDot, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  Search, ChevronDown, X, RotateCcw, Bell, HelpCircle, Globe,
  Radio, AlertTriangle, CheckCircle2, XCircle, WifiOff, Activity,
  Thermometer, Gauge, Droplets, CloudRain, Wind, Compass, MapPin,
  ChevronRight, Eye, History, BadgeCheck, ShieldAlert, Zap, TrendingDown,
  TrendingUp, Waves, Database, Clock, FileDown, ChevronLeft, Info,
  ListChecks, LayoutDashboard, Table2, GaugeCircle, LineChart as LineChartIcon,
  Menu, Contrast, PauseCircle
} from "lucide-react";

/* ============================================================
   THEME — government / meteorological operations palette
   ============================================================ */
const T = {
  navy: "#0B2545",
  navyDeep: "#081B34",
  blue: "#1B4B7A",
  blueLight: "#2E6DA4",
  blueFaint: "#EAF1F8",
  offwhite: "#F3F5F7",
  white: "#FFFFFF",
  saffron: "#C8722C",
  saffronBg: "#FBEFE3",
  green: "#26703B",
  greenBg: "#E7F3EA",
  amber: "#9C6B0B",
  amberBg: "#FBF1D9",
  red: "#B23327",
  redBg: "#FBEAE7",
  grey: "#7C8896",
  greyBg: "#EDEFF2",
  border: "#DBE1E7",
  borderStrong: "#C3CBD3",
  text: "#122036",
  textMuted: "#5A6B7C",
  textFaint: "#8B97A4",
};

const STATUS_META = {
  healthy: { label: "Healthy", color: T.green, bg: T.greenBg, icon: CheckCircle2 },
  warning: { label: "Warning", color: T.amber, bg: T.amberBg, icon: AlertTriangle },
  anomaly: { label: "Anomaly", color: T.red, bg: T.redBg, icon: XCircle },
  offline: { label: "Offline", color: T.grey, bg: T.greyBg, icon: WifiOff },
};

const ANOMALY_TYPES = {
  spike: { label: "Sensor Spike", icon: Zap },
  stuck: { label: "Sensor Stuck", icon: PauseCircle },
  drift: { label: "Sensor Drift", icon: TrendingUp },
  dropout: { label: "Data Dropout", icon: WifiOff },
  cross_sensor: { label: "Cross-Sensor Inconsistency", icon: Waves },
  implausible: { label: "Physically Implausible Reading", icon: ShieldAlert },
  extreme_weather: { label: "Extreme Weather Signature", icon: CloudRain },
};

/* ============================================================
   SEEDED RNG — deterministic mock data
   ============================================================ */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260908);
const rand = (min, max) => min + rng() * (max - min);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];

/* ============================================================
   GEOGRAPHY — approximate anchor points across India
   (illustrative positions, not surveyed coordinates)
   ============================================================ */
const REGIONS = [
  { state: "Jammu & Kashmir", code: "JK", lat: 34.08, lon: 74.79 },
  { state: "Punjab", code: "PB", lat: 31.14, lon: 75.34 },
  { state: "Himachal Pradesh", code: "HP", lat: 31.1, lon: 77.17 },
  { state: "Uttarakhand", code: "UK", lat: 30.32, lon: 78.03 },
  { state: "Delhi", code: "DL", lat: 28.61, lon: 77.2 },
  { state: "Rajasthan", code: "RJ", lat: 26.91, lon: 75.79 },
  { state: "Uttar Pradesh", code: "UP", lat: 26.84, lon: 80.94 },
  { state: "Gujarat", code: "GJ", lat: 23.02, lon: 72.57 },
  { state: "Madhya Pradesh", code: "MP", lat: 23.25, lon: 77.41 },
  { state: "Bihar", code: "BR", lat: 25.59, lon: 85.13 },
  { state: "West Bengal", code: "WB", lat: 22.57, lon: 88.36 },
  { state: "Jharkhand", code: "JH", lat: 23.34, lon: 85.31 },
  { state: "Chhattisgarh", code: "CG", lat: 21.25, lon: 81.63 },
  { state: "Maharashtra", code: "MH", lat: 19.07, lon: 72.87 },
  { state: "Maharashtra", code: "MH", lat: 18.52, lon: 73.85 },
  { state: "Odisha", code: "OD", lat: 20.29, lon: 85.82 },
  { state: "Telangana", code: "TG", lat: 17.38, lon: 78.48 },
  { state: "Andhra Pradesh", code: "AP", lat: 16.51, lon: 80.63 },
  { state: "Karnataka", code: "KA", lat: 12.97, lon: 77.59 },
  { state: "Tamil Nadu", code: "TN", lat: 13.08, lon: 80.27 },
  { state: "Kerala", code: "KL", lat: 9.93, lon: 76.26 },
  { state: "Goa", code: "GA", lat: 15.49, lon: 73.82 },
  { state: "Assam", code: "AS", lat: 26.14, lon: 91.73 },
  { state: "Sikkim", code: "SK", lat: 27.33, lon: 88.61 },
  { state: "Arunachal Pradesh", code: "AR", lat: 27.08, lon: 93.62 },
];

// Very rough, illustrative India outline (lat/lon vertices) — not a surveyed boundary.
const INDIA_OUTLINE_LATLON = [
  [35.2, 74.3], [33.6, 78.4], [30.9, 81.0], [29.3, 88.1], [27.6, 91.8],
  [26.4, 95.6], [24.2, 93.9], [22.6, 92.3], [21.5, 89.2], [21.0, 86.9],
  [20.1, 86.7], [17.0, 82.5], [13.5, 80.3], [10.3, 79.5], [8.1, 77.6],
  [8.9, 76.6], [11.0, 75.8], [14.7, 74.2], [17.0, 73.1], [19.1, 72.7],
  [20.6, 70.4], [22.4, 69.0], [23.6, 68.5], [24.3, 71.1], [26.0, 70.0],
  [28.0, 70.2], [29.4, 74.4], [32.4, 74.6], [34.3, 73.9], [35.2, 74.3],
];

const MAP_W = 420, MAP_H = 520;
const LAT_MIN = 8, LAT_MAX = 35.5, LON_MIN = 68, LON_MAX = 97.5;
function project(lat, lon) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H;
  return [x, y];
}
const INDIA_PATH = INDIA_OUTLINE_LATLON
  .map(([lat, lon], i) => {
    const [x, y] = project(lat, lon);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ") + " Z";

/* ============================================================
   MOCK DATA GENERATION
   ============================================================ */
function genSparkline(base, n = 12, vol = 1) {
  let v = base;
  const out = [];
  for (let i = 0; i < n; i++) {
    v += rand(-vol, vol);
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

function genHistory(base, range, hours = 24, anomalyAt = null, anomalyDelta = 0) {
  const pts = [];
  let v = base;
  for (let i = 0; i < hours; i++) {
    const hourLabel = `${String(i).padStart(2, "0")}:00`;
    v += rand(-range * 0.15, range * 0.15);
    v = Math.max(base - range, Math.min(base + range, v));
    let val = Number(v.toFixed(2));
    let anomalous = false;
    if (anomalyAt !== null && i === anomalyAt) {
      val = Number((val + anomalyDelta).toFixed(2));
      anomalous = true;
      v = val;
    }
    pts.push({ t: hourLabel, value: val, anomalous });
  }
  return pts;
}

function makeStation(idx, region, forcedStatus) {
  const num = String(idx + 1).padStart(3, "0");
  const id = `AWS-${region.code}-${num}`;
  const jitterLat = region.lat + rand(-0.9, 0.9);
  const jitterLon = region.lon + rand(-0.9, 0.9);
  const [x, y] = project(jitterLat, jitterLon);

  const roll = rng();
  const status =
    forcedStatus ||
    (roll < 0.79 ? "healthy" : roll < 0.9 ? "warning" : roll < 0.985 ? "anomaly" : "offline");

  const baseTemp = rand(21, 35);
  const basePressure = rand(1000, 1015);
  const baseHumidity = rand(35, 85);

  let anomalyType = null, anomalySource = null, anomalyIdx = null, confidence = null;
  const tempHist = genHistory(baseTemp, 3.5, 24);
  const pressHist = genHistory(basePressure, 4, 24);
  const humHist = genHistory(baseHumidity, 10, 24);

  if (status === "anomaly") {
    anomalyType = pick(["spike", "stuck", "drift", "dropout", "cross_sensor", "implausible"]);
    anomalyIdx = 22;
    anomalySource = "sensor_fault";
    confidence = Number(rand(0.85, 0.98).toFixed(2));
    const delta = pick([1, -1]) * rand(9, 16);
    tempHist[anomalyIdx] = { ...tempHist[anomalyIdx], value: Number((tempHist[anomalyIdx].value + delta).toFixed(2)), anomalous: true };
  } else if (status === "warning") {
    anomalyType = pick(["drift", "cross_sensor"]);
    confidence = Number(rand(0.55, 0.75).toFixed(2));
  }

  return {
    id, name: `${region.state} AWS ${num}`, state: region.state,
    lat: jitterLat, lon: jitterLon, x, y,
    elevation: Math.round(rand(15, 620)),
    stationType: pick(["Class A AWS", "Class B AWS", "Coastal AWS", "Hill Station AWS"]),
    status, dataQuality: status === "offline" ? 0 : Number(rand(88, 99.6).toFixed(1)),
    temperature: tempHist[23].value,
    pressure: pressHist[23].value,
    humidity: humHist[23].value,
    rainfall: Number(rand(0, 6).toFixed(1)),
    windSpeed: Number(rand(2, 22).toFixed(1)),
    windDir: pick(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
    prevTemperature: tempHist[22].value,
    prevPressure: pressHist[22].value,
    prevHumidity: humHist[22].value,
    sparkTemp: genSparkline(baseTemp, 12, 0.8),
    sparkPress: genSparkline(basePressure, 12, 0.6),
    sparkHum: genSparkline(baseHumidity, 12, 2.5),
    tempHist, pressHist, humHist,
    anomalyType, anomalySource, anomalyIdx, confidence,
    lastObservation: status === "offline" ? "47 min ago" : `${Math.floor(rand(1, 5))} min ago`,
  };
}

function useStations() {
  return useMemo(() => {
    const list = [];
    let i = 0;
    REGIONS.forEach((region) => {
      const count = Math.floor(rand(3, 6));
      for (let k = 0; k < count; k++) {
        list.push(makeStation(i, region));
        i++;
      }
    });
    // guarantee a rich flagship anomaly for the demo narrative
    list[3] = makeStation(3, REGIONS.find((r) => r.code === "MP"), "anomaly");
    list[3].anomalyType = "spike";
    return list;
  }, []);
}

function explainAnomaly(station) {
  if (!station || !station.anomalyType) return null;
  const type = station.anomalyType;
  const deltaT = (station.tempHist[station.anomalyIdx]?.value - station.tempHist[station.anomalyIdx - 1]?.value) || 0;
  const templates = {
    spike: {
      headline: `Temperature ${deltaT >= 0 ? "increased" : "decreased"} by ${Math.abs(deltaT).toFixed(1)}°C within a 3-minute observation window while pressure and humidity remained nearly unchanged.`,
      matters: "This combination is unlikely to represent normal atmospheric behaviour — genuine temperature shifts of this magnitude are almost always accompanied by correlated pressure or humidity movement.",
      cause: "Possible temperature sensor fault, loose probe connection, or radiation-shield exposure error.",
      action: "Verify the sensor housing and compare with the nearest three AWS observations before dispatching a field technician.",
    },
    stuck: {
      headline: "The sensor has reported an identical value for 6 consecutive observation cycles despite normal variability at neighbouring stations.",
      matters: "A flat, unchanging reading over an extended window is not consistent with natural atmospheric variation.",
      cause: "Likely a stuck or frozen sensor reading — possible firmware fault or physical obstruction.",
      action: "Schedule a diagnostic reset and confirm telemetry resumes normal variability.",
    },
    drift: {
      headline: "A gradual, one-directional drift has been observed over the last several hours that diverges from the station's historical baseline.",
      matters: "Slow drift without a matching regional trend often indicates calibration decay rather than a real weather change.",
      cause: "Possible sensor calibration drift.",
      action: "Flag for the next scheduled calibration cycle and monitor for continued divergence.",
    },
    dropout: {
      headline: "No new observations have been received from this station for an extended period.",
      matters: "Missing data reduces network coverage and can mask genuine local events.",
      cause: "Possible communication link failure, power loss, or data-logger fault.",
      action: "Check telemetry link status and confirm station power before resuming automated ingestion.",
    },
    cross_sensor: {
      headline: "Humidity and temperature values from this station are physically inconsistent with each other given current pressure readings.",
      matters: "Correlated sensors moving in an implausible combination is a strong signal of instrument fault rather than genuine weather.",
      cause: "Possible cross-sensor calibration mismatch.",
      action: "Cross-validate with nearby stations and inspect sensor wiring.",
    },
    implausible: {
      headline: "The reported value falls outside the physically plausible range for this location and season.",
      matters: "Values outside physical bounds cannot represent genuine atmospheric conditions.",
      cause: "Likely data corruption, transmission error, or hardware malfunction.",
      action: "Discard the affected observation and request an immediate station health check.",
    },
    extreme_weather: {
      headline: "Multiple correlated sensors show a rapid, consistent shift that matches a known extreme-weather signature.",
      matters: "The pattern is corroborated by neighbouring stations, which is inconsistent with an isolated instrument fault.",
      cause: "Likely a genuine localised weather event (e.g. squall line or thunderstorm outflow).",
      action: "Cross-check with nowcasting products and issue a local advisory if the pattern persists.",
    },
  };
  return templates[type] || templates.spike;
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function StatusDot({ status, size = 8, pulse = false }) {
  const m = STATUS_META[status];
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
      {pulse && (
        <span
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: m.color, opacity: 0.5, animation: "sg-ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
      )}
      <span style={{ width: size, height: size, borderRadius: "50%", background: m.color, display: "inline-block" }} />
    </span>
  );
}

function Badge({ children, color, bg, style }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
        padding: "3px 9px", borderRadius: 4, color, background: bg, letterSpacing: 0.2, ...style,
      }}
    >
      {children}
    </span>
  );
}

function CountUp({ value, duration = 900, reduceMotion }) {
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const startRef = useRef(null);
  const fromRef = useRef(display);
  useEffect(() => {
    if (reduceMotion) { setDisplay(value); return; }
    fromRef.current = display;
    startRef.current = null;
    let raf;
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion]);
  return <>{display.toLocaleString("en-IN")}</>;
}

function Sparkline({ data, color }) {
  const w = 72, h = 24;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header({ fontScale, setFontScale, highContrast, setHighContrast, reduceMotion, setReduceMotion, now }) {
  return (
    <header style={{ background: T.navy, color: T.white, borderBottom: `3px solid ${T.saffron}` }}>
      <a href="#main-content" style={{
        position: "absolute", left: -9999, top: 0, background: T.white, color: T.navy,
        padding: "10px 16px", zIndex: 100, fontWeight: 600,
      }} onFocus={(e) => { e.target.style.left = "8px"; e.target.style.top = "8px"; }}
        onBlur={(e) => { e.target.style.left = "-9999px"; }}>
        Skip to main content
      </a>
      <div className="flex items-center justify-between" style={{ padding: "12px 24px", flexWrap: "wrap", gap: 12 }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 6, background: T.blue,
            display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(255,255,255,0.25)`,
          }} aria-hidden="true">
            <Radio size={22} color={T.white} />
          </div>
          <div>
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.3 }}>SkyGuard AI</span>
              <Badge color={T.saffron} bg="rgba(200,114,44,0.18)" style={{ border: `1px solid rgba(200,114,44,0.5)` }}>
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
            {["A-", "A", "A+"].map((label, i) => (
              <button
                key={label}
                onClick={() => setFontScale(0.92 + i * 0.1)}
                style={{
                  ...navBtnStyle, padding: "5px 9px",
                  border: fontScale === 0.92 + i * 0.1 ? `1px solid ${T.saffron}` : navBtnStyle.border,
                }}
                aria-pressed={fontScale === 0.92 + i * 0.1}
              >
                {label}
              </button>
            ))}
          </div>
          <button style={{ ...navBtnStyle, border: highContrast ? `1px solid ${T.saffron}` : navBtnStyle.border }}
            onClick={() => setHighContrast((v) => !v)} aria-pressed={highContrast}>
            <Contrast size={15} /> High Contrast
          </button>
          <button style={{ ...navBtnStyle, border: reduceMotion ? `1px solid ${T.saffron}` : navBtnStyle.border }}
            onClick={() => setReduceMotion((v) => !v)} aria-pressed={reduceMotion}>
            Reduce Motion
          </button>
          <button style={navBtnStyle}><HelpCircle size={15} /> Help</button>
        </div>
      </div>
    </header>
  );
}
const navBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.18)", color: T.white, fontSize: 12.5, padding: "6px 10px",
  borderRadius: 5, cursor: "pointer",
};

/* ============================================================
   TOP INFORMATION BAR
   ============================================================ */
function InfoBar({ stats, reduceMotion, lastSync }) {
  const items = [
    { label: "Total Stations", value: stats.total, color: T.text },
    { label: "Healthy", value: stats.healthy, color: T.green },
    { label: "Warnings", value: stats.warning, color: T.amber },
    { label: "Anomalies", value: stats.anomaly, color: T.red },
    { label: "Offline", value: stats.offline, color: T.grey },
  ];
  return (
    <div style={{ background: T.white, borderBottom: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between" style={{ padding: "10px 24px", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textFaint, letterSpacing: 0.6 }}>
            AUTOMATIC WEATHER STATION NETWORK
          </div>
          <div style={{ fontSize: 13.5, color: T.textMuted }}>Real-time sensor quality monitoring across India</div>
        </div>
        <div className="flex items-center" style={{ gap: 26, flexWrap: "wrap" }}>
          {items.map((it) => (
            <div key={it.label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: it.color, fontVariantNumeric: "tabular-nums" }}>
                <CountUp value={it.value} reduceMotion={reduceMotion} />
              </div>
              <div style={{ fontSize: 11, color: T.textFaint }}>{it.label}</div>
            </div>
          ))}
          <div style={{ textAlign: "right", borderLeft: `1px solid ${T.border}`, paddingLeft: 20 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>{lastSync} IST</div>
            <div style={{ fontSize: 11, color: T.textFaint }}>Last Sync</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TABS
   ============================================================ */
const TABS = [
  { id: "dashboard", label: "Monitoring Dashboard", icon: LayoutDashboard },
  { id: "alerts", label: "Alert Center", icon: Bell },
  { id: "table", label: "Station Registry", icon: Table2 },
  { id: "quality", label: "Data Quality", icon: GaugeCircle },
  { id: "performance", label: "Model Performance", icon: LineChartIcon },
];
function TabBar({ active, setActive, alertCount }) {
  return (
    <nav style={{ background: T.blue, borderBottom: `1px solid ${T.navy}` }} aria-label="Primary">
      <div className="flex" style={{ padding: "0 24px", overflowX: "auto" }}>
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", fontSize: 13,
                fontWeight: 600, color: isActive ? T.white : "rgba(255,255,255,0.68)",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                borderBottom: isActive ? `3px solid ${T.saffron}` : "3px solid transparent",
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} /> {tab.label}
              {tab.id === "alerts" && alertCount > 0 && (
                <span style={{
                  background: T.red, color: T.white, fontSize: 10.5, fontWeight: 700,
                  borderRadius: 9, padding: "1px 6px", marginLeft: 2,
                }}>{alertCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ============================================================
   LEFT FILTER SIDEBAR
   ============================================================ */
function Sidebar({ filters, setFilters, stateOptions, resultCount }) {
  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const reset = () => setFilters({ query: "", state: "all", status: "all" });
  return (
    <aside style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.white, padding: 16 }}
      aria-label="Station filters">
      <div style={{ fontSize: 12, fontWeight: 700, color: T.textFaint, letterSpacing: 0.5, marginBottom: 10 }}>
        FILTER STATIONS
      </div>

      <label htmlFor="station-search" style={srLabel}>Search station, district or station ID</label>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={15} style={{ position: "absolute", left: 9, top: 9, color: T.textFaint }} />
        <input
          id="station-search"
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          placeholder="Search station, district or ID"
          style={{
            width: "100%", padding: "8px 10px 8px 30px", fontSize: 13, border: `1px solid ${T.border}`,
            borderRadius: 5, outline: "none", color: T.text,
          }}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={fieldLabel}>Quick Filters</div>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {["all", "healthy", "warning", "anomaly", "offline"].map((s) => (
            <button key={s} onClick={() => update("status", s)}
              style={{
                fontSize: 11.5, padding: "5px 10px", borderRadius: 14, cursor: "pointer",
                border: `1px solid ${filters.status === s ? T.blue : T.border}`,
                background: filters.status === s ? T.blueFaint : T.white,
                color: filters.status === s ? T.blue : T.textMuted, fontWeight: 600, textTransform: "capitalize",
              }}>
              {s === "all" ? "All Stations" : STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor="state-filter" style={fieldLabel}>State</label>
        <select id="state-filter" value={filters.state} onChange={(e) => update("state", e.target.value)} style={selectStyle}>
          <option value="all">All States</option>
          {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
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

      <button onClick={reset} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
        padding: "8px", fontSize: 12.5, fontWeight: 600, border: `1px solid ${T.border}`, borderRadius: 5,
        background: T.offwhite, color: T.textMuted, cursor: "pointer",
      }}>
        <RotateCcw size={13} /> Reset Filters
      </button>

      <div style={{ marginTop: 16, fontSize: 12, color: T.textFaint, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
        Showing <strong style={{ color: T.text }}>{resultCount}</strong> of {" "}
        stations matching current filters.
      </div>
    </aside>
  );
}
const srLabel = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" };
const fieldLabel = { fontSize: 11.5, fontWeight: 600, color: T.textMuted, marginBottom: 5 };
const selectStyle = {
  width: "100%", padding: "7px 8px", fontSize: 13, border: `1px solid ${T.border}`, borderRadius: 5,
  background: T.white, color: T.text,
};

/* ============================================================
   INDIA MAP
   ============================================================ */
function IndiaMap({ stations, selectedId, onSelect, reduceMotion }) {
  const [hovered, setHovered] = useState(null);
  const hoveredStation = stations.find((s) => s.id === hovered);

  return (
    <div style={{ position: "relative", background: "#F7F9FA", borderRadius: 6, border: `1px solid ${T.border}` }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", borderBottom: `1px solid ${T.border}`,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>India AWS Monitoring Network</div>
          <div style={{ fontSize: 11, color: T.textFaint }}>Illustrative station map — positions not to survey scale</div>
        </div>
        <div className="flex items-center" style={{ gap: 12, fontSize: 11, color: T.textMuted }}>
          {Object.entries(STATUS_META).map(([k, m]) => (
            <span key={k} className="flex items-center" style={{ gap: 4 }}>
              <StatusDot status={k} size={7} /> {m.label}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="560" role="img"
        aria-label="Map of India showing automatic weather station locations coloured by health status">
        <path d={INDIA_PATH} fill="#E8EDF1" stroke={T.borderStrong} strokeWidth={1.2} />
        {stations.map((s) => {
          const isSelected = s.id === selectedId;
          const meta = STATUS_META[s.status];
          const r = isSelected ? 6.5 : s.status === "anomaly" ? 5.5 : 4.2;
          return (
            <g key={s.id} transform={`translate(${s.x},${s.y})`} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s.id)} onBlur={() => setHovered(null)}
              onClick={() => onSelect(s.id)} tabIndex={0} role="button"
              aria-label={`${s.name}, status ${meta.label}, temperature ${s.temperature.toFixed(1)} degrees Celsius`}>
              {isSelected && (
                <circle r={r + 6} fill="none" stroke={T.blue} strokeWidth={1.4}
                  style={!reduceMotion ? { animation: "sg-ring 1.6s ease-out infinite" } : undefined} />
              )}
              {s.status === "anomaly" && !reduceMotion && (
                <circle r={r + 4} fill={meta.color} opacity={0.35} style={{ animation: "sg-ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
              )}
              <circle r={r} fill={meta.color} stroke="#fff" strokeWidth={1.3} />
            </g>
          );
        })}
      </svg>

      {hoveredStation && (
        <div style={{
          position: "absolute", left: Math.min(hoveredStation.x + 16, MAP_W - 190),
          top: Math.max(hoveredStation.y - 10, 8), width: 190, background: T.navy, color: T.white,
          borderRadius: 6, padding: "10px 12px", fontSize: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          pointerEvents: "none", zIndex: 5,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{hoveredStation.id}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>{hoveredStation.name}, {hoveredStation.state}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 3, columnGap: 8 }}>
            <span>Temp: {hoveredStation.temperature.toFixed(1)}°C</span>
            <span>Pressure: {hoveredStation.pressure.toFixed(0)} hPa</span>
            <span>Humidity: {hoveredStation.humidity.toFixed(0)}%</span>
            <span>Wind: {hoveredStation.windSpeed} km/h</span>
            <span>Rain: {hoveredStation.rainfall} mm</span>
            <span>{hoveredStation.lastObservation}</span>
          </div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <StatusDot status={hoveredStation.status} size={7} />
            <span style={{ fontWeight: 600 }}>{STATUS_META[hoveredStation.status].label}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   AI ANOMALY INTELLIGENCE PANEL
   ============================================================ */
function AnomalyIntelligencePanel({ stations, onSelect, onAcknowledge, acknowledged }) {
  const flagged = stations.filter((s) => s.status === "anomaly" || s.status === "warning")
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  return (
    <div style={{ width: 320, flexShrink: 0, borderLeft: `1px solid ${T.border}`, background: T.white, display: "flex", flexDirection: "column" }}
      aria-label="AI anomaly intelligence">
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <Activity size={15} color={T.blue} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text, letterSpacing: 0.3 }}>AI ANOMALY INTELLIGENCE</span>
        </div>
        <div style={{ fontSize: 11.5, color: T.textFaint, marginTop: 2 }}>Latest detections, ranked by confidence</div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "10px 12px" }}>
        {flagged.length === 0 && (
          <div style={{ fontSize: 12.5, color: T.textFaint, padding: 20, textAlign: "center" }}>
            No active anomalies. Network is nominal.
          </div>
        )}
        {flagged.map((s) => {
          const meta = STATUS_META[s.status];
          const at = ANOMALY_TYPES[s.anomalyType] || ANOMALY_TYPES.spike;
          const AtIcon = at.icon;
          const isAck = acknowledged.has(s.id);
          return (
            <div key={s.id} style={{
              border: `1px solid ${T.border}`, borderLeft: `3px solid ${meta.color}`, borderRadius: 5,
              padding: 10, marginBottom: 10, opacity: isAck ? 0.55 : 1,
            }}>
              <div className="flex items-center justify-between">
                <Badge color={meta.color} bg={meta.bg}>{s.status === "anomaly" ? "CRITICAL" : "WARNING"}</Badge>
                <span style={{ fontSize: 11, color: T.textFaint }}>{s.confidence ? `${Math.round(s.confidence * 100)}%` : "—"}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 6 }}>{s.id}</div>
              <div style={{ fontSize: 11.5, color: T.textMuted }}>{s.state}</div>
              <div className="flex items-center" style={{ gap: 5, marginTop: 5, fontSize: 12, color: T.textMuted }}>
                <AtIcon size={13} /> {at.label}
              </div>
              <div style={{ fontSize: 11, color: T.textFaint, marginTop: 4 }}>Detected {s.lastObservation}</div>
              <div className="flex" style={{ gap: 6, marginTop: 8 }}>
                <button onClick={() => onSelect(s.id)} style={smallBtn(T.blue)}>View Station</button>
                <button onClick={() => onSelect(s.id, true)} style={smallBtnOutline}>History</button>
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
const smallBtn = (color) => ({
  fontSize: 11, fontWeight: 600, padding: "5px 9px", borderRadius: 4, border: "none",
  background: color, color: T.white, cursor: "pointer",
});
const smallBtnOutline = {
  fontSize: 11, fontWeight: 600, padding: "5px 9px", borderRadius: 4, border: `1px solid ${T.border}`,
  background: T.white, color: T.textMuted, cursor: "pointer",
};

/* ============================================================
   METRIC CARD
   ============================================================ */
function MetricCard({ icon: Icon, label, value, unit, prev, spark, color }) {
  const change = prev !== undefined ? ((value - prev) / (Math.abs(prev) || 1)) * 100 : null;
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 12, background: T.white }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 6, color: T.textMuted, fontSize: 12 }}>
          <Icon size={14} color={color} /> {label}
        </div>
        {change !== null && (
          <span className="flex items-center" style={{ gap: 2, fontSize: 11, color: change >= 0 ? T.green : T.red, fontWeight: 600 }}>
            {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginTop: 6 }}>
        {value.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 500, color: T.textFaint }}> {unit}</span>
      </div>
      <div style={{ marginTop: 6 }}><Sparkline data={spark} color={color} /></div>
    </div>
  );
}

/* ============================================================
   SENSOR CHART
   ============================================================ */
function SensorChart({ title, data, unit, color, band }) {
  const anomalyPoint = data.find((d) => d.anomalous);
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 12, background: T.white }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{title} — last 24 hours</span>
        <div className="flex items-center" style={{ gap: 10, fontSize: 10.5, color: T.textFaint }}>
          <span className="flex items-center" style={{ gap: 3 }}><span style={{ width: 8, height: 8, background: "#D8E4EC", display: "inline-block", borderRadius: 2 }} /> Normal range</span>
          <span className="flex items-center" style={{ gap: 3 }}><span style={{ width: 8, height: 2, background: color, display: "inline-block" }} /> Observed</span>
          {anomalyPoint && <span className="flex items-center" style={{ gap: 3 }}><span style={{ width: 8, height: 8, background: T.red, display: "inline-block", borderRadius: 4 }} /> Anomalous</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#EEF1F4" vertical={false} />
          <XAxis dataKey="t" tick={{ fontSize: 9.5, fill: T.textFaint }} interval={3} axisLine={{ stroke: T.border }} tickLine={false} />
          <YAxis tick={{ fontSize: 9.5, fill: T.textFaint }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
          <ReferenceArea y1={band[0]} y2={band[1]} fill="#D8E4EC" fillOpacity={0.5} />
          <RTooltip
            contentStyle={{ fontSize: 11.5, borderRadius: 6, border: `1px solid ${T.border}` }}
            formatter={(v, n, p) => [`${v} ${unit}${p.payload.anomalous ? " (anomaly)" : ""}`, "Value"]}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.8} dot={false} isAnimationActive={true} animationDuration={500} />
          {anomalyPoint && (
            <ReferenceDot x={anomalyPoint.t} y={anomalyPoint.value} r={5} fill={T.red} stroke="#fff" strokeWidth={1.5} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================
   AI EXPLANATION — reasoning timeline
   ============================================================ */
function AIExplanation({ station, reduceMotion }) {
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
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", minWidth: 92,
                opacity: reduceMotion ? 1 : 0, animation: reduceMotion ? "none" : `sg-fadein 0.4s ease forwards`,
                animationDelay: reduceMotion ? "0s" : `${i * 0.15}s`,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: T.blueFaint, border: `1.5px solid ${T.blue}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.blue,
                }}>{i + 1}</div>
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

/* ============================================================
   EVENT VALIDATION — genuine weather vs sensor fault
   ============================================================ */
function EventValidation({ station, neighbors }) {
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
                {genuine ? <CheckCircle2 size={14} color={T.green} style={{ marginTop: 1, flexShrink: 0 }} /> : <XCircle size={14} color={T.red} style={{ marginTop: 1, flexShrink: 0 }} />}
                {c}
              </li>
            ))}
          </ul>
          <div style={{
            marginTop: 4, padding: "8px 12px", borderRadius: 5, fontWeight: 700, fontSize: 12.5,
            background: genuine ? T.greenBg : T.redBg, color: genuine ? T.green : T.red, display: "inline-block",
          }}>
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

/* ============================================================
   STATION DETAIL PANEL
   ============================================================ */
function StationDetail({ station, neighbors, reduceMotion }) {
  if (!station) {
    return (
      <div style={{
        border: `1px dashed ${T.border}`, borderRadius: 6, padding: 40, textAlign: "center", color: T.textFaint,
      }}>
        <MapPin size={22} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 13 }}>Select a station on the map to view live sensor readings, charts and AI diagnostics.</div>
      </div>
    );
  }
  const meta = STATUS_META[station.status];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16 }}>
        <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 8 }}>
          <div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{station.id}</span>
              <Badge color={meta.color} bg={meta.bg}><StatusDot status={station.status} size={6} /> {meta.label.toUpperCase()}</Badge>
            </div>
            <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 2 }}>{station.name} · {station.state}</div>
          </div>
          <div style={{ fontSize: 11.5, color: T.textFaint }}>Last observation: {station.lastObservation}</div>
        </div>
        <div style={{
          marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
          gap: 10, fontSize: 12, color: T.textMuted, borderTop: `1px solid ${T.border}`, paddingTop: 12,
        }}>
          <div><div style={metaLabel}>Latitude</div>{station.lat.toFixed(3)}°</div>
          <div><div style={metaLabel}>Longitude</div>{station.lon.toFixed(3)}°</div>
          <div><div style={metaLabel}>Elevation</div>{station.elevation} m</div>
          <div><div style={metaLabel}>Station Type</div>{station.stationType}</div>
          <div><div style={metaLabel}>Data Quality</div>{station.dataQuality}%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
        <MetricCard icon={Thermometer} label="Temperature" value={station.temperature} prev={station.prevTemperature} unit="°C" spark={station.sparkTemp} color={T.red} />
        <MetricCard icon={Gauge} label="Pressure" value={station.pressure} prev={station.prevPressure} unit="hPa" spark={station.sparkPress} color={T.blue} />
        <MetricCard icon={Droplets} label="Humidity" value={station.humidity} prev={station.prevHumidity} unit="%" spark={station.sparkHum} color={T.blueLight} />
        <MetricCard icon={CloudRain} label="Rainfall" value={station.rainfall} unit="mm" spark={genSparkline(station.rainfall, 12, 0.4)} color={T.saffron} />
        <MetricCard icon={Wind} label="Wind Speed" value={station.windSpeed} unit="km/h" spark={genSparkline(station.windSpeed, 12, 1.2)} color={T.green} />
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 12, background: T.white, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Compass size={20} color={T.textMuted} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 4 }}>{station.windDir}</div>
          <div style={{ fontSize: 11, color: T.textFaint }}>Wind Direction</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        <SensorChart title="Temperature" data={station.tempHist} unit="°C" color={T.red} band={[station.temperature - 3, station.temperature + 3]} />
        <SensorChart title="Pressure" data={station.pressHist} unit="hPa" color={T.blue} band={[station.pressure - 4, station.pressure + 4]} />
        <SensorChart title="Humidity" data={station.humHist} unit="%" color={T.blueLight} band={[station.humidity - 8, station.humidity + 8]} />
      </div>

      <AIExplanation station={station} reduceMotion={reduceMotion} />
      <EventValidation station={station} neighbors={neighbors} />
    </div>
  );
}
const metaLabel = { fontSize: 10.5, color: T.textFaint, marginBottom: 1 };

/* ============================================================
   SIMULATION / FAULT-INJECTION DEMO
   ============================================================ */
function SimulationPanel({ selectedStation, onInject, injecting }) {
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
        {selectedStation
          ? <>Faults will be injected into <strong style={{ color: T.text }}>{selectedStation.id}</strong>.</>
          : "Select a station on the map, or a healthy station will be chosen automatically."}
      </div>
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {faults.map((f) => {
          const Icon = f.icon;
          return (
            <button key={f.id} onClick={() => onInject(f.id)} disabled={injecting}
              style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
                padding: "8px 12px", borderRadius: 5, border: `1px solid ${T.saffron}`,
                background: T.white, color: T.saffron, cursor: injecting ? "not-allowed" : "pointer",
                opacity: injecting ? 0.6 : 1,
              }}>
              <Icon size={14} /> {f.label}
            </button>
          );
        })}
      </div>
      {injecting && (
        <div className="flex items-center" style={{ gap: 8, marginTop: 12, fontSize: 12, color: T.textMuted }}>
          <span style={{
            width: 14, height: 14, border: `2px solid ${T.saffron}`, borderTopColor: "transparent",
            borderRadius: "50%", display: "inline-block", animation: "sg-spin 0.7s linear infinite",
          }} />
          Running AI detection pipeline…
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EVENT TIMELINE (audit log)
   ============================================================ */
function EventTimeline({ events }) {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16 }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
        <Clock size={15} color={T.blue} />
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>EVENT TIMELINE</span>
      </div>
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {events.length === 0 && <div style={{ fontSize: 12, color: T.textFaint }}>No events logged yet.</div>}
        {events.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 10, paddingBottom: 10, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: e.color || T.blue, marginTop: 4 }} />
              {i < events.length - 1 && <span style={{ width: 1, flex: 1, background: T.border, marginTop: 2 }} />}
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: T.textFaint, fontVariantNumeric: "tabular-nums" }}>{e.time}</div>
              <div style={{ fontSize: 12.5, color: T.text }}>{e.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ALERT CENTER TAB
   ============================================================ */
function AlertCenterTab({ stations, acknowledged, onAcknowledge, onSelect, setActiveTab }) {
  const [filter, setFilter] = useState("all");
  const alerts = stations.filter((s) => s.status === "anomaly" || s.status === "warning")
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
          <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Alert Center</h1>
          <p style={{ fontSize: 12.5, color: T.textMuted }}>All active anomaly and warning alerts across the AWS network.</p>
        </div>
        <div className="flex" style={{ gap: 6 }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{
              fontSize: 11.5, fontWeight: 600, padding: "6px 11px", borderRadius: 14, cursor: "pointer",
              border: `1px solid ${filter === c ? T.blue : T.border}`,
              background: filter === c ? T.blueFaint : T.white, color: filter === c ? T.blue : T.textMuted,
            }}>{c === "all" ? "All" : c}</button>
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
          const meta = STATUS_META[s.status];
          const ex = explainAnomaly(s);
          return (
            <div key={s.id} style={{ border: `1px solid ${T.border}`, borderLeft: `4px solid ${meta.color}`, borderRadius: 6, background: T.white, padding: 14 }}>
              <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 8 }}>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <Badge color={meta.color} bg={meta.bg}>{severity.toUpperCase()}</Badge>
                  <span style={{ fontWeight: 700, color: T.text }}>{s.id}</span>
                  <span style={{ fontSize: 12, color: T.textMuted }}>{s.state} · {ANOMALY_TYPES[s.anomalyType]?.label}</span>
                </div>
                <span style={{ fontSize: 11.5, color: T.textFaint }}>{s.lastObservation}</span>
              </div>
              {ex && <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 8, lineHeight: 1.5 }}>{ex.headline}</div>}
              <div className="flex items-center justify-between" style={{ marginTop: 10, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11.5, color: status === "Acknowledged" ? T.green : T.textFaint, fontWeight: 600 }}>
                  Status: {status}
                </span>
                <div className="flex" style={{ gap: 6 }}>
                  <button style={smallBtn(T.blue)} onClick={() => { onSelect(s.id); setActiveTab("dashboard"); }}>View Station</button>
                  <button style={smallBtnOutline} onClick={() => onAcknowledge(s.id)} disabled={acknowledged.has(s.id)}>Acknowledge</button>
                  <button style={smallBtnOutline} onClick={() => onAcknowledge(s.id, true)}>Resolve</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   STATION REGISTRY TABLE TAB
   ============================================================ */
function TableTab({ stations, onSelect, setActiveTab }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = stations.filter((s) =>
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
    else { setSortKey(key); setSortDir("asc"); }
  };

  const exportCSV = () => {
    const header = "Station ID,Location,State,Temperature,Pressure,Humidity,Last Update,Health,Anomaly\n";
    const rows = filtered.map((s) =>
      [s.id, s.name, s.state, s.temperature.toFixed(1), s.pressure.toFixed(1), s.humidity.toFixed(1), s.lastObservation, s.status, s.anomalyType || ""].join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "skyguard_station_registry.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Station Registry</h1>
          <p style={{ fontSize: 12.5, color: T.textMuted }}>Full list of automatic weather stations with current readings.</p>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 8, top: 8 }} color={T.textFaint} />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search stations…"
              style={{ padding: "7px 10px 7px 28px", fontSize: 12.5, border: `1px solid ${T.border}`, borderRadius: 5, width: 200 }} />
          </div>
          <button onClick={exportCSV} style={{ ...smallBtn(T.blue), padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
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
                  <th key={c.key} scope="col" onClick={() => toggleSort(c.key)} style={{
                    textAlign: "left", padding: "9px 12px", fontWeight: 700, color: T.textMuted, cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    <span className="flex items-center" style={{ gap: 4 }}>
                      {c.label}
                      {sortKey === c.key && <ChevronDown size={12} style={{ transform: sortDir === "asc" ? "rotate(180deg)" : "none" }} />}
                    </span>
                  </th>
                ))}
                <th scope="col" style={{ padding: "9px 12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => {
                const meta = STATUS_META[s.status];
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={tdStyle}><strong>{s.id}</strong></td>
                    <td style={tdStyle}>{s.state}</td>
                    <td style={tdStyle}>{s.temperature.toFixed(1)}</td>
                    <td style={tdStyle}>{s.pressure.toFixed(1)}</td>
                    <td style={tdStyle}>{s.humidity.toFixed(1)}</td>
                    <td style={tdStyle}>{s.lastObservation}</td>
                    <td style={tdStyle}><Badge color={meta.color} bg={meta.bg}><StatusDot status={s.status} size={6} /> {meta.label}</Badge></td>
                    <td style={tdStyle}>
                      <button style={smallBtnOutline} onClick={() => { onSelect(s.id); setActiveTab("dashboard"); }}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between" style={{ padding: 12, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.textMuted }}>
          <span>Page {page} of {totalPages} · {filtered.length} stations</span>
          <div className="flex" style={{ gap: 6 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={smallBtnOutline}><ChevronLeft size={13} /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={smallBtnOutline}><ChevronRight size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
const tdStyle = { padding: "9px 12px", color: T.text, whiteSpace: "nowrap" };

/* ============================================================
   DATA QUALITY TAB
   ============================================================ */
function DataQualityTab({ stations }) {
  const avgQuality = (stations.reduce((a, s) => a + s.dataQuality, 0) / stations.length).toFixed(1);
  const metrics = [
    { label: "Completeness", value: 96.2, desc: "Share of expected observations successfully received." },
    { label: "Consistency", value: 94.1, desc: "Agreement between correlated sensor parameters." },
    { label: "Timeliness", value: 98.7, desc: "Observations received within the expected reporting window." },
    { label: "Validity", value: 95.4, desc: "Readings within physically plausible bounds." },
    { label: "Anomaly Rate", value: 1.5, desc: "Share of observations flagged as anomalous.", inverse: true },
  ];
  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Data Quality &amp; Validation</h1>
      <p style={{ fontSize: 12.5, color: T.textMuted, marginBottom: 16 }}>
        Network-wide data quality assessment based on the prototype's synthetic observation stream.
      </p>

      <div style={{
        display: "flex", alignItems: "center", gap: 20, border: `1px solid ${T.border}`, borderRadius: 6,
        background: T.white, padding: 20, marginBottom: 16, flexWrap: "wrap",
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: `conic-gradient(${T.green} ${avgQuality * 3.6}deg, ${T.greyBg} 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, color: T.text }}>
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
            <div style={{ fontSize: 24, fontWeight: 700, color: m.inverse ? T.amber : T.green, marginTop: 6 }}>{m.value}%</div>
            <div style={{ height: 6, background: T.greyBg, borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${m.value}%`, background: m.inverse ? T.amber : T.green }} />
            </div>
            <div style={{ fontSize: 11, color: T.textFaint, marginTop: 8 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 11.5, color: T.textFaint, border: `1px solid ${T.border}`, borderRadius: 6, padding: 12, background: T.offwhite }}>
        <strong>Methodology:</strong> Scores are computed from the prototype's simulated observation stream and fault-injection
        test cases. Prototype demonstration using simulated AWS observations — not live Government of India data.
      </div>
    </div>
  );
}

/* ============================================================
   MODEL PERFORMANCE TAB
   ============================================================ */
function ModelPerformanceTab() {
  const kpis = [
    { label: "Precision", value: null },
    { label: "Recall", value: null },
    { label: "False Positive Rate", value: null },
    { label: "F1 Score", value: null },
  ];
  const breakdown = [
    { label: "Normal Readings", value: 8600, color: T.green },
    { label: "Injected Faults", value: 214, color: T.saffron },
    { label: "Correctly Detected", value: 196, color: T.blue },
    { label: "False Positives", value: 12, color: T.amber },
    { label: "Missed Anomalies", value: 18, color: T.red },
  ];
  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Model Performance</h1>
      <p style={{ fontSize: 12.5, color: T.textMuted, marginBottom: 6 }}>
        Isolation Forest anomaly-detection model evaluated on temperature, pressure and humidity streams.
      </p>
      <div style={{
        fontSize: 11.5, color: T.amber, background: T.amberBg, border: `1px solid ${T.amber}33`, borderRadius: 5,
        padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16,
      }}>
        <Info size={13} /> Performance metrics shown are based on the prototype evaluation dataset.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.textFaint }}>{k.value ?? "-- %"}</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Evaluation Breakdown</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={breakdown} layout="vertical" margin={{ left: 30, right: 20 }}>
            <CartesianGrid stroke="#EEF1F4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10.5, fill: T.textFaint }} axisLine={{ stroke: T.border }} tickLine={false} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 11.5, fill: T.textMuted }} width={140} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={{ fontSize: 11.5, borderRadius: 6, border: `1px solid ${T.border}` }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {breakdown.map((b, i) => <React.Fragment key={i} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function SkyGuardAI() {
  const stationsInit = useStations();
  const [stations, setStations] = useState(stationsInit);
  const [selectedId, setSelectedId] = useState(stationsInit[3]?.id || null);
  const [filters, setFilters] = useState({ query: "", state: "all", status: "all" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [acknowledged, setAcknowledged] = useState(new Set());
  const [injecting, setInjecting] = useState(false);
  const [events, setEvents] = useState([
    { time: "09:41:32", text: "Temperature spike identified — AWS-MP-004", color: T.red },
    { time: "09:41:34", text: "Cross-sensor validation completed", color: T.blue },
    { time: "09:41:36", text: "Anomaly confirmed by AI detection engine", color: T.red },
  ]);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [now, setNow] = useState(() => new Date().toLocaleTimeString("en-IN", { hour12: false }));

  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleTimeString("en-IN", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const stateOptions = useMemo(() => [...new Set(stations.map((s) => s.state))].sort(), [stations]);

  const filtered = useMemo(() => stations.filter((s) => {
    if (filters.state !== "all" && s.state !== filters.state) return false;
    if (filters.status !== "all" && s.status !== filters.status) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (!s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q) && !s.state.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [stations, filters]);

  const stats = useMemo(() => ({
    total: stations.length,
    healthy: stations.filter((s) => s.status === "healthy").length,
    warning: stations.filter((s) => s.status === "warning").length,
    anomaly: stations.filter((s) => s.status === "anomaly").length,
    offline: stations.filter((s) => s.status === "offline").length,
  }), [stations]);

  const selectedStation = stations.find((s) => s.id === selectedId) || null;

  const neighbors = useMemo(() => {
    if (!selectedStation) return [];
    return stations
      .filter((s) => s.id !== selectedStation.id)
      .map((s) => ({ ...s, dist: Math.hypot(s.lat - selectedStation.lat, s.lon - selectedStation.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
  }, [stations, selectedStation]);

  const handleSelect = useCallback((id) => { setSelectedId(id); }, []);
  const handleAcknowledge = useCallback((id) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  }, []);

  const pushEvent = (text, color) => {
    const t = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setEvents((prev) => [{ time: t, text, color }, ...prev].slice(0, 30));
  };

  const handleInject = (faultType) => {
    let targetId = selectedId;
    if (!targetId || stations.find((s) => s.id === targetId)?.status === "offline") {
      const healthy = stations.find((s) => s.status === "healthy");
      targetId = healthy ? healthy.id : stations[0].id;
      setSelectedId(targetId);
    }
    setInjecting(true);
    pushEvent(`New observation received — ${targetId}`, T.blue);

    setTimeout(() => {
      setStations((prev) => prev.map((s) => {
        if (s.id !== targetId) {
          // for extreme weather, nudge a couple of neighbours too
          return s;
        }
        const anomalyIdx = 23;
        const isExtreme = faultType === "extreme_weather";
        const delta = isExtreme ? rand(6, 10) : pick([1, -1]) * rand(9, 17);
        const newTempHist = [...s.tempHist];
        newTempHist[anomalyIdx] = { ...newTempHist[anomalyIdx], value: Number((newTempHist[anomalyIdx].value + delta).toFixed(2)), anomalous: true };
        return {
          ...s,
          status: "anomaly",
          anomalyType: faultType,
          anomalySource: isExtreme ? "genuine_weather" : "sensor_fault",
          anomalyIdx,
          confidence: Number(rand(0.86, 0.98).toFixed(2)),
          temperature: newTempHist[anomalyIdx].value,
          tempHist: newTempHist,
          lastObservation: "just now",
        };
      }));

      if (faultType === "extreme_weather") {
        setStations((prev) => {
          const target = prev.find((s) => s.id === targetId);
          if (!target) return prev;
          const near = prev
            .filter((s) => s.id !== targetId)
            .map((s) => ({ ...s, dist: Math.hypot(s.lat - target.lat, s.lon - target.lon) }))
            .sort((a, b) => a.dist - b.dist).slice(0, 2).map((s) => s.id);
          return prev.map((s) => near.includes(s.id) ? { ...s, status: "warning", anomalyType: "extreme_weather", confidence: Number(rand(0.6, 0.75).toFixed(2)) } : s);
        });
      }

      pushEvent("Pattern analysis in progress", T.blue);
      pushEvent("Cross-sensor validation completed", T.blue);
      pushEvent(`${ANOMALY_TYPES[faultType]?.label || "Anomaly"} identified — ${targetId}`, T.red);
      pushEvent(`Anomaly confirmed by AI detection engine — ${targetId}`, T.red);
      setInjecting(false);
    }, 1200);
  };

  const alertCount = stations.filter((s) => s.status === "anomaly" && !acknowledged.has(s.id)).length;

  return (
    <div style={{
      fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif", background: T.offwhite, minHeight: "100%",
      fontSize: `${14 * fontScale}px`, color: T.text,
      filter: highContrast ? "contrast(1.25) saturate(1.1)" : "none",
    }}>
      <style>{`
        @keyframes sg-ping { 0% { transform: scale(1); opacity: 0.6; } 75%,100% { transform: scale(2.1); opacity: 0; } }
        @keyframes sg-ring { 0% { transform: scale(1); opacity: 0.9; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes sg-fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sg-spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
          outline: 2px solid #1B4B7A; outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>

      <Header fontScale={fontScale} setFontScale={setFontScale} highContrast={highContrast} setHighContrast={setHighContrast}
        reduceMotion={reduceMotion} setReduceMotion={setReduceMotion} now={now} />
      <InfoBar stats={stats} reduceMotion={reduceMotion} lastSync={now} />
      <TabBar active={activeTab} setActive={setActiveTab} alertCount={alertCount} />

      <main id="main-content" style={{ minHeight: 600 }}>
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Sidebar filters={filters} setFilters={setFilters} stateOptions={stateOptions} resultCount={filtered.length} />
            <div style={{ flex: 1, minWidth: 0, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <IndiaMap stations={filtered} selectedId={selectedId} onSelect={handleSelect} reduceMotion={reduceMotion} />
              <SimulationPanel selectedStation={selectedStation} onInject={handleInject} injecting={injecting} />
              <StationDetail station={selectedStation} neighbors={neighbors} reduceMotion={reduceMotion} />
              <EventTimeline events={events} />
            </div>
            <AnomalyIntelligencePanel stations={stations} onSelect={handleSelect} onAcknowledge={handleAcknowledge} acknowledged={acknowledged} />
          </div>
        )}
        {activeTab === "alerts" && (
          <AlertCenterTab stations={stations} acknowledged={acknowledged} onAcknowledge={handleAcknowledge} onSelect={handleSelect} setActiveTab={setActiveTab} />
        )}
        {activeTab === "table" && <TableTab stations={stations} onSelect={handleSelect} setActiveTab={setActiveTab} />}
        {activeTab === "quality" && <DataQualityTab stations={stations} />}
        {activeTab === "performance" && <ModelPerformanceTab />}
      </main>

      <footer style={{ background: T.navy, color: "rgba(255,255,255,0.8)", padding: "24px", marginTop: 20, fontSize: 12 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 18 }}>
          <div>
            <div style={{ fontWeight: 700, color: T.white, marginBottom: 8 }}>SkyGuard AI</div>
            <p style={{ color: "rgba(255,255,255,0.55)" }}>Prototype developed for Smart India Hackathon. Not an official Government of India platform.</p>
          </div>
          {[
            { h: "About", items: ["System Overview", "Data & Methodology", "About SkyGuard AI"] },
            { h: "Trust", items: ["Accessibility", "Privacy", "Security", "Terms / Disclaimer"] },
            { h: "Support", items: ["Contact", "Help"] },
          ].map((col) => (
            <div key={col.h}>
              <div style={{ fontWeight: 700, color: T.white, marginBottom: 8 }}>{col.h}</div>
              {col.items.map((it) => <div key={it} style={{ color: "rgba(255,255,255,0.6)", marginBottom: 5 }}>{it}</div>)}
            </div>
          ))}
        </div>
        <div style={{
          maxWidth: 1200, margin: "18px auto 0", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)", fontSize: 11,
        }}>
          Prototype demonstration using simulated AWS observations. Governance Meteorological Operations — neutral placeholder identity, no official affiliation implied.
          If real government/IMD data is later integrated, its use will be subject to applicable Government of India data-sharing, licensing, security and access policies.
        </div>
      </footer>
    </div>
  );
}
