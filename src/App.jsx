import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Recaps from './pages/Recaps';
import Finance from './pages/Finance';

function App() {
  const { initAuth, theme } = useStore();

  useEffect(() => {
    // Initialize auth listener
    initAuth();

    // Set initial theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [initAuth, theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="goals" element={<Goals />} />
          <Route path="recaps" element={<Recaps />} />
          <Route path="finance" element={<Finance />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
