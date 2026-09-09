import { useMemo } from "react";
import { REGIONS } from "../constants/theme";

/* ============================================================
   SEEDED RNG — deterministic mock data
   ============================================================ */
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rng = mulberry32(20260908);
export const rand = (min, max) => min + rng() * (max - min);
export const pick = (arr) => arr[Math.floor(rng() * arr.length)];

/* ============================================================
   MOCK DATA GENERATION
   ============================================================ */
export function genSparkline(base, n = 12, vol = 1) {
  let v = base;
  const out = [];
  for (let i = 0; i < n; i++) {
    v += rand(-vol, vol);
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

export function genHistory(base, range, hours = 24, anomalyAt = null, anomalyDelta = 0) {
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

export function makeStation(idx, region, forcedStatus) {
  const num = String(idx + 1).padStart(3, "0");
  const id = `AWS-${region.code}-${num}`;
  const jitterLat = region.lat + rand(-0.9, 0.9);
  const jitterLon = region.lon + rand(-0.9, 0.9);

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
    lat: jitterLat, lon: jitterLon,
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

export function useStations() {
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
    const mpRegion = REGIONS.find((r) => r.code === "MP") || REGIONS[0];
    list[3] = makeStation(3, mpRegion, "anomaly");
    list[3].anomalyType = "spike";
    return list;
  }, []);
}

export function explainAnomaly(station) {
  if (!station || !station.anomalyType) return null;
  const type = station.anomalyType;
  const deltaT = (station.tempHist?.[station.anomalyIdx]?.value - station.tempHist?.[station.anomalyIdx - 1]?.value) || 0;
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
