import React from "react";
import { Clock } from "lucide-react";
import { T } from "../../constants/theme";

export default function EventTimeline({ events = [] }) {
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
