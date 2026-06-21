"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

// Reusable hand-drawn signature canvas. Used by the owner during creation and
// by the counterparty on the public signing page.
export default function SignaturePad({ label, value, onChange, required = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState<boolean>(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!value) {
      setHasSignature(false);
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHasSignature(true);
    };
    img.src = value;
  }, [value]);

  function getScaledPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { x, y } = getScaledPoint(event);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { x, y } = getScaledPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawingRef.current = false;
    canvas.releasePointerCapture(event.pointerId);
    onChange(canvas.toDataURL("image/png"));
    setHasSignature(true);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange("");
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground/90">{label}</label>
      <div className="mt-1 rounded-lg border border-white/15 bg-white p-2">
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="h-40 w-full touch-none rounded bg-white"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={endDrawing}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted">Draw with mouse, trackpad, or touch.</span>
        <button type="button" onClick={clearSignature} className="btn-secondary px-2 py-1 text-xs">
          Clear
        </button>
      </div>
      {required && !hasSignature && <p className="mt-1 text-xs text-amber-300">Signature is required.</p>}
    </div>
  );
}
