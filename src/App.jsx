import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import NotFound from './pages/NotFound';
import { PATHS } from './routes/paths';

// Placeholder components for routes that don't exist yet
const Login = () => <div className="p-10 text-center">Login Page (Coming Soon)</div>;
const Register = () => <div className="p-10 text-center">Register Page (Coming Soon)</div>;
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
