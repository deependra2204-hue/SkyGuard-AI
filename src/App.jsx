import React, { useState, useMemo, useEffect, useCallback } from "react";
import Header from "./components/layout/Header";
import InfoBar from "./components/layout/InfoBar";
import TabBar from "./components/layout/TabBar";
import Footer from "./components/layout/Footer";

import Sidebar from "./components/dashboard/Sidebar";
import IndiaMap from "./components/map/IndiaMap";
import SimulationPanel from "./components/dashboard/SimulationPanel";
import StationDetail from "./components/station/StationDetail";
import EventTimeline from "./components/dashboard/EventTimeline";
import AnomalyIntelligencePanel from "./components/dashboard/AnomalyIntelligencePanel";

import AlertCenterTab from "./components/tabs/AlertCenterTab";
import TableTab from "./components/tabs/TableTab";
import DataQualityTab from "./components/tabs/DataQualityTab";
import ModelPerformanceTab from "./components/tabs/ModelPerformanceTab";

import { useStations, rand, pick } from "./utils/mockData";
import { T, ANOMALY_TYPES } from "./constants/theme";

const TRANSLATIONS = {
  en: {
    monitoringDashboard: "Monitoring Dashboard",
    alertCenter: "Alert Center",
    stationRegistry: "Station Registry",
    dataQuality: "Data Quality",
    modelPerformance: "Model Performance",
    online: "Online",
    offline: "Offline",
    healthy: "Healthy",
    warning: "Warning",
    anomaly: "Anomaly",
    station: "Station",
    temperature: "Temperature",
    humidity: "Humidity",
    pressure: "Pressure",
    wind: "Wind Speed",
  },

  hi: {
    monitoringDashboard: "निगरानी डैशबोर्ड",
    alertCenter: "अलर्ट केंद्र",
    stationRegistry: "स्टेशन रजिस्ट्री",
    dataQuality: "डेटा गुणवत्ता",
    modelPerformance: "मॉडल प्रदर्शन",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    healthy: "स्वस्थ",
    warning: "चेतावनी",
    anomaly: "असामान्यता",
    station: "स्टेशन",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    pressure: "वायुदाब",
    wind: "हवा की गति",
  },
};

const t = (language, key) =>
  TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;

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

  const [language, setLanguage] = useState(
  () => localStorage.getItem("skyguard-language") || "en"
);

useEffect(() => {
  localStorage.setItem("skyguard-language", language);
}, [language]);

useEffect(() => {
  document.documentElement.lang = language === "hi" ? "hi" : "en";
}, [language]);

  const [now, setNow] = useState(() => new Date().toLocaleTimeString("en-IN", { hour12: false }));

  const [isOnline, setIsOnline] = useState(
  () => typeof navigator !== "undefined" ? navigator.onLine : true
);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);

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
        if (s.id !== targetId) return s;
        const anomalyIdx = 23;
        const isExtreme = faultType === "extreme_weather";
        const delta = isExtreme ? rand(6, 10) : pick([1, -1]) * rand(9, 17);
        const newTempHist = [...s.tempHist];
        newTempHist[anomalyIdx] = {
          ...newTempHist[anomalyIdx],
          value: Number((newTempHist[anomalyIdx].value + delta).toFixed(2)),
          anomalous: true,
        };
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
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2)
            .map((s) => s.id);
          return prev.map((s) =>
            near.includes(s.id)
              ? { ...s, status: "warning", anomalyType: "extreme_weather", confidence: Number(rand(0.6, 0.75).toFixed(2)) }
              : s
          );
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
    <div
      style={{
       fontFamily:
        language === "hi"
        ? "'Noto Sans Devanagari', 'Noto Sans', sans-serif"
        : "Inter, 'Segoe UI', system-ui, sans-serif",
        background: T.offwhite,
        minHeight: "100%",
        fontSize: `${14 * fontScale}px`,
        color: T.text,
        filter: highContrast ? "contrast(1.25) saturate(1.1)" : "none",
      }}
    >
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

      <Header
        fontScale={fontScale}
        setFontScale={setFontScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        reduceMotion={reduceMotion}
        setReduceMotion={setReduceMotion}
        now={now}
        isOnline={isOnline}
        setLanguage={setLanguage}
        language={language}
      />
      <InfoBar stats={stats} reduceMotion={reduceMotion} lastSync={now} />
      <TabBar active={activeTab} 
      setActive={setActiveTab}
       alertCount={alertCount}
       language={language}
        />

      <main id="main-content" style={{ minHeight: 600 }}>
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Sidebar
              filters={filters}
              setFilters={setFilters}
              stateOptions={stateOptions}
              resultCount={filtered.length}
            />
            <div style={{ flex: 1, minWidth: 0, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <IndiaMap
                stations={filtered}
                selectedId={selectedId}
                onSelect={handleSelect}
                reduceMotion={reduceMotion}
              />
              <SimulationPanel
                selectedStation={selectedStation}
                onInject={handleInject}
                injecting={injecting}
              />
              <StationDetail
                station={selectedStation}
                neighbors={neighbors}
                reduceMotion={reduceMotion}
              />
              <EventTimeline events={events} />
            </div>
            <AnomalyIntelligencePanel
              stations={stations}
              onSelect={handleSelect}
              onAcknowledge={handleAcknowledge}
              acknowledged={acknowledged}
            />
          </div>
        )}
        {activeTab === "alerts" && (
          <AlertCenterTab
            stations={stations}
            acknowledged={acknowledged}
            onAcknowledge={handleAcknowledge}
            onSelect={handleSelect}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "table" && (
          <TableTab
            stations={stations}
            onSelect={handleSelect}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "quality" && <DataQualityTab stations={stations} />}
        {activeTab === "performance" && <ModelPerformanceTab />}
      </main>

      <Footer />
    </div>
  );
}
