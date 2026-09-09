import React from "react";
import { MapPin, Thermometer, Gauge, Droplets, CloudRain, Wind, Compass } from "lucide-react";
import StatusDot from "../common/StatusDot";
import Badge from "../common/Badge";
import MetricCard from "../common/MetricCard";
import SensorChart from "./SensorChart";
import AIExplanation from "./AIExplanation";
import EventValidation from "./EventValidation";
import { genSparkline } from "../../utils/mockData";
import { T, STATUS_META } from "../../constants/theme";

const metaLabel = { fontSize: 10.5, color: T.textFaint, marginBottom: 1 };

export default function StationDetail({ station, neighbors, reduceMotion }) {
  if (!station) {
    return (
      <div
        style={{
          border: `1px dashed ${T.border}`,
          borderRadius: 6,
          padding: 40,
          textAlign: "center",
          color: T.textFaint,
        }}
      >
        <MapPin size={22} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 13 }}>
          Select a station on the map to view live sensor readings, charts and AI diagnostics.
        </div>
      </div>
    );
  }

  const meta = STATUS_META[station.status] || STATUS_META.healthy;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, padding: 16 }}>
        <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 8 }}>
          <div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{station.id}</span>
              <Badge color={meta.color} bg={meta.bg}>
                <StatusDot status={station.status} size={6} /> {meta.label.toUpperCase()}
              </Badge>
            </div>
            <div style={{ fontSize: 12.5, color: T.textMuted, marginTop: 2 }}>
              {station.name} · {station.state}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: T.textFaint }}>Last observation: {station.lastObservation}</div>
        </div>
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
            gap: 10,
            fontSize: 12,
            color: T.textMuted,
            borderTop: `1px solid ${T.border}`,
            paddingTop: 12,
          }}
        >
          <div><div style={metaLabel}>Latitude</div>{station.lat.toFixed(3)}°</div>
          <div><div style={metaLabel}>Longitude</div>{station.lon.toFixed(3)}°</div>
          <div><div style={metaLabel}>Elevation</div>{station.elevation} m</div>
          <div><div style={metaLabel}>Station Type</div>{station.stationType}</div>
          <div><div style={metaLabel}>Data Quality</div>{station.dataQuality}%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
        <MetricCard
          icon={Thermometer}
          label="Temperature"
          value={station.temperature}
          prev={station.prevTemperature}
          unit="°C"
          spark={station.sparkTemp}
          color={T.red}
        />
        <MetricCard
          icon={Gauge}
          label="Pressure"
          value={station.pressure}
          prev={station.prevPressure}
          unit="hPa"
          spark={station.sparkPress}
          color={T.blue}
        />
        <MetricCard
          icon={Droplets}
          label="Humidity"
          value={station.humidity}
          prev={station.prevHumidity}
          unit="%"
          spark={station.sparkHum}
          color={T.blueLight}
        />
        <MetricCard
          icon={CloudRain}
          label="Rainfall"
          value={station.rainfall}
          unit="mm"
          spark={genSparkline(station.rainfall, 12, 0.4)}
          color={T.saffron}
        />
        <MetricCard
          icon={Wind}
          label="Wind Speed"
          value={station.windSpeed}
          unit="km/h"
          spark={genSparkline(station.windSpeed, 12, 1.2)}
          color={T.green}
        />
        <div
          style={{
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: 12,
            background: T.white,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Compass size={20} color={T.textMuted} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 4 }}>{station.windDir}</div>
          <div style={{ fontSize: 11, color: T.textFaint }}>Wind Direction</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        <SensorChart
          title="Temperature"
          data={station.tempHist}
          unit="°C"
          color={T.red}
          band={[station.temperature - 3, station.temperature + 3]}
        />
        <SensorChart
          title="Pressure"
          data={station.pressHist}
          unit="hPa"
          color={T.blue}
          band={[station.pressure - 4, station.pressure + 4]}
        />
        <SensorChart
          title="Humidity"
          data={station.humHist}
          unit="%"
          color={T.blueLight}
          band={[station.humidity - 8, station.humidity + 8]}
        />
      </div>

      <AIExplanation station={station} reduceMotion={reduceMotion} />
      <EventValidation station={station} neighbors={neighbors} />
    </div>
  );
}
