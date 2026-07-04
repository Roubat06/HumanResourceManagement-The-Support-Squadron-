import { useState } from 'react'
import { Mail, ArrowRight, KeyRound, Clock, CalendarCheck, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your login ID or email.')
      return
    }

    // TODO: replace with real API call once backend is ready
    // await fetch('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
    console.log('Requesting password reset for:', email)
    navigate('/verify-otp', { state: { email, purpose: 'reset' } })
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F7F7FB] text-[#111827] overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#6C5CE7] opacity-40 blur-[110px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF6B6B] opacity-25 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#00C896] opacity-25 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] flex items-center justify-center font-display font-bold text-xl text-white shadow-lg shadow-[#6C5CE7]/30">
              SS
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">The Support Squadron</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.1] mb-5 tracking-tight">
            Let's get you<br />
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#FF6B6B] bg-clip-text text-transparent">back in.</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
            We'll send a verification code to confirm it's you before
            letting you set a new password.
          </p>

          <div className="space-y-3">
            {[
              { icon: Clock, label: 'Real-time attendance tracking' },
              { icon: CalendarCheck, label: 'One-tap time off requests' },
              { icon: Wallet, label: 'Automated payroll breakdown' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-[#374151]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-[#6C5CE7] opacity-15 blur-[100px] lg:hidden" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full bg-[#FF6B6B] opacity-10 blur-[100px] hidden lg:block" />

        <div className="w-full max-w-md relative z-10 my-8">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] flex items-center justify-center font-display font-bold text-white">
              H
            </div>
            <span className="font-display font-bold text-xl">The Support Squadron </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(108,92,231,0.2)] rounded-3xl p-8 sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center mb-5 shadow-lg shadow-[#6C5CE7]/30">
              <KeyRound size={26} className="text-white" />
            </div>

            <h2 className="font-display text-4xl font-bold mb-2 tracking-tight">Forgot password?</h2>
            <p className="text-[#6B7280] text-sm mb-8">Enter your login ID or email and we'll send you a code.</p>

            {error && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Login ID / Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="OIJODO20220001 or jane@acmecorp.com"
                    required
                    className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 mt-2 shadow-xl shadow-[#6C5CE7]/30 text-white active:scale-[0.98]"
              >
                Send Code
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="text-base text-[#4B5563] text-center mt-7">
              Remembered it? <Link to="/signin" className="text-[#6C5CE7] font-semibold hover:underline">Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword