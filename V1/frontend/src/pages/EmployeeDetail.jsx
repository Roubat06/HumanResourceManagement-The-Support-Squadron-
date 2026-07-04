import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, Building2, Briefcase, CalendarDays,
  Clock, CheckCircle2, XCircle, PlaneTakeoff, TrendingUp
} from 'lucide-react'

// TEMPORARY mock data — replace with real API call once backend is ready
// e.g. fetch(`/api/employees/${id}`) and fetch(`/api/employees/${id}/attendance`)
const employees = [
  { id: 1, name: 'Aisha Khan', role: 'Product Designer', status: 'present', avatarColor: '#6C5CE7', email: 'aisha.khan@acmecorp.com', phone: '+91 98765 11111', department: 'Design', doj: '2023-02-14' },
  { id: 2, name: 'Rahul Mehta', role: 'Backend Engineer', status: 'present', avatarColor: '#00C896', email: 'rahul.mehta@acmecorp.com', phone: '+91 98765 22222', department: 'Engineering', doj: '2022-11-01' },
  { id: 3, name: 'Karan Verma', role: 'Frontend Engineer', status: 'absent', avatarColor: '#8B7CF6', email: 'karan.verma@acmecorp.com', phone: '+91 98765 33333', department: 'Engineering', doj: '2023-06-19' },
  { id: 4, name: 'Neha Gupta', role: 'QA Engineer', status: 'present', avatarColor: '#6C5CE7', email: 'neha.gupta@acmecorp.com', phone: '+91 98765 44444', department: 'Engineering', doj: '2023-01-09' },
  { id: 5, name: 'Arjun Nair', role: 'DevOps Engineer', status: 'present', avatarColor: '#00C896', email: 'arjun.nair@acmecorp.com', phone: '+91 98765 55555', department: 'Engineering', doj: '2021-09-23' },
  { id: 6, name: 'Sneha Patel', role: 'Marketing Lead', status: 'absent', avatarColor: '#FF6B6B', email: 'sneha.patel@acmecorp.com', phone: '+91 98765 66666', department: 'Marketing', doj: '2022-03-30' },
  { id: 7, name: 'Vikram Singh', role: 'Sales Executive', status: 'present', avatarColor: '#8B7CF6', email: 'vikram.singh@acmecorp.com', phone: '+91 98765 77777', department: 'Sales', doj: '2023-08-11' },
  { id: 8, name: 'Divya Rao', role: 'Support Lead', status: 'leave', avatarColor: '#6C5CE7', email: 'divya.rao@acmecorp.com', phone: '+91 98765 88888', department: 'Support', doj: '2020-12-05' },
  { id: 9, name: 'Amit Joshi', role: 'Data Analyst', status: 'present', avatarColor: '#00C896', email: 'amit.joshi@acmecorp.com', phone: '+91 98765 99999', department: 'Analytics', doj: '2023-04-17' },
]

// TEMPORARY mock attendance — replace with real API call once backend is ready
const attendanceSummary = { present: 21, absent: 2, leave: 1, workingDays: 24 }

const recentAttendance = [
  { date: 'Jul 4, 2026', status: 'present', checkIn: '09:12 AM', checkOut: '06:05 PM' },
  { date: 'Jul 3, 2026', status: 'present', checkIn: '09:05 AM', checkOut: '06:00 PM' },
  { date: 'Jul 2, 2026', status: 'leave', checkIn: '—', checkOut: '—' },
  { date: 'Jul 1, 2026', status: 'present', checkIn: '09:20 AM', checkOut: '05:58 PM' },
  { date: 'Jun 30, 2026', status: 'absent', checkIn: '—', checkOut: '—' },
]

const timeOffRequests = [
  { id: 1, type: 'Sick Leave', dates: 'Jun 2 – Jun 2, 2026', status: 'approved' },
  { id: 2, type: 'Vacation', dates: 'May 12 – May 15, 2026', status: 'approved' },
  { id: 3, type: 'Casual Leave', dates: 'Jul 10 – Jul 11, 2026', status: 'pending' },
]

function StatusPill({ status }) {
  const styles = {
    present: { bg: '#ECFDF5', text: '#059669', icon: CheckCircle2, label: 'Present' },
    absent: { bg: '#FEF2F2', text: '#DC2626', icon: XCircle, label: 'Absent' },
    leave: { bg: '#FFFBEB', text: '#D97706', icon: PlaneTakeoff, label: 'On Leave' },
    approved: { bg: '#ECFDF5', text: '#059669', icon: CheckCircle2, label: 'Approved' },
    pending: { bg: '#FFFBEB', text: '#D97706', icon: Clock, label: 'Pending' },
  }
  const s = styles[status]
  const Icon = s.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <Icon size={12} />
      {s.label}
    </span>
  )
}

function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const employee = employees.find((e) => e.id === Number(id))

  if (!employee) {
    return (
      <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">Employee not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#6C5CE7] font-semibold hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const initials = employee.name.split(' ').map((n) => n[0]).join('')
  const attendanceRate = Math.round((attendanceSummary.present / attendanceSummary.workingDays) * 100)

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-[#111827]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition mb-6"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </button>

        {/* Profile header */}
        <div className="bg-white border border-[#F0F0F5] rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl"
                style={{ backgroundColor: employee.avatarColor }}
              >
                {initials}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="font-display text-2xl font-bold">{employee.name}</h1>
                <StatusPill status={employee.status} />
              </div>
              <p className="text-sm text-[#6B7280] mb-4">{employee.role} · {employee.department}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {employee.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} /> {employee.phone}</span>
                <span className="flex items-center gap-1.5"><Building2 size={14} /> {employee.department}</span>
                <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Joined {employee.doj}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, color: '#6C5CE7' },
            { label: 'Days Present', value: attendanceSummary.present, icon: CheckCircle2, color: '#00C896' },
            { label: 'Days Absent', value: attendanceSummary.absent, icon: XCircle, color: '#FF6B6B' },
            { label: 'Days on Leave', value: attendanceSummary.leave, icon: PlaneTakeoff, color: '#F59E0B' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-[#F0F0F5] rounded-2xl p-5 shadow-sm">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${color}1A` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <p className="font-display text-2xl font-bold">{value}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent attendance */}
          <div className="bg-white border border-[#F0F0F5] rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-base font-bold mb-4">Recent Attendance</h2>
            <div className="space-y-2">
              {recentAttendance.map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F7F7FB] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#374151]">{entry.date}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {entry.checkIn !== '—' ? `${entry.checkIn} – ${entry.checkOut}` : 'No check-in recorded'}
                    </p>
                  </div>
                  <StatusPill status={entry.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Time off requests */}
          <div className="bg-white border border-[#F0F0F5] rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-base font-bold mb-4">Time Off History</h2>
            <div className="space-y-2">
              {timeOffRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between py-2.5 border-b border-[#F7F7FB] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#374151]">{req.type}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{req.dates}</p>
                  </div>
                  <StatusPill status={req.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetail