import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AllLessons from './pages/lessons/AllLessons';
import LessonDetails from './pages/lessons/LessonDetails';
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoute';
import { PATHS } from './routes/paths';

// Placeholder components for routes that don't exist yet
const Dashboard = () => <div className="p-10 text-center">User Dashboard (Protected)</div>;
const AdminDashboard = () => <div className="p-10 text-center">Admin Dashboard (Protected & Admin Only)</div>;

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.ALL_LESSONS} element={<AllLessons />} />
        <Route path={PATHS.LESSON_DETAILS} element={<LessonDetails />} />

        {/* Protected User Routes */}
        <Route
          path={PATHS.DASHBOARD.ROOT}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path={PATHS.ADMIN.ROOT}
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
