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
import { SchoolPortalOutlet } from "../ui/shared/SchoolPortalOutlet.tsx";
import { PortalIndexPage } from "../ui/pages/app/PortalIndexPage.tsx";
import { SalesSchoolsPage } from "../ui/pages/sales/SalesSchoolsPage.tsx";
import { SalesPipelinePage } from "../ui/pages/sales/SalesPipelinePage.tsx";
import { SalesSignalsPage } from "../ui/pages/sales/SalesSignalsPage.tsx";
import { SalesPerformancePage } from "../ui/pages/sales/SalesPerformancePage.tsx";
import { CataloguePage } from "../ui/pages/app/CataloguePage.tsx";
import { LibraryPage } from "../ui/pages/app/LibraryPage.tsx";
import { KitsPage } from "../ui/pages/app/KitsPage.tsx";
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
import { AdminDashboard } from "../ui/pages/admin-dashboard";
import { AdminSchoolsPage } from "../ui/pages/admin/AdminSchoolsPage.tsx";
import { AdminSchoolDetailsPage } from "../ui/pages/admin/AdminSchoolDetailsPage.tsx";
import { AdminRfqPipelinePage } from "../ui/pages/admin/AdminRfqPipelinePage.tsx";
import { AdminAnalyticsPage } from "../ui/pages/admin/AdminAnalyticsPage.tsx";
import { AdminSupportTicketsPage } from "../ui/pages/admin/AdminSupportTicketsPage.tsx";
import { AdminCmsCataloguePage } from "../ui/pages/admin/AdminCmsCataloguePage.tsx";
import { AdminCmsAnnouncementsPage } from "../ui/pages/admin/AdminCmsAnnouncementsPage.tsx";
import { AdminPublisherAccessPage } from "../ui/pages/admin/AdminPublisherAccessPage.tsx";
import { AdminCmsResourcesPage } from "../ui/pages/admin/AdminCmsResourcesPage.tsx";
import { AdminWhatsappLogsPage } from "../ui/pages/admin/AdminWhatsappLogsPage.tsx";
import { AdminAccountManagersPage } from "../ui/pages/admin/AdminAccountManagersPage.tsx";
import { AdminPublishersPage } from "../ui/pages/admin/AdminPublishersPage.tsx";
import { AdminIntegrationsPage } from "../ui/pages/admin/AdminIntegrationsPage.tsx";
import { AdminAuditLogPage } from "../ui/pages/admin/AdminAuditLogPage.tsx";
import { AdminCatalogueSegmentPage } from "../ui/pages/admin/AdminCatalogueSegmentPage.tsx";
import { AdminUsersPage } from "../ui/pages/admin/AdminUsersPage.tsx";
import { AdminSchoolAssignmentsPage } from "../ui/pages/admin/AdminSchoolAssignmentsPage.tsx";
import { AdminOrdersPage } from "../ui/pages/admin/AdminOrdersPage.tsx";
import { AdminInvoicesPage } from "../ui/pages/admin/AdminInvoicesPage.tsx";
import { AdminSamplesPage } from "../ui/pages/admin/AdminSamplesPage.tsx";
import { AdminWebinarsPage } from "../ui/pages/admin/AdminWebinarsPage.tsx";
import { AdminCertificationsPage } from "../ui/pages/admin/AdminCertificationsPage.tsx";
import { AdminPublisherDashboardPage } from "../ui/pages/admin-dashboard";
import { AdminOdooPage } from "../ui/pages/admin/AdminOdooPage.tsx";
import { AdminSettingsPage } from "../ui/pages/admin/AdminSettingsPage.tsx";

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
        <Route index element={<PortalIndexPage />} />
        <Route path="sales/schools" element={<SalesSchoolsPage />} />
        <Route path="sales/pipeline" element={<SalesPipelinePage />} />
        <Route path="sales/signals" element={<SalesSignalsPage />} />
        <Route path="sales/performance" element={<SalesPerformancePage />} />
        <Route element={<SchoolPortalOutlet />}>
          <Route path="catalogue" element={<CataloguePage />} />
          <Route path="catalogue/:id" element={<ProductDetailPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="kits" element={<KitsPage />} />
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
        <Route path="account-managers" element={<AdminAccountManagersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="assignments" element={<AdminSchoolAssignmentsPage />} />
        <Route path="audit-log" element={<AdminAuditLogPage />} />
        <Route path="publishers" element={<AdminPublishersPage />} />
        <Route path="publisher-dashboard" element={<AdminPublisherDashboardPage />} />
        <Route path="integrations" element={<AdminIntegrationsPage />} />
        <Route path="odoo" element={<AdminOdooPage />} />
        <Route path="schools" element={<AdminSchoolsPage />} />
        <Route path="schools/:id" element={<AdminSchoolDetailsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="rfq" element={<AdminRfqPipelinePage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="invoices" element={<AdminInvoicesPage />} />
        <Route path="samples" element={<AdminSamplesPage />} />
        <Route path="support" element={<AdminSupportTicketsPage />} />
        <Route path="webinars" element={<AdminWebinarsPage />} />
        <Route path="certifications" element={<AdminCertificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="cms/catalogue" element={<AdminCmsCataloguePage />} />
        <Route path="cms/textbooks" element={<AdminCatalogueSegmentPage />} />
        <Route path="cms/library" element={<AdminCatalogueSegmentPage />} />
        <Route path="cms/kits" element={<AdminCatalogueSegmentPage />} />
        <Route path="cms/announcements" element={<AdminCmsAnnouncementsPage />} />
        <Route path="cms/publisher-access" element={<AdminPublisherAccessPage />} />
        <Route path="cms/demo-credentials" element={<Navigate to="/admin/cms/publisher-access" replace />} />
        <Route path="cms/resources" element={<AdminCmsResourcesPage />} />
        <Route path="whatsapp-logs" element={<AdminWhatsappLogsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

