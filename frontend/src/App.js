// Main App component
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import InventoryTable from "./components/InventoryTable";
import AuthPage from "./pages/AuthPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e53935', // Red theme
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {!user ? (
            // Not logged in - show auth page
            <>
              <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            // Logged in - show main app
            <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<InventoryTable />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

