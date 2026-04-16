import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package, X, Check, MapPin, Mail, Book, Receipt, Shield, Box, User, Eye, Pencil, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { api } from "../../../services/api";
import {
  PUBLISHER_FILTER_ALL,
  SUBJECT_FILTER_ALL,
  TYPE_FILTER_ALL,
  ASSIGN_PRODUCT_TYPES,
  type AssignableProduct,
  assignableProductTypeLabelKey,
  type AssignableProductType,
} from "../../../data/admin/assignableCatalogue";
import {
  catalogueByTab,
  type CatalogueProductRow,
  type CatalogueTab,
} from "../../../data/admin/catalogue";

const CHIP_TONE: Record<AssignableProductType, string> = {
  textbook: "bg-emerald-500 text-white",
  digital: "bg-sky-100 text-sky-800",
  kit: "bg-amber-100 text-amber-800",
  library: "bg-violet-100 text-violet-900",
};

type SchoolDetail = {
  id: string;
  name: string;
  country: string;
  curriculumType: string;
  preferredLang: string;
  purchaseStatus: string;
  createdAt: string;
  logoUrl?: string;
  schoolEmail?: string;
  whatsapp?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  region?: string;
  postalCode?: string;
  phone?: string;
  website?: string;
  vatRate?: number;
  groupId?: string;
  enabledModules?: any;
  branding?: any;
};

