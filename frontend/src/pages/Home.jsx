import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.name ? `Welcome, ${user.name}` : 'Welcome to Corporates Guide LMS'}
          </h1>
        </div>

        <BannerCarousel />
      </div>
    </>
  )
}