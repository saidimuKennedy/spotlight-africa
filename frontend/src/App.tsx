/**
 * App - Main Application Component
 *
 * Root component that sets up routing and renders the main layout.
 * Features a story-like scrolling experience from top to bottom.
 *
 * @component
 */
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import {
  Navbar,
  HeroSection,
  BusinessParallaxSection,
  SpotlightSection,
  UpcomersSection,
  UpNextSection,
  Footer,
  ScrollToTop,
} from "./components";
import { fetchBusinesses, Business } from "./lib/api";
import BusinessPage from "./pages/BusinessPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AuthPage from "./pages/AuthPage";
import NetworkPage from "./pages/NetworkPage";
import InquiriesPage from "./pages/dashboard/InquiriesPage";
import PerformancePage from "./pages/dashboard/PerformancePage";
import BusinessEditorPage from "./pages/dashboard/BusinessEditorPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import RegisterBusinessPage from "./pages/RegisterBusinessPage";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage";
import BusinessesPage from "./pages/BusinessesPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogManagementPage from "./pages/dashboard/BlogManagementPage";

/**
 * ProtectedRoute Component
 * Redirects users based on their role and authentication status.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  // If not admin or owner, they can't see the dashboard metrics
  if (role !== "admin" && role !== "owner") {
    return <Navigate to="/register-business" replace />;
  }

  return <>{children}</>;
};

/**
 * HomePage - Main landing page with all sections
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch businesses on mount
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await fetchBusinesses(20, 0);
        setAllBusinesses(data);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  // Navigation handlers
  const handleExploreBio = (business: Business) => {
    navigate(`/business/${business.id}`);
  };

  const handleBusinessNavigate = (business: Business) => {
    navigate(`/business/${business.id}`);
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <>
      {/* Hero Section - >100vh with featured business */}
      <HeroSection
        allBusinesses={allBusinesses}
        onExploreBio={handleExploreBio}
      />

      {/* Top 3 Businesses - Parallax Cards */}
      <BusinessParallaxSection
        allBusinesses={allBusinesses}
        onNavigate={handleBusinessNavigate}
      />

      {/* Spotlight Africa - Brand Identity */}
      <SpotlightSection onLearnMore={handleLearnMore} />

      {/* Upcomers & Startups - Search/Filter/Sort */}
      <UpcomersSection
        initialData={allBusinesses}
        loading={loading}
        onNavigate={handleBusinessNavigate}
      />

      {/* Up Next - Events & Announcements */}
      <UpNextSection />
    </>
  );
};

import { useLocation } from "react-router-dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import PipelinePage from "./pages/dashboard/PipelinePage";

/**
 * Main App Component with Router
 */
function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      {/* Show Navbar only on non-dashboard pages */}
      {!isDashboard && <Navbar />}

      {/* Route Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Routes>
          {/* Main Site Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/business/:id" element={<BusinessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsArticlePage />} />
          <Route path="/businesses" element={<BusinessesPage />} />

          {/* Dashboard Routes wrapped in DashboardLayout */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route index element={<DashboardOverview />} />
                    <Route path="pipeline" element={<PipelinePage />} />
                    <Route path="inquiries" element={<InquiriesPage />} />
                    <Route path="performance" element={<PerformancePage />} />
                    <Route path="business" element={<BusinessEditorPage />} />
                    <Route path="blogs" element={<BlogManagementPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Global Footer */}
      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;
