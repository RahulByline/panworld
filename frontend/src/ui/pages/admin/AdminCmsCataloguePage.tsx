import { Navigate } from "react-router-dom";

/** Legacy route: catalogue management is split into textbooks, library books, and kits. */
export function AdminCmsCataloguePage() {
  return <Navigate to="/admin/cms/textbooks" replace />;
}
