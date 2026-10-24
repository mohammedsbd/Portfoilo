"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

// Shades of one blue, darkest to brightest
const PALETTE = ["#06102e", "#0a1f5c", "#123a9c", "#1d4ed8", "#3b82f6", "#7db4fb"];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);
const CELL = 4;
const FPS = 15;

function hash(x: number, y: number, seed: number) {
  let h = x * 374761393 + y * 668265263 + seed * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// Layered noise drifting in different directions, so the clouds slowly morph
function cloud(x: number, y: number, t: number, seed: number) {
  return (
    valueNoise(x * 0.06 + t * 0.12, y * 0.06 + t * 0.05, seed) * 0.55 +
    valueNoise(x * 0.13 - t * 0.09, y * 0.13 + t * 0.07, seed + 1) * 0.3 +
    valueNoise(x * 0.3 + t * 0.2, y * 0.3 - t * 0.15, seed + 2) * 0.15
  );
}

export function DitherGlow({ seed = 0, className }: { seed?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let last = 0;
    let time = seed * 3;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
    };

    const draw = (t: number) => {
      ctx.fillStyle = PALETTE[0];
      ctx.fillRect(0, 0, cols * CELL, rows * CELL);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = cloud(x, y, t, seed) + BAYER[(y % 4) * 4 + (x % 4)] * 0.12;
          const level = Math.max(0, Math.min(PALETTE.length - 1, Math.floor(n * 1.6 * PALETTE.length - 2.2)));
          if (level === 0) continue;
          ctx.fillStyle = PALETTE[level];
          ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / FPS) return;
      last = now;
      time = now / 1000 + seed * 3;
      draw(time);
    };

    resize();
    draw(time);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(time);
    });
    resizeObserver.observe(canvas);

    // Only animate while the card is on screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    if (!reduceMotion) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [seed]);

  return <canvas ref={canvasRef} aria-hidden className={cn("block", className)} />;
}
