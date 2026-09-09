import React from "react";

export default function Badge({ children, color, bg, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 4,
        color,
        background: bg,
        letterSpacing: 0.2,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
