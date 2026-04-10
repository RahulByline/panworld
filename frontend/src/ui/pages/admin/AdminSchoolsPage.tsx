import { useEffect, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, X, UserPlus } from "lucide-react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { api } from "../../../services/api";

const WHATSAPP_RE = /^[\d+()[\]\s\-]{8,40}$/;

const SchoolProfileSchema = z.object({
  name: z.string().trim().min(1),
  country: z.string().trim().min(1),
  curriculumType: z.string().trim().min(1),
  vatRate: z.coerce.number().min(0).max(100),
  preferredLang: z.enum(["en", "ar"]),
  groupId: z.string().optional(),
  schoolEmail: z.string().trim().email(),
  whatsapp: z
    .string()
    .trim()
    .min(8)
    .max(40)
    .regex(WHATSAPP_RE, "Invalid WhatsApp number"),
  addressLine1: z.string().trim().optional(),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().optional(),
  region: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  website: z.string().trim().optional(),
  logoUrl: z
    .string()
    .trim()
    .optional()
    .refine((s) => !s || z.string().url().safeParse(s).success, "Invalid URL"),
});

const CreateSchoolSchema = SchoolProfileSchema.extend({
  adminEmail: z.string().trim().email(),
  adminPassword: z.string().min(8).max(128),
  adminFirstName: z.string().trim().min(1),
  adminLastName: z.string().trim().min(1),
  adminUsername: z.string().trim().optional(),
});

type SchoolProfileValues = z.infer<typeof SchoolProfileSchema>;
type CreateFormValues = z.infer<typeof CreateSchoolSchema>;

const TEAM_ROLE_OPTIONS = ["SCHOOL_ADMIN", "HOD", "MANAGEMENT", "CEO", "PROCUREMENT", "TEACHER"] as const;

const AddUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  role: z.enum(TEAM_ROLE_OPTIONS),
});

type AddUserValues = z.infer<typeof AddUserSchema>;

function appendIf(fd: FormData, key: string, val: string | number | null | undefined) {
  if (val === null || val === undefined) return;
  if (typeof val === "string" && val.trim() === "") return;
  fd.append(key, String(val));
}

type SchoolRow = {
  id: string;
  name: string;
  country: string;
  curriculumType: string;
  preferredLang: string;
  purchaseStatus: string;
  createdAt: string;
};

type SchoolDetail = SchoolProfileValues & { id: string; createdAt?: string };

type SchoolGroupRow = { id: string; name: string };
type CurriculumRow = { id: string; name: string };
type CountryRow = { code: string; label: string; vatRate: number };

type SchoolUserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: number;
  username: string | null;
};

function fieldError(msg: string | undefined) {
  if (!msg) return null;
  return <div className="mt-1 text-xs text-rose-600">{msg}</div>;
}

const defaultProfileValues: SchoolProfileValues = {
  name: "",
  country: "",
  curriculumType: "",
  vatRate: 0,
  preferredLang: "en",
  groupId: "",
  schoolEmail: "",
  whatsapp: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postalCode: "",
  phone: "",
  website: "",
  logoUrl: "",
};

const defaultCreateValues: CreateFormValues = {
  ...defaultProfileValues,
  adminEmail: "",
  adminPassword: "",
  adminFirstName: "",
  adminLastName: "",
  adminUsername: "",
};

