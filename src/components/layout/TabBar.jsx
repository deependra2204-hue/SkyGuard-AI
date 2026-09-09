import React from "react";
import { T, TABS } from "../../constants/theme";

export default function TabBar({ active, setActive, alertCount, language }) {
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
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "11px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? T.white : "rgba(255,255,255,0.68)",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                borderBottom: isActive ? `3px solid ${T.saffron}` : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                
              }}
            >
              <Icon size={15} /> 
              {language === "hi"
  ? {
      dashboard: "निगरानी डैशबोर्ड",
      alerts: "अलर्ट केंद्र",
      table: "स्टेशन रजिस्ट्री",
      quality: "डेटा गुणवत्ता",
      performance: "मॉडल प्रदर्शन",
    }[tab.id] || tab.label
  : tab.label}
  
              {tab.id === "alerts" && alertCount > 0 && (
                <span
                  style={{
                    background: T.red,
                    color: T.white,
                    fontSize: 10.5,
                    fontWeight: 700,
                    borderRadius: 9,
                    padding: "1px 6px",
                    marginLeft: 2,
                  }}
                >
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
