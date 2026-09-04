import Link from "next/link";
import Image from "next/image";

/**
 * Header lockup using the v4 "child in hand / community circle" icon mark
 * (public/brand/CCOF_Logo_v4_Icon.svg, on-spec Warm Sage #748865 / Muted
 * Coral #E68B71 — two-color mark, Brand Standards v4).
 * The icon is decorative here — the adjacent text provides the accessible name.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  // 56px (44 scrolled): the v4 mark is a thin-ring icon that carries less
  // visual weight than its box, so it needs more size than a solid mark to
  // balance the nav (founder call, 9/3).
  const size = compact ? 44 : 56;
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
          The Children&apos;s Collective of Florida
        </span>
        <span
          className={`text-muted transition-all duration-300 ${
            compact ? "text-[0.7rem]" : "text-xs"
          }`}
        >
          501(c)(3) nonprofit
        </span>
      </span>
    </Link>
  );
}
