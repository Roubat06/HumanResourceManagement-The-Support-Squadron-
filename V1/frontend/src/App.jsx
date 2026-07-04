import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import OtpVerification from './pages/OtpVerification'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CompleteProfile from './pages/CompleteProfile'
import HRDashboard from './pages/HRDashboard'

// TEMPORARY placeholder — replace with the real page once it's built
function ComingSoon({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7FB] text-[#6B7280]">
      <p className="text-sm font-medium">{label} — coming soon</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Dashboards */}
        <Route path="/dashboard/hr" element={<HRDashboard />} />
        <Route path="/dashboard/admin" element={<ComingSoon label="Admin Dashboard" />} />
        <Route path="/dashboard/employee" element={<ComingSoon label="Employee Dashboard" />} />

        {/* Profiles */}
        <Route path="/profile/hr" element={<ComingSoon label="HR Profile" />} />

        {/* Catch-all — keep this LAST so it doesn't swallow real routes */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App