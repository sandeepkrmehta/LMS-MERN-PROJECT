/* eslint-disable-next-line no-unused-vars */
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Lazy loading pages
const HomePage = lazy(() => import("./Pages/HomePage"));
const AboutUs = lazy(() => import("./Pages/About"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Signup = lazy(() => import("./Pages/Signup"));
const Login = lazy(() => import("./Pages/Login"));
const ChangePassword = lazy(() => import("./Pages/Password/ChangePassword"));
const ForgotPassword = lazy(() => import("./Pages/Password/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/Password/ResetPassword"));
const CourseList = lazy(() => import("./Pages/Course/CourseList"));
const Contact = lazy(() => import("./Pages/Contact"));
const Denied = lazy(() => import("./Pages/Denied"));
const CourseDescription = lazy(() => import("./Pages/Course/CourseDescription"));
const RequireAuth = lazy(() => import("./Components/auth/RequireAuth"));
const CreateCourse = lazy(() => import("./Pages/Course/CreateCourse"));
const Profile = lazy(() => import("./Pages/User/Profile"));
const Checkout = lazy(() => import("./Pages/Payment/Checkout"));
const CheckoutSuccess = lazy(() => import("./Pages/Payment/CheckoutSuccess"));
const CheckoutFail = lazy(() => import("./Pages/Payment/CheckoutFail"));
const DisplayLecture = lazy(() => import("./Pages/Dashboard/DisplayLecture"));
const AddLecture = lazy(() => import("./Pages/Dashboard/AddLecture"));
const AdminDashboard = lazy(() => import("./Pages/Dashboard/AdminDashboard"));

// Helper functions for session management
function checkSessionExpiration() {
  const expiresAt = localStorage.getItem("expiresAt");
  if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    return true;
  }
  return false;
}

function startSessionTimer() {
  localStorage.setItem("expiresAt", Date.now() + 3600000); // 1 hour
}

function App() {
  const navigate = useNavigate();

  // Automatically check session expiration and navigate to login if expired
  useEffect(() => {
    if (checkSessionExpiration()) {
      alert("Your session has expired. Please log in again.");
      navigate("/login"); // Redirect to login if session expired
    }

    const interval = setInterval(() => {
      if (checkSessionExpiration()) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/profile/reset-password" element={<ForgotPassword />} />
        <Route path="/user/profile/reset-password/:resetToken" element={<ResetPassword />} />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/description/:courseId" element={<CourseDescription />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["USER", "ADMIN"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/profile/change-password" element={<ChangePassword />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFail />} />
          <Route path="/course/displaylectures" element={<DisplayLecture />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
