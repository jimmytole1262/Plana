import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import EventsGallery from './pages/EventsGallery';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    console.log('Current Path:', path);
    // Detect if the path looks like an absolute windows path (e.g., /D:/pil/...)
    if (path.match(/^\/[a-zA-Z]:\//)) {
      console.warn('Malformed absolute path detected, redirecting to home...');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/events" element={<EventsGallery />} />
      <Route path="/support" element={<Support />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all route for debugging */}
      <Route path="*" element={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>404 - Page Not Found</h1>
          <p>The path <code>{window.location.pathname}</code> did not match any routes.</p>
          <button onClick={() => window.location.href = '/'}>Go Home</button>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
