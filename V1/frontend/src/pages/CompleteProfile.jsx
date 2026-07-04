import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Calendar, MapPin, Globe, Mail, Users, Heart, FileText, Award,
  Landmark, CreditCard, ArrowRight, IdCard, Building2, Briefcase
} from 'lucide-react'

function CompleteProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = location.state?.role || 'employee' // admin | hr | employee — passed from OTP verification

  // Personal details
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [nationality, setNationality] = useState('')
  const [personalEmail, setPersonalEmail] = useState('')
  const [gender, setGender] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')

  // Professional details
  const [about, setAbout] = useState('')
  const [skills, setSkills] = useState('')
  const [certifications, setCertifications] = useState('')

  // Bank details
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [uanNumber, setUanNumber] = useState('')

  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!dob || !address || !nationality || !personalEmail || !gender || !maritalStatus) {
      setError('Please fill in all Personal Details fields.')
      return
    }

    if (!about || !skills || !certifications) {
      setError('Please fill in all Professional Details fields.')
      return
    }

    // Bank Details is optional for Admin, but required for HR and Employee
    if (role !== 'admin') {
      if (!accountNumber || !bankName || !ifscCode || !panNumber || !uanNumber) {
        setError('Please fill in all Bank Details fields.')
        return
      }
    }

    // TODO: replace with real API call once backend is ready
    // empId should come from the logged-in session / auth token, not typed by the user
    console.log('Profile completed:', {
      role,
      personal: { dob, address, nationality, personalEmail, gender, maritalStatus },
      professional: { about, skills, certifications },
      bank: { accountNumber, bankName, ifscCode, panNumber, uanNumber },
    })

    // Route to the correct dashboard based on role
    if (role === 'admin') navigate('/dashboard/admin')
    else if (role === 'hr') navigate('/dashboard/hr')
    else navigate('/dashboard/employee')
  }

  const inputClass =
    'w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all'

  return (
    <div className="min-h-screen w-full bg-[#F7F7FB] text-[#111827] py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] flex items-center justify-center font-display font-bold text-white">
            SS
          </div>
          <span className="font-display font-bold text-xl">The Support Squadron</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">Complete your profile</h1>
          <p className="text-[#6B7280] text-sm">Just one more step before your dashboard is ready.</p>
        </div>

        {error && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm rounded-xl px-4 py-3 mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(108,92,231,0.15)] rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight mb-5">Personal Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Date of Birth</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className={inputClass} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Gender</label>
                <div className="relative">
                  <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required className={`${inputClass} appearance-none`}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Residential Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat / Street / City / State / PIN"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Nationality</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Indian"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Personal Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    placeholder="jane.personal@gmail.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Marital Status</label>
                <div className="relative">
                  <Heart size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} required className={`${inputClass} appearance-none`}>
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(108,92,231,0.15)] rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight mb-5">Professional Details</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">About</label>
                <div className="relative">
                  <FileText size={18} className="absolute left-4 top-4 text-[#9CA3AF]" />
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="A short summary about your professional background"
                    required
                    rows={3}
                    className={`${inputClass} resize-none pt-3.5`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Skills</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Team Leadership, Payroll Management, Excel"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Certifications</label>
                <div className="relative">
                  <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    placeholder="e.g. PMP, SHRM-CP"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details — optional for Admin only */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(108,92,231,0.15)] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-display text-lg font-bold tracking-tight">Bank Details</h2>
              {role === 'admin' && (
                <span className="text-xs text-[#9CA3AF] font-medium bg-[#F3F4F6] px-2 py-0.5 rounded-full">Optional</span>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Account Number</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1234567890"
                    required={role !== 'admin'}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Bank Name</label>
                <div className="relative">
                  <Landmark size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="State Bank of India"
                    required={role !== 'admin'}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">IFSC Code</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="SBIN0001234"
                    required={role !== 'admin'}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">PAN Number</label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="ABCDE1234F"
                    required={role !== 'admin'}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">UAN Number</label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={uanNumber}
                    onChange={(e) => setUanNumber(e.target.value)}
                    placeholder="123456789012"
                    required={role !== 'admin'}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl py-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#6C5CE7]/30 text-white active:scale-[0.98]"
          >
            Complete Profile & Continue
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfile