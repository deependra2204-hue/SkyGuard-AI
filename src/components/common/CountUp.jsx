import React, { useState, useEffect, useRef } from "react";

export default function CountUp({ value, duration = 900, reduceMotion }) {
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const startRef = useRef(null);
  const fromRef = useRef(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) return;

    const startVal = fromRef.current;
    startRef.current = null;
    let raf;
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = Math.round(startVal + (value - startVal) * eased);
      fromRef.current = cur;
      setDisplay(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduceMotion, duration]);

  if (reduceMotion) {
    return <>{value.toLocaleString("en-IN")}</>;
  }

  return <>{display.toLocaleString("en-IN")}</>;
}
