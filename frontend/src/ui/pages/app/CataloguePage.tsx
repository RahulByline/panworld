import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { mockProducts } from "../../../mock/data";
import { useAuthStore } from "../../../store/auth.store";

function productImageDataUri(seed: string) {
  // Offline-friendly demo image (SVG data URI) derived from seed.
  const safe = seed.replaceAll("&", "and").slice(0, 48);
  let hash = 0;
  for (let i = 0; i < safe.length; i++) hash = (hash * 31 + safe.charCodeAt(i)) >>> 0;
  const hue1 = hash % 360;
  const hue2 = (hue1 + 38) % 360;
  const initials = safe
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue1} 80% 55%)"/>
      <stop offset="1" stop-color="hsl(${hue2} 80% 45%)"/>
    </linearGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <g opacity="0.18">
    <circle cx="180" cy="120" r="140" fill="#fff"/>
    <circle cx="1040" cy="540" r="180" fill="#fff"/>
    <circle cx="520" cy="640" r="120" fill="#fff"/>
  </g>
  <g filter="url(#s)">
    <rect x="70" y="78" rx="32" ry="32" width="1060" height="520" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)"/>
    <text x="120" y="205" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="44" font-weight="700" fill="rgba(255,255,255,0.92)">
      ${escapeXml(safe)}
    </text>
    <text x="120" y="270" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="26" font-weight="500" fill="rgba(255,255,255,0.80)">
      Panworld catalogue preview
    </text>
    <g>
      <rect x="120" y="350" rx="26" ry="26" width="140" height="140" fill="rgba(15,23,42,0.30)" stroke="rgba(255,255,255,0.18)"/>
      <text x="190" y="438" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="46" font-weight="800" fill="rgba(255,255,255,0.92)">${escapeXml(
        initials || "PW",
      )}</text>
    </g>
  </g>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function CataloguePage() {
  const { t } = useTranslation();
  const school = useAuthStore((s) => s.school);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"ALL" | "TEXTBOOK" | "LIBRARY" | "KIT" | "RESOURCE" | "UNIFORM">("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filteredAll = useMemo(() => {
    const base = mockProducts.filter((p) => (type === "ALL" ? true : p.type === type));
    const qq = q.trim().toLowerCase();
    return base
      .filter((p) => (qq ? `${p.name} ${p.publisher} ${p.subject ?? ""}`.toLowerCase().includes(qq) : true))
      .filter((p) => (school?.country ? p.countryRelevance.includes(school.country) : true));
  }, [q, school?.country, type]);

  const total = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [q, type, school?.country]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const filtered = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAll.slice(start, start + pageSize);
  }, [filteredAll, page]);

  const pageFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageTo = Math.min(total, page * pageSize);
  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">{t("nav.catalogue")}</div>
          <div className="mt-1 text-sm text-slate-600">
            Search, filter, and explore {school?.country === "KSA" ? "NCC-first" : "UAE-first"} catalogue.
          </div>
        </div>
        <Button type="button" variant="secondary">
          Filters
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["ALL", "TEXTBOOK", "LIBRARY", "KIT", "RESOURCE", "UNIFORM"] as const).map((k) => (
              <Button key={k} type="button" size="sm" variant={type === k ? "primary" : "secondary"} onClick={() => setType(k)}>
                {k}
              </Button>
            ))}
          </div>
          <div className="text-xs text-slate-500 md:text-right">
            Showing{" "}
            <span className="font-semibold">
              {pageFrom}–{pageTo}
            </span>{" "}
            of <span className="font-semibold">{total}</span> • Badges:{" "}
            <span className="font-semibold">NCC</span>, <span className="font-semibold">KSA/UAE</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="relative aspect-[16/8] w-full bg-slate-100">
              <img
                src={productImageDataUri(`${p.name} ${p.publisher}`)}
                alt={p.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-sm">{p.type}</span>
                {p.nccApproved ? (
                  <span className="rounded-full bg-emerald-600/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">NCC</span>
                ) : null}
              </div>
              <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                AED/SAR {p.price.toFixed(2)}
              </div>
            </div>

            <div className="p-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{p.name}</div>
                <div className="mt-0.5 text-xs text-slate-600">{p.publisher}</div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                {p.grades ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">G {p.grades}</span> : null}
                {p.subject ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">{p.subject}</span> : null}
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">{p.edition}</span>
                {school?.country ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">{school.country}</span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm">
                  Add to RFQ
                </Button>
                <Button type="button" size="sm" variant="secondary">
                  Add to Wishlist
                </Button>
                <Link to={`/app/catalogue/${p.id}`}>
                  <Button type="button" size="sm" variant="ghost">
                    View details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>

            {pageNumbers.map((n) => (
              <Button
                key={n}
                type="button"
                size="sm"
                variant={n === page ? "primary" : "secondary"}
                onClick={() => setPage(n)}
              >
                {n}
              </Button>
            ))}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