export function AdminSchoolsPage() {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [groups, setGroups] = useState<SchoolGroupRow[]>([]);
  const [curricula, setCurricula] = useState<CurriculumRow[]>([]);
  const [countries, setCountries] = useState<CountryRow[]>([]);

  const [refModal, setRefModal] = useState<{ type: "curriculum" | "group" | "country"; target: "create" | "edit" } | null>(
    null,
  );
  const [refName, setRefName] = useState("");
  const [refCountry, setRefCountry] = useState({ code: "", label: "", vat: "" });
  const [submittingRef, setSubmittingRef] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [logoFileCreate, setLogoFileCreate] = useState<File | null>(null);
  const [logoFileEdit, setLogoFileEdit] = useState<File | null>(null);

  const [schoolUsers, setSchoolUsers] = useState<SchoolUserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(CreateSchoolSchema) as any,
    defaultValues: defaultCreateValues,
  });

  const editForm = useForm<SchoolProfileValues>({
    resolver: zodResolver(SchoolProfileSchema) as any,
    defaultValues: defaultProfileValues,
  });

  const addUserForm = useForm<AddUserValues>({
    resolver: zodResolver(AddUserSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "TEACHER",
    },
  });

  const editUserForm = useForm<{
    firstName: string;
    lastName: string;
    role: (typeof TEAM_ROLE_OPTIONS)[number];
    active: boolean;
    password: string;
  }>({
    defaultValues: { firstName: "", lastName: "", role: "TEACHER", active: true, password: "" },
  });

  async function loadSchools() {
    setLoadingList(true);
    try {
      const res = await api.get<{ ok: boolean; data: { schools: SchoolRow[] } }>("admin/schools");
      if (res.data?.ok) setSchools(res.data.data.schools);
    } catch {
      setSchools([]);
    } finally {
      setLoadingList(false);
    }
  }

  async function loadGroups() {
    try {
      const res = await api.get<{ ok: boolean; data: { groups: SchoolGroupRow[] } }>("admin/school-groups");
      if (res.data?.ok) setGroups(res.data.data.groups);
    } catch {
      setGroups([]);
    }
  }

  async function loadCurricula() {
    try {
      const res = await api.get<{ ok: boolean; data: { curricula: CurriculumRow[] } }>("admin/curricula");
      if (res.data?.ok) setCurricula(res.data.data.curricula);
    } catch {
      setCurricula([]);
    }
  }

  async function loadCountries() {
    try {
      const res = await api.get<{ ok: boolean; data: { countries: CountryRow[] } }>("admin/countries");
      if (res.data?.ok) {
        const rows = res.data.data.countries.map((c) => ({
          ...c,
          vatRate: typeof c.vatRate === "string" ? Number(c.vatRate) : c.vatRate,
        }));
        setCountries(rows);
      }
    } catch {
      setCountries([]);
    }
  }

  useEffect(() => {
    void loadSchools();
    void loadGroups();
    void loadCurricula();
    void loadCountries();
  }, []);

  function openRefModal(type: "curriculum" | "group" | "country", target: "create" | "edit") {
    setRefName("");
    setRefCountry({ code: "", label: "", vat: "" });
    setRefModal({ type, target });
  }

  async function submitRefModal() {
    if (!refModal) return;
    setSubmittingRef(true);
    setBanner(null);
    try {
      if (refModal.type === "country") {
        const code = refCountry.code.trim().toUpperCase().replace(/\s+/g, "");
        const label = refCountry.label.trim();
        const vatNum = Number(refCountry.vat);
        if (!code || !label || Number.isNaN(vatNum) || vatNum < 0 || vatNum > 100) {
          setBanner({ type: "err", text: t("admin.schools.refCountryInvalid") });
          return;
        }
        const res = await api.post<{ ok: boolean; data: { country: CountryRow } }>("admin/countries", {
          code,
          label,
          vatRate: vatNum,
        });
        if (res.data?.ok) {
          await loadCountries();
          const c = res.data.data.country;
          const vat = typeof c.vatRate === "string" ? Number(c.vatRate) : c.vatRate;
          if (refModal.target === "create") {
            createForm.setValue("country", c.code, { shouldValidate: true });
            createForm.setValue("vatRate", vat, { shouldValidate: true });
          } else {
            editForm.setValue("country", c.code, { shouldValidate: true });
            editForm.setValue("vatRate", vat, { shouldValidate: true });
          }
          setRefModal(null);
        }
        return;
      }

      const name = refName.trim();
      if (!name) return;

      if (refModal.type === "curriculum") {
        const res = await api.post<{ ok: boolean; data: { curriculum: { id: string; name: string } } }>("admin/curricula", {
          name,
        });
        if (res.data?.ok) {
          await loadCurricula();
          const n = res.data.data.curriculum.name;
          if (refModal.target === "create") createForm.setValue("curriculumType", n, { shouldValidate: true });
          else editForm.setValue("curriculumType", n, { shouldValidate: true });
          setRefModal(null);
        }
      } else {
        const res = await api.post<{ ok: boolean; data: { group: { id: string; name: string } } }>("admin/school-groups", {
          name,
        });
        if (res.data?.ok) {
          await loadGroups();
          const id = res.data.data.group.id;
          if (refModal.target === "create") createForm.setValue("groupId", id, { shouldValidate: true });
          else editForm.setValue("groupId", id, { shouldValidate: true });
          setRefModal(null);
        }
      }
    } catch (e) {
      let text = t("admin.schools.refCreateFailed");
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as { error?: { message?: string } })?.error?.message;
        if (msg) text = msg;
      }
      setBanner({ type: "err", text });
    } finally {
      setSubmittingRef(false);
    }
  }

  async function loadSchoolUsers(schoolId: string) {
    setLoadingUsers(true);
    try {
      const res = await api.get<{ ok: boolean; data: { users: SchoolUserRow[] } }>(`admin/schools/${schoolId}/users`);
      if (res.data?.ok) setSchoolUsers(res.data.data.users);
    } catch {
      setSchoolUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    if (!editOpen || !editingId) return;
    let cancelled = false;
    (async () => {
      setLoadingEdit(true);
      try {
        const res = await api.get<{ ok: boolean; data: { school: SchoolDetail } }>(`admin/schools/${editingId}`);
        if (cancelled || !res.data?.ok) return;
        const s = res.data.data.school;
        editForm.reset({
          name: s.name,
          country: s.country ?? "",
          curriculumType: s.curriculumType ?? "",
          vatRate: Number(s.vatRate),
          preferredLang: s.preferredLang as "en" | "ar",
          groupId: s.groupId ?? "",
          addressLine1: s.addressLine1 ?? "",
          addressLine2: s.addressLine2 ?? "",
          city: s.city ?? "",
          region: s.region ?? "",
          postalCode: s.postalCode ?? "",
          phone: s.phone ?? "",
          schoolEmail: s.schoolEmail ?? "",
          whatsapp: s.whatsapp ?? "",
          website: s.website ?? "",
          logoUrl: s.logoUrl ?? "",
        });
        setLogoFileEdit(null);
        void loadSchoolUsers(editingId);
        setUserFormOpen(false);
        setEditingUserId(null);
      } catch {
        setBanner({ type: "err", text: t("admin.schools.loadFailed") });
        setEditOpen(false);
        setEditingId(null);
      } finally {
        if (!cancelled) setLoadingEdit(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOpen, editingId, t]);

  async function onCreateSubmit(values: CreateFormValues) {
    setSubmittingCreate(true);
    setBanner(null);
    try {
      const payload = {
        name: values.name,
        country: values.country,
        curriculumType: values.curriculumType.trim(),
        vatRate: values.vatRate,
        preferredLang: values.preferredLang,
        groupId: values.groupId?.trim() || null,
        addressLine1: values.addressLine1?.trim() || null,
        addressLine2: values.addressLine2?.trim() || null,
        city: values.city?.trim() || null,
        region: values.region?.trim() || null,
        postalCode: values.postalCode?.trim() || null,
        phone: values.phone?.trim() || null,
        schoolEmail: values.schoolEmail.trim(),
        whatsapp: values.whatsapp.trim(),
        website: values.website?.trim() || null,
        logoUrl: logoFileCreate ? null : values.logoUrl?.trim() || null,
        adminEmail: values.adminEmail.trim(),
        adminPassword: values.adminPassword,
        adminFirstName: values.adminFirstName.trim(),
        adminLastName: values.adminLastName.trim(),
        adminUsername: values.adminUsername?.trim() || null,
      };

      let res;
      if (logoFileCreate) {
        const fd = new FormData();
        fd.append("name", payload.name);
        fd.append("country", payload.country);
        fd.append("curriculumType", payload.curriculumType);
        fd.append("vatRate", String(payload.vatRate));
        fd.append("preferredLang", payload.preferredLang);
        appendIf(fd, "groupId", payload.groupId);
        appendIf(fd, "addressLine1", payload.addressLine1);
        appendIf(fd, "addressLine2", payload.addressLine2);
        appendIf(fd, "city", payload.city);
        appendIf(fd, "region", payload.region);
        appendIf(fd, "postalCode", payload.postalCode);
        appendIf(fd, "phone", payload.phone);
        fd.append("schoolEmail", payload.schoolEmail);
        fd.append("whatsapp", payload.whatsapp);
        appendIf(fd, "website", payload.website);
        if (payload.logoUrl) appendIf(fd, "logoUrl", payload.logoUrl);
        fd.append("adminEmail", payload.adminEmail);
        fd.append("adminPassword", payload.adminPassword);
        fd.append("adminFirstName", payload.adminFirstName);
        fd.append("adminLastName", payload.adminLastName);
        appendIf(fd, "adminUsername", payload.adminUsername);
        fd.append("logo", logoFileCreate);
        res = await api.post<{ ok: boolean; data: { school: { id: string }; schoolAdmin: { email: string } } }>(
          "admin/schools",
          fd,
        );
      } else {
        res = await api.post<{ ok: boolean; data: { school: { id: string }; schoolAdmin: { email: string } } }>(
          "admin/schools",
          payload,
        );
      }
      if (res.data?.ok) {
        setBanner({
          type: "ok",
          text: t("admin.schools.createdOk", {
            schoolId: res.data.data.school.id,
            email: res.data.data.schoolAdmin.email,
          }),
        });
        setLogoFileCreate(null);
        createForm.reset(defaultCreateValues);
        setAddOpen(false);
        void loadSchools();
      }
    } catch (e) {
      let text = t("admin.schools.createFailed");
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as { error?: { message?: string } })?.error?.message;
        if (msg) text = msg;
      }
      setBanner({ type: "err", text });
    } finally {
      setSubmittingCreate(false);
    }
  }

  async function onEditSubmit(values: SchoolProfileValues) {
    if (!editingId) return;
    setSubmittingEdit(true);
    setBanner(null);
    try {
      const payload = {
        name: values.name,
        country: values.country,
        curriculumType: values.curriculumType.trim(),
        vatRate: values.vatRate,
        preferredLang: values.preferredLang,
        groupId: values.groupId?.trim() || null,
        addressLine1: values.addressLine1?.trim() || null,
        addressLine2: values.addressLine2?.trim() || null,
        city: values.city?.trim() || null,
        region: values.region?.trim() || null,
        postalCode: values.postalCode?.trim() || null,
        phone: values.phone?.trim() || null,
        schoolEmail: values.schoolEmail.trim(),
        whatsapp: values.whatsapp.trim(),
        website: values.website?.trim() || null,
        logoUrl: logoFileEdit ? null : values.logoUrl?.trim() || null,
      };

      let res;
      if (logoFileEdit) {
        const fd = new FormData();
        fd.append("name", payload.name);
        fd.append("country", payload.country);
        fd.append("curriculumType", payload.curriculumType);
        fd.append("vatRate", String(payload.vatRate));
        fd.append("preferredLang", payload.preferredLang);
        appendIf(fd, "groupId", payload.groupId);
        appendIf(fd, "addressLine1", payload.addressLine1);
        appendIf(fd, "addressLine2", payload.addressLine2);
        appendIf(fd, "city", payload.city);
        appendIf(fd, "region", payload.region);
        appendIf(fd, "postalCode", payload.postalCode);
        appendIf(fd, "phone", payload.phone);
        fd.append("schoolEmail", payload.schoolEmail);
        fd.append("whatsapp", payload.whatsapp);
        appendIf(fd, "website", payload.website);
        if (payload.logoUrl) appendIf(fd, "logoUrl", payload.logoUrl);
        fd.append("logo", logoFileEdit);
        res = await api.patch(`admin/schools/${editingId}`, fd);
      } else {
        res = await api.patch(`admin/schools/${editingId}`, payload);
      }
      if (res.data?.ok) {
        setBanner({ type: "ok", text: t("admin.schools.updatedOk") });
        setLogoFileEdit(null);
        setEditOpen(false);
        setEditingId(null);
        void loadSchools();
      }
    } catch (e) {
      let text = t("admin.schools.updateFailed");
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as { error?: { message?: string } })?.error?.message;
        if (msg) text = msg;
      }
      setBanner({ type: "err", text });
    } finally {
      setSubmittingEdit(false);
    }
  }

  async function onAddUserSubmit(v: AddUserValues) {
    if (!editingId) return;
    setBanner(null);
    try {
      const res = await api.post(`admin/schools/${editingId}/users`, v);
      if (res.data?.ok) {
        setBanner({ type: "ok", text: t("admin.schools.userCreatedOk") });
        addUserForm.reset({ email: "", password: "", firstName: "", lastName: "", role: "TEACHER" });
        setUserFormOpen(false);
        void loadSchoolUsers(editingId);
      }
    } catch (e) {
      let text = t("admin.schools.userCreateFailed");
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as { error?: { message?: string } })?.error?.message;
        if (msg) text = msg;
      }
      setBanner({ type: "err", text });
    }
  }

  async function saveEditedUser() {
    if (!editingId || !editingUserId) return;
    const v = editUserForm.getValues();
    setBanner(null);
    try {
      const body: Record<string, unknown> = {
        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        role: v.role,
        active: v.active,
      };
      if (v.password.trim().length >= 8) body.password = v.password;
      const res = await api.patch(`admin/schools/${editingId}/users/${editingUserId}`, body);
      if (res.data?.ok) {
        setBanner({ type: "ok", text: t("admin.schools.userUpdatedOk") });
        setEditingUserId(null);
        editUserForm.reset({ firstName: "", lastName: "", role: "TEACHER", active: true, password: "" });
        void loadSchoolUsers(editingId);
      }
    } catch (e) {
      let text = t("admin.schools.userUpdateFailed");
      if (axios.isAxiosError(e)) {
        const msg = (e.response?.data as { error?: { message?: string } })?.error?.message;
        if (msg) text = msg;
      }
      setBanner({ type: "err", text });
    }
  }

  function openEdit(id: string) {
    setEditingId(id);
    setEditOpen(true);
  }

  function closeAdd() {
    setAddOpen(false);
    setLogoFileCreate(null);
    createForm.reset(defaultCreateValues);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditingId(null);
    setLogoFileEdit(null);
    setSchoolUsers([]);
    setUserFormOpen(false);
    setEditingUserId(null);
    editForm.reset(defaultProfileValues);
  }

  function startEditUser(u: SchoolUserRow) {
    setEditingUserId(u.id);
    setUserFormOpen(false);
    editUserForm.reset({
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role as (typeof TEAM_ROLE_OPTIONS)[number],
      active: !!u.active,
      password: "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-['DM_Serif_Display',serif] text-2xl text-[#1A1917]">{t("admin.schools.title")}</h1>
          <p className="mt-1 text-sm text-[#5C5A55]">{t("admin.schools.subtitle")}</p>
        </div>
        <Button
          type="button"
          onClick={() => setAddOpen(true)}
          className="shrink-0 bg-[#0A3D62] hover:bg-[#071E36]"
        >
          <Plus className="mr-2 inline h-4 w-4" />
          {t("admin.schools.addSchool")}
        </Button>
      </div>

      {banner ? (
        <div
          className={
            banner.type === "ok"
              ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
          }
        >
          {banner.text}
        </div>
      ) : null}

      <Card className="border-[#E2E0D9] p-5">
        <h2 className="text-lg font-semibold text-[#1A1917]">{t("admin.schools.listTitle")}</h2>
        <p className="mt-1 text-sm text-[#5C5A55]">{t("admin.schools.listHint")}</p>
        <div className="mt-4 overflow-auto rounded-xl border border-[#E2E0D9]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-3 py-2">{t("admin.schools.colName")}</th>
                <th className="px-3 py-2">{t("admin.schools.colCountry")}</th>
                <th className="px-3 py-2">{t("admin.schools.colCurriculum")}</th>
                <th className="px-3 py-2">{t("admin.schools.colCreated")}</th>
                <th className="px-3 py-2 text-right">{t("admin.schools.colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {loadingList ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-[#9A9890]">
                    {t("common.loading")}
                  </td>
                </tr>
              ) : schools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-[#9A9890]">
                    {t("admin.schools.empty")}
                  </td>
                </tr>
              ) : (
                schools.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAFAF8]">
                    <td className="px-3 py-2 font-medium text-[#1A1917]">{s.name}</td>
                    <td className="px-3 py-2 text-[#5C5A55]">{s.country}</td>
                    <td className="px-3 py-2 text-[#5C5A55]">{s.curriculumType}</td>
                    <td className="px-3 py-2 text-[#9A9890]">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(s.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E2E0D9] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0A3D62] hover:bg-[#F5F4F0]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t("common.edit")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {addOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 pb-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-school-title"
          onClick={(e) => e.target === e.currentTarget && closeAdd()}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-[#E2E0D9] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E0D9] bg-white px-6 py-4">
              <h2 id="add-school-title" className="font-['DM_Serif_Display',serif] text-xl text-[#1A1917]">
                {t("admin.schools.formTitle")}
              </h2>
              <button
                type="button"
                onClick={closeAdd}
                className="rounded-lg p-2 text-[#5C5A55] hover:bg-[#F5F4F0]"
                aria-label={t("admin.schools.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[min(78vh,880px)] overflow-y-auto px-6 py-5">
              <p className="text-sm text-[#5C5A55]">{t("admin.schools.formHint")}</p>
              <form className="mt-5 space-y-4" onSubmit={createForm.handleSubmit(onCreateSubmit)}>
                <SchoolProfileFields
                  form={createForm}
                  fieldError={fieldError}
                  t={t}
                  logoFile={logoFileCreate}
                  setLogoFile={setLogoFileCreate}
                  groups={groups}
                  curricula={curricula}
                  countries={countries}
                  onAddCurriculum={() => openRefModal("curriculum", "create")}
                  onAddGroup={() => openRefModal("group", "create")}
                  onAddCountry={() => openRefModal("country", "create")}
                />
                <div className="border-t border-[#E2E0D9] pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9890]">
                    {t("admin.schools.schoolAdminSection")}
                  </div>
                  <p className="mt-2 text-xs text-[#9A9890]">{t("admin.schools.schoolAdminHint")}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminFirst")}</label>
                      <Input className="mt-1 border-[#E2E0D9]" autoComplete="off" {...createForm.register("adminFirstName")} />
                      {fieldError(createForm.formState.errors.adminFirstName?.message)}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminLast")}</label>
                      <Input className="mt-1 border-[#E2E0D9]" autoComplete="off" {...createForm.register("adminLastName")} />
                      {fieldError(createForm.formState.errors.adminLastName?.message)}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminEmail")}</label>
                      <Input type="email" className="mt-1 border-[#E2E0D9]" autoComplete="off" {...createForm.register("adminEmail")} />
                      {fieldError(createForm.formState.errors.adminEmail?.message)}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminPassword")}</label>
                      <Input type="password" className="mt-1 border-[#E2E0D9]" autoComplete="new-password" {...createForm.register("adminPassword")} />
                      {fieldError(createForm.formState.errors.adminPassword?.message)}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminUsername")}</label>
                      <Input className="mt-1 border-[#E2E0D9]" autoComplete="off" {...createForm.register("adminUsername")} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="submit" disabled={submittingCreate} className="bg-[#0A3D62] hover:bg-[#071E36]">
                    {submittingCreate ? t("common.loading") : t("admin.schools.submit")}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeAdd}>
                    {t("common.cancel")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {editOpen && editingId ? (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 pb-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-school-title"
          onClick={(e) => e.target === e.currentTarget && closeEdit()}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-[#E2E0D9] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E0D9] bg-white px-6 py-4">
              <h2 id="edit-school-title" className="font-['DM_Serif_Display',serif] text-xl text-[#1A1917]">
                {t("admin.schools.editTitle")}
              </h2>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg p-2 text-[#5C5A55] hover:bg-[#F5F4F0]"
                aria-label={t("admin.schools.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[min(85vh,920px)] overflow-y-auto px-6 py-5">
              {loadingEdit ? (
                <div className="py-12 text-center text-sm text-[#9A9890]">{t("common.loading")}</div>
              ) : (
                <>
                  <form className="space-y-4" onSubmit={editForm.handleSubmit(onEditSubmit)}>
                    <p className="text-sm text-[#5C5A55]">{t("admin.schools.editHint")}</p>
                    <SchoolProfileFields
                      form={editForm}
                      fieldError={fieldError}
                      t={t}
                      logoFile={logoFileEdit}
                      setLogoFile={setLogoFileEdit}
                      groups={groups}
                      curricula={curricula}
                      countries={countries}
                      onAddCurriculum={() => openRefModal("curriculum", "edit")}
                      onAddGroup={() => openRefModal("group", "edit")}
                      onAddCountry={() => openRefModal("country", "edit")}
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button type="submit" disabled={submittingEdit} className="bg-[#0A3D62] hover:bg-[#071E36]">
                        {submittingEdit ? t("common.loading") : t("admin.schools.save")}
                      </Button>
                      <Button type="button" variant="secondary" onClick={closeEdit}>
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-8 border-t border-[#E2E0D9] pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-[#1A1917]">{t("admin.schools.usersSection")}</h3>
                        <p className="text-sm text-[#5C5A55]">{t("admin.schools.usersSectionHint")}</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setUserFormOpen(true);
                          setEditingUserId(null);
                          addUserForm.reset({ email: "", password: "", firstName: "", lastName: "", role: "TEACHER" });
                        }}
                      >
                        <UserPlus className="mr-1.5 inline h-4 w-4" />
                        {t("admin.schools.addUser")}
                      </Button>
                    </div>

                    {loadingUsers ? (
                      <p className="mt-4 text-sm text-[#9A9890]">{t("common.loading")}</p>
                    ) : (
                      <div className="mt-4 overflow-auto rounded-xl border border-[#E2E0D9]">
                        <table className="w-full min-w-[520px] text-left text-sm">
                          <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] uppercase tracking-wide text-[#5C5A55]">
                            <tr>
                              <th className="px-3 py-2">{t("admin.schools.colUser")}</th>
                              <th className="px-3 py-2">{t("admin.schools.colEmail")}</th>
                              <th className="px-3 py-2">{t("admin.schools.colRole")}</th>
                              <th className="px-3 py-2">{t("admin.schools.colActive")}</th>
                              <th className="px-3 py-2 text-right">{t("admin.schools.colActions")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E0D9]">
                            {schoolUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-[#FAFAF8]">
                                <td className="px-3 py-2 font-medium">
                                  {u.firstName} {u.lastName}
                                </td>
                                <td className="px-3 py-2 text-[#5C5A55]">{u.email}</td>
                                <td className="px-3 py-2 text-[#5C5A55]">{u.role}</td>
                                <td className="px-3 py-2">{u.active ? t("admin.schools.yes") : t("admin.schools.no")}</td>
                                <td className="px-3 py-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => startEditUser(u)}
                                    className="text-xs font-medium text-[#0A3D62] hover:underline"
                                  >
                                    {t("common.edit")}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {userFormOpen ? (
                      <form
                        className="mt-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-4"
                        onSubmit={addUserForm.handleSubmit(onAddUserSubmit)}
                      >
                        <div className="mb-3 text-sm font-semibold text-[#1A1917]">{t("admin.schools.addUserTitle")}</div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminFirst")}</label>
                            <Input className="mt-1 border-[#E2E0D9]" {...addUserForm.register("firstName")} />
                            {fieldError(addUserForm.formState.errors.firstName?.message)}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminLast")}</label>
                            <Input className="mt-1 border-[#E2E0D9]" {...addUserForm.register("lastName")} />
                            {fieldError(addUserForm.formState.errors.lastName?.message)}
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminEmail")}</label>
                            <Input type="email" className="mt-1 border-[#E2E0D9]" {...addUserForm.register("email")} />
                            {fieldError(addUserForm.formState.errors.email?.message)}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminPassword")}</label>
                            <Input type="password" className="mt-1 border-[#E2E0D9]" {...addUserForm.register("password")} />
                            {fieldError(addUserForm.formState.errors.password?.message)}
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminRole")}</label>
                            <select className="mt-1 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm" {...addUserForm.register("role")}>
                              {TEAM_ROLE_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button type="submit" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]">
                            {t("admin.schools.addUserSubmit")}
                          </Button>
                          <Button type="button" variant="secondary" size="sm" onClick={() => setUserFormOpen(false)}>
                            {t("common.cancel")}
                          </Button>
                        </div>
                      </form>
                    ) : null}

                    {editingUserId ? (
                      <div className="mt-4 rounded-xl border border-[#E2E0D9] bg-[#F5F4F0] p-4">
                        <div className="mb-3 text-sm font-semibold text-[#1A1917]">{t("admin.schools.editUserTitle")}</div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminFirst")}</label>
                            <Input className="mt-1 border-[#E2E0D9]" {...editUserForm.register("firstName")} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminLast")}</label>
                            <Input className="mt-1 border-[#E2E0D9]" {...editUserForm.register("lastName")} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.adminRole")}</label>
                            <select className="mt-1 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm" {...editUserForm.register("role")}>
                              {TEAM_ROLE_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-end pb-1">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#1A1917]">
                              <input type="checkbox" className="rounded border-[#E2E0D9]" {...editUserForm.register("active")} />
                              {t("admin.schools.activeUser")}
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.newPasswordOptional")}</label>
                            <Input type="password" className="mt-1 border-[#E2E0D9]" autoComplete="new-password" {...editUserForm.register("password")} />
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button type="button" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={() => void saveEditedUser()}>
                            {t("admin.schools.save")}
                          </Button>
                          <Button type="button" variant="secondary" size="sm" onClick={() => setEditingUserId(null)}>
                            {t("common.cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {refModal ? (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ref-modal-title"
          onClick={(e) => e.target === e.currentTarget && !submittingRef && setRefModal(null)}
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E2E0D9] bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 id="ref-modal-title" className="font-['DM_Serif_Display',serif] text-lg text-[#1A1917]">
              {refModal.type === "curriculum"
                ? t("admin.schools.refModalTitleCurriculum")
                : refModal.type === "group"
                  ? t("admin.schools.refModalTitleGroup")
                  : t("admin.schools.refModalTitleCountry")}
            </h2>
            {refModal.type === "country" ? (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#5C5A55]">{t("admin.schools.refModalCountryCode")}</label>
                  <Input
                    className="mt-1 border-[#E2E0D9]"
                    value={refCountry.code}
                    onChange={(e) => setRefCountry((p) => ({ ...p, code: e.target.value }))}
                    placeholder="UAE"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5C5A55]">{t("admin.schools.refModalCountryLabel")}</label>
                  <Input
                    className="mt-1 border-[#E2E0D9]"
                    value={refCountry.label}
                    onChange={(e) => setRefCountry((p) => ({ ...p, label: e.target.value }))}
                    placeholder={t("admin.schools.refModalCountryLabelPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5C5A55]">{t("admin.schools.refModalCountryVat")}</label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    className="mt-1 border-[#E2E0D9]"
                    value={refCountry.vat}
                    onChange={(e) => setRefCountry((p) => ({ ...p, vat: e.target.value }))}
                    placeholder="5"
                  />
                </div>
              </div>
            ) : (
              <>
                <label className="mt-3 block text-xs font-medium text-[#5C5A55]">{t("admin.schools.refModalName")}</label>
                <Input
                  className="mt-1 border-[#E2E0D9]"
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  placeholder={t("admin.schools.refModalNamePlaceholder")}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void submitRefModal();
                    }
                  }}
                />
              </>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" disabled={submittingRef} className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={() => void submitRefModal()}>
                {submittingRef ? t("common.loading") : t("admin.schools.refModalSubmit")}
              </Button>
              <Button type="button" variant="secondary" disabled={submittingRef} onClick={() => setRefModal(null)}>
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LabelWithAddRow({ label, addLabel, onAdd }: { label: ReactNode; addLabel: string; onAdd: () => void }) {
  return (
    <div className="mb-1 flex items-center justify-between gap-2">
      <span className="text-xs font-medium text-[#5C5A55]">{label}</span>
      <button type="button" className="shrink-0 text-xs font-medium text-[#0A3D62] hover:underline" onClick={onAdd}>
        {addLabel}
      </button>
    </div>
  );
}

function SchoolProfileFields({
  form,
  fieldError,
  t,
  logoFile,
  setLogoFile,
  groups,
  curricula,
  countries,
  onAddCurriculum,
  onAddGroup,
  onAddCountry,
}: {
  form: any;
  fieldError: (m?: string) => React.ReactNode;
  t: (k: string) => string;
  logoFile: File | null;
  setLogoFile: (f: File | null) => void;
  groups: SchoolGroupRow[];
  curricula: CurriculumRow[];
  countries: CountryRow[];
  onAddCurriculum: () => void;
  onAddGroup: () => void;
  onAddCountry: () => void;
}) {
  const fe = form.formState.errors;
  const countryCode = useWatch({ control: form.control, name: "country" }) as string | undefined;

  useEffect(() => {
    if (!countryCode || !countries.length) return;
    const row = countries.find((c) => c.code === countryCode);
    if (row) form.setValue("vatRate", row.vatRate, { shouldValidate: true });
  }, [countryCode, countries, form]);

  return (
    <>
      <div className="border-b border-[#E2E0D9] pb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9890]">{t("admin.schools.schoolSection")}</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.schoolName")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("name")} />
            {fieldError(fe.name?.message)}
          </div>
          <div>
            <LabelWithAddRow
              label={
                <>
                  {t("admin.schools.country")} <span className="text-rose-600">*</span>
                </>
              }
              addLabel={t("admin.schools.addCountry")}
              onAdd={onAddCountry}
            />
            <select className="mt-1 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm" {...form.register("country")}>
              <option value="">{t("admin.schools.selectCountry")}</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label} ({c.code})
                </option>
              ))}
            </select>
            {fieldError(fe.country?.message)}
            <p className="mt-1 text-xs text-[#9A9890]">{t("admin.schools.countryFromDbHint")}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.vatRate")}</label>
            <Input
              type="number"
              step="0.01"
              readOnly
              className="mt-1 cursor-not-allowed border-[#E2E0D9] bg-[#F5F4F0]"
              {...form.register("vatRate", { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-[#9A9890]">{t("admin.schools.vatByCountryHint")}</p>
          </div>
          <div className="sm:col-span-2">
            <LabelWithAddRow
              label={
                <>
                  {t("admin.schools.curriculum")} <span className="text-rose-600">*</span>
                </>
              }
              addLabel={t("admin.schools.addCurriculum")}
              onAdd={onAddCurriculum}
            />
            <select className="mt-1 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm" {...form.register("curriculumType")}>
              <option value="">{t("admin.schools.selectCurriculum")}</option>
              {curricula.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldError(fe.curriculumType?.message)}
            <p className="mt-1 text-xs text-[#9A9890]">{t("admin.schools.curriculumFromDbHint")}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.portalLang")}</label>
            <select className="mt-1 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm" {...form.register("preferredLang")}>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <LabelWithAddRow label={t("admin.schools.schoolGroup")} addLabel={t("admin.schools.addGroup")} onAdd={onAddGroup} />
            <select className="mt-1 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm" {...form.register("groupId")}>
              <option value="">{t("admin.schools.groupNone")}</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-b border-[#E2E0D9] pb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9890]">{t("admin.schools.addressSection")}</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.address1")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("addressLine1")} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.address2")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("addressLine2")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.city")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("city")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.region")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("region")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.postal")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("postalCode")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.phone")}</label>
            <Input className="mt-1 border-[#E2E0D9]" {...form.register("phone")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">
              {t("admin.schools.schoolEmail")} <span className="text-rose-600">*</span>
            </label>
            <Input type="email" className="mt-1 border-[#E2E0D9]" {...form.register("schoolEmail")} />
            {fieldError(fe.schoolEmail?.message)}
          </div>
          <div>
            <label className="text-xs font-medium text-[#5C5A55]">
              {t("admin.schools.whatsapp")} <span className="text-rose-600">*</span>
            </label>
            <Input type="tel" className="mt-1 border-[#E2E0D9]" autoComplete="tel" {...form.register("whatsapp")} />
            {fieldError(fe.whatsapp?.message)}
            <p className="mt-1 text-xs text-[#9A9890]">{t("admin.schools.whatsappHint")}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.website")}</label>
            <Input className="mt-1 border-[#E2E0D9]" placeholder="https://…" {...form.register("website")} />
          </div>
        </div>
      </div>

      <div className="border-b border-[#E2E0D9] pb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9890]">{t("admin.schools.brandingSection")}</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.logoFile")}</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="mt-1 block w-full text-sm text-[#5C5A55] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F5F4F0] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1A1917]"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-xs text-[#9A9890]">{t("admin.schools.logoFileHint")}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#5C5A55]">{t("admin.schools.logoUrl")}</label>
            <Input className="mt-1 border-[#E2E0D9]" placeholder="https://…" disabled={!!logoFile} {...form.register("logoUrl")} />
            {fieldError(fe.logoUrl?.message)}
          </div>
        </div>
      </div>
    </>
  );
}
