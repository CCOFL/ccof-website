import Link from "next/link";
import Image from "next/image";

/**
 * Header lockup using the v4 "child in hand / community circle" icon mark
 * (public/brand/CCOF_Logo_v4_Icon.svg, on-spec Warm Sage #748865 / Muted
 * Coral #E68B71 — two-color mark, Brand Standards v4).
 * The icon is decorative here — the adjacent text provides the accessible name.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 36 : 46;
  return (
    <Link
      href="/"
      title="The Children's Collective of Florida: home"
      className="group flex items-center gap-3"
    >
      <Image
        src="/brand/CCOF_Logo_v4_Icon.svg"
        alt=""
        width={size}
        height={size}
        priority
        className="transition-all duration-300"
      />
      <span className="flex flex-col leading-tight">
        <span
          className={`font-bold tracking-tight text-ink transition-all duration-300 ${
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
          of Florida ·{" "}
          <span className="whitespace-nowrap">501(c)(3) nonprofit</span>
        </span>
      </span>
    </Link>
  );
}
