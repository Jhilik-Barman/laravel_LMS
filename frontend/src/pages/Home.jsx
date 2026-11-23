import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BannerCarousel from '../components/BannerCarousel'
import WelcomeToast from '../components/WelcomeToast'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showRegistrationWelcome, setShowRegistrationWelcome] = useState(
    Boolean(location.state?.showWelcomeToast),
  )

  useEffect(() => {
    if (location.state?.showWelcomeToast) {
      navigate('/', { replace: true, state: null })
    }
  }, [location.state, navigate])

  return (
    <>
      {showRegistrationWelcome && <WelcomeToast user={user} />}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <BannerCarousel />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.name ? `Welcome, ${user.name}` : 'Welcome to Corporates Guide LMS'}
          </h1>
          <p className="text-gray-500">Your guide to mastering in-demand tech skills</p>
          <nav aria-label="Homepage navigation" className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/courses"
              className="px-6 py-2.5 rounded-md bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold hover:opacity-90"
            >
              Courses
            </Link>
            <Link
              to="/calendar"
              className="px-6 py-2.5 rounded-md border border-brand-indigo text-brand-indigo font-semibold hover:bg-indigo-50"
            >
              Calendar
            </Link>
            <Link
              to="/about"
              className="px-6 py-2.5 rounded-md border border-brand-indigo text-brand-indigo font-semibold hover:bg-indigo-50"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}