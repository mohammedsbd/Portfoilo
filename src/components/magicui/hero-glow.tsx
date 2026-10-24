import { DitherGlow } from "@/components/dither-glow";

export function HeroGlow() {
  return (
    <div
      aria-hidden
      className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px] z-0"
    >
      <DitherGlow seed={7} cell={5} transparent className="hero-pixels h-full w-full" />
    </div>
  );
}
