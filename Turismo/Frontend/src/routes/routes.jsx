import { Navigate, Route, Routes } from 'react-router-dom';
import App from '../App';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import UserProfile from '../pages/UserProfile/UserProfile';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}