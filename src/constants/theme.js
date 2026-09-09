import {
  CheckCircle2, AlertTriangle, XCircle, WifiOff,
  Zap, PauseCircle, TrendingUp, Waves, ShieldAlert, CloudRain,
  LayoutDashboard, Bell, Table2, GaugeCircle, LineChart as LineChartIcon
} from "lucide-react";

/* ============================================================
   THEME — government / meteorological operations palette
   ============================================================ */
export const T = {
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

export const STATUS_META = {
  healthy: { label: "Healthy", color: T.green, bg: T.greenBg, icon: CheckCircle2 },
  warning: { label: "Warning", color: T.amber, bg: T.amberBg, icon: AlertTriangle },
  anomaly: { label: "Anomaly", color: T.red, bg: T.redBg, icon: XCircle },
  offline: { label: "Offline", color: T.grey, bg: T.greyBg, icon: WifiOff },
};

export const ANOMALY_TYPES = {
  spike: { label: "Sensor Spike", icon: Zap },
  stuck: { label: "Sensor Stuck", icon: PauseCircle },
  drift: { label: "Sensor Drift", icon: TrendingUp },
  dropout: { label: "Data Dropout", icon: WifiOff },
  cross_sensor: { label: "Cross-Sensor Inconsistency", icon: Waves },
  implausible: { label: "Physically Implausible Reading", icon: ShieldAlert },
  extreme_weather: { label: "Extreme Weather Signature", icon: CloudRain },
};

export const TABS = [
  { id: "dashboard", label: "Monitoring Dashboard", icon: LayoutDashboard },
  { id: "alerts", label: "Alert Center", icon: Bell },
  { id: "table", label: "Station Registry", icon: Table2 },
  { id: "quality", label: "Data Quality", icon: GaugeCircle },
  { id: "performance", label: "Model Performance", icon: LineChartIcon },
];

/* ============================================================
   GEOGRAPHY — approximate anchor points across India
   ============================================================ */
export const REGIONS = [
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
