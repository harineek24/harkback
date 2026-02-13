"use client";
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../_contexts/AuthContext'
import LoginPage from './LoginPage'
import DoctorLayout from '../_layouts/DoctorLayout'
import ClinicAdminLayout from '../_layouts/ClinicAdminLayout'
import PatientLayout from '../_layouts/PatientLayout'
import ConsultConfig from './ConsultConfig'
import DoctorHistory from './doctor/DoctorHistory'
import DoctorCalendar from './doctor/DoctorCalendar'
import DoctorFeed from './doctor/DoctorFeed'
import DoctorReplyPage from './doctor/DoctorReplyPage'
import AdminPatientRegistration from './clinicadmin/AdminPatientRegistration'
import AdminDoctorManagement from './clinicadmin/AdminDoctorManagement'
import BillingDashboard from './clinicadmin/BillingDashboard'
import InsuranceDashboard from './clinicadmin/InsuranceDashboard'
import ClaimsDashboard from './clinicadmin/ClaimsDashboard'
import ClaimDetail from './clinicadmin/ClaimDetail'
import ClearinghousePage from './clinicadmin/ClearinghousePage'
import EligibilityPage from './clinicadmin/EligibilityPage'
import PaymentsDashboard from './clinicadmin/PaymentsDashboard'
import StatementsDashboard from './clinicadmin/StatementsDashboard'
import InsuranceDiscoveryPage from './clinicadmin/InsuranceDiscoveryPage'
import ERAPage from './clinicadmin/ERAPage'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  requiredRole: 'clinicadmin' | 'doctor' | 'patient'
  children: ReactNode
}

function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (role !== requiredRole) {
    return <Navigate to={`/${role}`} replace />
  }

  return <>{children}</>
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Clinic Admin Portal */}
      <Route
        path="/clinicadmin"
        element={
          <ProtectedRoute requiredRole="clinicadmin">
            <ClinicAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="patients" replace />} />
        <Route path="patients" element={<AdminPatientRegistration />} />
        <Route path="doctors" element={<AdminDoctorManagement />} />
        <Route path="billing" element={<BillingDashboard />} />
        <Route path="claims" element={<ClaimsDashboard />} />
        <Route path="claims/:id" element={<ClaimDetail />} />
        <Route path="clearinghouse" element={<ClearinghousePage />} />
        <Route path="eligibility" element={<EligibilityPage />} />
        <Route path="payments" element={<PaymentsDashboard />} />
        <Route path="era" element={<ERAPage />} />
        <Route path="discovery" element={<InsuranceDiscoveryPage />} />
        <Route path="statements" element={<StatementsDashboard />} />
        <Route path="insurance" element={<InsuranceDashboard />} />
      </Route>

      {/* Doctor Portal */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorFeed />} />
        <Route path="reply/:updateId" element={<DoctorReplyPage />} />
        <Route path="history" element={<DoctorHistory />} />
        <Route path="calendar" element={<DoctorCalendar />} />
        <Route path="consultconfig" element={<ConsultConfig />} />
      </Route>

      {/* Patient Portal */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientLayout />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
