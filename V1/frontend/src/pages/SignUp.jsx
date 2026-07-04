import { useState } from 'react'
import { Building2, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Upload, Clock, CalendarCheck, Wallet, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!companyName || !name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.')
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
    // Backend creates the company + admin account and generates
    // the admin's employee ID + first-time password (e.g. sent via email)
    // await fetch('/api/signup', { method: 'POST', body: JSON.stringify({ companyName, name, email, phone, password }) })
    console.log('Sign up:', { companyName, name, email, phone, password })
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
            Set up your<br />
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#FF6B6B] bg-clip-text text-transparent">company workspace.</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
            One-time setup. After this, your team logs in with credentials
            you create for them — no one else needs to sign up.
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

        <div className="w-full max-w-2xl relative z-10 my-8">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#FF6B6B] flex items-center justify-center font-display font-bold text-white">
              H
            </div>
            <span className="font-display font-bold text-xl">The Support Squadron </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(108,92,231,0.2)] rounded-3xl p-8 sm:p-12">

            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-[#059669]" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-3 tracking-tight">Signed up successfully!</h2>
                <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                  Your workspace for <span className="font-semibold text-[#374151]">{companyName}</span> has been created.
                  Check <span className="font-semibold text-[#374151]">{email}</span> for your admin login ID and password.
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
                <h2 className="font-display text-4xl font-bold mb-2 tracking-tight">Create your workspace</h2>
                <p className="text-[#6B7280] text-sm mb-8">Set up your company and your Admin account.</p>

                {error && (
                  <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm rounded-xl px-4 py-3 mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Company Name</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Acme Corp"
                          required
                          className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                        />
                      </div>
                      <label
                        htmlFor="logo-upload"
                        className="flex-shrink-0 w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center cursor-pointer hover:opacity-90 transition overflow-hidden"
                        title="Upload company logo"
                      >
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={20} className="text-white" />
                        )}
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Your Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@acmecorp.com"
                        required
                        className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl py-3.5 pl-11 pr-4 text-sm placeholder:text-[#C1C5CC] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15 focus:border-[#6C5CE7] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Password</label>
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
                    <label className="text-xs font-semibold text-[#374151] mb-2 block uppercase tracking-wide">Confirm Password</label>
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
                    Sign Up
                    <ArrowRight size={18} />
                  </button>
                </form>

                <p className="text-base text-[#4B5563] text-center mt-7">
                  Already have an account? <Link to="/signin" className="text-[#6C5CE7] font-semibold hover:underline">Sign In</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp