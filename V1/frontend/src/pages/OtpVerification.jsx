import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Clock, CalendarCheck, Wallet } from 'lucide-react'

function OtpVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'your email'
  const purpose = location.state?.purpose || 'signup'
  const role = location.state?.role || 'employee'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef([])

  const heading = purpose === 'reset' || purpose === 'signin'
    ? 'Verify it\'s you'
    : 'Verify your email'

  const subtext = purpose === 'reset'
    ? `Enter the 6-digit code we sent to ${email} to reset your password.`
    : purpose === 'signin'
    ? `Enter the 6-digit code we sent to ${email} to complete sign in.`
    : `Enter the 6-digit code we sent to ${email} to activate your workspace.`

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
  e.preventDefault()

  const pasted = e.clipboardData
    .getData('text')
    .replace(/\D/g, '')
    .slice(0, 6)

  if (!pasted) return

  const newOtp = [...otp]

  pasted.split('').forEach((digit, index) => {
    newOtp[index] = digit
  })

  setOtp(newOtp)
  setError('')

  inputRefs.current[Math.min(pasted.length, 5)]?.focus()
}

  const handleSubmit = (e) => {
  e.preventDefault()
  const code = otp.join('')

  if (code.length !== 6) {
    setError('Please enter all 6 digits.')
    return
  }

  // TODO: replace with real API call once backend is ready
  console.log('Verifying OTP:', code, 'for', purpose)

  if (purpose === 'reset') {
  navigate('/reset-password', { state: { email } })
} else {
  navigate('/complete-profile', {
    state: { role } // now uses the real passed-in role, not hardcoded 'admin'
  })
 }
}

  const handleResend = () => {
    if (resendTimer > 0) return
    // TODO: replace with real API call once backend is ready
    // await fetch('/api/resend-otp', { method: 'POST', body: JSON.stringify({ email, purpose }) })
    console.log('Resending OTP to', email)
    setResendTimer(30)
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
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
            Almost<br />
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#FF6B6B] bg-clip-text text-transparent">there.</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
            A quick verification step keeps your workspace and your
            team's data secure.
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
              SS
            </div>
            <span className="font-display font-bold text-xl">The Support Squadron </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(108,92,231,0.2)] rounded-3xl p-8 sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center mb-5 shadow-lg shadow-[#6C5CE7]/30">
              <ShieldCheck size={26} className="text-white" />
            </div>

            <h2 className="font-display text-4xl font-bold mb-2 tracking-tight">{heading}</h2>
            <p className="text-[#6B7280] text-sm mb-8">{subtext}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex gap-2 sm:gap-3 justify-between" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-xs text-[#EF4444] font-medium mt-3">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#6C5CE7]/30 text-white active:scale-[0.98]"
              >
                Verify
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="text-base text-[#4B5563] text-center mt-7">
              Didn't get the code?{' '}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`font-semibold ${
                  resendTimer > 0
                    ? 'text-[#9CA3AF] cursor-not-allowed'
                    : 'text-[#6C5CE7] hover:underline'
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
            </p>

           <p className="text-sm text-[#9CA3AF] text-center mt-3">
                Wrong email? <Link to="/signin" className="text-[#6C5CE7] font-medium hover:underline">Go back</Link>
           </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification 