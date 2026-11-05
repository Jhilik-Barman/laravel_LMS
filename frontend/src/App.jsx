import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionWarningModal from "./components/SessionWarningModal";
import RequireAuth from "./components/RequireAuth";
import { useSessionTimeout } from "./hooks/useSessionTimeout";

import Home from "./pages/Home";
import About from "./pages/About";
import CalendarPage from "./pages/Calendar";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return null;
}

function PreventBrowserBack() {
  const location = useLocation();
  const currentUrl = useRef("");

  currentUrl.current = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    const restoreCurrentRoute = () => {
      window.history.pushState(
        window.history.state,
        "",
        currentUrl.current,
      );
    };

    restoreCurrentRoute();
    window.addEventListener("popstate", restoreCurrentRoute, true);

    return () => {
      window.removeEventListener("popstate", restoreCurrentRoute, true);
    };
  }, []);

  return null;
}

export default function App() {
  const { showWarning, secondsLeft, continueSession } = useSessionTimeout();
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <PreventBrowserBack />
      <Navbar />
      <SessionWarningModal
        visible={showWarning}
        secondsLeft={secondsLeft}
        onContinue={continueSession}
      />

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
          path="/courses/:courseSlug"
          element={
            <RequireAuth>
              <CourseDetails />
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
      <Footer />
    </>
  );
}
