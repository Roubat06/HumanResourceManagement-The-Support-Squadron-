import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, ChevronDown, LogOut, User as UserIcon, Pencil,
  Building2, Users2, Mail, Phone, MapPin, Calendar, Globe,
  Heart, Landmark, CreditCard, IdCard, ShieldCheck, KeyRound,
  Briefcase, Award, FileText, Camera
} from 'lucide-react'

// TEMPORARY mock data — replace with real API call once backend is ready
// e.g. fetch('/api/me/profile')
const profileData = {
  name: 'Aisha Khan',
  jobPosition: 'Product Designer',
  email: 'aisha.khan@acmecorp.com',
  mobile: '+91 98765 11111',
  company: 'Acme Corp',
  department: 'Design',
  manager: 'Rahul Mehta',
  location: 'Bengaluru, India',
  empCode: 'OIAIKH20260002',
  private: {
    dob: '1996-04-12',
    address: '221B, Palm Residency, Bengaluru, Karnataka 560001',
    nationality: 'Indian',
    personalEmail: 'aisha.khan.personal@gmail.com',
    gender: 'Female',
    maritalStatus: 'Single',
    doj: '2023-02-14',
  },
  salary: {
    accountNumber: '•••• •••• 4521',
    bankName: 'HDFC Bank',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    uanNumber: '123456789012',
  },
  resume: {
    about: 'Product designer with 4+ years crafting clean, usable interfaces for B2B SaaS.',
    skills: 'Figma, Design Systems, User Research, Prototyping',
    certifications: 'Google UX Design Certificate',
  },
}

function TopNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navItems = ['Employees', 'Attendance', 'Time Off']

  return (
    <div className="bg-white border-b border-[#F0F0F5] sticky top-0 z-20">
      <div className="px-6 sm:px-8 py-3.5 flex items-center gap-6">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] flex items-center justify-center font-display font-bold text-sm text-white">
            SS
          </div>
          <span className="font-display font-bold text-sm hidden sm:block">The Support Squadron</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item}
              to={`/dashboard/employee`}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F7F7FB] hover:text-[#111827] transition"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="relative p-2 rounded-full hover:bg-[#F7F7FB] transition">
            <Bell size={18} className="text-[#6B7280]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B6B]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#F7F7FB] transition"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center text-white text-xs font-semibold">
                  AK
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00C896] border-2 border-white" />
              </div>
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#F0F0F5] rounded-xl shadow-lg py-1.5 z-30">
                <Link
                  to="/profile/employee"
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F7F7FB] transition"
                >
                  <UserIcon size={15} /> My Profile
                </Link>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition">
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoField({ icon: Icon, label, value, editing, onChange, type = 'text' }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <Icon size={12} />
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
        />
      ) : (
        <p className="text-sm font-medium text-[#374151]">{value}</p>
      )}
    </div>
  )
}