export function AdminSchoolDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [assignedProductIds, setAssignedProductIds] = useState<string[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(PUBLISHER_FILTER_ALL);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_FILTER_ALL);
  const [selectedType, setSelectedType] = useState(TYPE_FILTER_ALL);
  const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [catalogueProducts, setCatalogueProducts] = useState<CatalogueProductRow[]>([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadSchool() {
      setLoading(true);
      try {
        const res = await api.get<{ ok: boolean; data: { school: SchoolDetail } }>(`admin/schools/${id}`);
        if (res.data?.ok) {
          setSchool(res.data.data.school);
          // Load assigned products
          const assignRes = await api.get<{ ok: boolean; data: { productIds: string[] } }>(`admin/schools/${id}/products`);
          if (assignRes.data?.ok) {
            setAssignedProductIds(assignRes.data.data.productIds || []);
          }
        }
      } catch (error) {
        console.error("Failed to load school:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSchool();
  }, [id]);

  async function loadCatalogueProducts() {
    setLoadingCatalogue(true);
    try {
      // Fetch all catalogue products from all tabs
      const allProducts: CatalogueProductRow[] = [];
      const tabs: CatalogueTab[] = ["textbooks", "library", "kits"];

      for (const tab of tabs) {
        if (tab === "textbooks") {
          const listRes = await api.get<{ ok: boolean; data: { series: any[] } }>("admin/catalogue/series", {
            params: { category: "textbooks" },
          });
          if (listRes.data?.ok) {
            for (const s of listRes.data.data.series) {
              const detailRes = await api.get<{
                ok: boolean;
                data: { items: any[]; marketingElements: Array<{ id: string }> };
              }>(`admin/catalogue/series/${s.id}`);
              const items = detailRes.data?.ok ? detailRes.data.data.items : [];
              const marketingCount = detailRes.data?.ok ? detailRes.data.data.marketingElements.length : 0;
              allProducts.push({
                id: s.id,
                name: s.name,
                publisher: s.publisher,
                grades: `${s.gradeFrom}–${s.gradeTo}`,
                format: s.format,
                price: items.length ? `AED ${Math.min(...items.map((x: any) => Number(x.listPrice)))}` : "AED —",
                badges: s.badges || [],
                status: s.status,
                cardIcon: "default",
                headerKey: "default",
                detailLine: s.detailLine || s.subject,
                curriculum: s.curriculumType,
                gradeBuckets: [`${s.gradeFrom}–${s.gradeTo}`],
                lineItems: items.map((it: any) => ({
                  id: it.id,
                  title: it.title,
                  gradeLabel: it.gradeLabel,
                  isbn: it.isbn || undefined,
                  price: `AED ${Number(it.listPrice)}`,
                  priceUnit: it.priceUnit,
                  status: it.status,
                  coverImageUrl: it.coverImageUrl || undefined,
                })),
                folderPriceLabel: items.length ? `${items.length} titles` : "—",
                folderDetailSummary: s.description || s.subject,
                folderAccess: { passwordProtected: false },
              });
            }
          }
        } else {
          // Use mock data for library and kits for now
          allProducts.push(...catalogueByTab[tab]);
        }
      }

      setCatalogueProducts(allProducts);
    } catch (error) {
      console.error("Failed to load catalogue products:", error);
      // Fall back to mock data
      setCatalogueProducts([...catalogueByTab.textbooks, ...catalogueByTab.library, ...catalogueByTab.kits]);
    } finally {
      setLoadingCatalogue(false);
    }
  }

  const assignedProducts = catalogueProducts.filter((p) => assignedProductIds.includes(p.id));

  const filteredProducts = catalogueProducts.filter((p) => {
    if (selectedPublisher !== PUBLISHER_FILTER_ALL && p.publisher !== selectedPublisher) return false;
    if (selectedSubject !== SUBJECT_FILTER_ALL && p.detailLine !== selectedSubject) return false;
    if (selectedType !== TYPE_FILTER_ALL) {
      const isType = selectedType === "kit" ? p.format === "Kit" : selectedType === "library" ? p.format === "Library" : selectedType === "textbook" ? p.format !== "Kit" && p.format !== "Library" : false;
      if (!isType) return false;
    }
    return true;
  });

  const publishers = [PUBLISHER_FILTER_ALL, ...Array.from(new Set(catalogueProducts.map((p) => p.publisher))).sort()];
  const subjects = [SUBJECT_FILTER_ALL, ...Array.from(new Set(catalogueProducts.map((p) => p.detailLine || "").filter(Boolean))).sort()];

  function openAssignModal() {
    setTempSelectedIds(new Set(assignedProductIds));
    setAssignModalOpen(true);
    void loadCatalogueProducts();
  }

  function closeAssignModal() {
    setAssignModalOpen(false);
    setSelectedPublisher(PUBLISHER_FILTER_ALL);
    setSelectedSubject(SUBJECT_FILTER_ALL);
    setSelectedType(TYPE_FILTER_ALL);
  }

  function toggleProduct(productId: string) {
    setTempSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  async function saveAssignments() {
    if (!id) return;
    setSaving(true);
    try {
      const productIds = Array.from(tempSelectedIds);
      await api.post(`admin/schools/${id}/products`, { productIds });
      setAssignedProductIds(productIds);
      closeAssignModal();
    } catch (error) {
      console.error("Failed to save assignments:", error);
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(productId: string) {
    if (!id) return;
    try {
      const newProductIds = assignedProductIds.filter((pid) => pid !== productId);
      await api.post(`admin/schools/${id}/products`, { productIds: newProductIds });
      setAssignedProductIds(newProductIds);
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-white to-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-white to-slate-50">
        <div className="text-sm text-slate-500">School not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="w-full space-y-4 px-4 pt-0">
        {/* Hero Section */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/30">
          <div className="grid gap-4 p-5 lg:grid-cols-[1.5fr_0.8fr] xl:grid-cols-[1.6fr_0.7fr]">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 text-blue-600 text-3xl font-extrabold">
                  {school.logoUrl ? (
                    <img src={school.logoUrl} alt={school.name} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    school.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">{school.name}</h1>
                  <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span><strong>ID:</strong> {school.id}</span>
                    <span>•</span>
                    <span>{school.city || school.country}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700 border border-green-200">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    {school.purchaseStatus || "Active"}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Territory</div>
                      <div className="mt-1 text-base font-extrabold text-slate-800">{school.country}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Curriculum</div>
                      <div className="mt-1 text-base font-extrabold text-slate-800">{school.curriculumType || "—"}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">VAT Rate</div>
                      <div className="mt-1 text-base font-extrabold text-slate-800">{school.vatRate ? `${school.vatRate}%` : "—"}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">WhatsApp</div>
                      <div className="mt-1 text-base font-extrabold text-slate-800">{school.whatsapp || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <aside className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-blue-50/50 p-4">
              <h3 className="text-base font-extrabold tracking-tight text-slate-800">Quick Actions</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Manage school products and access.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Orders</div>
                  <div className="mt-1 text-xs font-bold text-slate-700">View Orders</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Products</div>
                  <div className="mt-1 text-xs font-bold text-slate-700">{assignedProducts.length} assigned</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Language</div>
                  <div className="mt-1 text-xs font-bold text-slate-700">{school.preferredLang === "en" ? "English" : "Arabic"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">City</div>
                  <div className="mt-1 text-xs font-bold text-slate-700">{school.city || "—"}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  onClick={openAssignModal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A3D62] px-3 py-2 text-xs font-bold text-white hover:bg-[#071E36] transition-colors"
                >
                  <Package className="h-3.5 w-3.5" />
                  Assign Products
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Impersonate
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  View RFQs
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors">
                  Deactivate
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr] xl:grid-cols-[1.6fr_0.7fr]">
          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-3 p-4 pb-0">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-800">General Information</h2>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  School details in a compact layout.
                </p>
              </div>
              <button
                onClick={() => navigate(`/admin/schools`)}
                className="rounded-lg border border-[#0A3D62]/20 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0A3D62] hover:bg-blue-100 transition-colors"
              >
                Edit School
              </button>
            </div>

            <div className="p-4 overflow-visible">
              <div className="flex flex-wrap gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[150px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Language</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">{school.preferredLang === "en" ? "English" : "Arabic"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[150px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">School Email</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">{school.schoolEmail || "—"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[150px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Website</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">{school.website || "—"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[150px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">{school.phone || "—"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[150px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">City</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">{school.city || "—"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[150px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">{school.purchaseStatus || "—"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 min-w-[200px]">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Address</div>
                  <div className="mt-1 text-sm font-bold text-slate-700 leading-snug">
                    {school.addressLine1 || school.city || school.region || school.postalCode
                      ? [school.addressLine1, school.addressLine2, school.city, school.region, school.postalCode].filter(Boolean).join(", ")
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="my-4 h-px bg-slate-200"></div>

              <div className="mb-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-base font-extrabold tracking-tight text-slate-800">Assigned Products</h3>
                  {assignedProducts.length === 0 ? (
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-3">
                      <div>
                        <div className="text-xs font-bold text-slate-700">No products assigned yet</div>
                        <div className="text-[11px] text-slate-500">Assign products to activate services</div>
                      </div>
                      <button
                        onClick={openAssignModal}
                        className="shrink-0 rounded-lg bg-[#0A3D62] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#071E36] transition-colors"
                      >
                        Assign Products
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {assignedProducts.map((p) => {
                        const getType = (): AssignableProductType => {
                          if (p.format === "Kit") return "kit";
                          if (p.format === "Library") return "library";
                          return "textbook";
                        };
                        const type = getType();
                        return (
                          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${CHIP_TONE[type]}`}>
                                {t(assignableProductTypeLabelKey(type))}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                                <div className="mt-0.5 flex flex-wrap gap-2 text-[11px] text-slate-500">
                                  <span>{p.publisher}</span>
                                  <span>•</span>
                                  <span>{p.grades}</span>
                                  <span>•</span>
                                  <span>{p.format}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProduct(p.id)}
                              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="p-4 pb-0">
                <h2 className="text-base font-extrabold tracking-tight text-slate-800">Profile Highlights</h2>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  Key profile details at a glance.
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Location</div>
                      <div className="text-[11px] text-slate-500">{school.city || school.country}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Primary Email</div>
                      <div className="text-[11px] text-slate-500">{school.schoolEmail || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                      <Book className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Curriculum</div>
                      <div className="text-[11px] text-slate-500">{school.curriculumType || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">VAT Configuration</div>
                      <div className="text-[11px] text-slate-500">{school.vatRate ? `${school.vatRate}% tax rate` : "No VAT"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="p-4 pb-0">
                <h2 className="text-base font-extrabold tracking-tight text-slate-800">Recent Actions</h2>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  Recent administrative activities.
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700">Profile viewed</div>
                        <div className="text-[11px] text-slate-500">Just now</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600">Completed</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                        <Box className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700">Product assignment</div>
                        <div className="text-[11px] text-slate-500">{assignedProducts.length} products</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700">Impersonation access</div>
                        <div className="text-[11px] text-slate-500">Admin can log in</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Products Modal */}
      {assignModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && closeAssignModal()}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-white to-slate-50 px-7 py-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Assign Products</h2>
              <button
                type="button"
                onClick={closeAssignModal}
                className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-7 py-6">
              <div className="mb-5 flex flex-wrap gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Publisher</label>
                  <select
                    className="mt-2 h-11 w-52 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={selectedPublisher}
                    onChange={(e) => setSelectedPublisher(e.target.value)}
                  >
                    {publishers.map((p) => (
                      <option key={p} value={p}>
                        {p === PUBLISHER_FILTER_ALL ? "All Publishers" : p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</label>
                  <select
                    className="mt-2 h-11 w-52 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s === SUBJECT_FILTER_ALL ? "All Subjects" : s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Type</label>
                  <select
                    className="mt-2 h-11 w-52 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {ASSIGN_PRODUCT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.value === TYPE_FILTER_ALL ? "All Types" : type.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-5 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                Selected: <span className="text-red-600 font-bold">{tempSelectedIds.size}</span> product{tempSelectedIds.size !== 1 ? "s" : ""}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredProducts.map((product) => {
                  const isSelected = tempSelectedIds.has(product.id);
                  // Map format to assignable type
                  const getType = (): AssignableProductType => {
                    if (product.format === "Kit") return "kit";
                    if (product.format === "Library") return "library";
                    return "textbook";
                  };
                  const type = getType();
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-red-500 bg-red-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-red-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isSelected ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800">{product.name}</div>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${CHIP_TONE[type]}`}>
                            {t(assignableProductTypeLabelKey(type))}
                          </span>
                          <span className="text-xs font-medium text-slate-600">{product.publisher}</span>
                          <span className="text-xs font-medium text-slate-600">{product.detailLine}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5">
              <button
                type="button"
                onClick={closeAssignModal}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAssignments}
                disabled={saving}
                className="rounded-xl bg-gradient-to-br from-red-500 to-red-400 px-6 py-3 text-sm font-bold text-white border border-red-500 hover:from-red-600 hover:to-red-500 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
