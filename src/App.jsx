import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AllLessons from './pages/lessons/AllLessons';
import LessonDetails from './pages/lessons/LessonDetails';
import Pricing from './pages/Pricing';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFail from './pages/payment/PaymentFail';
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import { PATHS } from './routes/paths';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import AddLesson from './pages/dashboard/AddLesson';
import MyLessons from './pages/dashboard/MyLessons';
import MyFavorites from './pages/dashboard/MyFavorites';
import UpdateLesson from './pages/dashboard/UpdateLesson';
import Profile from './pages/dashboard/Profile';

import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLessons from './pages/admin/AdminLessons';
import ReportedLessons from './pages/admin/ReportedLessons';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.LOGIN} element={<Login />} />
          <Route path={PATHS.REGISTER} element={<Register />} />
          <Route path={PATHS.ALL_LESSONS} element={<AllLessons />} />
          <Route path={PATHS.ALL_LESSONS} element={<AllLessons />} />

          {/* Protected Pricing */}
          <Route
            path={PATHS.SUBSCRIPTION}
            element={
              <PrivateRoute>
                <Pricing />
              </PrivateRoute>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />

          {/* Protected Lesson Details */}
          <Route
            path={PATHS.LESSON_DETAILS}
            element={
              <PrivateRoute>
                <LessonDetails />
              </PrivateRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected User & Admin Routes (Shared Dashboard Layout) */}
        <Route
          path={PATHS.DASHBOARD.ROOT}
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* User Routes (Default) */}
          <Route index element={<DashboardHome />} />
          <Route path={PATHS.DASHBOARD.ADD_LESSON} element={<AddLesson />} />
          <Route path={PATHS.DASHBOARD.MY_LESSONS} element={<MyLessons />} />
          <Route path={PATHS.DASHBOARD.MY_FAVORITES} element={<MyFavorites />} />
          <Route path="update-lesson/:id" element={<UpdateLesson />} />
          <Route path={PATHS.DASHBOARD.PROFILE} element={<Profile />} />

          {/* Admin Routes (Wrapped in AdminRoute) */}
          <Route
            path={PATHS.ADMIN.ROOT}
            element={
              <AdminRoute>
                <Outlet />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminDashboardHome />} />
            <Route path={PATHS.ADMIN.MANAGE_USERS} element={<AdminUsers />} />
            <Route path={PATHS.ADMIN.MANAGE_LESSONS} element={<AdminLessons />} />
            <Route path={PATHS.ADMIN.REPORTED_LESSONS} element={<ReportedLessons />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
