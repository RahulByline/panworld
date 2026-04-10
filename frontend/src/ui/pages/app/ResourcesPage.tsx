import { useEffect, useMemo, useState } from "react";
import { Download, Eye, FileText, Star } from "lucide-react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function typePill(type: string) {
  if (type === "PDF") return "bg-rose-100 text-rose-900";
  if (type === "PPT") return "bg-amber-100 text-amber-900";
  if (type === "DOC") return "bg-emerald-100 text-emerald-900";
  return "bg-sky-100 text-sky-900";
}

function escapeXml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function resourceThumbDataUri(seed: string) {
  // Offline-friendly demo thumbnail (SVG data URI) derived from seed.
  const safe = seed.replaceAll("&", "and").slice(0, 64);
  let hash = 0;
  for (let i = 0; i < safe.length; i++) hash = (hash * 31 + safe.charCodeAt(i)) >>> 0;
  const hue1 = hash % 360;
  const hue2 = (hue1 + 32) % 360;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue1} 70% 60%)"/>
      <stop offset="1" stop-color="hsl(${hue2} 75% 45%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#g)"/>
  <g opacity="0.16">
    <circle cx="240" cy="180" r="170" fill="#fff"/>
    <circle cx="980" cy="520" r="210" fill="#fff"/>
  </g>
  <rect x="70" y="80" width="1060" height="560" rx="32" ry="32" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.26)"/>
  <text x="120" y="180" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="32" font-weight="700" fill="rgba(255,255,255,0.92)">${escapeXml(
    safe,
  )}</text>
  <text x="120" y="226" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="18" font-weight="600" fill="rgba(255,255,255,0.86)">Resource preview</text>
</svg>`.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function pillFromText(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 33 + text.charCodeAt(i)) >>> 0;
  const palette = [
    "bg-indigo-100 text-indigo-900",
    "bg-fuchsia-100 text-fuchsia-900",
    "bg-rose-100 text-rose-900",
    "bg-sky-100 text-sky-900",
    "bg-emerald-100 text-emerald-900",
    "bg-amber-100 text-amber-900",
  ] as const;
  return palette[hash % palette.length]!;
}

export function ResourcesPage() {
  const { resources } = usePortalMock();
  const [q, setQ] = useState("");
  const [publisher, setPublisher] = useState<string>("All");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItem, setViewerItem] = useState<(typeof resources)[number] | null>(null);

  const publishers = useMemo(() => ["All", ...Array.from(new Set(resources.map((x) => x.publisher)))], [resources]);

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return resources
      .filter((x) => (publisher === "All" ? true : x.publisher === publisher))
      .filter((x) => (premiumOnly ? x.premium : true))
      .filter((x) => (qq ? (x.title + " " + x.tags.join(" ") + " " + x.publisher).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.downloads - a.downloads);
  }, [resources, q, publisher, premiumOnly]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setViewerOpen(false);
    }
    if (viewerOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerOpen]);

  function openViewer(item: (typeof resources)[number]) {
    setViewerItem(item);
    setViewerOpen(true);
  }

  function downloadItem(item: (typeof resources)[number]) {
    const url = (item as any).url as string | undefined;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(item.title ?? "resource").toString().replaceAll(/[^\w\s-]/g, "").trim().slice(0, 80) || "resource"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="space-y-4">
      {viewerOpen && viewerItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewerOpen(false);
          }}
        >
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{viewerItem.title}</div>
                <div className="truncate text-xs text-slate-600">{viewerItem.publisher}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="secondary" className="gap-2" onClick={() => downloadItem(viewerItem)}>
                  <Download size={16} />
                  Download
                </Button>
                <Button type="button" size="sm" variant="secondary" onClick={() => setViewerOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="h-[70vh] w-full bg-slate-50">
              <iframe
                title={viewerItem.title}
                src={(viewerItem as any).url}
                className="h-full w-full"
                sandbox="allow-same-origin allow-scripts allow-downloads"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Resources</div>
          <div className="mt-1 text-sm text-slate-600">Searchable library with premium tagging and download tracking.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Upload
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          >
            {publishers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
            <input type="checkbox" checked={premiumOnly} onChange={(e) => setPremiumOnly(e.target.checked)} />
            Premium only
          </label>
          <div className="flex items-center justify-between gap-3 md:justify-end">
            <div className="text-sm text-slate-600">
              {rows.length} item{rows.length === 1 ? "" : "s"}
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={view === "cards" ? "primary" : "secondary"} onClick={() => setView("cards")}>
                Cards
              </Button>
              <Button type="button" size="sm" variant={view === "table" ? "primary" : "secondary"} onClick={() => setView("table")}>
                Table
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {rows.map((x) => (
            <Card key={x.id} className="overflow-hidden">
              <div className="relative aspect-[16/7] w-full bg-slate-100">
                <img src={resourceThumbDataUri(`${x.title} ${x.publisher}`)} alt={x.title} className="h-full w-full object-cover" loading="lazy" />
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <FileText size={14} className="text-rose-600" />
                    <span className="uppercase tracking-wide">{x.type}</span>
                    {x.premium ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">Premium</span> : null}
                  </div>

                  <button
                    type="button"
                    aria-label={savedIds.has(x.id) ? "Remove from saved" : "Save resource"}
                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    onClick={() =>
                      setSavedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(x.id)) next.delete(x.id);
                        else next.add(x.id);
                        return next;
                      })
                    }
                  >
                    <Star size={18} className={savedIds.has(x.id) ? "fill-amber-400 text-amber-500" : ""} />
                  </button>
                </div>

                <div className="mt-2 truncate text-sm font-semibold text-slate-900">{x.title}</div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {x.tags.slice(0, 3).map((t) => (
                    <span key={t} className={"rounded-full px-2.5 py-1 text-xs font-semibold " + pillFromText(t)}>
                      {t}
                    </span>
                  ))}
                  {x.tags.length > 3 ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">+{x.tags.length - 3}</span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="gap-2 bg-rose-600 text-white hover:bg-rose-500"
                    onClick={() => {
                      openViewer(x);
                    }}
                  >
                    <Eye size={16} />
                    View
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      downloadItem(x);
                    }}
                  >
                    <Download size={16} />
                    Download
                  </Button>
                </div>
              </div>

              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500">
                <div className="truncate">{x.publisher}</div>
                <div className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5">{x.downloads.toLocaleString()} downloads</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-2">
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Publisher</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Downloads</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((x) => (
                  <tr key={x.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{x.title}</div>
                      {x.premium ? <div className="mt-1 text-xs font-semibold text-amber-700">Premium</div> : null}
                    </td>
                    <td className="px-4 py-3">
                      <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + typePill(x.type)}>{x.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{x.publisher}</td>
                    <td className="px-4 py-3 text-slate-700">{x.tags.join(", ")}</td>
                    <td className="px-4 py-3 text-slate-700">{x.downloads}</td>
                    <td className="px-4 py-3 text-right">
                      <Button type="button" size="sm" variant="secondary">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

