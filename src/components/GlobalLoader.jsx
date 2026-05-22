import React from "react";

export default function GlobalLoader({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
      <img
        src="/loader.gif"
        alt="Loading..."
        style={{ width: 90, height: 90 }}
      />
    </div>
  );
}
