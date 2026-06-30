import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.95rem] min-h-[44px]",
  lg: "px-7 py-3.5 text-base min-h-[48px]",
};

const variants: Record<Variant, string> = {
  // Single primary action sitewide: solid brand-green (brief priority #5).
  // Uses the brand's darker sage so cream label text clears WCAG AA.
  primary:
    "bg-sage-600 text-cream shadow-card hover:bg-sage-700 hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0",
  // Demoted partner/volunteer/goods actions: outline
  secondary:
    "border border-sage/50 bg-transparent text-sage-700 hover:border-sage hover:bg-sage/5",
  ghost: "bg-transparent text-ink hover:text-sage-600",
  // Cream pill for use on sage / charcoal (dark) backgrounds; darker-sage
  // label keeps the text AA-legible on the cream fill.
  inverse:
    "bg-cream text-sage-700 shadow-card hover:bg-white hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0",
};

function classes(variant: Variant, size: Size, className?: string) {
  return `${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`.trim();
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: LinkButtonProps) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
