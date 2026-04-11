import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

const PANWORLD: {
  initials: string;
  avatarBg: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}[] = [
  {
    initials: "RK",
    avatarBg: "var(--pw-brand)",
    name: "Rania Khalil",
    role: "Senior Account Manager · UAE",
    phone: "+971 50 123 4567",
    email: "r.khalil@panworld.ae",
  },
  {
    initials: "MH",
    avatarBg: "#512DA8",
    name: "Mohamed Hassan",
    role: "Regional Manager · UAE · Escalations",
    phone: "+971 50 987 6543",
    email: "m.hassan@panworld.ae",
  },
];

const PUBLISHER_REPS: {
  emoji: string;
  pubClass: string;
  name: string;
  line: string;
  contact: string;
}[] = [
  { emoji: "📗", pubClass: "pub-mcgraw", name: "Ahmed Al Rashidi", line: "McGraw Hill · UAE", contact: "+971 4 456 7890" },
  { emoji: "🏫", pubClass: "pub-kodeit", name: "Lena Abdallah", line: "Kodeit Global · UAE", contact: "+971 4 111 2233" },
  { emoji: "📕", pubClass: "pub-oxford", name: "Sara Malik", line: "Oxford · UAE & Gulf", contact: "+971 4 678 9012" },
  { emoji: "📗", pubClass: "pub-cambridge", name: "James Mitchell", line: "Cambridge · UAE & Gulf", contact: "+971 4 345 6789" },
  { emoji: "📙", pubClass: "pub-pearson", name: "Fatima Nasser", line: "Pearson / Savvas · UAE", contact: "+971 4 222 3344" },
  { emoji: "🔤", pubClass: "pub-jolly", name: "Panworld KG Team", line: "Jolly Phonics enquiries", contact: "kg@panworld.ae" },
];

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export function ContactsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("nav.contactDirectory")} subtitle={t("mvpPages.contacts.subtitle")} />

      <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C5A55]">
        {t("mvpPages.contacts.panworldTeam")}
      </div>
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {PANWORLD.map((p) => (
          <div key={p.email} className="pw-contact-card">
            <div className="mb-3 flex items-center gap-3">
              <div className="pw-contact-avatar" style={{ background: p.avatarBg }}>
                {p.initials}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#1A1917]">{p.name}</div>
                <div className="text-[12.5px] text-[#5C5A55]">{p.role}</div>
              </div>
            </div>
            <div className="mb-3 flex flex-col gap-1.5 text-[13px] text-[#5C5A55]">
              <div>📞 {p.phone}</div>
              <div>✉ {p.email}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                className="pw-wa-btn no-underline"
                href={`https://wa.me/${digitsOnly(p.phone)}`}
                target="_blank"
                rel="noreferrer"
              >
                💬 {t("mvpPages.contacts.whatsapp")}
              </a>
              <a className="pw-btn pw-btn-outline pw-btn-sm no-underline" href={`mailto:${p.email}`}>
                ✉ {t("mvpPages.contacts.email")}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#5C5A55]">
        {t("mvpPages.contacts.publisherReps")}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PUBLISHER_REPS.map((r) => (
          <div key={r.name} className="pw-contact-card p-3.5">
            <div className="mb-2.5 flex items-center gap-2.5">
              <div className={cn("pw-demo-icon mb-0 h-9 w-9 shrink-0 p-0 text-lg", r.pubClass)}>
                {r.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#1A1917]">{r.name}</div>
                <div className="text-[11.5px] text-[#5C5A55]">{r.line}</div>
              </div>
            </div>
            <div className="mb-2 text-[12px] text-[#5C5A55]">{r.contact}</div>
            <a
              className="pw-wa-btn w-full justify-center text-[11.5px] no-underline"
              href={
                r.contact.includes("@")
                  ? `mailto:${r.contact}`
                  : `https://wa.me/${digitsOnly(r.contact)}`
              }
              target="_blank"
              rel="noreferrer"
            >
              💬 {t("mvpPages.contacts.whatsapp")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
