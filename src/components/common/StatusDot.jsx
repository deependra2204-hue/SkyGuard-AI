import React from "react";
import { STATUS_META } from "../../constants/theme";

export default function StatusDot({ status, size = 8, pulse = false }) {
  const m = STATUS_META[status] || STATUS_META.healthy;
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
      {pulse && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: m.color,
            opacity: 0.5,
            animation: "sg-ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
      )}
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: m.color,
          display: "inline-block",
        }}
      />
    </span>
  );
}
