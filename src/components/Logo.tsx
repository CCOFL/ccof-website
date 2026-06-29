import Link from "next/link";

/**
 * Text wordmark placeholder. Replace the mark <span> with the real CCOF logo
 * (e.g. <Image src="/logo.svg" .../>) when the asset is available — keep the
 * accessible name on the Link.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="The Children's Collective of Florida — home"
      className="group flex items-center gap-3"
    >
      <span
        aria-hidden
        className={`grid place-items-center rounded-full bg-sage-600 font-extrabold text-cream transition-all duration-300 ${
          compact ? "h-9 w-9 text-base" : "h-11 w-11 text-lg"
        }`}
      >
        CC
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`font-serif font-semibold tracking-tight text-ink transition-all duration-300 ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          The Children&apos;s Collective
        </span>
        <span
          className={`text-muted transition-all duration-300 ${
            compact ? "text-[0.7rem]" : "text-xs"
          }`}
        >
          of Florida
        </span>
      </span>
    </Link>
  );
}
