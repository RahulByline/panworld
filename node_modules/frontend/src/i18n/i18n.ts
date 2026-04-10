import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import { setDocumentDirection } from "../utils/rtl";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  setDocumentDirection(lng === "ar" ? "rtl" : "ltr");
});

// bootstrap direction at load
setDocumentDirection(i18n.language === "ar" ? "rtl" : "ltr");

export default i18n;

