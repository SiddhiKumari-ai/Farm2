import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { RegisterFarmer } from './pages/RegisterFarmer';
import { RegisterCompany } from './pages/RegisterCompany';

// Farmer Dashboard Pages
import { FarmerLayout } from './pages/farmer/FarmerLayout';
import { FarmerOverview } from './pages/farmer/FarmerOverview';
import { MyFarm } from './pages/farmer/MyFarm';
import { CropAnalytics } from './pages/farmer/CropAnalytics';
import { EquipmentSupport } from './pages/farmer/EquipmentSupport';
import { CarbonProgramme } from './pages/farmer/CarbonProgramme';

// Company Dashboard Pages
import { CompanyLayout } from './pages/company/CompanyLayout';
import { CompanyOverview } from './pages/company/CompanyOverview';
import { SubmitRequirement } from './pages/company/SubmitRequirement';
import { MyInquiries } from './pages/company/MyInquiries';

// Admin Dashboard Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminFarmers } from './pages/admin/AdminFarmers';
import { AdminCompanies } from './pages/admin/AdminCompanies';
import { AdminAssessments } from './pages/admin/AdminAssessments';
import { AdminEquipment } from './pages/admin/AdminEquipment';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminProgrammes } from './pages/admin/AdminProgrammes';
import { AdminContacts } from './pages/admin/AdminContacts';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Website */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register/farmer" element={<RegisterFarmer />} />
                <Route path="/register/company" element={<RegisterCompany />} />

                {/* Farmer Portal (Protected) */}
                <Route
                  path="/farmer"
                  element={
                    <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                      <FarmerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<FarmerOverview />} />
                  <Route path="my-farm" element={<MyFarm />} />
                  <Route path="crop-analytics" element={<CropAnalytics />} />
                  <Route path="equipment" element={<EquipmentSupport />} />
                  <Route path="carbon-programme" element={<CarbonProgramme />} />
                </Route>

                {/* Company Portal (Protected) */}
                <Route
                  path="/company"
                  element={
                    <ProtectedRoute allowedRoles={['company', 'admin']}>
                      <CompanyLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<CompanyOverview />} />
                  <Route path="submit" element={<SubmitRequirement />} />
                  <Route path="inquiries" element={<MyInquiries />} />
                </Route>

                {/* Admin Control Center (Protected: Admin Only) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="farmers" element={<AdminFarmers />} />
                  <Route path="companies" element={<AdminCompanies />} />
                  <Route path="assessments" element={<AdminAssessments />} />
                  <Route path="equipment" element={<AdminEquipment />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                  <Route path="programmes" element={<AdminProgrammes />} />
                  <Route path="contacts" element={<AdminContacts />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
