import { FLYWHEEL } from "@/lib/site";
import { Reveal } from "./Reveal";

/** 3-step giving-flywheel diagram: You give → We steward → Programs get funded (brief §5). */
export function Flywheel() {
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {FLYWHEEL.map((node, i) => (
        <Reveal as="li" key={node.step} delay={i * 90}>
          <div className="relative h-full rounded-2xl border border-line bg-cream p-6 shadow-card">
            <span
              aria-hidden
              className="text-xs font-bold uppercase tracking-[0.12em] text-coral"
            >
              Step {i + 1}
            </span>
            <h3 className="mt-1 text-xl font-bold">{node.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {node.body}
            </p>
            {i < FLYWHEEL.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-2xl text-sage md:block"
              >
                →
              </span>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
