import Link from "next/link";
import Image from "next/image";

/**
 * Header wordmark using the official CCOF icon mark (Brand Assets →
 * 01_Master_Logos/02_icon_only, on-spec sage #6F8764 / coral #EF7F6D).
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 36 : 46;
  return (
    <Link
      href="/"
      aria-label="The Children's Collective of Florida — home"
      className="group flex items-center gap-3"
    >
      <Image
        src="/ccof-icon.svg"
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
          of Florida
        </span>
      </span>
    </Link>
  );
}
