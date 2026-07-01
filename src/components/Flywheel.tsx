import { FLYWHEEL } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * The giving cycle — a self-sustaining loop, drawn as a closed circle so the
 * "proceeds cycle back into the community" idea lands visually (not a straight
 * line). Desktop shows the three steps arranged around a ring with clockwise
 * arrows; mobile stacks them with a loop-back note. Both are static (no motion),
 * so nothing to gate for reduced-motion.
 */

// Node centers as % of the square container (top, bottom-right, bottom-left),
// evenly spaced 120° apart on a ring at 40% radius.
const NODE_POS = [
  { left: "50%", top: "10%" },
  { left: "84.6%", top: "70%" },
  { left: "15.4%", top: "70%" },
];

// Clockwise arrowheads sitting on the ring, between the nodes (SVG 400×400 space,
// r=160). Each is a triangle pointing along the tangent (clockwise).
const ARROWS = [
  { x: 338.6, y: 120, rot: 60 },
  { x: 200, y: 360, rot: 180 },
  { x: 61.4, y: 120, rot: 300 },
];

export function Flywheel() {
  return (
    <div>
      {/* Desktop / tablet: circular cycle */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[34rem] md:block">
        {/* Ring + clockwise arrows (decorative) */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            style={{ stroke: "var(--color-sage-light)" }}
            strokeWidth="2"
            strokeDasharray="3 9"
            strokeLinecap="round"
            opacity="0.7"
          />
          {ARROWS.map((a, i) => (
            <path
              key={i}
              d="M7 0 L-6 -6 L-6 6 Z"
              style={{ fill: "var(--color-sage)" }}
              transform={`translate(${a.x} ${a.y}) rotate(${a.rot})`}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-coral-deep">
            Powered by
          </p>
          <p className="font-serif text-xl font-bold text-sage-600">community</p>
        </div>

        {/* Nodes */}
        <ol>
          {FLYWHEEL.map((node, i) => (
            <li
              key={node.step}
              className="absolute w-[11.5rem] -translate-x-1/2 -translate-y-1/2"
              style={{ left: NODE_POS[i].left, top: NODE_POS[i].top }}
            >
              <div className="rounded-2xl border border-line bg-cream p-4 text-center shadow-card">
                <span className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-sage-600 text-sm font-extrabold text-cream">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold">{node.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {node.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical stack that closes the loop with a return note */}
      <ol className="mx-auto max-w-md space-y-3 md:hidden">
        {FLYWHEEL.map((node, i) => (
          <Reveal as="li" key={node.step} delay={i * 80}>
            <div className="relative rounded-2xl border border-line bg-cream p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage-600 text-sm font-extrabold text-cream">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{node.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {node.body}
                  </p>
                </div>
              </div>
              {i < FLYWHEEL.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-[27px] text-lg leading-none text-sage"
                >
                  ↓
                </span>
              )}
            </div>
          </Reveal>
        ))}
        <li
          aria-hidden
          className="flex items-center justify-center gap-2 pt-1 text-sm font-medium text-sage-600"
        >
          <span>↻</span>
          <span>…and the proceeds cycle back to the start</span>
        </li>
      </ol>
    </div>
  );
}
