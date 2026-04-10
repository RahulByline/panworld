export function setDocumentDirection(dir: "ltr" | "rtl") {
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", dir === "rtl" ? "ar" : "en");
}