function ResumeTab({ resume }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <FileText size={12} /> About
        </p>
        <p className="text-sm text-[#374151] leading-relaxed">{resume.about}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Briefcase size={12} /> Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {resume.skills.split(',').map((skill) => (
            <span key={skill} className="bg-[#F5F3FF] text-[#6C5CE7] text-xs font-medium px-3 py-1.5 rounded-full">
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Award size={12} /> Certifications
        </p>
        <p className="text-sm text-[#374151]">{resume.certifications}</p>
      </div>
    </div>
  )
}

function PrivateInfoTab({ data, editing, onFieldChange }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <InfoField icon={Calendar} label="Date of Birth" value={data.dob} editing={editing} type="date" onChange={(e) => onFieldChange('dob', e.target.value)} />
      <InfoField icon={Users2} label="Gender" value={data.gender} editing={editing} onChange={(e) => onFieldChange('gender', e.target.value)} />
      <InfoField icon={MapPin} label="Residing Address" value={data.address} editing={editing} onChange={(e) => onFieldChange('address', e.target.value)} />
      <InfoField icon={Globe} label="Nationality" value={data.nationality} editing={editing} onChange={(e) => onFieldChange('nationality', e.target.value)} />
      <InfoField icon={Mail} label="Personal Email" value={data.personalEmail} editing={editing} type="email" onChange={(e) => onFieldChange('personalEmail', e.target.value)} />
      <InfoField icon={Heart} label="Marital Status" value={data.maritalStatus} editing={editing} onChange={(e) => onFieldChange('maritalStatus', e.target.value)} />
      <InfoField icon={Calendar} label="Date of Joining" value={data.doj} editing={false} onChange={() => {}} />
    </div>
  )
}

function SalaryInfoTab({ data, editing, onFieldChange, empCode }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <InfoField icon={IdCard} label="Employee Code" value={empCode} editing={false} onChange={() => {}} />
      <div />
      <InfoField icon={CreditCard} label="Account Number" value={data.accountNumber} editing={editing} onChange={(e) => onFieldChange('accountNumber', e.target.value)} />
      <InfoField icon={Landmark} label="Bank Name" value={data.bankName} editing={editing} onChange={(e) => onFieldChange('bankName', e.target.value)} />
      <InfoField icon={Building2} label="IFSC Code" value={data.ifscCode} editing={editing} onChange={(e) => onFieldChange('ifscCode', e.target.value)} />
      <InfoField icon={IdCard} label="PAN Number" value={data.panNumber} editing={editing} onChange={(e) => onFieldChange('panNumber', e.target.value)} />
      <InfoField icon={IdCard} label="UAN Number" value={data.uanNumber} editing={editing} onChange={(e) => onFieldChange('uanNumber', e.target.value)} />
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center gap-3 bg-[#F5F3FF] rounded-xl px-4 py-3.5">
        <ShieldCheck size={18} className="text-[#6C5CE7] flex-shrink-0" />
        <p className="text-sm text-[#374151]">Two-factor authentication (OTP) is enabled on every sign-in.</p>
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#E5E7EB] hover:border-[#6C5CE7] hover:text-[#6C5CE7] text-[#374151] text-sm font-semibold px-4 py-3 rounded-xl transition">
        <KeyRound size={16} />
        Change Password
      </button>
    </div>
  )
}

function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('Private Info')
  const [editing, setEditing] = useState(false)
  const [privateInfo, setPrivateInfo] = useState(profileData.private)
  const [salaryInfo, setSalaryInfo] = useState(profileData.salary)

  const tabs = ['Resume', 'Private Info', 'Salary Info', 'Security']

  const handleSave = () => {
    // TODO: replace with real API call once backend is ready
    // await fetch('/api/me/profile', { method: 'PUT', body: JSON.stringify({ privateInfo, salaryInfo }) })
    console.log('Saving profile:', { privateInfo, salaryInfo })
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-[#111827]">
      <TopNav />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">My Profile</h1>

        {/* Profile header */}
        <div className="bg-white border border-[#F0F0F5] rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center text-white font-display font-bold text-3xl">
                AK
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-[#F0F0F5] flex items-center justify-center hover:bg-[#F7F7FB] transition">
                <Camera size={14} className="text-[#6B7280]" />
              </button>
            </div>

            <div className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h2 className="font-display text-xl font-bold mb-0.5">{profileData.name}</h2>
                <p className="text-sm text-[#9CA3AF] mb-4">{profileData.jobPosition}</p>
                <div className="space-y-2.5">
                  <p className="text-sm text-[#6B7280] flex items-center gap-2"><Mail size={14} /> {profileData.email}</p>
                  <p className="text-sm text-[#6B7280] flex items-center gap-2"><Phone size={14} /> {profileData.mobile}</p>
                </div>
              </div>
              <div className="space-y-2.5 sm:pt-9">
                <p className="text-sm text-[#6B7280] flex items-center gap-2"><Building2 size={14} /> {profileData.company}</p>
                <p className="text-sm text-[#6B7280] flex items-center gap-2"><Users2 size={14} /> {profileData.department}</p>
                <p className="text-sm text-[#6B7280] flex items-center gap-2"><UserIcon size={14} /> Manager: {profileData.manager}</p>
                <p className="text-sm text-[#6B7280] flex items-center gap-2"><MapPin size={14} /> {profileData.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="bg-white border border-[#F0F0F5] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#F0F0F5] px-2">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setEditing(false) }}
                  className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                    activeTab === tab
                      ? 'border-[#6C5CE7] text-[#6C5CE7]'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#374151]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {(activeTab === 'Private Info' || activeTab === 'Salary Info') && (
              <div className="flex-shrink-0 pr-4">
                {editing ? (
                  <button
                    onClick={handleSave}
                    className="text-xs font-semibold text-white bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#6C5CE7] hover:underline"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'Resume' && <ResumeTab resume={profileData.resume} />}
            {activeTab === 'Private Info' && (
              <PrivateInfoTab
                data={privateInfo}
                editing={editing}
                onFieldChange={(field, value) => setPrivateInfo((p) => ({ ...p, [field]: value }))}
              />
            )}
            {activeTab === 'Salary Info' && (
              <SalaryInfoTab
                data={salaryInfo}
                editing={editing}
                empCode={profileData.empCode}
                onFieldChange={(field, value) => setSalaryInfo((s) => ({ ...s, [field]: value }))}
              />
            )}
            {activeTab === 'Security' && <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile