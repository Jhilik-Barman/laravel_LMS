import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SessionWarningModal from './components/SessionWarningModal'
import RequireAuth from './components/RequireAuth'
import { useSessionTimeout } from './hooks/useSessionTimeout'

import Home from './pages/Home'
import About from './pages/About'
import CalendarPage from './pages/Calendar'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'
import Register from './pages/Register'
import Courses from './pages/Courses'
import Profile from './pages/Profile'
import Payment from './pages/Payment'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [location.pathname])

  return null
}

export default function App() {
  const { showWarning, secondsLeft, continueSession } = useSessionTimeout()
  const location = useLocation()
  const isPaymentPage = location.pathname.startsWith('/payment/')

  return (
    <>
      <ScrollToTop />
      {!isPaymentPage && <Navbar />}
      {!isPaymentPage && (
        <SessionWarningModal visible={showWarning} secondsLeft={secondsLeft} onContinue={continueSession} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/courses"
          element={
            <RequireAuth>
              <Courses />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/payment/:courseSlug"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />
      </Routes>
      {!isPaymentPage && <Footer />}
    </>
  )
}
