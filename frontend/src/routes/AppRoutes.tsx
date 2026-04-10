import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./RequireAuth.tsx";
import { RequireRole } from "./RequireRole.tsx";
import { AuthLayout } from "../ui/layouts/AuthLayout.tsx";
import { AppLayout } from "../ui/layouts/AppLayout.tsx";
import { AdminLayout } from "../ui/layouts/AdminLayout.tsx";
import { PanworldAdminRedirect } from "./PanworldAdminRedirect.tsx";
import { LoginPage } from "../ui/pages/auth/LoginPage.tsx";
import { ForgotPasswordPage } from "../ui/pages/auth/ForgotPasswordPage.tsx";
import { ResetPasswordPage } from "../ui/pages/auth/ResetPasswordPage.tsx";
import { InviteActivationPage } from "../ui/pages/auth/InviteActivationPage.tsx";
import { ProfileCompletionPage } from "../ui/pages/auth/ProfileCompletionPage.tsx";
import { DashboardPage } from "../ui/pages/app/DashboardPage.tsx";
import { CataloguePage } from "../ui/pages/app/CataloguePage.tsx";
import { ProductDetailPage } from "../ui/pages/app/ProductDetailPage.tsx";
import { RfqPage } from "../ui/pages/app/RfqPage.tsx";
import { RfqDetailPage } from "../ui/pages/app/RfqDetailPage.tsx";
import { InvoicesPage } from "../ui/pages/app/InvoicesPage.tsx";
import { SupportPage } from "../ui/pages/app/SupportPage.tsx";
import { PlaceholderPage } from "../ui/pages/app/PlaceholderPage.tsx";
import { WishlistPage } from "../ui/pages/app/WishlistPage.tsx";
import { AnnouncementsPage } from "../ui/pages/app/AnnouncementsPage.tsx";
import { ContactsPage } from "../ui/pages/app/ContactsPage.tsx";
import { TrainingPage } from "../ui/pages/app/TrainingPage.tsx";
import { WebinarsPage } from "../ui/pages/app/WebinarsPage.tsx";
import { ResourcesPage } from "../ui/pages/app/ResourcesPage.tsx";
import { SamplesPage } from "../ui/pages/app/SamplesPage.tsx";
import { SampleRequestDetailPage } from "../ui/pages/app/SampleRequestDetailPage.tsx";
import { SampleRequestFollowUpPage } from "../ui/pages/app/SampleRequestFollowUpPage.tsx";
import { CertificatesPage } from "../ui/pages/app/CertificatesPage.tsx";
import { AssessmentPage } from "../ui/pages/app/AssessmentPage.tsx";
import { AnalyticsPage } from "../ui/pages/app/AnalyticsPage.tsx";
import { OrdersPage } from "../ui/pages/app/OrdersPage.tsx";
import { UsersPage } from "../ui/pages/app/UsersPage.tsx";
import { SyncLogsPage } from "../ui/pages/app/SyncLogsPage.tsx";
import { CurriculumMappingPage } from "../ui/pages/app/CurriculumMappingPage.tsx";
import { DemoHubPage } from "../ui/pages/app/DemoHubPage.tsx";
import { AdminDashboard } from "../ui/pages/admin/AdminDashboard.tsx";
import { AdminSchoolsPage } from "../ui/pages/admin/AdminSchoolsPage.tsx";
import { AdminPlaceholderPage } from "../ui/pages/admin/AdminPlaceholderPage.tsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/invite" element={<InviteActivationPage />} />
        <Route path="/first-login" element={<ProfileCompletionPage />} />
      </Route>

      <Route
        path="/app/*"
        element={
          <RequireAuth>
            <PanworldAdminRedirect>
              <AppLayout />
            </PanworldAdminRedirect>
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="catalogue" element={<CataloguePage />} />
        <Route path="catalogue/:id" element={<ProductDetailPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="curriculum-mapping" element={<CurriculumMappingPage />} />
        <Route path="demo-hub" element={<DemoHubPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="webinars" element={<WebinarsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="samples" element={<SamplesPage />} />
        <Route path="samples/:id" element={<SampleRequestDetailPage />} />
        <Route path="samples/:id/follow-up" element={<SampleRequestFollowUpPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="assessment" element={<AssessmentPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="rfq" element={<RfqPage />} />
        <Route path="rfq/:id" element={<RfqDetailPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="sync-logs" element={<SyncLogsPage />} />
        <Route
          path="__placeholder"
          element={<PlaceholderPage title="Placeholder" description="(kept for quick scaffolding)" />}
        />
      </Route>

      <Route
        path="/admin/*"
        element={
          <RequireAuth>
            <RequireRole roles={["PANWORLD_ADMIN"]}>
              <AdminLayout />
            </RequireRole>
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="schools" element={<AdminSchoolsPage />} />
        <Route path="analytics" element={<AdminPlaceholderPage titleKey="admin.titles.analytics" />} />
        <Route path="rfq" element={<AdminPlaceholderPage titleKey="admin.titles.rfq" />} />
        <Route path="support" element={<AdminPlaceholderPage titleKey="admin.titles.support" />} />
        <Route path="cms/catalogue" element={<AdminPlaceholderPage titleKey="admin.titles.cmsCatalogue" />} />
        <Route path="cms/announcements" element={<AdminPlaceholderPage titleKey="admin.titles.cmsAnnouncements" />} />
        <Route path="cms/demo-credentials" element={<AdminPlaceholderPage titleKey="admin.titles.cmsDemo" />} />
        <Route path="cms/resources" element={<AdminPlaceholderPage titleKey="admin.titles.cmsResources" />} />
        <Route path="whatsapp-logs" element={<AdminPlaceholderPage titleKey="admin.titles.whatsapp" />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

