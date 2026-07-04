import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Bell, ChevronDown, Plus, LogOut, User as UserIcon,
  Clock, Settings, ArrowLeftRight, Users, CalendarCheck, CalendarClock,
  UserPlus, Briefcase
} from 'lucide-react'

// TEMPORARY mock data — replace with real API call once backend is ready
const employees = [
  { id: 1, name: 'Aisha Khan', role: 'Product Designer', status: 'present', avatarColor: '#6C5CE7' },
  { id: 2, name: 'Rahul Mehta', role: 'Backend Engineer', status: 'present', avatarColor: '#00C896' },
  { id: 3, name: 'Karan Verma', role: 'Frontend Engineer', status: 'absent', avatarColor: '#8B7CF6' },
  { id: 4, name: 'Neha Gupta', role: 'QA Engineer', status: 'present', avatarColor: '#6C5CE7' },
  { id: 5, name: 'Arjun Nair', role: 'DevOps Engineer', status: 'present', avatarColor: '#00C896' },
  { id: 6, name: 'Sneha Patel', role: 'Marketing Lead', status: 'absent', avatarColor: '#FF6B6B' },
  { id: 7, name: 'Vikram Singh', role: 'Sales Executive', status: 'present', avatarColor: '#8B7CF6' },
  { id: 8, name: 'Divya Rao', role: 'Support Lead', status: 'leave', avatarColor: '#6C5CE7' },
  { id: 9, name: 'Amit Joshi', role: 'Data Analyst', status: 'present', avatarColor: '#00C896' },
  { id: 10, name: 'Priya Sharma', role: 'HR Officer', status: 'present', avatarColor: '#FF6B6B' },
]

function StatusDot({ status }) {
  if (status === 'present') {
    return <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#00C896] border-2 border-white" />
  }
  if (status === 'leave') {
    return (
      <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#F59E0B] border-2 border-white flex items-center justify-center text-[8px]">
        ✈
      </span>
    )
  }
  return <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#FBBF24] border-2 border-white" />
}

function EmployeeCard({ employee, onClick }) {
  const initials = employee.name.split(' ').map((n) => n[0]).join('')
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#F0F0F5] rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 shadow-sm"
    >
      <div className="relative mb-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-lg"
          style={{ backgroundColor: employee.avatarColor }}
        >
          {initials}
        </div>
        <StatusDot status={employee.status} />
      </div>
      <p className="font-semibold text-sm text-[#111827]">{employee.name}</p>
      <p className="text-xs text-[#9CA3AF] mt-0.5">{employee.role}</p>
    </button>
  )
}

function CheckInWidget() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [sinceTime, setSinceTime] = useState(null)

  const handleToggle = () => {
    if (!checkedIn) {
      const now = new Date()
      setSinceTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    setCheckedIn(!checkedIn)
  }

  return (
    <div className="bg-white border border-[#F0F0F5] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${checkedIn ? 'bg-[#00C896]' : 'bg-[#D1D5DB]'}`} />
        <p className="text-xs text-[#6B7280]">
          {checkedIn ? `Since ${sinceTime}` : 'Not checked in yet'}
        </p>
      </div>
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
          checkedIn
            ? 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
            : 'bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white shadow-md shadow-[#6C5CE7]/25 hover:opacity-90'
        }`}
      >
        <Clock size={15} />
        {checkedIn ? 'Check Out' : 'Check In'}
      </button>
    </div>
  )
}

function AddMenu({ open, onClose, navigate }) {
  if (!open) return null
  return (
    <div className="absolute left-0 right-0 mt-2 bg-white border border-[#F0F0F5] rounded-xl shadow-lg py-1.5 z-30">
      <button
        onClick={() => { navigate('/add-employee'); onClose() }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F7F7FB] transition"
      >
        <UserPlus size={15} /> New Employee
      </button>
      <button
        onClick={() => { console.log('Navigate to Add HR form'); onClose() }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F7F7FB] transition"
      >
        <Briefcase size={15} /> New HR
      </button>
    </div>
  )
}

function Sidebar({ activeTab, setActiveTab, navigate }) {
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const tabs = [
    { label: 'Employees', icon: Users },
    { label: 'Attendance', icon: CalendarCheck },
    { label: 'Time Off', icon: CalendarClock },
  ]

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-[#F0F0F5] flex flex-col p-5">
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0">
          SS
        </div>
        <span className="font-display font-bold text-base leading-tight">The Support Squadron</span>
      </div>

      <div className="relative mb-6">
        <button
          onClick={() => setAddMenuOpen(!addMenuOpen)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-md shadow-[#6C5CE7]/25 hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add New
          <ChevronDown size={14} className={`ml-auto transition-transform ${addMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        <AddMenu open={addMenuOpen} onClose={() => setAddMenuOpen(false)} navigate={navigate} />
      </div>

      <nav className="space-y-1 mb-6">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === label
                ? 'bg-[#F5F3FF] text-[#6C5CE7]'
                : 'text-[#6B7280] hover:bg-[#F7F7FB] hover:text-[#111827]'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mb-6">
        <CheckInWidget />
      </div>

      <Link
        to="/dashboard/employee"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6C5CE7] bg-[#F5F3FF] hover:bg-[#EDE9FE] transition mb-1"
      >
        <ArrowLeftRight size={17} />
        Switch to Employee View
      </Link>

      <div className="flex-1" />

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-[#F7F7FB] hover:text-[#111827] transition">
        <Settings size={17} />
        Settings
      </button>
    </aside>
  )
}

function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="bg-white border-b border-[#F0F0F5] sticky top-0 z-20">
      <div className="px-6 py-3 flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full bg-[#F7F7FB] border border-transparent rounded-full py-2 pl-9 pr-4 text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#6C5CE7]/30 transition"
            />
          </div>
        </div>

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
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00C896] border-2 border-white" />
              </div>
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#F0F0F5] rounded-xl shadow-lg py-1.5 z-30">
                <Link
                  to="/profile/admin"
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

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Employees')

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-display text-2xl font-bold text-[#111827]">Employees</h1>
          </div>
          <p className="text-sm text-[#6B7280] mb-4">{employees.length} people across your organization</p>

          <div className="flex items-center gap-5 mb-6 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00C896]" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /> Absent</span>
            <span className="flex items-center gap-1.5"><span>✈</span> On Leave</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onClick={() => navigate(`/employee/${employee.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard