import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { T, ANOMALY_TYPES } from "../../constants/theme";

export default function IndiaMap({ stations, selectedId, onSelect, reduceMotion }) {
  const [hovered, setHovered] = useState(null);
  const hoveredStation = stations.find((s) => s.id === hovered);

  const statusColors = {
    healthy: "#22c55e",
    warning: "#f59e0b",
    anomaly: "#ef4444",
    offline: "#94a3b8",
  };

  const statusLabels = {
    healthy: "Healthy",
    warning: "Warning",
    anomaly: "Anomaly",
    offline: "Offline",
  };

  const stationIcon = (station) => {
    const color = statusColors[station.status] || "#22c55e";
    const isAnomaly = station.status === "anomaly";
    const isSelected = station.id === selectedId;

    return L.divIcon({
      className: "",
      html: `
        <div style="
          position: relative;
          width: ${isSelected ? 30 : 24}px;
          height: ${isSelected ? 30 : 24}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${
            isAnomaly && !reduceMotion
              ? `
                <div style="
                  position:absolute;
                  width:30px;
                  height:30px;
                  border-radius:50%;
                  background:${color};
                  opacity:0.35;
                  animation:sg-map-pulse 1.6s ease-out infinite;
                "></div>
              `
              : ""
          }

          ${
            isSelected
              ? `
                <div style="
                  position:absolute;
                  width:32px;
                  height:32px;
                  border-radius:50%;
                  border:2px solid #38bdf8;
                  animation:${reduceMotion ? "none" : "sg-map-ring 1.5s ease-out infinite"};
                "></div>
              `
              : ""
          }

          <div style="
            position:relative;
            z-index:2;
            width:${isSelected ? 18 : 14}px;
            height:${isSelected ? 18 : 14}px;
            border-radius:50%;
            background:${color};
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.45);
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#111827",
        borderRadius: 6,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          background: "rgba(8,27,52,0.92)",
          backdropFilter: "blur(8px)",
          color: "white",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            India AWS Monitoring Network
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: "rgba(255,255,255,0.7)",
              marginTop: 2,
            }}
          >
            Live satellite view · Automatic Weather Stations
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
          }}
        >
          {Object.entries(statusColors).map(([status, color]) => (
            <span
              key={status}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  boxShadow:
                    status === "anomaly"
                      ? `0 0 8px ${color}`
                      : "none",
                }}
              />
              {statusLabels[status]}
            </span>
          ))}
        </div>
      </div>

      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "560px",
          background: "#111827",
        }}
      >
        <TileLayer
          attribution='&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={stationIcon(station)}
            eventHandlers={{
              mouseover: () => setHovered(station.id),
              mouseout: () => setHovered(null),
              click: () => onSelect(station.id),
            }}
          >
            <Popup>
              <div
                style={{
                  minWidth: 210,
                  fontFamily: "Inter, Segoe UI, sans-serif",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0B2545",
                    marginBottom: 3,
                  }}
                >
                  {station.id}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#5A6B7C",
                    marginBottom: 10,
                  }}
                >
                  {station.name}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 7,
                    fontSize: 11.5,
                  }}
                >
                  <div>
                    🌡️ <b>{station.temperature.toFixed(1)}°C</b>
                  </div>
                  <div>
                    💧 <b>{station.humidity.toFixed(0)}%</b>
                  </div>
                  <div>
                    🧭 <b>{station.pressure.toFixed(0)} hPa</b>
                  </div>
                  <div>
                    💨 <b>{station.windSpeed} km/h</b>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: "1px solid #DBE1E7",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: statusColors[station.status],
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusColors[station.status],
                    }}
                  />
                  {statusLabels[station.status]}
                </div>

                {station.anomalyType && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "6px 8px",
                      borderRadius: 5,
                      background:
                        station.status === "anomaly"
                          ? "#FBEAE7"
                          : "#FBF1D9",
                      color:
                        station.status === "anomaly"
                          ? "#B23327"
                          : "#9C6B0B",
                      fontSize: 10.5,
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {ANOMALY_TYPES[station.anomalyType]?.label || "Data anomaly detected"}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {hoveredStation && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            zIndex: 1000,
            background: "rgba(8,27,52,0.94)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "9px 12px",
            borderRadius: 6,
            fontSize: 11,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700 }}>{hoveredStation.id}</div>
          <div style={{ color: "rgba(255,255,255,0.72)" }}>{hoveredStation.name}</div>
        </div>
      )}

      <style>{`
        @keyframes sg-map-pulse {
          0% {
            transform: scale(0.7);
            opacity: 0.65;
          }
          70% {
            transform: scale(2.1);
            opacity: 0;
          }
          100% {
            transform: scale(2.1);
            opacity: 0;
          }
        }

        @keyframes sg-map-ring {
          0% {
            transform: scale(0.7);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }

        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
}
