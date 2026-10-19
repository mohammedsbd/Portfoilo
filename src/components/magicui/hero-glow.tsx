export function HeroGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden z-0"
    >
      <div className="hero-glow-line absolute inset-x-0 top-0 h-px" />
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />
    </div>
  );
}
