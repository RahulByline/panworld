import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

export const KC_THEMES = ["green", "blue", "orange", "purple", "teal"] as const;
export type KnowledgeCardTheme = (typeof KC_THEMES)[number];

export function knowledgeCardTheme(index: number): KnowledgeCardTheme {
  return KC_THEMES[index % KC_THEMES.length] ?? "green";
}

/** Stable theme index from a string id (e.g. product id). */
export function knowledgeCardThemeFromId(id: string): KnowledgeCardTheme {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h + id.charCodeAt(i) * (i + 1)) % 997;
  }
  return knowledgeCardTheme(h);
}

/** Right-hand illustration (stationery scene) — pairs with `.pw-kc-card--*`. */
export function KnowledgeCardScene({ theme }: { theme: KnowledgeCardTheme }) {
  return (
    <div className={cn("pw-kc-scene", `pw-kc-scene--${theme}`)} aria-hidden>
      <div className="pw-kc-sheet" />
      <div className="pw-kc-book">
        <div className="pw-kc-book-spine" />
        <div className="pw-kc-book-text">BOOK</div>
        <div className="pw-kc-book-bm" />
      </div>
      <div className="pw-kc-ruler" />
      <div className="pw-kc-tri-ruler" />
      <div className="pw-kc-pencil pw-kc-pc1" />
      <div className="pw-kc-pencil pw-kc-pc2" />
      <div className="pw-kc-pencil pw-kc-pc3" />
      <div className="pw-kc-pencil pw-kc-pc4" />
      <div className="pw-kc-pencil pw-kc-pc5" />
      <div className="pw-kc-mag" />
      <div className="pw-kc-eraser" />
    </div>
  );
}

export type KnowledgeProductCardProps = {
  /** When omitted, renders a static block (e.g. product detail hero). */
  to?: string;
  title: string;
  eyebrow: string;
  body: string;
  priceLine: string;
  ctaLine?: string;
  theme: KnowledgeCardTheme;
  badge?: ReactNode;
  className?: string;
};

/**
 * Split “knowledge” product row used on the school dashboard recent catalogue strip.
 * Reused on the main catalogue grid and product detail hero for visual consistency.
 */
export function KnowledgeProductCard({
  to,
  title,
  eyebrow,
  body,
  priceLine,
  ctaLine,
  theme,
  badge,
  className,
}: KnowledgeProductCardProps) {
  const inner = (
    <>
      <div className="pw-kc-left">
        <div className="pw-kc-left-inner">
          {badge}
          <div className="pw-kc-subtitle">{eyebrow}</div>
          <h2 className="pw-kc-title">{title}</h2>
          <p className="pw-kc-body">{body}</p>
          <p className="pw-kc-price">{priceLine}</p>
          {ctaLine ? <p className="pw-kc-cta-line">{ctaLine}</p> : null}
        </div>
        <div className="pw-kc-nav" aria-hidden>
          <span className="pw-kc-nav-btn">
            <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
          </span>
          <span className="pw-kc-nav-btn">
            <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          </span>
        </div>
      </div>
      <div className="pw-kc-right">
        <KnowledgeCardScene theme={theme} />
      </div>
    </>
  );

  const cardClass = cn(
    "pw-kc-card",
    `pw-kc-card--${theme}`,
    to
      ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#388e3c] focus-visible:ring-offset-2"
      : null,
    className,
  );

  if (to) {
    return (
      <Link to={to} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cardClass} role="region" aria-label={title}>
      {inner}
    </div>
  );
}
