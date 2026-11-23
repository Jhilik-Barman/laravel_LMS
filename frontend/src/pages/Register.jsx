import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

export default function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const email = location.state?.email
  const [form, setForm] = useState({
    name: '',
    dob: '',
    organization: '',
    organization_type: 'college',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!email) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { email, ...form })
      const { access_token, user } = res.data
      login(access_token, user)
      navigate('/', { state: { showWelcomeToast: true } })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Complete Your Profile</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Registering as <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="register-name"
              name="name"
              required
              autoComplete="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
          <div>
            <label htmlFor="register-dob" className="mb-1.5 block text-sm font-medium text-slate-700">
              Date of Birth <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="register-dob"
              name="dob"
              type="date"
              required
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div>
            <label htmlFor="register-organization-type" className="mb-1.5 block text-sm font-medium text-slate-700">
              Account Type <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <select
              id="register-organization-type"
              name="organization_type"
              required
              value={form.organization_type}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="college">College</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div>
            <label htmlFor="register-organization" className="mb-1.5 block text-sm font-medium text-slate-700">
              {form.organization_type === 'college' ? 'College Name' : 'Company Name'}{' '}
              <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="register-organization"
              name="organization"
              required
              placeholder={form.organization_type === 'college' ? 'College Name' : 'Company Name'}
              value={form.organization}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div>
            <label htmlFor="register-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone Number <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              pattern="(?=(?:.*[0-9]){7,15}$)\\+?[0-9\\s().-]{7,20}"
              title="Enter a phone number containing 7 to 15 digits."
              required
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}