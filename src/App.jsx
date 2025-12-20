import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import { PATHS } from './routes/paths';

// Placeholder components for routes that don't exist yet
const AllLessons = () => <div className="p-10 text-center">All Lessons Page (Coming Soon)</div>;

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.ALL_LESSONS} element={<AllLessons />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
