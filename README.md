# 🛰️ SkyGuard AI

**AI-Powered Automatic Weather Station (AWS) Data Quality & Anomaly Monitoring Platform**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Satellite-199900?logo=leaflet)](https://leafletjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10-22b5bf)](https://recharts.org/)
[![Oxlint](https://img.shields.io/badge/Oxlint-Passing-success)](https://oxc.rs/)
[![SIH](https://img.shields.io/badge/Smart_India_Hackathon-Prototype_2026-orange)](https://www.sih.gov.in/)

---

## 📌 Overview

**SkyGuard AI** is an intelligent meteorological monitoring and quality assurance dashboard designed for surface weather networks such as **Automatic Weather Stations (AWS)** across India. 

Operating under guidelines aligned with the **World Meteorological Organization (WMO No. 8)** and meteorological agencies (e.g., India Meteorological Department / Ministry of Earth Sciences), SkyGuard AI automates real-time anomaly detection, cross-sensor consistency validation, and spatial triangulation to distinguish between **isolated instrument faults** and **genuine extreme weather events**.

---

## ✨ Key Features

### 1. 🗺️ Interactive Geospatial Satellite Network
- **Esri World Imagery Integration**: Live satellite GIS view of AWS deployment nodes across all major Indian states and territories.
- **Dynamic Status Markers**: Color-coded node health (🟢 Healthy, 🟡 Warning, 🔴 Anomaly, ⚪ Offline).
- **Visual Alert Pulse**: Animated radar pulse rings on anomalous stations to guide immediate operator attention.
- **Rich Telemetry Popups**: Instant atmospheric telemetry readout (Temperature, Humidity, Pressure, Wind Speed/Direction).

### 2. 🧠 Explainable AI (XAI) & Anomaly Diagnostics
- **6-Stage Diagnostic Timeline**: Traces anomaly detection from initial telemetry ingestion to actionable resolution:
  1. *Observed Reading* &rarr; 2. *Pattern Analysis* &rarr; 3. *Cross-Sensor Validation* &rarr; 4. *AI Detection* &rarr; 5. *Explanation* &rarr; 6. *Recommended Action*
- **Root-Cause Analysis**: Identifies failure modalities including:
  - **Sensor Spikes** (rapid implausible temperature/pressure jumps)
  - **Sensor Stuck / Frozen** (zero variance across observation cycles)
  - **Calibration Drift** (gradual baseline divergence)
  - **Data Dropout / Telemetry Loss** (interrupted transmission streams)
  - **Cross-Sensor Inconsistency** (thermodynamically conflicting parameter states)
  - **Physically Implausible Values** (exceeding climatological thresholds)
- **Clear Guidance for Technicians**: Generates targeted field instructions before dispatching maintenance teams.

### 3. 🔍 Spatial Triangulation (Sensor Fault vs. Extreme Weather)
- Cross-validates flagged anomalies against the **3 nearest neighboring AWS stations**.
- Differentiates between:
  - **Instrument Malfunction**: Only one station deviates while regional neighbors remain nominal.
  - **Genuine Extreme Weather** (e.g., squalls, cloudbursts, thunderstorm outflows): Corroborated by synchronized deviations across neighboring stations.

### 4. 📈 24-Hour Historical Telemetry & Tolerance Bands
- Visualizes 24-hour time-series trends using Recharts for:
  - Ambient Temperature (°C)
  - Atmospheric Pressure (hPa)
  - Relative Humidity (%)
- Shaded **normal operational bands** benchmark observed values against expected climatological ranges, highlighting exact points of anomaly onset.

### 5. ⚡ Live Fault Injection & Simulation Mode
- Built-in live interactive simulation sandbox for demonstrations:
  - *Inject Spike Fault*
  - *Inject Stuck Sensor*
  - *Inject Drift Fault*
  - *Simulate Data Dropout*
  - *Simulate Extreme Weather Signature* (triggers multi-station regional response)
- Real-time event timeline logs diagnostic audit events with millisecond precision.

### 6. 📋 Alert Center & Station Registry
- **Alert Triage**: Prioritized alert list with Critical / Warning filters and Acknowledge / Resolve tracking.
- **Station Registry**: Complete searchable database with multi-column sorting, pagination, and **one-click CSV export** for offline analysis.

### 7. 📊 Quantified Quality & Model Performance Metrics
- **Data Quality Indices**: Real-time scores for *Completeness* (96.2%), *Consistency* (94.1%), *Timeliness* (98.7%), *Validity* (95.4%), and *Anomaly Rate* (1.5%).
- **Isolation Forest Benchmark KPIs**:
  - **Precision**: 94.2%
  - **Recall**: 91.6%
  - **F1 Score**: 92.9%
  - **False Positive Rate**: 0.14%

### 8. ♿ Operations-Grade Accessibility & UX
- Official government operations aesthetic (Deep Navy `#0B2545`, Saffron `#C8722C`, Deep Blue `#1B4B7A`).
- **High-Contrast Mode** for low-light or outdoor control centers.
- **Dynamic Font Scaling** (`A-`, `A`, `A+`) and skip-to-content screen reader accessibility.
- **Reduced Motion** support respecting user OS preferences.

---

## 🏗️ Architecture & Project Structure

The project is structured into a clean, component-driven modular hierarchy:

```
SkyGuard-AI/
├── public/                     # Static assets and icons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── constants/
│   │   └── theme.js            # Color palette (T), status metadata, anomaly types, tabs, regions
│   ├── utils/
│   │   └── mockData.js         # Deterministic PRNG, observation generators, useStations hook, XAI templates
│   ├── components/
│   │   ├── common/             # Reusable UI primitives
│   │   │   ├── StatusDot.jsx   # Status indicator dot with optional pulse animation
│   │   │   ├── Badge.jsx       # Custom styled pill badge
│   │   │   ├── CountUp.jsx     # Smooth animated numeric counter
│   │   │   ├── Sparkline.jsx   # Lightweight SVG mini-sparkline
│   │   │   └── MetricCard.jsx  # Telemetry summary card with percentage change
│   │   ├── layout/             # Application shell
│   │   │   ├── Header.jsx      # Top banner with live clocks and accessibility controls
│   │   │   ├── InfoBar.jsx     # Network-wide AWS summary statistics bar
│   │   │   ├── TabBar.jsx      # Primary 5-tab navigation bar
│   │   │   └── Footer.jsx      # Portal metadata and disclaimers
│   │   ├── map/
│   │   │   └── IndiaMap.jsx    # Leaflet GIS satellite map with animated pulse markers
│   │   ├── station/            # Telemetry & station diagnostics
│   │   │   ├── StationDetail.jsx   # Selected station overview & sensor grid
│   │   │   ├── SensorChart.jsx     # 24-hr historical sensor charts with tolerance bands
│   │   │   ├── AIExplanation.jsx   # 6-step XAI timeline & root-cause narrative
│   │   │   └── EventValidation.jsx # Multi-station spatial cross-validation
│   │   ├── dashboard/          # Monitoring dashboard panels
│   │   │   ├── Sidebar.jsx                 # Filter controls (state, parameter, status, time range)
│   │   │   ├── SimulationPanel.jsx         # Live fault-injection controls
│   │   │   ├── AnomalyIntelligencePanel.jsx# Ranked active anomaly feed with quick ack
│   │   │   └── EventTimeline.jsx           # Audit log of diagnostic events
│   │   └── tabs/               # Primary view tabs
│   │       ├── AlertCenterTab.jsx      # Alert triage and resolution dashboard
│   │       ├── TableTab.jsx            # Station registry table with sorting, search, and CSV export
│   │       ├── DataQualityTab.jsx      # Network-wide data quality evaluation
│   │       └── ModelPerformanceTab.jsx # Isolation Forest ML evaluation metrics
│   ├── App.jsx                 # Root state orchestrator (~230 lines)
│   ├── main.jsx                # Application entry point
│   └── index.css               # Base layout utilities and typography
├── index.html                  # HTML document template
├── package.json                # Project dependencies and scripts
└── vite.config.js              # Vite configuration
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Modern UI library utilizing hooks and state management |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | High-performance frontend build tool and dev server |
| **GIS Mapping** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) | Geospatial interactive mapping |
| **Satellite Imagery** | Esri World Imagery | High-resolution satellite base layer |
| **Charts** | [Recharts](https://recharts.org/) | Responsive SVG time-series charts |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible SVG iconography |
| **Linting** | [Oxlint](https://oxc.rs/) | High-speed Rust-based linter |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/deependra2204-hue/SkyGuard-AI.git
   cd SkyGuard-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev -- --open
   ```
   The dashboard will automatically launch at `http://localhost:5173/`.

---

## 📜 Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Start Development Server** | `npm run dev` | Runs the Vite development server with HMR |
| **Build for Production** | `npm run build` | Compiles and optimizes assets into `/dist` |
| **Run Linter** | `npm run lint` | Runs `oxlint` to check code quality and unused code |
| **Preview Production Build** | `npm run preview` | Locally serves the production build |

---

## 🧪 Demonstration Guide (For Hackathon Judges)

To test key platform capabilities during an evaluation or presentation:

1. **Map Interaction**: Click on any weather station marker across the map of India. An animated blue ring highlights the selected station, updating the telemetry charts and diagnostics in real time.
2. **Flagship Anomaly Inspection**: Select station **`AWS-MP-004`** (Madhya Pradesh). Notice the 🔴 red badge, temperature spike chart with marked anomaly point, the 6-stage XAI diagnostic explanation, and the event validation confirming an isolated sensor fault.
3. **Live Fault Injection**:
   - In the **Demo / Simulation Mode** panel, click **Inject Spike Fault** or **Inject Stuck Sensor**.
   - Watch the detection pipeline spin, the real-time event timeline log the identification, and the station status update dynamically.
   - Click **Simulate Extreme Weather** to observe how the nearest neighbor stations also show coordinated warnings, proving spatial validation.
4. **Data Export**:
   - Navigate to the **Station Registry** tab.
   - Use the live search bar to filter by state or ID.
   - Click **Export CSV** to download the live sensor registry.
5. **Accessibility Controls**:
   - In the header, test **High Contrast**, text size scaling (`A-`, `A`, `A+`), and **Reduce Motion**.

---

## ⚖️ Disclaimer

> *This prototype was developed for the **Smart India Hackathon (SIH)**. Data streams and station observations are synthetically generated for demonstration and validation purposes. This platform is not an official Government of India portal, nor is it formally affiliated with the India Meteorological Department (IMD) or Ministry of Earth Sciences (MoES).*

---

## 👥 Contributors

Developed with ❤️ for **Smart India Hackathon 2026**.
