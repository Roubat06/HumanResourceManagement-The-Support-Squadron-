import { useState } from 'react'
import { Search, Plane, Stethoscope, Check, X, ChevronDown } from 'lucide-react'

// TEMPORARY mock data — replace with real API call once backend is ready
// e.g. fetch('/api/timeoff?status=all')
const initialRequests = [
  { id: 1, name: 'Aisha Khan', avatarColor: '#6C5CE7', startDate: '2026-07-10', endDate: '2026-07-11', type: 'Paid Time Off', status: 'pending' },
  { id: 2, name: 'Karan Verma', avatarColor: '#8B7CF6', startDate: '2026-07-02', endDate: '2026-07-02', type: 'Sick Time Off', status: 'pending' },
  { id: 3, name: 'Divya Rao', avatarColor: '#6C5CE7', startDate: '2026-05-12', endDate: '2026-05-15', type: 'Paid Time Off', status: 'approved' },
  { id: 4, name: 'Sneha Patel', avatarColor: '#FF6B6B', startDate: '2026-06-20', endDate: '2026-06-21', type: 'Sick Time Off', status: 'approved' },
  { id: 5, name: 'Vikram Singh', avatarColor: '#8B7CF6', startDate: '2026-07-15', endDate: '2026-07-16', type: 'Paid Time Off', status: 'pending' },
  { id: 6, name: 'Amit Joshi', avatarColor: '#00C896', startDate: '2026-04-03', endDate: '2026-04-03', type: 'Unpaid Leave', status: 'rejected' },
]

// TEMPORARY mock leave balances — replace with real API call once backend is ready
const leaveBalances = { paidTimeOff: 24, sickTimeOff: 7 }

function StatusBadge({ status }) {
  const styles = {
    pending: { bg: '#FFFBEB', text: '#D97706', label: 'Pending' },
    approved: { bg: '#ECFDF5', text: '#059669', label: 'Approved' },
    rejected: { bg: '#FEF2F2', text: '#DC2626', label: 'Rejected' },
  }
  const s = styles[status]
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  )
}

function TypeIcon({ type }) {
  if (type === 'Sick Time Off') return <Stethoscope size={13} className="text-[#F59E0B]" />
  return <Plane size={13} className="text-[#6C5CE7]" />
}

function TimeOffList() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filterOptions = ['All', 'Pending', 'Approved', 'Rejected']

  const handleApprove = (id) => {
    // TODO: replace with real API call once backend is ready
    // await fetch(`/api/timeoff/${id}/approve`, { method: 'POST' })
    console.log('Approving request:', id)
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
  }

  const handleReject = (id) => {
    // TODO: replace with real API call once backend is ready
    // await fetch(`/api/timeoff/${id}/reject`, { method: 'POST' })
    console.log('Rejecting request:', id)
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const filtered = requests.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || r.status === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-[#111827]">Time Off</h1>
      </div>
      <p className="text-sm text-[#6B7280] mb-6">Review and manage time-off requests across your organization</p>

      {/* Leave balance summary (org-wide allocation reference) */}
      <div className="grid grid-cols-2 sm:w-fit sm:inline-grid gap-4 mb-6">
        <div className="bg-white border border-[#F0F0F5] rounded-2xl px-5 py-4 shadow-sm">
          <p className="text-xs text-[#6C5CE7] font-semibold mb-1 flex items-center gap-1.5">
            <Plane size={13} /> Paid Time Off
          </p>
          <p className="font-display text-xl font-bold">{leaveBalances.paidTimeOff} <span className="text-xs font-medium text-[#9CA3AF]">days/year</span></p>
        </div>
        <div className="bg-white border border-[#F0F0F5] rounded-2xl px-5 py-4 shadow-sm">
          <p className="text-xs text-[#F59E0B] font-semibold mb-1 flex items-center gap-1.5">
            <Stethoscope size={13} /> Sick Time Off
          </p>
          <p className="font-display text-xl font-bold">{leaveBalances.sickTimeOff} <span className="text-xs font-medium text-[#9CA3AF]">days/year</span></p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name..."
            className="w-full bg-white border border-[#E5E7EB] rounded-full py-2.5 pl-9 pr-4 text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C5CE7]/40 transition"
          />
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-[#E5E7EB] rounded-full py-2.5 pl-4 pr-9 text-sm text-[#374151] font-medium focus:outline-none focus:border-[#6C5CE7]/40 transition cursor-pointer"
          >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#F0F0F5] rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.4fr_1fr_1.4fr] gap-3 px-5 py-3 border-b border-[#F0F0F5] bg-[#F9FAFB]">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Name</p>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Start Date</p>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">End Date</p>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Type</p>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Status</p>
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide text-right">Actions</p>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#9CA3AF]">No time-off requests found.</div>
        ) : (
          filtered.map((req) => {
            const initials = req.name.split(' ').map((n) => n[0]).join('')
            return (
              <div
                key={req.id}
                className="grid grid-cols-[2fr_1.2fr_1.2fr_1.4fr_1fr_1.4fr] gap-3 px-5 py-4 items-center border-b border-[#F7F7FB] last:border-0 hover:bg-[#FAFAFC] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: req.avatarColor }}
                  >
                    {initials}
                  </div>
                  <p className="text-sm font-medium text-[#374151] truncate">{req.name}</p>
                </div>
                <p className="text-sm text-[#6B7280]">{formatDate(req.startDate)}</p>
                <p className="text-sm text-[#6B7280]">{formatDate(req.endDate)}</p>
                <div className="flex items-center gap-1.5 text-sm text-[#374151]">
                  <TypeIcon type={req.type} />
                  {req.type}
                </div>
                <div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="flex items-center justify-end gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center hover:bg-[#FEE2E2] transition"
                        title="Reject"
                      >
                        <X size={15} />
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center hover:bg-[#D1FAE5] transition"
                        title="Approve"
                      >
                        <Check size={15} />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-[#9CA3AF]">—</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TimeOffList