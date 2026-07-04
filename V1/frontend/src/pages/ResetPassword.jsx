import { useState } from 'react'
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, Clock, CalendarCheck, Wallet } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'your account'

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please fill in both fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    // TODO: replace with real API call once backend is ready
    // await fetch('/api/reset-password', { method: 'POST', body: JSON.stringify({ email, password }) })
    console.log('Resetting password for:', email)
    setIsSubmitted(true)
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
            Set a new<br />
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#FF6B6B] bg-clip-text text-transparent">password.</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
            Choose something strong you haven't used before on this account.
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

            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-[#059669]" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-3 tracking-tight">Password reset!</h2>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Your password has been updated. Use your new password the next time you sign in.
                </p>
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full bg-gradient-to-r from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#6C5CE7]/30 text-white active:scale-[0.98]"
                >
                  Go to Sign In
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center mb-5 shadow-lg shadow-[#6C5CE7]/30">
                  <ShieldCheck size={26} className="text-white" />
                </div>

                <h2 className="font-display text-4xl font-bold mb-2 tracking-tight">Set new password</h2>
                <p className="text-[#6B7280] text-sm mb-8">for {email}</p>

                {error && (
                  <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm rounded-xl px-4 py-3 mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-11 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6C5CE7] transition"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-11 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6C5CE7] transition"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 mt-2 shadow-xl shadow-[#6C5CE7]/30 text-white active:scale-[0.98]"
                  >
                    Reset Password
                    <ArrowRight size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword