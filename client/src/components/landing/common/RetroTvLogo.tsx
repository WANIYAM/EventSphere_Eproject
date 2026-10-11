import React, { useEffect, useRef } from "react";

export const RetroTvLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    const renderNoise = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buffer = new Uint32Array(idata.data.buffer);
      for (let i = 0; i < buffer.length; i++) {
        const val = Math.floor(Math.random() * 255);
        buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
      }
      ctx.putImageData(idata, 0, 0);
      frameId = requestAnimationFrame(renderNoise);
    };

    renderNoise();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 10,
      backgroundColor: "var(--color-cerulean)",
      border: "2px solid var(--color-dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "2px 2px 0px var(--color-dark)",
      position: "relative"
    }}>
      <canvas
        ref={canvasRef}
        width={28}
        height={22}
        style={{
          borderRadius: 4,
          border: "1.5px solid var(--color-dark)",
          backgroundColor: "#000"
        }}
      />
    </div>
  );
};